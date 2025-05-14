import { requireAuthorOrAdmin } from "@/lib/auth-guards";

export default async function EditorOverviewPage() {
  await requireAuthorOrAdmin();

  return <>Ello Edita!</>;
}
