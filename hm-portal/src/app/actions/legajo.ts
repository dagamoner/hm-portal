"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export interface LegajoItem {
  name: string;
  status: "Vigente" | "Pendiente" | "Sin registros";
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
      // RiskEvaluations don't have direct companyId, they are tied to hazards -> tasks -> roles -> processes -> sectors -> establishments -> company
      // For simplicity in this v1 of Legajo, let's just query if there's any establishment for the company
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

    // Flatten Risk Evaluations
    const allRiskEvaluations = riskEvaluations.flatMap(e => e.sectors.flatMap(s => s.processes.flatMap(p => p.jobRoles.flatMap(j => j.tasks.flatMap(t => t.hazards.flatMap(h => h.evaluations))))));

    const checkDocs = (keywords: string[]) => {
      const match = documents.find(d => keywords.some(k => d.title.toLowerCase().includes(k.toLowerCase())));
      return match ? "Vigente" : "Sin registros";
    };

    const checkInspections = (keywords: string[]) => {
      const match = inspections.find(i => keywords.some(k => i.title.toLowerCase().includes(k.toLowerCase())));
      return match ? "Vigente" : "Sin registros";
    };

    const items: LegajoItem[] = [
      { name: "Programa de Seguridad de Obra", status: checkDocs(["programa de seguridad", "pso"]) },
      { name: "Aviso de Inicio de Obra", status: checkDocs(["aviso de inicio", "aio"]) },
      { name: "Cronograma y Plan Anual de Capacitaciones", status: trainingPlans.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Check List decreto 911", status: checkInspections(["911", "decreto"]) },
      { name: "Relevamiento de Agentes de Riesgos", status: allRiskEvaluations.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Relevamiento General de Riesgos Laborales", status: allRiskEvaluations.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Charlas de 5 minutos", status: trainings.some(t => t.title.toLowerCase().includes("charla") || t.title.toLowerCase().includes("5 minutos")) ? "Vigente" : "Sin registros" },
      { name: "Estadísticas Mensuales de Siniestralidad de la Obra", status: incidents.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Check List de herramientas manuales", status: equipments.some(e => e.category.toLowerCase().includes("manual")) ? "Vigente" : "Sin registros" },
      { name: "Check List de Simulacros", status: emergencyDrills.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Check List de tableros Eléctricos", status: checkInspections(["tablero", "eléctrico"]) === "Vigente" || equipments.some(e => e.category.toLowerCase().includes("tablero")) ? "Vigente" : "Sin registros" },
      { name: "Check List de Botiquines de primeros auxilios", status: emergencyEquipments.some(e => e.type.toLowerCase().includes("botiquín") || e.type.toLowerCase().includes("botiquin")) ? "Vigente" : "Sin registros" },
      { name: "Informes Semanales y Mensuales de HySL", status: checkDocs(["informe semanal", "informe mensual", "hysl"]) },
      { name: "Mediciones de Puesta A Tierra", status: measurements.some(m => m.type.toLowerCase().includes("tierra") || m.type.toLowerCase().includes("pat")) ? "Vigente" : "Sin registros" },
      { name: "Mediciones de Ruido", status: measurements.some(m => m.type.toLowerCase().includes("ruido")) ? "Vigente" : "Sin registros" },
      { name: "Medición Protocolo de Ergonomía", status: ergonomics.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Planillas de Mantenimiento de Máquinas y Herramientas", status: equipments.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Planillas de Mantenimiento de Prolongaciones", status: checkDocs(["prolongacion", "prolongación", "mantenimiento"]) },
      { name: "Notas Varias", status: checkDocs(["nota"]) },
      { name: "Pliego de Obra", status: checkDocs(["pliego"]) },
      { name: "Entrega de EPP", status: eppDeliveries.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Constancia de Entrega de Credenciales de ART", status: checkDocs(["credencial", "art"]) },
      { name: "Visitas de ART", status: visits.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Planillas y Verificación de Orden y Limpieza", status: checkInspections(["orden", "limpieza"]) },
      { name: "Procedimientos Seguros de Trabajo", status: checkDocs(["procedimiento", "pst", "seguro"]) },
      { name: "Registro de Accidentes e Incidentes", status: incidents.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Investigaciones de Accidentes", status: investigations.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Relevamiento de Extintores de Incendios", status: emergencyEquipments.some(e => e.type.toLowerCase().includes("extintor") || e.type.toLowerCase().includes("matafuego")) ? "Vigente" : "Sin registros" },
      { name: "Relevamiento de Escaleras y Andamios", status: equipments.some(e => e.category.toLowerCase().includes("escalera") || e.category.toLowerCase().includes("andamio")) ? "Vigente" : "Sin registros" },
      { name: "Relevamiento de herramientas Eléctricas", status: equipments.some(e => e.category.toLowerCase().includes("eléctrica") || e.category.toLowerCase().includes("electrica")) ? "Vigente" : "Sin registros" },
      { name: "Rol de Llamadas de Emergencias en obra e In Itinere", status: emergencyPlans.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Plan de Emergencias", status: emergencyPlans.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Coordinación Divisional de Emergencias", status: checkDocs(["coordinación divisional", "coordinacion", "emergencia"]) },
      { name: "Políticas de HySL en la Empresa y en Obra", status: checkDocs(["política", "politica", "hysl"]) },
      { name: "Políticas de prevención de alcohol y drogas en la Empresa", status: checkDocs(["alcohol", "droga"]) },
      { name: "Matriz de riesgos", status: allRiskEvaluations.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Programa de Control de Riesgos, evaluación de riesgos", status: allRiskEvaluations.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Coordinación ante emergencias", status: emergencyPlans.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Registros de Permisos de trabajo", status: ptws.length > 0 ? "Vigente" : "Sin registros" },
      { name: "Visación del Libro de higiene y Seguridad en el Trabajo.", status: checkDocs(["libro", "visación", "visacion"]) }
    ];

    return { success: true, items };
  } catch (error) {
    console.error("Error fetching legajo data:", error);
    return { success: false, error: "No se pudo obtener la información técnica de la empresa." };
  }
}
