import MasterMapEditor from "@/components/editors/MasterMapEditor";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";
import CursorContextProvider from "@/store/cursorContext";

export default async function MasterMapEditorPage() {
  const session = await requireAuthorOrAdmin();

  return (
    <CursorContextProvider>
      <MasterMapEditor user={session.user} />
    </CursorContextProvider>
  );
}
