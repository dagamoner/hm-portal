"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type TrainingTopic = {
  month: string;
  theme: string;
  description: string;
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
      { month: "ENERO", theme: "Prevención de estrés térmico", description: "Reconocimiento de síntomas, pausas activas e hidratación adecuada en ambientes calurosos.", target: "Operativos", typeInternal: true, typeExternal: false },
      { month: "FEBRERO", theme: "Criterios de selección y mantenimiento de EPP específicos", description: "Uso correcto, cuidado, limpieza y criterios de reemplazo de los elementos de protección personal.", target: "Operativos", typeInternal: true, typeExternal: false },
      { month: "MARZO", theme: "Seguridad en el uso de herramientas neumáticas y manuales portátiles", description: "Inspección previa al uso, normas de seguridad operativas y almacenamiento seguro de las herramientas.", target: "Operativos", typeInternal: true, typeExternal: false },
      { month: "NOVIEMBRE", theme: "Señalización, delimitación de áreas y circulación segura", description: "Identificación de cartelería, respeto de senderos seguros y mantenimiento del orden y limpieza.", target: "Operativos", typeInternal: true, typeExternal: false },
      { month: "DICIEMBRE", theme: "Auditoría de cumplimiento y análisis de indicadores de siniestralidad", description: "Revisión anual del sistema, evaluación de estadísticas de accidentes y definición de propuestas de mejora.", target: "Intermedios", typeInternal: true, typeExternal: false },
    ];

    // Temas dinámicos basados en peligros
    if (hasString(['altura', 'caída'])) {
      topics.push({ month: "ABRIL", theme: "Trabajo seguro en altura: Uso de arnés y líneas de vida", description: "Sistemas anti-caídas, revisión de arneses de seguridad y determinación de puntos de anclaje seguros.", target: "Operativos", typeInternal: true, typeExternal: false });
    }
    
    if (hasString(['eléctric', 'tension'])) {
      topics.push({ month: "MAYO", theme: "Riesgo eléctrico", description: "Identificación de peligros eléctricos, uso de procedimientos de bloqueo/etiquetado (LOTO) y distancias de seguridad.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: false });
    }

    if (hasString(['carga', 'esfuerzo', 'ergonómic', 'postura'])) {
      topics.push({ month: "JUNIO", theme: "Manipulación manual de cargas y prevención de TME", description: "Adopción de posturas correctas, conocimiento de límites de peso y prevención de trastornos músculo-esqueléticos.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: false });
    }

    if (hasString(['izaje', 'grúa', 'autoelevador'])) {
      topics.push({ month: "JULIO", theme: "Izaje crítico de cargas", description: "Cálculo y distribución de cargas, inspección y uso de eslingas o estrobos, y protocolos de comunicación con el operador.", target: "Operativos", typeInternal: true, typeExternal: false });
    }

    if (hasString(['polvo', 'químic', 'sílice', 'respiratori'])) {
      topics.push({ month: "AGOSTO", theme: "Protección respiratoria contra sustancias químicas", description: "Selección de tipos de filtros según el contaminante, prueba de ajuste hermético y mantenimiento del respirador.", target: "Operativos", typeInternal: true, typeExternal: false });
    }

    if (hasString(['demolición', 'obra', 'residuos'])) {
      topics.push({ month: "SEPTIEMBRE", theme: "Seguridad en demoliciones y gestión de residuos de obra", description: "Procedimientos de demolición segura, métodos para el control de polvo ambiental y correcta clasificación de residuos.", target: "Operativos", typeInternal: true, typeExternal: false });
    }

    if (hasString(['incendio', 'fuego', 'inflamable', 'explosión'])) {
      topics.push({ month: "OCTUBRE", theme: "Prevención de incendios: Uso de extintores y sistemas fijos", description: "Reconocimiento de clases de fuego, manejo práctico de extintores portátiles y repaso del plan de evacuación.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: true });
    }
    
    if (hasString(['ruido', 'sonoro', 'auditivo'])) {
      topics.push({ month: "SEPTIEMBRE", theme: "Conservación auditiva y uso correcto de protectores auditivos", description: "Comprensión de los niveles de ruido nocivos, correcta colocación de tapones endoaurales y uso de protectores de copa.", target: "Operativos", typeInternal: true, typeExternal: false });
    }

    // Si la empresa no tiene riesgos cargados o tiene pocos, rellenamos con temas generales del PDF
    const allExpectedTopics = [
      { month: "ABRIL", theme: "Trabajo seguro en altura: Uso de arnés y líneas de vida", description: "Sistemas anti-caídas, revisión de arneses de seguridad y determinación de puntos de anclaje seguros.", target: "Operativos", typeInternal: true, typeExternal: false },
      { month: "MAYO", theme: "Riesgo eléctrico", description: "Identificación de peligros eléctricos, uso de procedimientos de bloqueo/etiquetado (LOTO) y distancias de seguridad.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: false },
      { month: "JUNIO", theme: "Manipulación manual de cargas y prevención de TME", description: "Adopción de posturas correctas, conocimiento de límites de peso y prevención de trastornos músculo-esqueléticos.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: false },
      { month: "JULIO", theme: "Izaje crítico de cargas", description: "Cálculo y distribución de cargas, inspección y uso de eslingas o estrobos, y protocolos de comunicación con el operador.", target: "Operativos", typeInternal: true, typeExternal: false },
      { month: "AGOSTO", theme: "Protección respiratoria contra sustancias químicas", description: "Selección de tipos de filtros según el contaminante, prueba de ajuste hermético y mantenimiento del respirador.", target: "Operativos", typeInternal: true, typeExternal: false },
      { month: "SEPTIEMBRE", theme: "Seguridad en gestión de residuos", description: "Manejo adecuado de residuos peligrosos y patogénicos, etiquetado y almacenamiento temporal seguro.", target: "Operativos", typeInternal: true, typeExternal: false },
      { month: "OCTUBRE", theme: "Prevención de incendios: Uso de extintores", description: "Reconocimiento de clases de fuego, manejo práctico de extintores portátiles y repaso del plan de evacuación.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: true },
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

export async function generateRandomPlanData(): Promise<TrainingTopic[]> {
  const months = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", 
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];

  const pool = [
    { theme: "Prevención de estrés térmico", description: "Reconocimiento de síntomas, pausas activas e hidratación adecuada en ambientes calurosos.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Criterios de selección y mantenimiento de EPP específicos", description: "Uso correcto, cuidado, limpieza y criterios de reemplazo de los elementos de protección personal.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Seguridad en el uso de herramientas neumáticas y manuales portátiles", description: "Inspección previa al uso, normas de seguridad operativas y almacenamiento seguro de las herramientas.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Señalización, delimitación de áreas y circulación segura", description: "Identificación de cartelería, respeto de senderos seguros y mantenimiento del orden y limpieza.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Auditoría de cumplimiento y análisis de indicadores de siniestralidad", description: "Revisión anual del sistema, evaluación de estadísticas de accidentes y definición de propuestas de mejora.", target: "Intermedios", typeInternal: true, typeExternal: false },
    { theme: "Trabajo seguro en altura: Uso de arnés y líneas de vida", description: "Sistemas anti-caídas, revisión de arneses de seguridad y determinación de puntos de anclaje seguros.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Riesgo eléctrico y LOTO", description: "Identificación de peligros eléctricos, uso de procedimientos de bloqueo/etiquetado (LOTO) y distancias de seguridad.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: false },
    { theme: "Manipulación manual de cargas y prevención de TME", description: "Adopción de posturas correctas, conocimiento de límites de peso y prevención de trastornos músculo-esqueléticos.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: false },
    { theme: "Izaje crítico de cargas", description: "Cálculo y distribución de cargas, inspección y uso de eslingas o estrobos, y protocolos de comunicación con el operador.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Protección respiratoria contra sustancias químicas", description: "Selección de tipos de filtros según el contaminante, prueba de ajuste hermético y mantenimiento del respirador.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Seguridad en demoliciones y gestión de residuos de obra", description: "Procedimientos de demolición segura, métodos para el control de polvo ambiental y correcta clasificación de residuos.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Prevención de incendios: Uso de extintores", description: "Reconocimiento de clases de fuego, manejo práctico de extintores portátiles y repaso del plan de evacuación.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: true },
    { theme: "Conservación auditiva y uso correcto de protectores auditivos", description: "Comprensión de los niveles de ruido nocivos, correcta colocación de tapones endoaurales y uso de protectores de copa.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Seguridad Vial y Manejo Defensivo", description: "Técnicas de manejo defensivo, revisión vehicular preventiva y respeto por normas de tránsito en el ámbito laboral.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: true },
    { theme: "Primeros Auxilios y RCP", description: "Técnicas de reanimación cardiopulmonar, control de hemorragias y asistencia inicial en emergencias médicas.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: true },
    { theme: "Uso seguro de autoelevadores y equipos móviles", description: "Checklist pre-uso, límites de velocidad, visibilidad y normas de seguridad en almacenes.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Manejo seguro de productos químicos y lectura de FDS", description: "Interpretación de Fichas de Datos de Seguridad (SGA), almacenamiento de incompatibles y respuesta ante derrames.", target: "Operativos/Administrativos", typeInternal: true, typeExternal: false },
    { theme: "Prevención de Riesgos Biológicos", description: "Medidas de higiene personal, uso de EPP descartable y manejo seguro de material cortopunzante o patológico.", target: "Operativos", typeInternal: true, typeExternal: false },
    { theme: "Riesgos Psicosociales y Manejo del Estrés", description: "Identificación de factores estresores, técnicas de afrontamiento y promoción del bienestar laboral.", target: "Administrativos", typeInternal: true, typeExternal: false },
    { theme: "Trabajos en Espacios Confinados", description: "Medición de gases, ventilación, permisos de trabajo y roles del vigía y entrante.", target: "Operativos", typeInternal: true, typeExternal: true },
    { theme: "Liderazgo en Seguridad y Cultura Preventiva", description: "Herramientas para la supervisión efectiva, comunicación de riesgos y fomento de conductas seguras.", target: "Altos Cargos", typeInternal: true, typeExternal: false }
  ];

  // Shuffle the pool
  const shuffled = pool.sort(() => 0.5 - Math.random());
  
  // Pick the first 12 and assign them to months
  const selected = shuffled.slice(0, 12);
  
  const topics: TrainingTopic[] = selected.map((topic, idx) => ({
    ...topic,
    month: months[idx]
  }));

  return topics;
}

export async function saveTrainingProgramToDB(companyId: string, year: number, topics: TrainingTopic[]) {
  try {
    // Check if plan exists
    let plan = await prisma.trainingPlan.findUnique({
      where: { companyId_year: { companyId, year } }
    });

    if (!plan) {
      plan = await prisma.trainingPlan.create({
        data: { companyId, year }
      });
    }

    const monthMap: Record<string, number> = {
      "ENERO": 1, "FEBRERO": 2, "MARZO": 3, "ABRIL": 4, "MAYO": 5, "JUNIO": 6,
      "JULIO": 7, "AGOSTO": 8, "SEPTIEMBRE": 9, "OCTUBRE": 10, "NOVIEMBRE": 11, "DICIEMBRE": 12
    };

    // Create trainings (skip if already created for that month to avoid dupes)
    for (const topic of topics) {
      const monthIdx = monthMap[topic.month] || 1;
      
      const existing = await prisma.training.findFirst({
        where: { planId: plan.id, monthIndex: monthIdx, title: topic.theme }
      });

      if (!existing) {
        await prisma.training.create({
          data: {
            companyId,
            planId: plan.id,
            title: topic.theme,
            description: topic.description,
            monthIndex: monthIdx,
            type: "Operativo",
            priority: "Recomendada",
            status: "Pendiente" // Tentativo
          }
        });
      }
    }
    
    revalidatePath(`/portal/empresas/${companyId}/capacitaciones`);
    return { success: true };
  } catch (error: any) {
    console.error("Error saving training program:", error);
    return { error: error.message };
  }
}
