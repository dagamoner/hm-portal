import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInvoices, getInvoiceMetrics } from "@/app/actions/invoices";
import InvoicesGlobalClient from "./InvoicesGlobalClient";
import { prisma } from "@/lib/prisma";

export default async function GlobalInvoicesPage() {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        redirect("/portal/dashboard");
    }

    const invoices = await getInvoices();
    const metrics = await getInvoiceMetrics();
    const companies = await prisma.company.findMany({ select: { id: true, name: true }});

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-black text-slate-900 mb-8">Dashboard Global de Cobranzas</h1>
            <InvoicesGlobalClient invoices={invoices} metrics={metrics} companies={companies} />
        </div>
    );
}
