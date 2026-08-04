"use client";

import { useState } from "react";
import { markInvoiceAsPaid, deleteInvoice } from "@/app/actions/invoices";
import { format } from "date-fns";
import { CheckCircle, Clock, XCircle, Trash2, DollarSign, Search } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function InvoicesGlobalClient({ invoices, metrics, companies }: { invoices: any[], metrics: any, companies: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [companyFilter, setCompanyFilter] = useState("ALL");
    
    const [isUpdating, setIsUpdating] = useState(false);

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    };

    const handleMarkAsPaid = async (id: string) => {
        if (!confirm("¿Confirmas que se ha cobrado el 100% de esta factura?")) return;
        setIsUpdating(true);
        try {
            await markInvoiceAsPaid(id);
            toast.success("Factura cobrada con éxito");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar factura permanentemente?")) return;
        setIsUpdating(true);
        try {
            await deleteInvoice(id);
            toast.success("Factura eliminada");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
        const matchesCompany = companyFilter === "ALL" || inv.companyId === companyFilter;
        return matchesSearch && matchesStatus && matchesCompany;
    });

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Facturado</p>
                        <h3 className="text-3xl font-black text-slate-900">{formatMoney(metrics.totalBilled)}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <DollarSign size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Cobrado</p>
                        <h3 className="text-3xl font-black text-emerald-600">{formatMoney(metrics.totalPaid)}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Deuda Pendiente</p>
                        <h3 className="text-3xl font-black text-rose-600">{formatMoney(metrics.totalDebt)}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                        <XCircle size={28} />
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por factura o empresa..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        <select 
                            className="w-full md:w-auto px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                        >
                            <option value="ALL">Todas las empresas</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select 
                            className="w-full md:w-auto px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Todos los estados</option>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="PAGADO">Pagado</option>
                            <option value="VENCIDO">Vencido</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Factura / Periodo</th>
                                <th className="px-6 py-4">Empresa (Receptor)</th>
                                <th className="px-6 py-4">Vencimiento</th>
                                <th className="px-6 py-4">Monto Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{inv.invoiceNumber}</div>
                                        <div className="text-xs text-slate-500">Periodo: {inv.period}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/portal/empresas/${inv.companyId}/facturacion`} className="font-semibold text-indigo-600 hover:underline">
                                            {inv.company.name}
                                        </Link>
                                        <div className="text-xs text-slate-500">CUIT: {inv.company.taxId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-700">{format(new Date(inv.dueDate), 'dd/MM/yyyy')}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{formatMoney(inv.amount)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {inv.status === 'PAGADO' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle size={14}/> Pagado</span>}
                                        {inv.status === 'PENDIENTE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><Clock size={14}/> Pendiente</span>}
                                        {inv.status === 'VENCIDO' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700"><XCircle size={14}/> Vencido</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {inv.status !== 'PAGADO' && (
                                                <button 
                                                    onClick={() => handleMarkAsPaid(inv.id)}
                                                    disabled={isUpdating}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Marcar como cobrado"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(inv.id)}
                                                disabled={isUpdating}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Eliminar factura"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No se encontraron facturas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
