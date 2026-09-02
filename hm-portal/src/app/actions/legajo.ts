"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export interface LegajoItem {
  name: string;
  status: string;
}

export async function getLegajoData(companyId: string) {
  await requireAuth(companyId);

  try {
    const [
      documents,
      trainings,
      trainingPlans,
      inspections,
      riskEvaluations,
      incidents,
      equipments,
      emergencyDrills,
      emergencyEquipments,
      measurements,
      ergonomics,
      eppDeliveries,
      visits,
      investigations,
      emergencyPlans,
      ptws,
      safetyBookEntries,
      managementReports,
      psts,
      toolboxTalks,
      companyPolicies
    ] = await Promise.all([
      prisma.document.findMany({ where: { companyId } }),
      prisma.training.findMany({ where: { companyId } }),
      prisma.trainingPlan.findMany({ where: { companyId } }),
      prisma.inspection.findMany({ where: { companyId } }),
      prisma.establishment.findMany({ where: { companyId }, include: { sectors: { include: { processes: { include: { jobRoles: { include: { tasks: { include: { hazards: { include: { evaluations: true } } } } } } } } } } } }),
      prisma.incident.findMany({ where: { companyId } }),
      prisma.equipment.findMany({ where: { companyId } }),
      prisma.emergencyDrill.findMany({ where: { companyId } }),
      prisma.emergencyEquipment.findMany({ where: { companyId } }),
      prisma.measurementRecord.findMany({ where: { companyId } }),
      prisma.ergonomicEvaluation.findMany({ where: { companyId } }),
      prisma.eppDelivery.findMany({ where: { companyId } }),
      prisma.visit.findMany({ where: { companyId }, include: { findings: true } }),
      prisma.investigation.findMany({ where: { companyId } }),
      prisma.emergencyPlan.findMany({ where: { companyId } }),
      prisma.permitToWork.findMany({ where: { companyId } }),
      prisma.safetyBookEntry.findMany({ where: { companyId } }),
      prisma.managementReport.findMany({ where: { companyId } }),
      prisma.pST.findMany({ where: { companyId } }),
      prisma.toolboxTalk.findMany({ where: { companyId } }),
      prisma.companyPolicy.findMany({ where: { companyId } })
    ]);

    const allRiskEvaluations = riskEvaluations.flatMap(e => e.sectors.flatMap(s => s.processes.flatMap(p => p.jobRoles.flatMap(j => j.tasks.flatMap(t => t.hazards.flatMap(h => h.evaluations))))));
    const allFindings = visits.flatMap(v => v.findings);
    const openFindings = allFindings.filter(f => f.status !== 'CERRADA' && f.status !== 'CERRADO');

    const items: LegajoItem[] = [];

    const formatDate = (d: Date | null | undefined) => d ? new Date(d).toLocaleDateString() : '';
    const truncate = (str: string, length: number = 60) => str && str.length > length ? str.substring(0, length) + '...' : str;

    // 1. Documentos
    documents.forEach(d => {
      let statusStr = d.status;
      if (d.expirationDate) statusStr += ` (Vence: ${formatDate(d.expirationDate)})`;
      items.push({ name: `Documento: ${d.title}`, status: statusStr });
    });

    // 2. Capacitaciones
    trainings.forEach(t => {
      items.push({ name: `Capacitación: ${t.title}`, status: `${t.status} - Mes ${t.monthIndex}` });
    });

    // 3. Inspecciones
    inspections.forEach(i => {
      items.push({ name: `Inspección: ${i.title}`, status: `Realizada: ${formatDate(i.date)}` });
    });

    // 4. Visitas y Actas
    visits.forEach(v => {
      const templateName = (v.checklistData as any)?.templateName || "Acta de Visita";
      let statusStr = `Realizada: ${formatDate(v.date)} por ${v.inspectorName}`;
      if (v.observations) statusStr += ` | Obs: ${truncate(v.observations)}`;
      items.push({ name: `Acta/CheckList: ${templateName}`, status: statusStr });
      
      v.findings.forEach(f => {
        let fStatus = f.status;
        if (f.deadline) fStatus += ` (Plazo: ${formatDate(f.deadline)})`;
        items.push({ name: `   ↳ Desvío: ${truncate(f.description)}`, status: fStatus });
      });
    });

    // 5. Libro de Actas
    safetyBookEntries.forEach(b => {
      items.push({ name: `Libro de Actas (Folio ${b.folioNumber})`, status: `Fecha: ${formatDate(b.date)} | Obs: ${truncate(b.observations)}` });
    });

    // 6. Informes de Gestión
    managementReports.forEach(r => {
      items.push({ name: `Informe de Gestión: ${r.type}`, status: `Período: ${r.period}` });
    });

    // 7. PTS / ATS
    psts.forEach(p => {
      items.push({ name: `PST/ATS: ${p.title}`, status: `Estado: ${p.status} (v${p.version})` });
    });

    // 8. Toolbox Talks (Charlas)
    toolboxTalks.forEach(t => {
      items.push({ name: `Charla de 5 Minutos: ${t.topic}`, status: `Fecha: ${formatDate(t.date)}` });
    });

    // 9. Políticas
    companyPolicies.forEach(p => {
      items.push({ name: `Política: ${p.title}`, status: `Versión: ${p.version} | Aprobada: ${formatDate(p.approvalDate)}` });
    });

    // 10. Evaluaciones de Riesgo
    allRiskEvaluations.forEach(r => {
      items.push({ name: `Eval. de Riesgo: ${r.riskType}`, status: `Nivel: ${r.riskLevel}` });
    });

    // 11. Incidentes
    incidents.forEach(i => {
      items.push({ name: `Incidente: ${i.type}`, status: `Fecha: ${formatDate(i.date)} | Estado: ${i.status}` });
    });

    // 12. Equipos y Máquinas
    equipments.forEach(e => {
      items.push({ name: `Equipo/Máquina: ${e.name}`, status: `Categoría: ${e.category} | Estado: ${e.status}` });
    });

    // 13. Simulacros
    emergencyDrills.forEach(d => {
      items.push({ name: `Simulacro: ${d.type}`, status: `Fecha: ${formatDate(d.date)} | Resultado: ${d.result}` });
    });

    // 14. Equipos de Emergencia
    emergencyEquipments.forEach(e => {
      let statusStr = e.status;
      if (e.expirationDate) statusStr += ` (Vence: ${formatDate(e.expirationDate)})`;
      items.push({ name: `Equipo Emergencia: ${e.type} (${e.location})`, status: statusStr });
    });

    // 15. Mediciones
    measurements.forEach(m => {
      items.push({ name: `Medición: ${m.type}`, status: `Fecha: ${formatDate(m.date)} | Resultado: ${m.result}` });
    });

    // 16. Ergonomía
    ergonomics.forEach(e => {
      items.push({ name: `Eval. Ergonómica`, status: `Fecha: ${formatDate(e.date)} | Riesgo: ${e.riskLevel}` });
    });

    // 17. EPP
    eppDeliveries.forEach(e => {
      items.push({ name: `Entrega EPP (Res. 299/11)`, status: `Fecha: ${formatDate(e.date)}` });
    });

    // 18. Investigaciones
    investigations.forEach(i => {
      items.push({ name: `Investigación Accidente`, status: `Fecha: ${formatDate(i.date)} | Estado: ${i.status}` });
    });

    // 19. Planes de Emergencia
    emergencyPlans.forEach(e => {
      items.push({ name: `Plan de Contingencia/Emergencia`, status: `Actualización: ${formatDate(e.updatedAt)}` });
    });

    // 20. Permisos de Trabajo
    ptws.forEach(p => {
      items.push({ name: `Permiso de Trabajo: ${p.type}`, status: `Validez: ${formatDate(p.validUntil)} | Estado: ${p.status}` });
    });

    return { success: true, items };
  } catch (error) {
    console.error("Error fetching legajo data:", error);
    return { success: false, error: "No se pudo obtener la información técnica de la empresa." };
  }
}
