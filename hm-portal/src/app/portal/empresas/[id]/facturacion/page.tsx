import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInvoices, getInvoiceMetrics } from "@/app/actions/invoices";
import CompanyInvoicesClient from "./CompanyInvoicesClient";
import { prisma } from "@/lib/prisma";

export default async function CompanyInvoicesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    
    if (!session || session.user.role !== "ADMIN") {
        redirect(`/portal/empresas/${id}`);
    }

    const company = await prisma.company.findUnique({
        where: { id },
        select: { id: true, name: true, taxId: true, address: true }
    });

    if (!company) {
        redirect("/portal/empresas");
    }

    const invoices = await getInvoices(id);
    const metrics = await getInvoiceMetrics(id);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Facturación: {company.name}</h2>
            <CompanyInvoicesClient invoices={invoices} metrics={metrics} company={company} />
        </div>
    );
}
