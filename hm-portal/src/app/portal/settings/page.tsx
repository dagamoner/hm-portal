import { getSession, requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileSettingsClient } from "./ProfileSettingsClient";

export default async function SettingsGeneralPage() {
  const session = await getSession();
  if (!session || !session.user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser) return null;

  let userCompanies: any[] = [];

  if (dbUser.hasGlobalAccess) {
    // Has access to all companies
  } else if (dbUser.assignedCompanyIds && dbUser.assignedCompanyIds.length > 0) {
    userCompanies = await prisma.company.findMany({
      where: {
        id: { in: dbUser.assignedCompanyIds }
      }
    });
  } else if (dbUser.companyId) {
    const mainCompany = await prisma.company.findUnique({
      where: { id: dbUser.companyId }
    });
    if (mainCompany) userCompanies = [mainCompany];
  }

  return (
    <div>
      <ProfileSettingsClient dbUser={dbUser} userCompanies={userCompanies} />
    </div>
  );
}
