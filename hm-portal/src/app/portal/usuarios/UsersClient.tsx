"use client";

import React, { useState, useTransition } from 'react';
import { Users, Plus, Search, CheckCircle2, Trash2, Key, User, Building2, Building, ShieldAlert, Edit2, Phone, CreditCard, RefreshCw } from 'lucide-react';
import { createUser, deleteUser, updateUser, resetUserPassword } from '@/app/actions/users';

// @ts-ignore
export default function UsersClient({ initialUsers, companies }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [userToReset, setUserToReset] = useState<any | null>(null);
    const [resetSuccessData, setResetSuccessData] = useState<{username: string, newPassword: string} | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        id: '', username: '', password: '', name: '', role: 'CLIENT', companyId: '', dni: '', phone: '',
        hasGlobalAccess: false,
        assignedCompanyIds: [] as string[]
    });

    const openCreate = () => {
        setFormData({ id: '', username: '', password: '', name: '', role: 'CLIENT', companyId: '', dni: '', phone: '', hasGlobalAccess: false, assignedCompanyIds: [] });
        setError(null);
        setIsCreateModalOpen(true);
    };

    const openEdit = (u: any) => {
        setFormData({
            id: u.id,
            username: u.username,
            password: '', // Edit doesn't change password directly here
            name: u.name,
            role: u.role,
            companyId: u.companyId || '',
            dni: u.dni || '',
            phone: u.phone || '',
            hasGlobalAccess: u.hasGlobalAccess || false,
            assignedCompanyIds: u.assignedCompanyIds || []
        });
        setError(null);
        setIsEditModalOpen(true);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'assignedCompanyIds') {
                (value as string[]).forEach(id => data.append('assignedCompanyIds', id));
            } else if (key === 'hasGlobalAccess') {
                data.append(key, value ? 'true' : 'false');
            } else {
                data.append(key, value as string);
            }
        });

        startTransition(async () => {
            const res = await createUser(data);
            if (res.success) {
                window.location.reload(); 
            } else {
                setError(res.error || 'Error al crear usuario');
            }
        });
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'assignedCompanyIds') {
                (value as string[]).forEach(id => data.append('assignedCompanyIds', id));
            } else if (key === 'hasGlobalAccess') {
                data.append(key, value ? 'true' : 'false');
            } else {
                data.append(key, value as string);
            }
        });

        startTransition(async () => {
            const res = await updateUser(formData.id, data);
            if (res.success) {
                window.location.reload(); 
            } else {
                setError(res.error || 'Error al actualizar usuario');
            }
        });
    };

    const confirmDelete = () => {
        if (!userToDelete) return;
        startTransition(async () => {
            const res = await deleteUser(userToDelete.id);
            if (res.success) {
                setUsers(users.filter((u: any) => u.id !== userToDelete.id));
            } else {
                alert(res.error);
            }
            setUserToDelete(null);
        });
    };

    const confirmReset = () => {
        if (!userToReset) return;
        startTransition(async () => {
            const res = await resetUserPassword(userToReset.id);
            if (res.success) {
                setResetSuccessData({ username: userToReset.username, newPassword: res.newPassword! });
                setUserToReset(null);
            } else {
                alert(res.error);
                setUserToReset(null);
            }
        });
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-xl text-xs font-bold border border-purple-200 shadow-sm">Administrador</span>;
            case 'MANAGER': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-xs font-bold border border-blue-200 shadow-sm">Gerente HSE</span>;
            case 'INSPECTOR': return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-xl text-xs font-bold border border-amber-200 shadow-sm">Inspector</span>;
            case 'CLIENT': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-xl text-xs font-bold border border-emerald-200 shadow-sm">Cliente</span>;
            default: return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs font-bold">{role}</span>;
        }
    };

    const filteredUsers = users.filter((u: any) => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex justify-between items-center bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-600" />
                        Gestor de Usuarios
                    </h2>
                    <p className="text-slate-500 mt-1">Genera y administra credenciales de acceso para tu equipo y clientes.</p>
                </div>
                <button 
                    onClick={openCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Nuevo Usuario
                </button>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre, usuario o empresa..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {users.length} Cuentas Registradas
                    </div>
                </div>

                <div className="overflow-x-auto px-2 pb-2">
                    <table className="w-full text-sm text-left">
                        <thead className="text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-5">Usuario</th>
                                <th className="px-6 py-5">Rol / Creación</th>
                                <th className="px-6 py-5">Contacto</th>
                                <th className="px-6 py-5">Empresa Asignada</th>
                                <th className="px-6 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user: any) => (
                                <tr key={user.id} className="hover:bg-white/80 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg bg-indigo-100 text-indigo-600 shadow-sm">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-base">{user.name}</p>
                                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">@{user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2 items-start">
                                            {getRoleBadge(user.role)}
                                            <span className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1 text-xs text-slate-600">
                                            {user.dni ? <div className="flex items-center gap-1"><CreditCard className="w-3 h-3 text-slate-400"/> {user.dni}</div> : null}
                                            {user.phone ? <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400"/> {user.phone}</div> : null}
                                            {!user.dni && !user.phone && <span className="text-slate-400 italic">Sin datos</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {user.company ? (
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold text-slate-700">{user.company.name}</span>
                                            </div>
                                        ) : user.hasGlobalAccess ? (
                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Acceso Global</span>
                                        ) : user.assignedCompanyIds?.length > 0 ? (
                                            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{user.assignedCompanyIds.length} Empresas Asignadas</span>
                                        ) : (
                                            <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Sin Acceso</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => openEdit(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100"
                                                title="Editar Usuario"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setUserToReset(user)}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100"
                                                title="Restablecer Contraseña"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                            {user.username !== 'admin' && (
                                                <button 
                                                    onClick={() => setUserToDelete(user)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Alta / Edición */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm min-h-[100vh]" onClick={() => isCreateModalOpen ? setIsCreateModalOpen(false) : setIsEditModalOpen(false)}></div>
                    <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-8">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-2xl font-black text-slate-800">{isCreateModalOpen ? 'Generador de Usuarios' : 'Editar Usuario'}</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                {isCreateModalOpen ? 'Crea nuevas credenciales de acceso' : 'Modifica los datos del usuario'}
                            </p>
                        </div>

                        <form onSubmit={isCreateModalOpen ? handleCreate : handleEdit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2 border border-red-100">
                                    <ShieldAlert className="w-5 h-5" /> {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-600 ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm" placeholder="Ej: Juan Pérez" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Usuario de Ingreso</label>
                                    <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} disabled={isEditModalOpen} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm disabled:bg-slate-50 disabled:text-slate-400" placeholder="jperez" />
                                </div>
                                {isCreateModalOpen && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-slate-600 ml-1">Contraseña</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm" placeholder="••••••••" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">DNI / Documento</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value})} className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm" placeholder="Opcional" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Teléfono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm" placeholder="Opcional" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase text-slate-600 ml-1">Rol en el Sistema</label>
                                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} disabled={isEditModalOpen && formData.username === 'admin'} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm appearance-none disabled:bg-slate-50 disabled:text-slate-400">
                                    <option value="CLIENT">Cliente (Solo ve su empresa)</option>
                                    <option value="INSPECTOR">Inspector (Registra datos operativos)</option>
                                    <option value="MANAGER">Gerente HSE (Acceso Global Operativo)</option>
                                    <option value="ADMIN">Administrador General</option>
                                </select>
                            </div>

                            {formData.role === 'CLIENT' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Asignar a Empresa (Obligatorio)</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <select required value={formData.companyId} onChange={(e) => setFormData({...formData, companyId: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm appearance-none">
                                            <option value="">Seleccione una empresa...</option>
                                            {companies.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {['MANAGER', 'INSPECTOR'].includes(formData.role) && (
                                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            id="globalAccess"
                                            checked={formData.hasGlobalAccess}
                                            onChange={(e) => setFormData({...formData, hasGlobalAccess: e.target.checked})}
                                            className="w-5 h-5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="globalAccess" className="text-sm font-bold text-slate-800">
                                            Otorgar Acceso Global a todas las empresas
                                        </label>
                                    </div>
                                    {!formData.hasGlobalAccess && (
                                        <div className="mt-4">
                                            <label className="text-xs font-black uppercase text-slate-600 ml-1 mb-2 block">Seleccionar Empresas Específicas</label>
                                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                                                {companies.map((c: any) => (
                                                    <label key={c.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-all cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={formData.assignedCompanyIds.includes(c.id)}
                                                            onChange={(e) => {
                                                                const newIds = e.target.checked 
                                                                    ? [...formData.assignedCompanyIds, c.id]
                                                                    : formData.assignedCompanyIds.filter(id => id !== c.id);
                                                                setFormData({...formData, assignedCompanyIds: newIds});
                                                            }}
                                                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm text-slate-700">{c.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 flex gap-4 pt-4">
                                <button type="button" onClick={() => isCreateModalOpen ? setIsCreateModalOpen(false) : setIsEditModalOpen(false)} className="flex-1 py-3 text-sm font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all">Cancelar</button>
                                <button type="submit" disabled={isPending} className="flex-1 py-3 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50">
                                    {isPending ? 'Guardando...' : (isCreateModalOpen ? 'Crear Usuario' : 'Guardar')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Eliminación */}
            {userToDelete && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setUserToDelete(null)}></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden p-8 text-center border border-slate-100">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3">¿Revocar Acceso?</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            El usuario <span className="font-bold text-slate-800">@{userToDelete.username}</span> ya no podrá ingresar al portal.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setUserToDelete(null)} className="flex-1 py-4 text-sm font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all border border-slate-200">Cancelar</button>
                            <button onClick={confirmDelete} disabled={isPending} className="flex-1 py-4 text-sm font-black text-white bg-red-600 uppercase tracking-widest hover:bg-red-700 rounded-2xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50">{isPending ? 'Borrando...' : 'Eliminar'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Reset Password */}
            {userToReset && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setUserToReset(null)}></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden p-8 text-center border border-slate-100">
                        <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-100">
                            <RefreshCw className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3">¿Regenerar Contraseña?</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Se generará una nueva contraseña segura para el usuario <span className="font-bold text-slate-800">@{userToReset.username}</span> y se desbloqueará su cuenta si estaba restringida.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setUserToReset(null)} className="flex-1 py-4 text-sm font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all border border-slate-200">Cancelar</button>
                            <button onClick={confirmReset} disabled={isPending} className="flex-1 py-4 text-sm font-black text-white bg-amber-500 uppercase tracking-widest hover:bg-amber-600 rounded-2xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50">{isPending ? 'Procesando...' : 'Confirmar'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Contraseña Regenerada (Success) */}
            {resetSuccessData && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden p-8 text-center border border-slate-100">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-3">Contraseña Actualizada</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                            Copia esta nueva contraseña y envíasela a <strong>@{resetSuccessData.username}</strong> por un canal seguro.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 select-all">
                            <span className="font-mono text-2xl tracking-wider font-bold text-slate-800">{resetSuccessData.newPassword}</span>
                        </div>
                        <button onClick={() => setResetSuccessData(null)} className="w-full py-4 text-sm font-black text-white bg-indigo-600 uppercase tracking-widest hover:bg-indigo-700 rounded-2xl transition-all shadow-lg shadow-indigo-600/20">Entendido</button>
                    </div>
                </div>
            )}
        </div>
    );
}
