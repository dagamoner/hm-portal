"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logAction } from "./auditoria";

type InvoiceStatus = "PENDIENTE" | "PAGADO" | "VENCIDO";

export async function getInvoices(companyId?: string) {
    const session = await getSession();
    if (!session?.user) throw new Error("No autenticado");
    
    // Solo admins pueden ver todo, si no se pasa companyId
    if (!companyId && session.user.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    const where = companyId ? { companyId } : {};
    
    return await prisma.invoice.findMany({
        where,
        include: {
            company: {
                select: { name: true, taxId: true, address: true }
            }
        },
        orderBy: { issueDate: 'desc' }
    });
}

export async function getInvoiceMetrics(companyId?: string) {
    const invoices = await getInvoices(companyId);
    
    let totalBilled = 0;
    let totalPaid = 0;
    let totalDebt = 0;

    invoices.forEach(inv => {
        totalBilled += inv.amount;
        totalPaid += inv.amountPaid;
        totalDebt += (inv.amount - inv.amountPaid);
    });

    return {
        totalBilled,
        totalPaid,
        totalDebt,
        totalInvoices: invoices.length,
        pendingInvoices: invoices.filter(i => i.status === "PENDIENTE" || i.status === "VENCIDO").length
    };
}

export async function createInvoice(data: any) {
    await requireAuth();
    
    const newInvoice = await prisma.invoice.create({
        data: {
            companyId: data.companyId,
            issuerName: "Moner Dante Gaston",
            issuerCuit: "20-33445566-7",
            issuerAddress: "Mendoza, Argentina",
            invoiceNumber: data.invoiceNumber,
            issueDate: new Date(data.issueDate),
            period: data.period,
            dueDate: new Date(data.dueDate),
            vatCondition: data.vatCondition || "Responsable Inscripto",
            concept: data.concept,
            amount: parseFloat(data.amount),
            amountPaid: 0,
            status: "PENDIENTE"
        }
    });
    await logAction("Facturación", "CREAR", `Factura ${data.invoiceNumber}`);
    
    revalidatePath("/portal/facturacion");
    revalidatePath(`/portal/empresas/${newInvoice.companyId}/facturacion`);
    return newInvoice;
}

export async function markInvoiceAsPaid(id: string) {
    await requireAuth();
    
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new Error("Factura no encontrada");
    
    const updated = await prisma.invoice.update({
        where: { id },
        data: {
            amountPaid: invoice.amount,
            status: "PAGADO",
            paymentDate: new Date()
        }
    });
    
    await logAction("Facturación", "MODIFICAR", `Factura ${invoice.invoiceNumber} cobrada`);
    
    revalidatePath("/portal/facturacion");
    revalidatePath(`/portal/empresas/${updated.companyId}/facturacion`);
    return updated;
}

export async function deleteInvoice(id: string) {
    await requireAuth();
    const deleted = await prisma.invoice.delete({ where: { id } });
    await logAction("Facturación", "ELIMINAR", `Factura ${deleted.invoiceNumber}`);
    revalidatePath("/portal/facturacion");
    revalidatePath(`/portal/empresas/${deleted.companyId}/facturacion`);
    return deleted;
}
