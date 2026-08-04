import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInvoices, getInvoiceMetrics } from "@/app/actions/invoices";
import CompanyInvoicesClient from "./CompanyInvoicesClient";
import { prisma } from "@/lib/prisma";

export default async function CompanyInvoicesPage({ params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        redirect(`/portal/empresas/${params.id}`);
    }

    const company = await prisma.company.findUnique({
        where: { id: params.id },
        select: { id: true, name: true, taxId: true, address: true }
    });

    if (!company) {
        redirect("/portal/empresas");
    }

    const invoices = await getInvoices(params.id);
    const metrics = await getInvoiceMetrics(params.id);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Facturación: {company.name}</h2>
            <CompanyInvoicesClient invoices={invoices} metrics={metrics} company={company} />
        </div>
    );
}
