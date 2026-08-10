import { LogOut, MessageSquare } from "lucide-react"
import Link from "next/link"
import { logout } from "@/app/actions/auth"
import { NotificationBell } from "./NotificationBell"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ClientChatWidget } from "@/components/chat/ClientChatWidget"

export async function PortalHeader() {
  const session = await getSession();
  const user = session?.user;
  
  let roleText = "Administrador";
  let nameText = user?.name || "Admin General";
  let initials = "AD";
  
  if (user?.role === "CLIENT") {
    roleText = "Cliente";
    if (user.companyId) {
       const company = await prisma.company.findUnique({ where: { id: user.companyId } });
       if (company) {
           roleText = `Cliente - ${company.name}`;
       }
    }
  } else if (user?.role === "MANAGER") {
    roleText = "Gerente";
  } else if (user?.role === "INSPECTOR") {
    roleText = "Inspector";
  }
  
  if (nameText) {
      const nameParts = nameText.split(" ");
      if (nameParts.length > 1) {
         initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      } else {
         initials = nameText.substring(0, 2).toUpperCase();
      }
  }

  return (
    <header className="print:hidden h-24 px-10 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 capitalize tracking-tight">
            Portal MH
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {user?.role === "CLIENT" && user.companyId ? (
          <ClientChatWidget companyId={user.companyId} />
        ) : (
          <Link 
            href="/portal/settings/log-auditoria?tab=comunicaciones"
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
            title="Comunicaciones"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
        )}
        <NotificationBell />
        <div className="h-10 w-px bg-slate-200/60 hidden sm:block"></div>
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{nameText}</p>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {roleText}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-all duration-300">
            {initials}
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
