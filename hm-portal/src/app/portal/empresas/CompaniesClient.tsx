"use client";

import React, { useState, useTransition } from 'react';
import { 
    Building2, Plus, Search, CheckCircle2, ArrowRight, Trash2, Edit2, 
    Briefcase, Fingerprint, Phone, Key, Eye, EyeOff, Users, ShieldCheck, 
    TrendingUp, FileText, AlertCircle, Save, X
} from 'lucide-react';
import { createCompany, updateCompany, deleteCompany } from '@/app/actions/companies';

// @ts-ignore
export default function CompaniesClient({ initialCompanies }) {
    const [companies, setCompanies] = useState(initialCompanies);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<any | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<any | null>(null);
    const [showArtPass, setShowArtPass] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState<any>({
        name: '', owner: '', taxId: '', address: '', workContact: '', insuranceART: '',
        establishmentsCount: 1, workersAdmin: 0, workersOps: 0, keyData: '',
        remarks: '', artUser: '', artPass: '', industry: '', riskLevel: 'MEDIUM',
        status: 'Activa', safetyCompliance: 80
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key].toString());
            }
        });

        startTransition(async () => {
            if (editingCompany) {
                const res = await updateCompany(editingCompany.id, data);
                if (res.success) {
                    setCompanies(companies.map((c: any) => c.id === editingCompany.id ? { ...c, ...formData } : c));
                }
            } else {
                const res = await createCompany(data);
                if (res.success) {
                    // Quick optimistic reload (real reload handled by server action revalidatePath)
                    window.location.reload(); 
                }
            }
            setIsModalOpen(false);
            setEditingCompany(null);
        });
    };

    const confirmDelete = () => {
        if (!companyToDelete) return;
        startTransition(async () => {
            const res = await deleteCompany(companyToDelete.id);
            if (res.success) {
                setCompanies(companies.filter((c: any) => c.id !== companyToDelete.id));
            }
            setCompanyToDelete(null);
        });
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
            case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const filteredCompanies = companies.filter((c: any) => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.taxId.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex justify-between items-center bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-indigo-600" />
                        Directorio de Empresas
                    </h2>
                    <p className="text-slate-500 mt-1">Seleccione una empresa para gestionar sus riesgos e indicadores 365.</p>
                </div>
                <button 
                    onClick={() => { setFormData({ establishmentsCount: 1, safetyCompliance: 80, riskLevel: 'MEDIUM', status: 'Activa' }); setEditingCompany(null); setIsModalOpen(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Alta Nueva Empresa
                </button>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre, CUIT o industria..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {companies.length} Entidades en Sistema
                    </div>
                </div>

                <div className="overflow-x-auto px-2 pb-2">
                    <table className="w-full text-sm text-left">
                        <thead className="text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-5">Empresa / CUIT</th>
                                <th className="px-6 py-5">Sector</th>
                                <th className="px-6 py-5">ART / Cobertura</th>
                                <th className="px-6 py-5 text-center">Riesgo</th>
                                <th className="px-6 py-5 text-center">Cumplimiento</th>
                                <th className="px-6 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCompanies.map((company: any) => (
                                <tr key={company.id} className="hover:bg-white/80 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-indigo-100 text-indigo-600 shadow-sm">
                                                {company.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-base">{company.name}</p>
                                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{company.taxId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">{company.industry}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            {company.insuranceART}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-tighter ${getRiskColor(company.riskLevel)}`}>
                                            {company.riskLevel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                                                <div className="bg-indigo-600 h-full transition-all shadow-[0_0_8px_rgba(79,70,229,0.5)]" style={{ width: `${company.safetyCompliance}%` }} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-600">{company.safetyCompliance}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a 
                                                href={`/portal/empresas/${company.id}`}
                                                className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100 flex items-center gap-1.5"
                                                title="Ver Empresa"
                                            >
                                                <TrendingUp className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-wider hidden md:inline">Empresa</span>
                                            </a>
                                            <button 
                                                onClick={() => { setEditingCompany(company); setFormData(company); setIsModalOpen(true); }}
                                                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setCompanyToDelete(company)}
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
                    <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
                        <Users className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Trabajadores (Ops + Admin)</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">
                            {companies.reduce((acc: number, c: any) => acc + (c.workersAdmin || 0) + (c.workersOps || 0), 0).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
                    <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cumplimiento Global HSE</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">
                            {companies.length > 0 
                                ? Math.round(companies.reduce((acc: number, c: any) => acc + c.safetyCompliance, 0) / companies.length) 
                                : 0}%
                        </p>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sectores Auditados</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">
                            {new Set(companies.map((c: any) => c.industry)).size}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal de Alta / Edición */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">
                                        {editingCompany ? 'Perfil Corporativo' : 'Nueva Entidad'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Gestión de datos técnicos y legales</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Datos Identificatorios */}
                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-100 pb-3">Identidad de la Empresa</h4>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-600 ml-1">Nombre de Fantasía</label>
                                            <div className="relative group">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700" placeholder="Ej: Aceros Industriales S.A." />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-slate-600 ml-1">CUIT</label>
                                                <div className="relative group">
                                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input required type="text" value={formData.taxId || ''} onChange={(e) => setFormData({...formData, taxId: e.target.value})} className="w-full pl-9 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono font-bold" placeholder="30-77889900-1" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-slate-600 ml-1">Sector</label>
                                                <input required type="text" value={formData.industry || ''} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" placeholder="Construcción" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-600 ml-1">Apoderado / Dueño</label>
                                            <input required type="text" value={formData.owner || ''} onChange={(e) => setFormData({...formData, owner: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" placeholder="Nombre completo" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-600 uppercase ml-1">Domicilio Legal</label>
                                            <input required type="text" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" placeholder="Av. Libertador 1200, CABA" />
                                        </div>
                                    </div>
                                </div>

                                {/* Datos Técnicos y ART */}
                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-100 pb-3">Estructura y ART</h4>
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-slate-600 ml-1">Teléfono</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input required type="text" value={formData.workContact || ''} onChange={(e) => setFormData({...formData, workContact: e.target.value})} className="w-full pl-9 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" placeholder="+54 9 11..." />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-slate-600 ml-1">Aseguradora ART</label>
                                                <input required type="text" value={formData.insuranceART || ''} onChange={(e) => setFormData({...formData, insuranceART: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" placeholder="Provincia ART" />
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-inner space-y-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Key className="w-4 h-4 text-slate-500" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Portal ART Autenticación</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase">Usuario ART</label>
                                                    <input type="text" value={formData.artUser || ''} onChange={(e) => setFormData({...formData, artUser: e.target.value})} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase">Password ART</label>
                                                    <div className="relative">
                                                        <input type={showArtPass ? "text" : "password"} value={formData.artPass || ''} onChange={(e) => setFormData({...formData, artPass: e.target.value})} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500" />
                                                        <button type="button" onClick={() => setShowArtPass(!showArtPass)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                                                            {showArtPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-500 uppercase">Establec.</label>
                                                <input type="number" value={formData.establishmentsCount || 1} onChange={(e) => setFormData({...formData, establishmentsCount: +e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-center" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-500 uppercase">Admin</label>
                                                <input type="number" value={formData.workersAdmin || 0} onChange={(e) => setFormData({...formData, workersAdmin: +e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-center" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-500 uppercase">Operativos</label>
                                                <input type="number" value={formData.workersOps || 0} onChange={(e) => setFormData({...formData, workersOps: +e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-center" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-600 uppercase ml-1">Nivel de Riesgo Operativo</label>
                                            <select value={formData.riskLevel || 'MEDIUM'} onChange={(e) => setFormData({...formData, riskLevel: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 appearance-none">
                                                <option value="LOW">Riesgo Bajo</option>
                                                <option value="MEDIUM">Riesgo Medio</option>
                                                <option value="HIGH">Riesgo Alto</option>
                                                <option value="CRITICAL">Riesgo Crítico</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Full width Sections */}
                                <div className="md:col-span-2 space-y-6 pt-6 border-t border-slate-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 ml-1">
                                                <FileText className="w-4 h-4 text-indigo-500" /> Datos Clave y Procesos
                                            </label>
                                            <textarea rows={4} value={formData.keyData || ''} onChange={(e) => setFormData({...formData, keyData: e.target.value})} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm resize-none font-medium text-slate-700 shadow-sm" placeholder="Describa maquinarias críticas, materiales peligrosos o certificaciones específicas..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 ml-1">
                                                <AlertCircle className="w-4 h-4 text-amber-500" /> Observaciones del Consultor
                                            </label>
                                            <textarea rows={4} value={formData.remarks || ''} onChange={(e) => setFormData({...formData, remarks: e.target.value})} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm resize-none font-medium text-slate-700 shadow-sm" placeholder="Notas internas sobre la relación comercial o cumplimiento histórico..." />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4 pt-6 border-t border-slate-100 bg-white/50 sticky bottom-0">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all border border-transparent hover:border-slate-200">Cancelar</button>
                                <button type="submit" disabled={isPending} className="flex-[2] py-4 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50">
                                    <Save className="w-5 h-5" /> {isPending ? 'Guardando...' : (editingCompany ? 'Actualizar Master Data' : 'Dar de Alta Entidad')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {companyToDelete && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setCompanyToDelete(null)}></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden p-8 text-center border border-slate-100">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3">¿Eliminar Empresa?</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Está a punto de eliminar a <span className="font-bold text-slate-800">"{companyToDelete.name}"</span>. 
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setCompanyToDelete(null)}
                                className="flex-1 py-4 text-sm font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all border border-slate-200"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isPending}
                                className="flex-1 py-4 text-sm font-black text-white bg-red-600 uppercase tracking-widest hover:bg-red-700 rounded-2xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                            >
                                {isPending ? 'Borrando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
