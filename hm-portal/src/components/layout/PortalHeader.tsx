import { Bell, Search, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"

export function PortalHeader() {
  return (
    <header className="h-24 px-10 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-100 rounded-xl hidden md:block">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 capitalize tracking-tight">
            Portal MH
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>
        <div className="h-10 w-px bg-slate-200/60 hidden sm:block"></div>
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Admin General</p>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Administrador
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-all duration-300">
            AD
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Cerrar Sesión">
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </div>
    </header>
  )
}
