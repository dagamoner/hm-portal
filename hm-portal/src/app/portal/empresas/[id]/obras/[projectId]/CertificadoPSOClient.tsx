"use client";

import React from "react";
import { FileUp, FileCheck, Calendar, Eye, Trash2 } from "lucide-react";

export default function CertificadoPSOClient({ project, onOpenUploadModal, onDeleteDoc, isPending }: { project: any, onOpenUploadModal: () => void, onDeleteDoc: (id: string) => void, isPending: boolean }) {
    const certDocs = project.documents?.filter((d: any) => d.type === 'CERTIFICADO_PSO') || [];

    return (
        <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-emerald-500" />
                            Certificado de Aprobación P.S.O.
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Sube el certificado aprobado por la A.R.T. o incluye un link de Drive.</p>
                    </div>
                    <button 
                        onClick={onOpenUploadModal}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <FileUp className="w-4 h-4" /> Nuevo Certificado
                    </button>
                </div>
                <div className="p-6">
                    {certDocs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <FileCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p>No hay certificados cargados.</p>
                            <p className="text-sm mt-1">Sube el certificado de aprobación de la ART.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {certDocs.map((doc: any) => (
                                <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between">
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                                            {doc.type.replace(/_/g, ' ')}
                                        </span>
                                        <h4 className="font-bold text-slate-800 mt-1">{doc.title}</h4>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                            <span className={`px-2 py-1 rounded-md border font-bold ${
                                                doc.status === 'Aprobado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                doc.status === 'Observado' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
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
                                                <Eye className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button 
                                            onClick={() => onDeleteDoc(doc.id)}
                                            disabled={isPending}
                                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
