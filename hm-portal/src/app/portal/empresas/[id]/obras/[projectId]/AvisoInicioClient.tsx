"use client";

import React, { useRef } from "react";
import { Download, FileText, Building2, MapPin, Calendar, Building, User, FileUp, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function AvisoInicioClient({ project, company, onOpenUploadModal, onDeleteDoc, isPending: parentIsPending }: { project: any, company: any, onOpenUploadModal?: () => void, onDeleteDoc?: (id: string) => void, isPending?: boolean }) {
    const componentRef = useRef<HTMLDivElement>(null);
    const avisoDocs = project.documents?.filter((d: any) => d.type === 'AVISO_INICIO_OBRA') || [];

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
                <div className="flex gap-2">
                    {onOpenUploadModal && (
                        <button onClick={onOpenUploadModal} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all">
                            <FileUp className="w-5 h-5 text-indigo-500" /> Subir Generado
                        </button>
                    )}
                    <button 
                        onClick={handleDownload}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 print:hidden"
                    >
                        <Download className="w-5 h-5" /> Exportar
                    </button>
                </div>
            </div>

            {avisoDocs.length > 0 && (
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden print:hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            Avisos de Inicio Subidos / Adjuntos
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {avisoDocs.map((doc: any) => (
                                <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{doc.title}</h4>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                            <span className="px-2 py-1 rounded-md border font-bold bg-amber-50 text-amber-700 border-amber-200">
                                                {doc.status}
                                            </span>
                                            {doc.validUntil && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Vence: {new Date(doc.validUntil).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {doc.fileUrl && (
                                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors" title="Ver Documento">
                                                <FileText className="w-4 h-4" />
                                            </a>
                                        )}
                                        {onDeleteDoc && (
                                            <button 
                                                onClick={() => onDeleteDoc(doc.id)}
                                                disabled={parentIsPending}
                                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
