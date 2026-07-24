"use client";

import React, { useState, useTransition } from 'react';
import { Users, Plus, Search, CheckCircle2, Trash2, Key, User, Building2, Building, ShieldAlert } from 'lucide-react';
import { createUser, deleteUser } from '@/app/actions/users';

// @ts-ignore
export default function UsersClient({ initialUsers, companies }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        username: '', password: '', name: '', role: 'CLIENT', companyId: ''
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
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
                    onClick={() => { setFormData({ username: '', password: '', name: '', role: 'CLIENT', companyId: '' }); setIsModalOpen(true); setError(null); }}
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
                                <th className="px-6 py-5">Rol</th>
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
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-5">
                                        {user.company ? (
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold text-slate-700">{user.company.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Acceso Global</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {user.username !== 'admin' && (
                                            <button 
                                                onClick={() => setUserToDelete(user)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Alta */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-100">
                            <h3 className="text-2xl font-black text-slate-800">Generador de Usuarios</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Crea nuevas credenciales de acceso</p>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2 border border-red-100">
                                    <ShieldAlert className="w-5 h-5" /> {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-600 ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm" placeholder="Ej: Juan Pérez" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Usuario de Ingreso</label>
                                    <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm" placeholder="jperez" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Contraseña</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-9 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-600 ml-1">Rol en el Sistema</label>
                                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm appearance-none">
                                    <option value="CLIENT">Cliente (Solo ve su empresa)</option>
                                    <option value="INSPECTOR">Inspector (Registra datos operativos)</option>
                                    <option value="MANAGER">Gerente HSE (Acceso Global Operativo)</option>
                                    <option value="ADMIN">Administrador General</option>
                                </select>
                            </div>

                            {formData.role === 'CLIENT' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Asignar a Empresa (Obligatorio para Clientes)</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <select required value={formData.companyId} onChange={(e) => setFormData({...formData, companyId: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-slate-700 shadow-sm appearance-none">
                                            <option value="">Seleccione una empresa...</option>
                                            {companies.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all">Cancelar</button>
                                <button type="submit" disabled={isPending} className="flex-1 py-4 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50">
                                    {isPending ? 'Creando...' : 'Crear Usuario'}
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
        </div>
    );
}
