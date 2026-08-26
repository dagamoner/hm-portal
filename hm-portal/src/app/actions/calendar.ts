"use server";

import { prisma } from "@/lib/prisma";

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'visit' | 'finding' | 'training' | 'measurement' | 'invoice' | 'improvement_action';
  color: string;
  companyName: string;
  url: string;
  description?: string;
  status?: string;
  criticidad?: string;
  responsable?: string;
};

export async function getCalendarEvents(companyId?: string): Promise<CalendarEvent[]> {
  const events: CalendarEvent[] = [];
  const whereCompany = companyId ? { companyId } : {};

  // 1. Visitas
  const visits = await prisma.visit.findMany({
    where: companyId ? { establishment: { companyId } } : {},
    include: { establishment: { include: { company: true } } }
  });

  visits.forEach(v => {
    events.push({
      id: `visit-${v.id}`,
      title: `Visita: ${v.establishment.name}`,
      date: v.date,
      type: 'visit',
      color: 'bg-emerald-500',
      companyName: v.establishment.company.name,
      url: `/portal/empresas/${v.establishment.companyId}/visitas`,
      description: `Visita nro ${v.visitNumber} por ${v.inspectorName}`,
      responsable: v.inspectorName
    });
  });

  // 2. Desvíos (VisitFindings) pendientes
  const findings = await prisma.visitFinding.findMany({
    where: {
      ...whereCompany,
      status: { not: 'CERRADO' },
      deadline: { not: null }
    },
    include: { company: true, visit: true }
  });

  findings.forEach(f => {
    events.push({
      id: `finding-${f.id}`,
      title: `Vence desvío en ${f.company.name}`,
      date: f.deadline!,
      type: 'finding',
      color: f.hazardLevel?.toUpperCase().includes('CRITIC') || f.hazardLevel?.toUpperCase().includes('EXTREMO') ? 'bg-red-500' : 'bg-orange-500',
      companyName: f.company.name,
      url: `/portal/empresas/${f.companyId}/visitas`,
      description: f.description,
      status: f.status,
      criticidad: f.hazardLevel || 'N/A'
    });
  });

  // 3. Capacitaciones
  const trainings = await prisma.training.findMany({
    where: companyId ? { plan: { companyId } } : {},
    include: { plan: { include: { company: true } } }
  });

  trainings.forEach(t => {
    events.push({
      id: `training-${t.id}`,
      title: `Capacitación: ${t.title}`,
      date: new Date(new Date().getFullYear(), t.monthIndex - 1, 1),
      type: 'training',
      color: 'bg-blue-500',
      companyName: t.plan.company.name,
      url: `/portal/empresas/${t.plan.companyId}/capacitaciones`,
      description: t.description || 'Sin descripción',
      status: t.status,
      criticidad: t.priority
    });
  });

  // 4. Mediciones (Vencimientos)
  const measurements = await prisma.measurementRecord.findMany({
    where: {
      ...whereCompany,
      status: 'Pendiente'
    },
    include: { company: true }
  });

  measurements.forEach(m => {
    events.push({
      id: `measurement-${m.id}`,
      title: `Medición Pendiente: ${m.type}`,
      date: m.date,
      type: 'measurement',
      color: 'bg-purple-500',
      companyName: m.company.name,
      url: `/portal/empresas/${m.companyId}/mediciones`,
      description: `Sector: ${m.area}`,
      status: m.status
    });
  });

  // 5. Facturas Pendientes
  const invoices = await prisma.invoice.findMany({
    where: {
      ...whereCompany,
      status: { not: 'PAGADO' }
    },
    include: { company: true }
  });

  invoices.forEach(i => {
    events.push({
      id: `invoice-${i.id}`,
      title: `Factura Vence: ${i.invoiceNumber}`,
      date: i.dueDate,
      type: 'invoice',
      color: 'bg-slate-700',
      companyName: i.company.name,
      url: `/portal/facturacion`,
      description: `Monto: $${i.amount}`,
      status: i.status
    });
  });

  // 6. ImprovementActions (Matriz de Riesgos)
  const improvementActions = await prisma.improvementAction.findMany({
    where: {
      status: { not: 'Cerrada' },
      deadline: { not: null },
      ...(companyId ? { evaluation: { hazard: { task: { jobRole: { process: { sector: { establishment: { companyId } } } } } } } } : {})
    },
    include: {
      evaluation: {
        include: { hazard: { include: { task: { include: { jobRole: { include: { process: { include: { sector: { include: { establishment: { include: { company: true } } } } } } } } } } } } }
      }
    }
  });

  improvementActions.forEach(a => {
    const comp = a.evaluation?.hazard?.task?.jobRole?.process?.sector?.establishment?.company;
    if (comp) {
      events.push({
        id: `imp-${a.id}`,
        title: `Acción Preventiva`,
        date: a.deadline!,
        type: 'improvement_action',
        color: 'bg-amber-600',
        companyName: comp.name,
        url: `/portal/empresas/${comp.id}/matriz`,
        description: a.description,
        status: a.status,
        responsable: a.responsible || 'N/A'
      });
    }
  });

  return events;
}
