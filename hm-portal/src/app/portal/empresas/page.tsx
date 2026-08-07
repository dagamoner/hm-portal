import { getCompanies } from "@/app/actions/companies";
import CompaniesClient from "./CompaniesClient";
import { requireAuth } from "@/lib/auth";

export default async function EmpresasPage() {
  const user = await requireAuth();
  const companies = await getCompanies();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <CompaniesClient initialCompanies={companies} userRole={user.role} />
    </div>
  );
}
