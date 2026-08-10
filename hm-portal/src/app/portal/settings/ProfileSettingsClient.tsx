"use client";

import { useState } from "react";
import { User, Mail, Phone, Hash, Shield, Building, Loader2, Key } from "lucide-react";
import toast from "react-hot-toast";
import { updateUserProfile } from "@/app/actions/users";
import { useAuth } from "@/components/providers/AuthProvider";

export function ProfileSettingsClient({ dbUser, userCompanies }: { dbUser: any, userCompanies: any[] }) {
  const { user: authUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: dbUser.name || "",
    email: dbUser.email || "",
    dni: dbUser.dni || "",
    phone: dbUser.phone || "",
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador Global",
    MANAGER: "Gerente",
    INSPECTOR: "Inspector Técnico",
    CLIENT: "Cliente"
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateUserProfile(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Perfil actualizado correctamente");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white text-3xl font-black shadow-lg shrink-0">
          {getInitials(dbUser.name)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-800">{dbUser.name}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              {roleLabels[dbUser.role] || dbUser.role}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
              <User className="w-3.5 h-3.5" />
              @{dbUser.username}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'profile' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <User className="w-4 h-4" />
            Datos Personales
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'security' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Key className="w-4 h-4" />
            Seguridad
          </button>
        </div>

        {/* Tab Content: Profile */}
        {activeTab === "profile" && (
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Section */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Información de Contacto</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" /> Correo Electrónico
                    </label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" /> Teléfono
                    </label>
                    <input 
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-slate-400" /> DNI / Identificación
                  </label>
                  <input 
                    type="text"
                    value={formData.dni}
                    onChange={e => setFormData({...formData, dni: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    placeholder="Documento de Identidad"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>

            {/* Read-only Access Info */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-fit">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Building className="w-4 h-4 text-slate-500" />
                Mis Accesos
              </h3>
              
              {dbUser.hasGlobalAccess ? (
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-200 text-sm font-medium">
                  Tienes acceso global a todas las empresas del sistema.
                </div>
              ) : userCompanies.length > 0 ? (
                <ul className="space-y-2">
                  {userCompanies.map(c => (
                    <li key={c.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                      <span className="font-semibold text-slate-800 text-sm">{c.name}</span>
                      <span className="text-xs text-slate-500">{c.cuit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">No tienes empresas asignadas.</p>
              )}
            </div>

          </div>
        )}

        {/* Tab Content: Security */}
        {activeTab === "security" && (
          <div className="p-6 md:p-8 text-center py-16">
            <Key className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Cambio de Contraseña</h3>
            <p className="text-slate-500 mt-1 max-w-md mx-auto text-sm">Esta funcionalidad se implementará en la próxima actualización para que puedas cambiar tu contraseña manualmente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
