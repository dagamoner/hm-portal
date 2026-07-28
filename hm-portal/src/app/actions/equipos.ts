"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEquipments(companyId: string) {
  try {
    return await prisma.equipment.findMany({
      where: { companyId },
      include: {
        interventions: {
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching equipments:", error);
    return [];
  }
}

export async function createEquipment(companyId: string, data: {
  name: string;
  category: string;
  status: string;
  hours: number;
}) {
  try {
    const equipment = await prisma.equipment.create({
      data: {
        companyId,
        name: data.name,
        category: data.category,
        status: data.status,
        hours: data.hours,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/equipos`);
    return { success: true, equipment };
  } catch (error) {
    console.error("Error creating equipment:", error);
    return { success: false, error: "No se pudo crear el equipo" };
  }
}

export async function createIntervention(equipmentId: string, data: {
  type: string;
  date: Date;
  description: string;
}) {
  try {
    const intervention = await prisma.intervention.create({
      data: {
        equipmentId,
        type: data.type,
        date: data.date,
        description: data.description
      }
    });
    return { success: true, intervention };
  } catch (error) {
    console.error("Error creating intervention:", error);
    return { success: false, error: "No se pudo crear la intervención" };
  }
}

export async function getEquipmentAnalysis(equipmentId: string) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        interventions: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!equipment) return null;

    // AI Predictive Analysis Engine
    const MAX_HOURS = 10000;
    let health = 100;
    
    // Penalize by raw usage
    const usageFactor = equipment.hours / MAX_HOURS;
    health -= (usageFactor * 40); // Max 40% penalty for hours

    // Analyze interventions
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    
    let hasRecentPreventive = false;
    let correctivesCount = 0;

    equipment.interventions.forEach(inv => {
      if (inv.date >= sixMonthsAgo && (inv.type === 'Preventivo' || inv.type === 'Predictivo')) {
        hasRecentPreventive = true;
      }
      if (inv.type === 'Correctivo') {
        correctivesCount++;
      }
    });

    if (!hasRecentPreventive && equipment.hours > (MAX_HOURS * 0.5)) {
      health -= 20; // 20% penalty for lack of recent maintenance on heavily used equipment
    }

    health -= (correctivesCount * 10); // 10% penalty per corrective maintenance
    
    if (equipment.status === 'Crítico') health = Math.min(health, 20);
    if (equipment.status === 'En Mantenimiento') health = Math.min(health, 50);

    health = Math.max(0, Math.min(100, Math.round(health)));

    // Risk and Window
    const risk = 100 - health;
    let window = "Operación Segura";
    let component = "N/A";
    let suggestion = "Mantener plan de rutinas según manual del fabricante.";

    if (risk > 75) {
      window = "Inminente (0-15 días)";
    } else if (risk > 50) {
      window = "A Corto Plazo (15-45 días)";
    } else if (risk > 25) {
      window = "A Mediano Plazo (3-6 meses)";
    }

    // Identify typical critical components based on category
    if (equipment.category === 'Grúa Torre' || equipment.category === 'Grúa Móvil') {
      component = risk > 50 ? "Sistema de izaje (cables y roldanas)" : "Motor de giro";
      if (risk > 50) suggestion = "Programar END (Ensayos No Destructivos) en cables de acero e inspeccionar frenos de emergencia.";
    } else if (equipment.category === 'Generador Eléctrico') {
      component = risk > 50 ? "Alternador / Regulador de voltaje" : "Filtros y Bomba de inyección";
      if (risk > 50) suggestion = "Realizar termografía de tableros y análisis físico-químico de aceite.";
    } else if (equipment.category === 'Caldera') {
      component = risk > 50 ? "Válvulas de seguridad y purga" : "Quemador y refractarios";
      if (risk > 50) suggestion = "Prueba hidrostática y calibración certificada de válvulas.";
    } else if (equipment.category === 'Autoelevador' || equipment.category === 'Maquinaria Pesada') {
      component = risk > 50 ? "Bomba hidráulica principal" : "Mástil y rodamientos";
      if (risk > 50) suggestion = "Controlar presiones del circuito hidráulico y reemplazar filtros micronados.";
    } else {
      component = risk > 50 ? "Sistemas motrices principales" : "Sistemas secundarios";
      if (risk > 50) suggestion = "Realizar mantenimiento correctivo programado (Overhaul parcial).";
    }

    return {
      equipment,
      analysis: {
        health,
        risk,
        window,
        component,
        suggestion
      }
    };
  } catch (error) {
    console.error("Error generating equipment analysis:", error);
    return null;
  }
}
