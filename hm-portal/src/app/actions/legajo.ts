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
      ptws
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
      prisma.visit.findMany({ where: { companyId } }),
      prisma.investigation.findMany({ where: { companyId } }),
      prisma.emergencyPlan.findMany({ where: { companyId } }),
      prisma.permitToWork.findMany({ where: { companyId } }),
    ]);

    const allRiskEvaluations = riskEvaluations.flatMap(e => e.sectors.flatMap(s => s.processes.flatMap(p => p.jobRoles.flatMap(j => j.tasks.flatMap(t => t.hazards.flatMap(h => h.evaluations))))));

    const checkDocs = (keywords: string[]) => {
      const matches = documents.filter(d => keywords.some(k => d.title.toLowerCase().includes(k.toLowerCase())));
      if (matches.length === 0) return null;
      
      const alDia = matches.filter(d => d.status === 'VIGENTE' || (d.expirationDate && new Date(d.expirationDate) >= new Date())).length;
      const vencidos = matches.filter(d => d.status === 'VENCIDO' || (d.expirationDate && new Date(d.expirationDate) < new Date())).length;
      
      if (vencidos > 0 && alDia > 0) return `${alDia} al día, ${vencidos} vencido(s)`;
      if (vencidos > 0) return `${vencidos} vencido(s)`;
      return `${alDia} al día`;
    };

    const checkInspections = (keywords: string[]) => {
      const matches = inspections.filter(i => keywords.some(k => i.title.toLowerCase().includes(k.toLowerCase())));
      if (matches.length === 0) return null;
      return `${matches.length} registro(s)`;
    };

    const checkCount = (count: number, suffix: string = "registro(s)") => {
      return count > 0 ? `${count} ${suffix}` : null;
    };

    const rawItems = [
      { name: "Libro de Higiene y Seguridad en el Trabajo", status: checkDocs(["libro de higiene", "libro hys", "visación", "visacion"]) },
      { name: "Manual de procedimientos del servicio de Higiene y Seguridad", status: checkDocs(["manual de procedimiento", "procedimientos del servicio"]) },
      { name: "Normas Generales de seguridad", status: checkDocs(["normas generales", "normas de seguridad"]) },
      { name: "Plan de contingencia con roles asignados", status: emergencyPlans.length > 0 ? checkCount(emergencyPlans.length, "plan(es)") : checkDocs(["contingencia", "plan de contingencia"]) },
      { name: "ATS, PTS, ARO, IPER", status: checkDocs(["ats", "pts", "aro", "iper", "procedimiento seguro"]) },
      { name: "Evaluación de cumplimiento a normativa vigente", status: checkDocs(["evaluación normativa", "cumplimiento normativa", "legal"]) },
      { name: "Evaluación de cumplimiento en planes de la S.R.T.", status: checkDocs(["plan srt", "s.r.t"]) },
      { name: "Evaluación de cumplimiento en requerimientos de la A.R.T.", status: checkDocs(["requerimiento art", "a.r.t"]) },
      { name: "Actualización y mantenimiento (Diagramas y Planos)", status: checkDocs(["diagrama", "plano", "layout"]) },
      { name: "Mediciones, evaluaciones y registros (Contaminantes/PAT/Ruido)", status: checkCount(measurements.length, "medición(es)") },
      { name: "Registro de Entrega de EPP (Res. 299/11)", status: checkCount(eppDeliveries.length, "entrega(s)") },
      { name: "Programa de Seguridad de Obra", status: checkDocs(["programa de seguridad", "pso"]) },
      { name: "Aviso de Inicio de Obra", status: checkDocs(["aviso de inicio", "aio"]) },
      { name: "Cronograma y Plan Anual de Capacitaciones", status: checkCount(trainings.length, "capacitación(es) programada(s)") },
      { name: "Coordinación de acciones de prevención (Contratistas)", status: checkDocs(["coordinación de acciones", "contratista", "simultáneo"]) },
      { name: "Check List Decreto 911", status: checkInspections(["911", "decreto"]) },
      { name: "Relevamiento de Agentes de Riesgos / Riesgos Laborales", status: checkCount(allRiskEvaluations.length, "evaluación(es)") },
      { name: "Charlas de 5 minutos", status: checkCount(trainings.filter(t => t.title.toLowerCase().includes("charla") || t.title.toLowerCase().includes("5 minutos")).length, "charla(s)") },
      { name: "Estadísticas Mensuales de Siniestralidad", status: checkCount(incidents.length, "incidente(s) registrado(s)") },
      { name: "Check List de herramientas manuales", status: checkCount(equipments.filter(e => e.category.toLowerCase().includes("manual")).length, "herramienta(s)") },
      { name: "Check List de Simulacros", status: checkCount(emergencyDrills.length, "simulacro(s)") },
      { name: "Check List de tableros Eléctricos", status: checkCount(equipments.filter(e => e.category.toLowerCase().includes("tablero") || e.category.toLowerCase().includes("eléctric")).length, "tablero(s)") },
      { name: "Check List de Botiquines de primeros auxilios", status: checkCount(emergencyEquipments.filter(e => e.type.toLowerCase().includes("botiquín") || e.type.toLowerCase().includes("botiquin")).length, "botiquín(es)") },
      { name: "Informes Semanales y Mensuales de HySL", status: checkDocs(["informe"]) },
      { name: "Planillas de Mantenimiento de Máquinas y Herramientas", status: checkCount(equipments.length, "equipo(s)") },
      { name: "Planillas de Mantenimiento de Prolongaciones", status: checkDocs(["prolongacion", "prolongación"]) },
      { name: "Notas Varias", status: checkDocs(["nota"]) },
      { name: "Pliego de Obra", status: checkDocs(["pliego"]) },
      { name: "Constancia de Entrega de Credenciales de ART", status: checkDocs(["credencial", "art"]) },
      { name: "Visitas de ART / Externas", status: checkCount(visits.length, "visita(s)") },
      { name: "Planillas y Verificación de Orden y Limpieza", status: checkInspections(["orden", "limpieza"]) },
      { name: "Investigaciones de Accidentes", status: checkCount(investigations.length, "investigación(es)") },
      { name: "Relevamiento de Extintores de Incendios", status: checkCount(emergencyEquipments.filter(e => e.type.toLowerCase().includes("extintor") || e.type.toLowerCase().includes("matafuego")).length, "extintor(es)") },
      { name: "Relevamiento de Escaleras y Andamios", status: checkCount(equipments.filter(e => e.category.toLowerCase().includes("escalera") || e.category.toLowerCase().includes("andamio")).length, "equipo(s)") },
      { name: "Rol de Llamadas de Emergencias", status: checkDocs(["rol de llamada"]) },
      { name: "Políticas de HySL y Prevención", status: checkDocs(["política", "politica", "alcohol", "droga"]) },
      { name: "Registros de Permisos de trabajo", status: checkCount(ptws.length, "permiso(s)") }
    ];

    // Filter out items that have no records (status is null)
    const items: LegajoItem[] = rawItems
      .filter(item => item.status !== null)
      .map(item => ({ name: item.name, status: item.status as string }));

    return { success: true, items };
  } catch (error) {
    console.error("Error fetching legajo data:", error);
    return { success: false, error: "No se pudo obtener la información técnica de la empresa." };
  }
}
