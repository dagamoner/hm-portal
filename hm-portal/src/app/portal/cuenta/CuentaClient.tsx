"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, DollarSign, Calendar, FileText } from "lucide-react";

export default function CuentaClient({ invoices }: { invoices: any[] }) {
    // Only pending or overdue invoices count towards debt
    const pendingInvoices = invoices.filter(inv => inv.status === "PENDIENTE" || inv.status === "VENCIDO");
    
    // Check if any invoice is more than 15 days past its due date
    const today = new Date();
    const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
    
    const isAlertTriggered = pendingInvoices.some(inv => {
        const dueDate = new Date(inv.dueDate);
        const timePastDue = today.getTime() - dueDate.getTime();
        return timePastDue > fifteenDaysInMs;
    });

    const totalDebt = pendingInvoices.reduce((sum, inv) => sum + (inv.amount - inv.amountPaid), 0);

    return (
        <div className="space-y-6">
            {isAlertTriggered ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-red-800 font-bold text-lg mb-1">Atención Requerida</h3>
                        <p className="text-red-700">
                            No ha regularizado su pago del Servicio de Higiene y Seguridad, por favor póngase en contacto con los administradores para regularizar su situación.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl shadow-sm flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                    <p className="text-emerald-800 font-medium">
                        Su empresa se encuentra con los pagos del servicio al día.
                    </p>
                </div>
            )}

            {pendingInvoices.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-indigo-500" />
                            Detalle de Deuda
                        </h3>
                    </div>
                    
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                        <th className="p-4 font-bold">Factura / Periodo</th>
                                        <th className="p-4 font-bold">Vencimiento</th>
                                        <th className="p-4 font-bold text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pendingInvoices.map(inv => {
                                        const dueDate = new Date(inv.dueDate);
                                        const isOverdue15 = (today.getTime() - dueDate.getTime()) > fifteenDaysInMs;
                                        
                                        return (
                                            <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800">{inv.invoiceNumber}</p>
                                                            <p className="text-sm text-slate-500">Período: {inv.period}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className={`font-medium ${isOverdue15 ? 'text-red-600' : 'text-slate-700'}`}>
                                                            {dueDate.toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="font-bold text-slate-800">
                                                        ${(inv.amount - inv.amountPaid).toLocaleString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-50">
                                        <td colSpan={2} className="p-4 text-right font-bold text-slate-600 uppercase tracking-wider text-sm">
                                            Monto Total Adeudado
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-xl font-black text-indigo-700">
                                                ${totalDebt.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
