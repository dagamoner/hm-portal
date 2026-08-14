import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.MANAGER)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const budgets = await prisma.budget.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("[BUDGETS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.MANAGER)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Determine next budget number
    const count = await prisma.budget.count();
    const nextNumber = `PRES-${String(count + 1).padStart(3, "0")}`;

    const body = await request.json();
    const { clientName, clientCompany, clientCuil, clientAddress, reference, items, total, importantNote, date } = body;

    const budget = await prisma.budget.create({
      data: {
        budgetNumber: nextNumber,
        date: date ? new Date(date) : new Date(),
        clientName: clientName || "",
        clientCompany: clientCompany || "",
        clientCuil: clientCuil || "",
        clientAddress: clientAddress || "",
        reference: reference || "",
        items: items || [],
        total: total || 0,
        importantNote: importantNote || "",
      }
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGETS_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
