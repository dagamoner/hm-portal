"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVehicles(companyId: string) {
  try {
    return await prisma.vehicle.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

export async function createVehicle(companyId: string, data: {
  type: string;
  brand: string;
  model: string;
  plate: string;
  year: number;
  mileage?: number;
  hours?: number;
  status: string;
}) {
  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        companyId,
        type: data.type,
        brand: data.brand,
        model: data.model,
        plate: data.plate,
        year: data.year,
        mileage: data.mileage || null,
        hours: data.hours || null,
        status: data.status,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/vehiculos`);
    return { success: true, vehicle };
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return { success: false, error: "No se pudo crear el vehículo" };
  }
}

export async function getVehicleDiagnosis(vehicleId: string) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) return null;

    // AI Predictive Diagnosis Engine (Rule-based)
    
    // 1. Checklist Predictivo (basado en tipo)
    let checklist = [];
    let rules = [];
    let reqs = [];
    let priority = [];

    const isHeavy = ['Autoelevador', 'Maquinaria', 'Tractor', 'Excavadora'].includes(vehicle.type);
    const usage = vehicle.mileage || vehicle.hours || 0;
    const age = new Date().getFullYear() - vehicle.year;
    
    // Base checklist
    checklist.push({ item: 'Neumáticos y llantas', reason: 'Prevenir pérdida de control o reventones' });
    checklist.push({ item: 'Frenos (Servicio y Estacionamiento)', reason: 'Asegurar capacidad de detención' });
    checklist.push({ item: 'Luces y bocina', reason: 'Comunicación y visibilidad en operación' });

    if (isHeavy) {
      checklist.push({ item: 'Mástil, cilindros y mangueras hidráulicas', reason: 'Riesgo de falla catastrófica bajo carga' });
      checklist.push({ item: 'Alarma de retroceso', reason: 'Alerta a peatones en maniobras de riesgo' });
      checklist.push({ item: 'Cinturón de seguridad y jaula antivuelco (ROPS)', reason: 'Seguridad pasiva vital del operador' });
      
      rules.push("Prohibido elevar cargas por encima del límite nominal de la chapa de capacidad.");
      rules.push("Descender pendientes marcha atrás si la carga obstaculiza la visión frontal.");
      rules.push("Toda operación de mantenimiento se debe realizar con horquillas apoyadas en suelo.");

      reqs.push("Curso específico teórico-práctico con certificación vigente (Resolución SRT 960/15).");
      reqs.push("Licencia de conducir clase E2.");
      reqs.push("Examen médico preocupacional con foco osteomuscular.");
    } else {
      checklist.push({ item: 'Niveles de fluidos (aceite, refrigerante, frenos)', reason: 'Prevenir daños de motor y pérdida de frenado' });
      checklist.push({ item: 'Espejos y cristales', reason: 'Eliminar puntos ciegos' });
      
      rules.push("Respetar límites de velocidad máximos (Ruta: 110, Zona urbana: 40/60).");
      rules.push("Uso obligatorio de cinturón de seguridad en todas las plazas.");
      rules.push("Prohibido el uso de telefonía celular durante la conducción.");

      reqs.push("Licencia Nacional de Conducir (B1, B2 o C según corresponda).");
      reqs.push("LINTI (Licencia Nacional de Transporte Interjurisdiccional) si transporta cargas.");
    }

    // Priority maintenance rules
    if (usage > 100000 || (isHeavy && usage > 5000)) {
      priority.push("Revisión exhaustiva del sistema de transmisión y embrague por alto desgaste.");
      priority.push("Inspección de fatiga de materiales en anclajes estructurales críticos.");
    }
    
    if (age > 5) {
      priority.push("Reemplazo preventivo de mangueras y correas por degradación térmica.");
    }

    if (priority.length === 0) {
      priority.push("Mantenimiento preventivo estándar según manual del fabricante.");
    }

    // Global Aptitude score
    let score = 100;
    score -= (age * 1.5);
    if (!isHeavy && usage > 150000) score -= 15;
    if (isHeavy && usage > 8000) score -= 15;
    if (vehicle.status === 'Fuera de servicio') score = 0;
    if (vehicle.status === 'En Mantenimiento') score -= 50;
    
    score = Math.max(0, Math.min(100, Math.round(score)));

    return {
      vehicle,
      diagnosis: {
        score,
        checklist,
        rules,
        reqs,
        priority,
        ergonomics: [
          "Ajustar distancia del asiento: los brazos deben tener una ligera flexión al tomar el volante.",
          "El apoyo lumbar debe coincidir con la curva natural de la espalda baja.",
          "Pausas activas cada 2 horas de conducción continua (elongación de piernas y espalda)."
        ]
      }
    };
  } catch (error) {
    console.error("Error generating diagnosis:", error);
    return null;
  }
}
