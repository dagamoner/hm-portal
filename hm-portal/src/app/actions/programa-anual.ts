"use server";

import { prisma } from "@/lib/prisma";

export type TrainingTopic = {
  month: string;
  theme: string;
  target: string;
  typeInternal: boolean;
  typeExternal: boolean;
};

export async function getTrainingPlanData(companyId: string): Promise<TrainingTopic[]> {
  try {
    // Buscar peligros asociados a la empresa para armar el plan
    const establishments = await prisma.establishment.findMany({
      where: { companyId },
      include: {
        sectors: {
          include: {
            processes: {
              include: {
                jobRoles: {
                  include: {
                    tasks: {
                      include: {
                        hazards: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const hazardNames = new Set<string>();
    
    establishments.forEach(est => {
      est.sectors.forEach(sec => {
        sec.processes.forEach(proc => {
          proc.jobRoles.forEach(role => {
            role.tasks.forEach(task => {
              task.hazards.forEach(hazard => {
                if (hazard.name) hazardNames.add(hazard.name.toLowerCase());
                if (hazard.type) hazardNames.add(hazard.type.toLowerCase());
              });
            });
          });
        });
      });
    });

    const hasString = (searchTerms: string[]) => {
      for (const hazard of Array.from(hazardNames)) {
        for (const term of searchTerms) {
          if (hazard.includes(term)) return true;
        }
      }
      return false;
    };

    // Meses del año
    const months = [
      "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", 
      "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];

    // Temas base obligatorios
    const topics: TrainingTopic[] = [
      { month: "ENERO", theme: "Prevención de estrés térmico", target: "Operativo", typeInternal: true, typeExternal: false },
      { month: "FEBRERO", theme: "Criterios de selección y mantenimiento de EPP específicos", target: "Operativo", typeInternal: true, typeExternal: false },
      { month: "MARZO", theme: "Seguridad en el uso de herramientas neumáticas y manuales portátiles", target: "Operativo", typeInternal: true, typeExternal: false },
      { month: "NOVIEMBRE", theme: "Señalización, delimitación de áreas y circulación segura", target: "Operativo", typeInternal: true, typeExternal: false },
      { month: "DICIEMBRE", theme: "Auditoría de cumplimiento y análisis de indicadores de siniestralidad", target: "Intermedio / Operativo", typeInternal: true, typeExternal: false },
    ];

    // Temas dinámicos basados en peligros
    if (hasString(['altura', 'caída'])) {
      topics.push({ month: "ABRIL", theme: "Trabajo seguro en altura: Uso de arnés y líneas de vida", target: "Operativo", typeInternal: true, typeExternal: false });
    }
    
    if (hasString(['eléctric', 'tension'])) {
      topics.push({ month: "MAYO", theme: "Riesgo eléctrico", target: "Intermedio / Operativo", typeInternal: true, typeExternal: false });
    }

    if (hasString(['carga', 'esfuerzo', 'ergonómic', 'postura'])) {
      topics.push({ month: "JUNIO", theme: "Manipulación manual de cargas y prevención de TME", target: "Intermedio / Operativo", typeInternal: true, typeExternal: false });
    }

    if (hasString(['izaje', 'grúa', 'autoelevador'])) {
      topics.push({ month: "JULIO", theme: "Izaje crítico de cargas", target: "Operativo", typeInternal: true, typeExternal: false });
    }

    if (hasString(['polvo', 'químic', 'sílice', 'respiratori'])) {
      topics.push({ month: "AGOSTO", theme: "Protección respiratoria contra polvo y sustancias químicas", target: "Intermedio / Operativo", typeInternal: true, typeExternal: false });
    }

    if (hasString(['demolición', 'obra', 'residuos'])) {
      topics.push({ month: "SEPTIEMBRE", theme: "Seguridad en demoliciones y gestión de residuos de obra", target: "Operativo", typeInternal: true, typeExternal: false });
    }

    if (hasString(['incendio', 'fuego', 'inflamable', 'explosión'])) {
      topics.push({ month: "OCTUBRE", theme: "Prevención de incendios: Uso de extintores y sistemas fijos", target: "Intermedio / Operativo", typeInternal: true, typeExternal: true });
    }
    
    if (hasString(['ruido', 'sonoro', 'auditivo'])) {
      topics.push({ month: "SEPTIEMBRE", theme: "Conservación auditiva y uso correcto de protectores auditivos", target: "Operativo", typeInternal: true, typeExternal: false });
    }

    // Si la empresa no tiene riesgos cargados o tiene pocos, rellenamos con temas generales del PDF
    const allExpectedTopics = [
      { month: "ABRIL", theme: "Trabajo seguro en altura: Uso de arnés y líneas de vida", target: "Operativo", typeInternal: true, typeExternal: false },
      { month: "MAYO", theme: "Riesgo eléctrico", target: "Intermedio / Operativo", typeInternal: true, typeExternal: false },
      { month: "JUNIO", theme: "Manipulación manual de cargas y prevención de TME", target: "Intermedio / Operativo", typeInternal: true, typeExternal: false },
      { month: "JULIO", theme: "Izaje crítico de cargas", target: "Operativo", typeInternal: true, typeExternal: false },
      { month: "AGOSTO", theme: "Protección respiratoria contra sustancias químicas", target: "Intermedio / Operativo", typeInternal: true, typeExternal: false },
      { month: "SEPTIEMBRE", theme: "Seguridad en gestión de residuos", target: "Operativo", typeInternal: true, typeExternal: false },
      { month: "OCTUBRE", theme: "Prevención de incendios: Uso de extintores", target: "Intermedio / Operativo", typeInternal: true, typeExternal: true },
    ];

    allExpectedTopics.forEach(t => {
      if (!topics.find(top => top.month === t.month)) {
        topics.push(t);
      }
    });

    // Ordenar por meses
    return topics.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));

  } catch (error) {
    console.error("Error fetching training plan data:", error);
    return [];
  }
}
