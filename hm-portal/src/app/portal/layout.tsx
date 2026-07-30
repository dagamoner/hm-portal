import { ReactNode } from "react"
import { PortalSidebar } from "@/components/layout/PortalSidebar"
import { PortalHeader } from "@/components/layout/PortalHeader"
import { getSession } from "@/lib/auth"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { redirect } from "next/navigation"

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <AuthProvider user={session.user}>
      <div className="flex min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
        <PortalSidebar />
        <div className="flex-1 flex flex-col ml-72">
          <PortalHeader />
          <main className="flex-1 overflow-y-auto p-10 bg-slate-50/50 min-h-[calc(100vh-6rem)]">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
