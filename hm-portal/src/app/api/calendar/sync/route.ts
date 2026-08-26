import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ical from 'ical-generator';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  // Token is just user.id for MVP (in production use a signed JWT or explicit access key)
  const user = await prisma.user.findUnique({
    where: { id: token },
    include: { company: true }
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const calendar = ical({ 
    name: 'MH Calendario',
    prodId: '//MH//Higiene y Seguridad//ES'
  });
  
  // Re-use logic to get events (simplified for API)
  const companyId = user.role === 'CLIENT' ? user.companyId : undefined;
  const whereCompany = companyId ? { companyId } : {};

  // 1. Visitas
  const visits = await prisma.visit.findMany({
    where: companyId ? { establishment: { companyId } } : {},
    include: { establishment: { include: { company: true } } }
  });

  visits.forEach(v => {
    calendar.createEvent({
      start: v.date,
      end: v.date,
      allDay: true,
      summary: `[VISITA] ${v.establishment.company.name} - ${v.establishment.name}`,
      description: `Visita nro ${v.visitNumber} por ${v.inspectorName}`,
    });
  });

  // 2. Desvíos
  const findings = await prisma.visitFinding.findMany({
    where: { ...whereCompany, status: { not: 'CERRADO' }, deadline: { not: null } },
    include: { company: true }
  });

  findings.forEach(f => {
    calendar.createEvent({
      start: f.deadline!,
      end: f.deadline!,
      allDay: true,
      summary: `[VENCE DESVÍO] ${f.company.name}`,
      description: `Criticidad: ${f.hazardLevel}\nDescripción: ${f.description}`,
    });
  });

  // 3. Capacitaciones
  const trainings = await prisma.training.findMany({
    where: companyId ? { plan: { companyId } } : {},
    include: { plan: { include: { company: true } } }
  });

  trainings.forEach(t => {
    const d = new Date(new Date().getFullYear(), t.monthIndex - 1, 1);
    calendar.createEvent({
      start: d,
      end: d,
      allDay: true,
      summary: `[CAPACITACIÓN] ${t.plan.company.name} - ${t.title}`,
      description: t.description || 'Sin descripción',
    });
  });

  return new NextResponse(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="hm-portal.ics"',
    },
  });
}
