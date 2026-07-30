"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
    Search, Filter, Link as LinkIcon, Download, Eye, Trash2, Plus, 
    FileText, Activity, Users, Shield, File, ChevronDown, UploadCloud
} from 'lucide-react';
import { deleteDocument, createDocument, updateDocumentFile } from '@/app/actions/documents';
import { DocumentCategory, DocumentStatus } from '@prisma/client';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '@/components/providers/AuthProvider';

export type DocumentDTO = {
    id: string;
    title: string;
    category: DocumentCategory;
    status: DocumentStatus;
    uploadDate: Date;
    expirationDate: Date | null;
    fileUrl: string | null;
};

export default function DocumentationClient({ 
    documents, 
    companyId,
    companyName
}: { 
    documents: DocumentDTO[], 
    companyId: string,
    companyName: string
}) {
    const { canEdit, isClient } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'TODOS'>('TODOS');
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUpdateDocId, setSelectedUpdateDocId] = useState<string | null>(null);
    const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');

    const filteredDocs = documents.filter(doc => {
        if (selectedCategory !== 'TODOS' && doc.category !== selectedCategory) return false;
        if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const getStatusColor = (status: DocumentStatus) => {
        switch (status) {
            case 'VIGENTE': return 'bg-emerald-100 text-emerald-600';
            case 'POR_VENCER': return 'bg-amber-100 text-amber-600';
            case 'VENCIDO': return 'bg-rose-100 text-rose-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusLabel = (status: DocumentStatus) => {
        switch (status) {
            case 'VIGENTE': return 'VIGENTE';
            case 'POR_VENCER': return 'POR VENCER';
            case 'VENCIDO': return 'VENCIDO';
            default: return status;
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este documento?")) {
            await deleteDocument(id, companyId);
        }
    };

    const generateTableData = () => {
        return filteredDocs.map(doc => [
            doc.title,
            doc.category,
            getStatusLabel(doc.status),
            new Date(doc.uploadDate).toLocaleDateString(),
            doc.expirationDate ? new Date(doc.expirationDate).toLocaleDateString() : 'N/A'
        ]);
    };

    const exportToCSV = () => {
        const headers = ['Título', 'Categoría', 'Estado', 'Fecha Subida', 'Vencimiento'];
        const data = generateTableData();
        const csvContent = [
            headers.join(','),
            ...data.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `documentos_${companyName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOptionsOpen(false);
    };

    const exportToExcel = () => {
        const headers = [['Título', 'Categoría', 'Estado', 'Fecha Subida', 'Vencimiento']];
        const data = generateTableData();
        const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Documentos");
        XLSX.writeFile(wb, `documentos_${companyName}.xlsx`);
        setIsOptionsOpen(false);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text(`Listado de Documentos - ${companyName}`, 14, 15);
        autoTable(doc, {
            head: [['Título', 'Categoría', 'Estado', 'Fecha Subida', 'Vencimiento']],
            body: generateTableData(),
            startY: 20,
        });
        doc.save(`documentos_${companyName}.pdf`);
        setIsOptionsOpen(false);
    };

    const totalDocs = documents.length;
    const activeDocs = documents.filter(d => d.status === 'VIGENTE').length;
    const healthPercentage = totalDocs > 0 ? Math.round((activeDocs / totalDocs) * 100) : 100;
    const expiringDocs = documents.filter(d => d.status === 'POR_VENCER').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
                <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                    </span>
                    Gestión Documental HSE
                </h2>
                <p className="text-slate-500 font-medium mt-2">
                    Archivo técnico digitalizado y auditado por IA para {companyName}
                </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button 
                            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            Opciones
                            <ChevronDown className={`w-4 h-4 transition-transform ${isOptionsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isOptionsOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                                <div className="p-1">
                                    <button 
                                        onClick={exportToPDF}
                                        className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                                    >
                                        Descargar como PDF
                                    </button>
                                    <button 
                                        onClick={exportToExcel}
                                        className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                                    >
                                        Descargar como Excel
                                    </button>
                                    <button 
                                        onClick={exportToCSV}
                                        className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                                    >
                                        Descargar como CSV
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {!isClient && (
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            CARGAR NUEVO DOCUMENTO
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white/50">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Categorías HSE</p>
                    <div className="space-y-1">
                        <button 
                            onClick={() => setSelectedCategory('TODOS')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                selectedCategory === 'TODOS' 
                                    ? 'bg-indigo-50 text-indigo-700' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${selectedCategory === 'TODOS' ? 'border-2 border-indigo-400' : 'border-2 border-slate-300'}`} />
                                Ver Todos
                            </span>
                            {selectedCategory === 'TODOS' && <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"/></div>}
                        </button>
                        
                        {(['LEGAL', 'PERSONAL', 'ACTIVOS', 'PROCEDIMIENTOS'] as DocumentCategory[]).map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                    selectedCategory === cat 
                                        ? 'bg-indigo-50 text-indigo-700' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${selectedCategory === cat ? 'border-2 border-indigo-400' : 'border-2 border-slate-300'}`} />
                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </span>
                                {selectedCategory === cat && <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"/></div>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0f172a] p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Shield className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Salud del Legajo</p>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-4">Nivel de Integridad</p>
                        
                        <div className="flex items-end justify-between mb-2">
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mr-4">
                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${healthPercentage}%` }} />
                            </div>
                            <span className="text-xl font-black text-white leading-none">{healthPercentage}%</span>
                        </div>
                        
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-4">
                            Sistema detecta {expiringDocs} documento{expiringDocs !== 1 ? 's' : ''} próximo a vencer. Mantenga el legajo actualizado para cumplir con la ley 19.587.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                {/* Search Bar */}
                <div className="flex gap-4">
                    <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl flex items-center px-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                        <Search className="w-5 h-5 text-slate-400 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Buscar documentos de Higiene y Seguridad..."
                            className="w-full bg-transparent border-none focus:outline-none py-4 text-sm font-medium text-slate-700 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="w-14 h-14 bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="w-14 h-14 bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">
                        <LinkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredDocs.map((doc) => (
                        <div key={doc.id} className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/50 overflow-hidden flex flex-col group hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {doc.fileUrl && (
                                            <>
                                                {!doc.fileUrl.startsWith('http') && (
                                                    <a href={doc.fileUrl} download={doc.title} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Descargar documento">
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Ver documento">
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            </>
                                        )}
                                        {!isClient && (
                                            <button 
                                                onClick={() => {
                                                    setSelectedUpdateDocId(doc.id);
                                                    setIsUpdateModalOpen(true);
                                                }}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" 
                                                title="Reemplazar archivo"
                                            >
                                                <UploadCloud className="w-4 h-4" />
                                            </button>
                                        )}
                                        {canEdit && (
                                            <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Eliminar documento">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <h3 className="font-black text-slate-800 text-lg mb-3 line-clamp-2">{doc.title}</h3>
                                
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg ${getStatusColor(doc.status)}`}>
                                        {getStatusLabel(doc.status)}
                                    </span>
                                    <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-slate-100 text-slate-500">
                                        {doc.category}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                                    <span>Subido: {doc.uploadDate.toLocaleDateString()}</span>
                                    {doc.expirationDate && (
                                        <span className={doc.status === 'VENCIDO' || doc.status === 'POR_VENCER' ? 'text-rose-500' : ''}>
                                            Vence: {doc.expirationDate.toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-100 p-3 bg-slate-50/50">
                                <button className="w-full text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-2 py-2 hover:bg-indigo-50 rounded-xl transition-colors">
                                    <Activity className="w-3.5 h-3.5" />
                                    Auditoría IA de Documento
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Placeholder */}
                    {!isClient && (
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-white/30 backdrop-blur-xl rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all min-h-[300px] flex flex-col items-center justify-center group"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-indigo-500 flex items-center justify-center mb-4 transition-colors">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-500 uppercase tracking-widest transition-colors">
                                Añadir Archivo Técnico
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Modal de Carga */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-slate-800">Cargar Documento</h3>
                                <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                            
                            <form action={async (formData) => {
                                formData.append('companyId', companyId);
                                await createDocument(formData);
                                setIsUploadModalOpen(false);
                            }} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Título del Documento</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        required 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="Ej: Certificado de Cobertura ART"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categoría</label>
                                        <select 
                                            name="category" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                                        >
                                            <option value="LEGAL">Legal</option>
                                            <option value="PERSONAL">Personal</option>
                                            <option value="ACTIVOS">Activos</option>
                                            <option value="PROCEDIMIENTOS">Procedimientos</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vencimiento (Opcional)</label>
                                        <input 
                                            type="date" 
                                            name="expirationDate" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex gap-4 mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                checked={uploadMethod === 'file'}
                                                onChange={() => setUploadMethod('file')}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-bold text-slate-600">Subir Archivo</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                checked={uploadMethod === 'link'}
                                                onChange={() => setUploadMethod('link')}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-bold text-slate-600">Enlace (Google Drive, etc)</span>
                                        </label>
                                    </div>

                                    {uploadMethod === 'file' ? (
                                        <input 
                                            type="file" 
                                            name="file" 
                                            accept="*/*"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    ) : (
                                        <input 
                                            type="url" 
                                            name="driveUrl" 
                                            placeholder="https://drive.google.com/..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsUploadModalOpen(false)}
                                        className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                                    >
                                        Guardar Documento
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Reemplazo de Archivo */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-slate-800">Reemplazar Archivo</h3>
                                <button onClick={() => setIsUpdateModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                            
                            <form action={async (formData) => {
                                if (selectedUpdateDocId) {
                                    await updateDocumentFile(selectedUpdateDocId, companyId, formData);
                                    setIsUpdateModalOpen(false);
                                    setSelectedUpdateDocId(null);
                                }
                            }} className="space-y-5">
                                
                                <div>
                                    <div className="flex gap-4 mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                checked={uploadMethod === 'file'}
                                                onChange={() => setUploadMethod('file')}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-bold text-slate-600">Subir Archivo</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                checked={uploadMethod === 'link'}
                                                onChange={() => setUploadMethod('link')}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-bold text-slate-600">Enlace (Google Drive, etc)</span>
                                        </label>
                                    </div>

                                    {uploadMethod === 'file' ? (
                                        <input 
                                            type="file" 
                                            name="file" 
                                            accept="*/*"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    ) : (
                                        <input 
                                            type="url" 
                                            name="driveUrl" 
                                            placeholder="https://drive.google.com/..."
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsUpdateModalOpen(false)}
                                        className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                                    >
                                        Actualizar Archivo
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}
