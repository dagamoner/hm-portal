"use client";

import { useState } from "react";
import { markInvoiceAsPaid, deleteInvoice, createInvoice } from "@/app/actions/invoices";
import { format } from "date-fns";
import { CheckCircle, Clock, XCircle, Trash2, DollarSign, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export default function CompanyInvoicesClient({ invoices, metrics, company }: { invoices: any[], metrics: any, company: any }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        invoiceNumber: "",
        issueDate: format(new Date(), 'yyyy-MM-dd'),
        period: "",
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        vatCondition: "Responsable Inscripto",
        concept: "",
        amount: ""
    });

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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await createInvoice({ ...formData, companyId: company.id });
            toast.success("Factura registrada exitosamente");
            setIsModalOpen(false);
            setFormData({
                invoiceNumber: "",
                issueDate: format(new Date(), 'yyyy-MM-dd'),
                period: "",
                dueDate: format(new Date(), 'yyyy-MM-dd'),
                vatCondition: "Responsable Inscripto",
                concept: "",
                amount: ""
            });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={20} />
                    Registrar Nueva Factura
                </button>
            </div>

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

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Factura / Periodo</th>
                                <th className="px-6 py-4">Concepto</th>
                                <th className="px-6 py-4">Vencimiento</th>
                                <th className="px-6 py-4">Monto Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{inv.invoiceNumber}</div>
                                        <div className="text-xs text-slate-500">Periodo: {inv.period}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-700">{inv.concept}</div>
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
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No se encontraron facturas para esta empresa.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">Registrar Factura</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            {/* Información del Receptor */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                                <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Datos del Cliente</h3>
                                <p className="text-sm text-slate-600"><strong>Razón Social:</strong> {company.name}</p>
                                <p className="text-sm text-slate-600"><strong>CUIT:</strong> {company.taxId}</p>
                                <p className="text-sm text-slate-600"><strong>Domicilio:</strong> {company.address}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Número de Factura</label>
                                    <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl"
                                        value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Concepto / Producto</label>
                                    <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl"
                                        value={formData.concept} onChange={e => setFormData({...formData, concept: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Periodo Facturado (ej. Mayo 2026)</label>
                                    <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl"
                                        value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Monto Total (con IVA)</label>
                                    <input required type="number" step="0.01" className="w-full p-3 border border-slate-200 rounded-xl"
                                        value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Condición frente al IVA</label>
                                    <select className="w-full p-3 border border-slate-200 rounded-xl"
                                        value={formData.vatCondition} onChange={e => setFormData({...formData, vatCondition: e.target.value})}>
                                        <option value="Responsable Inscripto">Responsable Inscripto</option>
                                        <option value="Monotributo">Monotributo</option>
                                        <option value="Exento">Exento</option>
                                        <option value="Consumidor Final">Consumidor Final</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de Emisión</label>
                                    <input required type="date" className="w-full p-3 border border-slate-200 rounded-xl"
                                        value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de Vencimiento</label>
                                    <input required type="date" className="w-full p-3 border border-slate-200 rounded-xl"
                                        value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isUpdating} className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                                    {isUpdating ? "Guardando..." : "Guardar Factura"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
