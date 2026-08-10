"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Hash, Shield, Building, Loader2, Key, Clock, Lock, Settings, Moon, Sun, LifeBuoy, FileText, Send, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { updateUserProfile, changeUserPassword, reportSystemIssue } from "@/app/actions/users";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "next-themes";

export function ProfileSettingsClient({ dbUser, userCompanies, recentLogins }: { dbUser: any, userCompanies: any[], recentLogins: any[] }) {
  const { user: authUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences" | "help">("profile");
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  
  const [pwdData, setPwdData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdData.new !== pwdData.confirm) {
      return toast.error("Las nuevas contraseñas no coinciden");
    }
    if (pwdData.new.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    }

    setPwdLoading(true);
    const result = await changeUserPassword(pwdData.current, pwdData.new);
    setPwdLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Contraseña actualizada exitosamente");
      setPwdData({ current: "", new: "", confirm: "" });
    }
  };
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim()) {
      toast.error("Por favor, describe el problema.");
      return;
    }
    
    setReportLoading(true);
    try {
      const res = await reportSystemIssue(reportMessage);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Reporte enviado correctamente. El equipo técnico lo revisará a la brevedad.");
        setReportMessage("");
      }
    } catch (error) {
      toast.error("Error al enviar el reporte.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6 transition-colors">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white text-3xl font-black shadow-lg shrink-0">
          {getInitials(dbUser.name)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{dbUser.name}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors">
              <Shield className="w-3.5 h-3.5" />
              {roleLabels[dbUser.role] || dbUser.role}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-700/50 transition-colors">
              <User className="w-3.5 h-3.5" />
              @{dbUser.username}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'profile' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <User className="w-4 h-4" />
            Datos Personales
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'security' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Key className="w-4 h-4" />
            Seguridad
          </button>
          <button 
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'preferences' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Settings className="w-4 h-4" />
            Preferencias
          </button>
          <button 
            onClick={() => setActiveTab("help")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'help' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <LifeBuoy className="w-4 h-4" />
            Ayuda y Soporte
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
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" /> Correo Electrónico
                    </label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" /> Teléfono
                    </label>
                    <input 
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-slate-400" /> DNI / Identificación
                  </label>
                  <input 
                    type="text"
                    value={formData.dni}
                    onChange={e => setFormData({...formData, dni: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
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
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 h-fit transition-colors">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Building className="w-4 h-4 text-slate-500" />
                Mis Accesos
              </h3>
              
              {dbUser.hasGlobalAccess ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-sm font-medium transition-colors">
                  Tienes acceso global a todas las empresas del sistema.
                </div>
              ) : userCompanies.length > 0 ? (
                <ul className="space-y-2">
                  {userCompanies.map(c => (
                    <li key={c.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{c.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{c.cuit}</span>
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
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Password Change Form */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                Cambiar Contraseña
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña Actual</label>
                  <input 
                    type="password"
                    required
                    value={pwdData.current}
                    onChange={e => setPwdData({...pwdData, current: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nueva Contraseña</label>
                  <input 
                    type="password"
                    required
                    value={pwdData.new}
                    onChange={e => setPwdData({...pwdData, new: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
                  <input 
                    type="password"
                    required
                    value={pwdData.confirm}
                    onChange={e => setPwdData({...pwdData, confirm: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={pwdLoading}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Actualizar Contraseña
                  </button>
                </div>
              </form>
            </div>

            {/* Login History */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" />
                Historial de Accesos
              </h2>
              
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                {recentLogins.length > 0 ? (
                  <div className="divide-y divide-slate-200">
                    {recentLogins.map((log) => (
                      <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-100 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {new Date(log.timestamp).toLocaleDateString("es-AR", { 
                              day: '2-digit', month: 'short', year: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs text-slate-500">Inicio de sesión exitoso</p>
                        </div>
                        <span className="text-sm font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                          {new Date(log.timestamp).toLocaleTimeString("es-AR", { 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No hay registros de acceso recientes.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab Content: Preferences */}
        {activeTab === "preferences" && (
          <div className="p-6 md:p-8 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-500" />
              Preferencias del Sistema
            </h2>
            
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">Tema Visual</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Alternar entre modo claro y oscuro.</p>
                </div>
                
                {mounted && (
                  <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        theme === 'light' 
                          ? 'bg-white text-slate-800 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Claro
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        theme === 'dark' 
                          ? 'bg-slate-800 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                      }`}
                    >
                      <Moon className="w-4 h-4" /> Oscuro
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Help */}
        {activeTab === "help" && (
          <div className="p-6 md:p-8 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-slate-500" />
              Ayuda y Soporte
            </h2>
            
            <div className="space-y-6">
              {/* User Manual */}
              <div className="flex items-start md:items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-col md:flex-row gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    Manual de Usuario
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Descarga el instructivo oficial de la plataforma para tu rol actual.
                  </p>
                </div>
                
                <a
                  href={dbUser.role === 'CLIENT' ? '/manuals/Manual_Usuario_Cliente_MH.pdf' : '/manuals/Manual_Usuario_Profesionales_MH.pdf'}
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Descargar PDF
                </a>
              </div>

              {/* Report Issue */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-red-500" />
                  Reportar un Problema Técnico
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  ¿Encontraste un error en la plataforma o algo no funciona como debería? Envíanos un reporte detallado.
                </p>
                
                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="Describe el problema técnico que estás experimentando..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm min-h-[100px] resize-y"
                    disabled={reportLoading}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={reportLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {reportLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Enviar Reporte
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
