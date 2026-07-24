import { getCompanies } from "@/app/actions/companies";
import CompaniesClient from "./CompaniesClient";

export default async function EmpresasPage() {
  const companies = await getCompanies();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <CompaniesClient initialCompanies={companies} />
    </div>
  );
}
