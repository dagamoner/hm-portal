import { getCompanies } from "@/app/actions/companies";
import CompaniesClient from "./CompaniesClient";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EmpresasPage() {
  const user = await requireAuth();
  const companies = await getCompanies();
  
  let allUsers: any[] = [];
  if (user.role === 'ADMIN') {
    allUsers = await prisma.user.findMany({
      select: { id: true, name: true, role: true, username: true },
      orderBy: { name: 'asc' }
    });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <CompaniesClient initialCompanies={companies} userRole={user.role} allUsers={allUsers} />
    </div>
  );
}
