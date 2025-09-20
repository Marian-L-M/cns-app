import { requireAuthorOrAdmin } from "@/lib/auth-guards";
import WikiForm from "@/components/forms/WikiForm";

export default async function NewWiki() {
  const currentSession = await requireAuthorOrAdmin();
  return <WikiForm user={currentSession.user} />;
}
