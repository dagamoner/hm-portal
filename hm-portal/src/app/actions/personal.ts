"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function calculateSafetyScore(worker: any) {
  let score = 50; // Base score
  
  // EPP Delivered
  if (worker.eppDeliveries && worker.eppDeliveries.length > 0) {
    score += 10;
  }
  
  // Trainings
  if (worker.trainingRecords && worker.trainingRecords.length > 0) {
    const approvedTrainings = worker.trainingRecords.filter((t: any) => t.approved).length;
    score += Math.min(20, approvedTrainings * 5); // Max 20 points
  }
  
  // Permits
  if (worker.permits && worker.permits.length > 0) {
    const validPermits = worker.permits.filter((p: any) => p.status === 'Vigente' || p.status === 'Cerrado' || p.status === 'Firmado').length;
    score += Math.min(20, validPermits * 2); // Max 20 points
  }
  
  return Math.min(100, Math.max(0, score)); // Ensure between 0 and 100
}

export async function getWorkers(companyId: string) {
  try {
    const workers = await prisma.worker.findMany({
      where: { companyId },
      include: {
        permits: {
          orderBy: { issueDate: 'desc' }
        },
        trainingRecords: true,
        eppDeliveries: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return workers.map(w => ({
      ...w,
      safetyScore: calculateSafetyScore(w)
    }));
  } catch (error) {
    console.error("Error fetching workers:", error);
    return [];
  }
}

export async function getWorkerProfile(workerId: string) {
  try {
    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      include: {
        permits: {
          orderBy: { issueDate: 'desc' }
        },
        trainingRecords: true
      }
    });
    
    if (worker) {
      return {
        ...worker,
        safetyScore: calculateSafetyScore(worker)
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching worker:", error);
    return null;
  }
}

export async function generateWorkers(companyId: string, roleName: string, count: number) {
  try {
    const firstNames = ["Juan", "Carlos", "Luis", "Pedro", "Miguel", "Jorge", "Roberto", "Andrés", "Diego", "Fernando"];
    const lastNames = ["García", "Rodríguez", "López", "Martínez", "Pérez", "Gómez", "Sánchez", "Díaz", "Fernández", "Ruiz"];
    
    const workersData = Array.from({ length: count }).map(() => {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Simulate safety score based on role complexity
      let safetyScore = 100;
      if (roleName.toLowerCase().includes('soldador') || roleName.toLowerCase().includes('altura') || roleName.toLowerCase().includes('eléctrico')) {
        safetyScore = Math.floor(Math.random() * (100 - 80 + 1) + 80); // 80 - 100
      } else {
        safetyScore = Math.floor(Math.random() * (100 - 60 + 1) + 60); // 60 - 100
      }

      return {
        companyId,
        firstName: fName,
        lastName: lName,
        documentId: Math.floor(Math.random() * 90000000 + 10000000).toString(),
        laborData: { position: roleName },
        safetyScore
      };
    });

    const createdWorkers = await prisma.$transaction(
      workersData.map(data => prisma.worker.create({ data }))
    );

    revalidatePath(`/portal/empresas/${companyId}/personal`);
    return { success: true, workers: createdWorkers };
  } catch (error) {
    console.error("Error generating workers:", error);
    return { success: false, error: "No se pudieron generar los perfiles" };
  }
}

export async function createActualWorkers(companyId: string, workersData: any[]) {
  try {
    const formattedWorkers = workersData.map(w => ({
      companyId,
      firstName: w.firstName,
      lastName: w.lastName,
      documentId: w.documentId,
      safetyScore: 100, // Default to 100 as per user requirement to use live data later
      laborData: {
        position: w.position,
        function: w.function,
        cuil: w.cuil,
        phone: w.phone,
        emergencyContact: w.emergencyContact || null,
        address: w.address || null,
        eppDelivered: w.eppDelivered,
        educationLevel: w.educationLevel || null,
        hireDate: w.hireDate || null,
      }
    }));

    const createdWorkers = await prisma.$transaction(
      formattedWorkers.map(data => prisma.worker.create({ data }))
    );

    revalidatePath(`/portal/empresas/${companyId}/personal`);
    return { success: true, workers: createdWorkers };
  } catch (error) {
    console.error("Error creating real workers:", error);
    return { success: false, error: "No se pudieron crear los perfiles" };
  }
}

export async function issuePTW(workerId: string, companyId: string, data: {
  taskDescription: string;
  hazards: string[];
  ppe: string[];
  preventions: string[];
  expirationDate: Date;
}) {
  try {
    const signatureId = `SAFEGUARD-VERIFIED-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    
    const ptw = await prisma.permitToWork.create({
      data: {
        workerId,
        companyId,
        taskDescription: data.taskDescription,
        hazards: data.hazards,
        ppe: data.ppe,
        preventions: data.preventions,
        expirationDate: data.expirationDate,
        status: "Vigente",
        signatureId
      }
    });

    revalidatePath(`/portal/empresas/${companyId}/personal/${workerId}`);
    return { success: true, ptw };
  } catch (error) {
    console.error("Error issuing PTW:", error);
    return { success: false, error: "No se pudo emitir el permiso de trabajo" };
  }
}

export async function getPTWSuggestions(taskDescription: string) {
  // Simulating an AI assistant analyzing the task to suggest hazards and PPE
  const text = taskDescription.toLowerCase();
  
  const hazards: string[] = [];
  const ppe: string[] = ["Casco de seguridad", "Calzado de seguridad", "Lentes de seguridad", "Guantes de trabajo"];
  const preventions: string[] = ["Charla de seguridad de 5 minutos", "Demarcación del área de trabajo"];

  if (text.includes("altura") || text.includes("techo") || text.includes("andamio")) {
    hazards.push("Caída a distinto nivel", "Caída de objetos", "Vientos fuertes");
    ppe.push("Arnés de cuerpo entero con doble cabo de vida", "Barbiquejo");
    preventions.push("Inspección de andamios (Tarjeta Verde)", "Cálculo de punto de anclaje", "Delimitar zona inferior");
  }
  
  if (text.includes("soldadura") || text.includes("corte") || text.includes("amoladora")) {
    hazards.push("Quemaduras", "Inhalación de humos metálicos", "Proyección de partículas calientes", "Incendio/Explosión");
    ppe.push("Careta de soldar / Pantalla facial", "Delantal, polainas y mangas de descarne", "Protección respiratoria para humos");
    preventions.push("Retirar material combustible a 10m", "Disponer de extintor PQS 10kg", "Designar observador de fuego");
  }

  if (text.includes("eléctrico") || text.includes("tablero") || text.includes("tensión")) {
    hazards.push("Electrocución", "Arco eléctrico", "Quemaduras por contacto");
    ppe.push("Guantes dieléctricos (clase según tensión)", "Calzado dieléctrico sin punta de acero", "Ropa ignífuga (ATPV adecuado)");
    preventions.push("Aplicar las 5 Reglas de Oro (Corte, Bloqueo, Verificación, Puesta a tierra, Señalización)", "Uso de alfombra dieléctrica");
  }
  
  if (text.includes("confinado") || text.includes("tanque") || text.includes("cisterna")) {
    hazards.push("Asfixia por falta de oxígeno", "Intoxicación por gases", "Atrapamiento", "Explosión");
    ppe.push("Equipo de respiración autónoma (si aplica)", "Arnés y línea de rescate", "Detector multigas portátil");
    preventions.push("Medición de gases antes y durante", "Ventilación forzada continua", "Vigía en el exterior obligatorio");
  }

  if (hazards.length === 0) {
    hazards.push("Golpes o cortes", "Sobreesfuerzo", "Caída a nivel");
  }

  return { success: true, suggestions: { hazards, ppe, preventions } };
}

export async function updateWorker(workerId: string, companyId: string, data: any) {
  try {
    const worker = await prisma.worker.update({
      where: { id: workerId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        documentId: data.documentId,
        laborData: {
          position: data.position,
          function: data.function,
          cuil: data.cuil,
          phone: data.phone,
          emergencyContact: data.emergencyContact || null,
          address: data.address || null,
          eppDelivered: data.eppDelivered,
          educationLevel: data.educationLevel || null,
          hireDate: data.hireDate || null,
        }
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/personal`);
    revalidatePath(`/portal/empresas/${companyId}/personal/${workerId}`);
    return { success: true, worker };
  } catch (error) {
    console.error("Error updating worker:", error);
    return { success: false, error: "Error al actualizar perfil" };
  }
}

export async function deleteWorker(workerId: string, companyId: string) {
  try {
    await prisma.worker.delete({
      where: { id: workerId }
    });
    revalidatePath(`/portal/empresas/${companyId}/personal`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting worker:", error);
    return { success: false, error: "Error al eliminar perfil" };
  }
}
