import { getUsers } from "@/app/actions/users";
import { getCompanies } from "@/app/actions/companies";
import UsersClient from "./UsersClient";

export default async function UsuariosPage() {
  const users = await getUsers();
  const companies = await getCompanies();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <UsersClient initialUsers={users} companies={companies} />
    </div>
  );
}
