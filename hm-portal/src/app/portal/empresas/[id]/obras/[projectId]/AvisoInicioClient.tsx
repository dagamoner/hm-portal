"use client";

import React, { useRef } from "react";
import { Download, FileText, Building2, MapPin, Calendar, Building, User } from "lucide-react";
import { format } from "date-fns";

export default function AvisoInicioClient({ project, company }: { project: any, company: any }) {
    const componentRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        // Simplified print triggering. In a real scenario you would use html2canvas + jsPDF.
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-600" />
                        Aviso de Inicio de Obra
                    </h2>
                    <p className="text-slate-500 mt-1">Generación automática del formulario estándar (Anexo I).</p>
                </div>
                <button 
                    onClick={handleDownload}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 print:hidden"
                >
                    <Download className="w-5 h-5" /> Exportar / Imprimir
                </button>
            </div>

            <div className="flex justify-center print:p-0">
                <div 
                    ref={componentRef}
                    className="bg-white p-12 shadow-xl border border-slate-200 rounded-lg w-full max-w-4xl text-slate-900 printable-form"
                    style={{ minHeight: '1122px' }} // A4 approx
                >
                    <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight">Aviso de Inicio de Obra</h1>
                            <p className="text-sm font-medium mt-1">Anexo I - Resolución SRT</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{company.name}</p>
                            <p className="text-sm">CUIT: {company.cuit}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="font-bold uppercase bg-slate-100 px-3 py-1 mb-4 flex items-center gap-2"><Building2 className="w-4 h-4" /> 1. Datos del Empleador</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm px-3">
                                <div><strong>Razón Social:</strong> {company.name}</div>
                                <div><strong>CUIT:</strong> {company.cuit}</div>
                                <div className="col-span-2"><strong>Domicilio Legal:</strong> {company.address}</div>
                            </div>
                        </section>

                        <section>
                            <h3 className="font-bold uppercase bg-slate-100 px-3 py-1 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> 2. Datos de la Obra</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm px-3">
                                <div className="col-span-2"><strong>Denominación / Proyecto:</strong> {project.name}</div>
                                <div className="col-span-2"><strong>Ubicación:</strong> {project.location}</div>
                                <div><strong>Superficie Aprox:</strong> {project.surfaceArea ? `${project.surfaceArea} m²` : 'N/A'}</div>
                                <div><strong>Comitente:</strong> {project.clientName || 'N/A'}</div>
                                <div className="col-span-2"><strong>Tipo de Obra:</strong> {project.description || 'Construcción / Montaje'}</div>
                            </div>
                        </section>

                        <section>
                            <h3 className="font-bold uppercase bg-slate-100 px-3 py-1 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> 3. Plazos Estimados</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm px-3">
                                <div><strong>Fecha de Inicio:</strong> {project.startDate ? format(new Date(project.startDate), 'dd/MM/yyyy') : 'No definida'}</div>
                                <div><strong>Fecha de Finalización:</strong> {project.endDate ? format(new Date(project.endDate), 'dd/MM/yyyy') : 'No definida'}</div>
                            </div>
                        </section>

                        <section>
                            <h3 className="font-bold uppercase bg-slate-100 px-3 py-1 mb-4 flex items-center gap-2"><User className="w-4 h-4" /> 4. Firmas Responsables</h3>
                            <div className="mt-24 grid grid-cols-2 gap-12 text-center text-sm px-12">
                                <div>
                                    <div className="border-t border-slate-400 pt-2">
                                        <strong>Representante de la Empresa</strong><br/>
                                        Firma y Aclaración
                                    </div>
                                </div>
                                <div>
                                    <div className="border-t border-slate-400 pt-2">
                                        <strong>Responsable HyS</strong><br/>
                                        Firma y Sello (Matrícula)
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-20 text-xs text-slate-400 text-center border-t border-slate-200 pt-4">
                        Documento generado automáticamente por el Portal MH - {format(new Date(), 'dd/MM/yyyy HH:mm')}
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body * { visibility: hidden; }
                    .printable-form, .printable-form * { visibility: visible; }
                    .printable-form { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}} />
        </div>
    );
}
