import { redirect } from "next/navigation";
import { getSession, requireAuth } from "@/lib/auth";
import { getInvoices } from "@/app/actions/invoices";
import CuentaClient from "./CuentaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Estado de Cuenta | MH Portal",
    description: "Estado de cuenta y facturación de su empresa",
};

export default async function CuentaPage() {
    await requireAuth();
    const session = await getSession();
    
    if (!session || !session.user) {
        redirect("/login");
    }

    const user = session.user;

    // Only clients or users with an assigned company should see this specific company's billing
    const companyId = user.companyId || (user.assignedCompanyIds && user.assignedCompanyIds[0]);

    if (!companyId) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No hay empresa asignada</h2>
                    <p className="text-slate-500">Comunícate con un administrador para que asigne una empresa a tu perfil.</p>
                </div>
            </div>
        );
    }

    const invoices = await getInvoices(companyId);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Estado de Cuenta</h1>
                <p className="text-slate-500 mt-2 text-lg">Revisa el estado de tus facturas y pagos del servicio de Higiene y Seguridad.</p>
            </div>
            
            <CuentaClient invoices={invoices} />
        </div>
    );
}
