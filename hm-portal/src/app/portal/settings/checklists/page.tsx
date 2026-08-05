import { getChecklistTemplates } from "@/app/actions/checklists";
import ChecklistClient from "./ChecklistClient";

export default async function ChecklistsPage() {
    const templates = await getChecklistTemplates();

    return (
        <ChecklistClient initialTemplates={templates} />
    );
}
