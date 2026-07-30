import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, UserPlus, KeyRound, Building, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createUser } from "@/app/actions/users";

export default async function NuevoUsuarioPage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/portal/usuarios" 
          className="p-2.5 bg-white rounded-xl border border-slate-200/60 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Crear Nuevo Usuario
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Asigna credenciales y permisos a un nuevo usuario del portal.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        
        <form action={async (formData) => {
          "use server";
          await createUser(formData);
        }} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Datos Personales
              </h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Nombre y Apellido
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:font-normal"
                />
              </div>

              <div>
                <label htmlFor="dni" className="block text-sm font-bold text-slate-700 mb-1.5">
                  DNI / Documento
                </label>
                <input
                  id="dni"
                  name="dni"
                  type="text"
                  placeholder="Opcional"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:font-normal"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Opcional"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:font-normal"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Nombre de Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Ej: juan_mh"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:font-normal"
                />
                <p className="text-xs text-slate-500 mt-1.5">Este será el identificador para iniciar sesión.</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Seguridad
              </h3>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Contraseña Temporal
                </label>
                <input
                  id="password"
                  name="password"
                  type="text"
                  required
                  placeholder="Escribe una contraseña"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:font-normal"
                />
                <p className="text-xs text-slate-500 mt-1.5">Recomendamos usar al menos 8 caracteres.</p>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Nivel de Acceso (Rol)
                </label>
                <div className="relative">
                  <ShieldCheck className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    id="role"
                    name="role"
                    required
                    defaultValue="CLIENT"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="CLIENT">Cliente (Solo lee info de su empresa)</option>
                    <option value="INSPECTOR">Inspector MH</option>
                    <option value="MANAGER">Gerente MH</option>
                    <option value="ADMIN">Administrador (Acceso Total)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Asignación de Empresa
            </h3>
            
            <div className="max-w-md">
              <label htmlFor="companyId" className="block text-sm font-bold text-slate-700 mb-1.5">
                Vincular a Cliente B2B (Opcional)
              </label>
              <select
                id="companyId"
                name="companyId"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
              >
                <option value="">-- No vincular a ninguna empresa (Solo Personal MH) --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">Si el rol es &quot;Cliente&quot;, debes asignarlo obligatoriamente a una empresa para que pueda ver sus datos.</p>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-4">
            <Button type="submit" className="px-8 py-3 text-base shadow-indigo-500/25">
              Guardar Usuario
            </Button>
            <Link href="/portal/usuarios" className="text-sm font-bold text-slate-500 hover:text-slate-700">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
