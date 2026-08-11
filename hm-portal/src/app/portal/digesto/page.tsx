import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DigestoClient } from "./DigestoClient";

export const metadata = {
  title: "Digesto Normativo | Portal MH",
  description: "Digesto Normativo de Higiene y Seguridad en el Trabajo",
};

export default async function DigestoPage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  // Ensure only ADMIN, MANAGER, and INSPECTOR can view this page
  const allowedRoles = ["ADMIN", "MANAGER", "INSPECTOR"];
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/portal/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          Digesto Normativo Completo de Higiene y Seguridad en el Trabajo
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-4xl transition-colors">
          Normativa vigente y aplicable en la Provincia de Mendoza, Argentina — Actualizado a 2026. Este módulo es exclusivo para administradores, gerentes e inspectores.
        </p>
      </div>

      <DigestoClient />
    </div>
  );
}
