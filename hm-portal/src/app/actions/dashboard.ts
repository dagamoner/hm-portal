"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics(companyId?: string) {
  try {
    const whereCompany = companyId ? { companyId } : {};

    // 1. HORAS HOMBRE Y TRABAJADORES
    const totalWorkers = await prisma.worker.count({
      where: whereCompany
    });

    const now = new Date();
    // Horas estimadas del año en curso hasta hoy (8 hs/día, 22 días/mes)
    const currentMonthNum = now.getMonth() + 1;
    const hoursWorkedYTD = totalWorkers * 8 * 22 * currentMonthNum;
    // Para cálculos de los últimos 12 meses, usamos las horas de 12 meses
    const hoursWorked12M = totalWorkers * 8 * 22 * 12;

    // 2. INCIDENTES Y DÍAS PERDIDOS
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    
    const incidents = await prisma.incident.findMany({
      where: whereCompany,
      orderBy: { date: 'desc' }
    });

    const incidents12M = incidents.filter(i => new Date(i.date) >= twelveMonthsAgo);
    
    let totalLostDaysYTD = 0;
    let totalLostDays12M = 0;
    const incidentsYTD = incidents.filter(i => new Date(i.date).getFullYear() === now.getFullYear());

    const parseLostDays = (details: any) => {
      if (details && typeof details === 'object' && !Array.isArray(details) && 'diasPerdidos' in details) {
        return Number(details.diasPerdidos) || 0;
      }
      return 0; // Ocupa menos espacio asumir 0 si no se reporta
    };

    incidentsYTD.forEach(i => totalLostDaysYTD += parseLostDays(i.details));
    incidents12M.forEach(i => totalLostDays12M += parseLostDays(i.details));

    // KPIs Fila 1
    const IF_12M = hoursWorked12M > 0 ? (incidents12M.length / hoursWorked12M) * 1000000 : 0;
    const IG_12M = hoursWorked12M > 0 ? (totalLostDays12M / hoursWorked12M) * 1000000 : 0;

    // 3. RIESGOS (Riesgos Extremos y Altos abiertos)
    const riskEvals = await prisma.riskEvaluation.findMany({
      where: {
        hazard: {
          task: {
            jobRole: {
              process: {
                sector: {
                  establishment: {
                    ...whereCompany
                  }
                }
              }
            }
          }
        }
      },
      include: {
        hazard: {
          include: {
            task: { include: { jobRole: { include: { process: { include: { sector: { include: { establishment: true } } } } } } } }
          }
        }
      }
    });

    // Supongamos que level > 15 es ALTO/EXTREMO (matriz 5x5)
    const openRiskEvals = riskEvals.filter(r => (r.riskLevel || 0) >= 15 && r.status !== 'Cerrado').length;
    const verifiedCriticalControls = riskEvals.filter(r => (r.riskLevel || 0) >= 15 && r.status === 'Validado').length;
    
    // Novedad: integrar VisitFindings (Desvíos)
    const visitFindings = await prisma.visitFinding.findMany({
      where: whereCompany,
      include: { visit: { include: { establishment: true } } }
    });

    const isCriticalFinding = (f: any) => {
      const hl = f.hazardLevel?.toUpperCase() || '';
      return hl.includes('ALTO') || hl.includes('CRITIC') || hl.includes('CRÍTIC') || hl.includes('EXTREMO');
    };

    const openCriticalFindings = visitFindings.filter(f => isCriticalFinding(f) && f.status !== 'CERRADO').length;
    const openCriticalRisks = openRiskEvals + openCriticalFindings;
    const pctControlsVerified = openCriticalRisks > 0 ? Math.round((verifiedCriticalControls / openCriticalRisks) * 100) : 0;

    // 4. ACCIONES DE MEJORA
    const actions = await prisma.improvementAction.findMany({
      where: {
        evaluation: {
          hazard: {
            task: { jobRole: { process: { sector: { establishment: { ...whereCompany } } } } }
          }
        }
      }
    });

    const openActions = actions.filter(a => a.status !== 'Cerrada');
    const overdueRiskActions = openActions.filter(a => a.deadline && new Date(a.deadline) < now).length;
    const overdueFindings = visitFindings.filter(f => f.deadline && new Date(f.deadline) < now && f.status !== 'CERRADO').length;
    const overdueActions = overdueRiskActions + overdueFindings;
    
    let closedOnTime = 0;
    let totalClosedWithDeadline = 0;
    
    actions.forEach(a => {
      if (a.status === 'Cerrada' && a.deadline) {
        totalClosedWithDeadline++;
        const closedAt = new Date(a.updatedAt);
        if (closedAt <= new Date(a.deadline)) closedOnTime++;
      }
    });

    visitFindings.forEach(f => {
      if (f.status === 'CERRADO' && f.deadline) {
        totalClosedWithDeadline++;
        const closedAt = f.resolutionDate ? new Date(f.resolutionDate) : new Date(f.updatedAt);
        if (closedAt <= new Date(f.deadline)) closedOnTime++;
      }
    });

    const pctClosedOnTime = totalClosedWithDeadline > 0 ? Math.round((closedOnTime / totalClosedWithDeadline) * 100) : 0;

    // 5. TENDENCIAS MENSUALES (Últimos 12 meses)
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyTrend = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = monthNames[d.getMonth()];
      const incsInMonth = incidents12M.filter(inc => new Date(inc.date).getMonth() === d.getMonth() && new Date(inc.date).getFullYear() === d.getFullYear());
      const lostDaysMonth = incsInMonth.reduce((acc, inc) => acc + parseLostDays(inc.details), 0);
      
      const hrsMonth = totalWorkers * 8 * 22;
      const mIF = hrsMonth > 0 ? (incsInMonth.length / hrsMonth) * 1000000 : 0;
      const mIG = hrsMonth > 0 ? (lostDaysMonth / hrsMonth) * 1000000 : 0;

      monthlyTrend.push({
        month: mLabel,
        IF: Math.round(mIF),
        IG: Math.round(mIG),
        accidentes: incsInMonth.length
      });
    }

    // 6. RIESGOS POR ESTABLECIMIENTO
    const riskByEst: Record<string, { low: number, medium: number, high: number, critical: number }> = {};
    
    riskEvals.forEach(r => {
      const estName = r.hazard?.task?.jobRole?.process?.sector?.establishment?.name || 'Desconocido';
      if (!riskByEst[estName]) riskByEst[estName] = { low: 0, medium: 0, high: 0, critical: 0 };
      
      const rl = r.riskLevel || 0;
      if (rl >= 20) riskByEst[estName].critical++;
      else if (rl >= 15) riskByEst[estName].high++;
      else if (rl >= 8) riskByEst[estName].medium++;
      else riskByEst[estName].low++;
    });

    visitFindings.forEach(f => {
      const estName = f.visit?.establishment?.name || 'Desconocido';
      if (!riskByEst[estName]) riskByEst[estName] = { low: 0, medium: 0, high: 0, critical: 0 };
      
      const hl = f.hazardLevel?.toUpperCase() || '';
      if (hl.includes('EXTREMO') || hl.includes('CRITIC') || hl.includes('CRÍTIC')) riskByEst[estName].critical++;
      else if (hl.includes('ALTO')) riskByEst[estName].high++;
      else if (hl.includes('MEDIO')) riskByEst[estName].medium++;
      else riskByEst[estName].low++;
    });

    const riskByEstArray = Object.keys(riskByEst).map(k => ({
      name: k,
      ...riskByEst[k]
    }));

    // 7. PARETO DE CAUSAS (Usando 'details.type' o fallback a Severidad)
    const causeCount: Record<string, number> = {};
    incidents12M.forEach(inc => {
      let cause = "Otro";
      if (inc.details && typeof inc.details === 'object' && !Array.isArray(inc.details) && (inc.details as any).type) {
        cause = String((inc.details as any).type);
      } else {
        cause = inc.severity;
      }
      causeCount[cause] = (causeCount[cause] || 0) + 1;
    });

    let paretoData = Object.keys(causeCount).map(k => ({ cause: k, count: causeCount[k] })).sort((a, b) => b.count - a.count);
    let cumulative = 0;
    const totalPareto = paretoData.reduce((acc, curr) => acc + curr.count, 0);
    paretoData = paretoData.map(p => {
      cumulative += p.count;
      return {
        ...p,
        cumulativePct: totalPareto > 0 ? Math.round((cumulative / totalPareto) * 100) : 0
      };
    });

    // 8. AGING DE ACCIONES
    let age0_15 = 0;
    let age16_30 = 0;
    let age30plus = 0;
    
    openActions.forEach(a => {
      const diffTime = Math.abs(now.getTime() - new Date(a.createdAt).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 15) age0_15++;
      else if (diffDays <= 30) age16_30++;
      else age30plus++;
    });

    visitFindings.filter(f => f.status !== 'CERRADO').forEach(f => {
      const diffTime = Math.abs(now.getTime() - new Date(f.createdAt).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 15) age0_15++;
      else if (diffDays <= 30) age16_30++;
      else age30plus++;
    });

    const agingData = [
      { category: '0-15 Días', count: age0_15 },
      { category: '16-30 Días', count: age16_30 },
      { category: '> 30 Días', count: age30plus },
    ];

    // 9. EVENTOS POR TURNO
    const turnosCount = { 'Mañana': 0, 'Tarde': 0, 'Noche': 0 };
    incidents12M.forEach(inc => {
      let turno = 'Mañana';
      if (inc.details && typeof inc.details === 'object' && !Array.isArray(inc.details) && (inc.details as any).turno) {
        turno = String((inc.details as any).turno);
      } else {
        const h = new Date(inc.date).getHours();
        if (h >= 6 && h < 14) turno = 'Mañana';
        else if (h >= 14 && h < 22) turno = 'Tarde';
        else turno = 'Noche';
      }
      if (turno in turnosCount) {
        turnosCount[turno as keyof typeof turnosCount]++;
      }
    });

    const eventsByShift = [
      { name: 'Mañana', count: turnosCount['Mañana'] },
      { name: 'Tarde', count: turnosCount['Tarde'] },
      { name: 'Noche', count: turnosCount['Noche'] }
    ];

    // Inspecciones (Visitas) -> Contamos fechas únicas (días de visita reales)
    const visitsForCount = await prisma.visit.findMany({ 
      where: companyId ? { establishment: { companyId: companyId } } : {},
      select: { date: true }
    });
    const bookEntriesForCount = await prisma.safetyBookEntry.findMany({
      where: whereCompany,
      select: { date: true }
    });
    
    const uniqueVisitDates = new Set([
      ...visitsForCount.map(v => new Date(v.date).toISOString().split('T')[0]),
      ...bookEntriesForCount.map(b => new Date(b.date).toISOString().split('T')[0])
    ]);
    const totalInspections = uniqueVisitDates.size;

    // 10. CUMPLIMIENTO DE PERSONAL
    const trainingRecords = await prisma.trainingRecord.findMany({ where: whereCompany });
    const completedTrainings = trainingRecords.filter(r => r.completed).length;
    const trainingCompliancePct = trainingRecords.length > 0 ? Math.round((completedTrainings / trainingRecords.length) * 100) : 0;

    const eppDeliveries = await prisma.eppDelivery.findMany({ 
      where: { ...whereCompany, signed: true },
      select: { workerId: true }
    });
    const uniqueWorkersWithEPP = new Set(eppDeliveries.map(e => e.workerId)).size;
    const eppCoveragePct = totalWorkers > 0 ? Math.round((uniqueWorkersWithEPP / totalWorkers) * 100) : 0;

    return {
      kpis: {
        frequencyRate: IF_12M.toFixed(1),
        severityRate: IG_12M.toFixed(1),
        lostDays: totalLostDays12M,
        openCriticalRisks,
        overdueActions,
        pctClosedOnTime,
        pctControlsVerified,
        totalInspections,
        trainingCompliancePct,
        eppCoveragePct
      },
      monthlyTrend,
      riskByEstArray,
      paretoData,
      agingData,
      eventsByShift
    };

  } catch (error) {
    console.error("Error fetching advanced dashboard metrics:", error);
    return null;
  }
}
