import { ReactNode } from "react"
// Force vercel deploy
import { getSession } from "@/lib/auth"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { SessionGuard } from "@/components/providers/SessionGuard"
import { SidebarProvider } from "@/components/providers/SidebarProvider"
import { PortalClientWrapper } from "@/components/layout/PortalClientWrapper"
import { PortalHeader } from "@/components/layout/PortalHeader"
import { redirect } from "next/navigation"

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <AuthProvider user={session.user}>
      <SidebarProvider>
        <SessionGuard />
        <PortalClientWrapper header={<PortalHeader />}>
          {children}
        </PortalClientWrapper>
      </SidebarProvider>
    </AuthProvider>
  )
}
