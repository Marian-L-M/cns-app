import { requireEditorOrAdmin } from "@/lib/auth-guards";

export default async function EditorOverviewPage() {
  await requireEditorOrAdmin();

  return <>Ello Edita!</>;
}
