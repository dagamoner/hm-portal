import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.MANAGER)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const budget = await prisma.budget.findUnique({
      where: { id: params.id },
    });

    if (!budget) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGET_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.MANAGER)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { clientName, clientCompany, clientCuil, clientAddress, reference, items, total, importantNote, date } = body;

    const budget = await prisma.budget.update({
      where: { id: params.id },
      data: {
        date: date ? new Date(date) : undefined,
        clientName,
        clientCompany,
        clientCuil,
        clientAddress,
        reference,
        items,
        total,
        importantNote,
      }
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGET_PUT]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const session = await getSession();
    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.MANAGER)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.budget.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BUDGET_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
