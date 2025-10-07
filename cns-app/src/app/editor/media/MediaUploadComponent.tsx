import MediaUploadForm from "@/components/forms/MediaUploadForm";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";

export default async function MediaUploadComponent() {
  const session = await requireAuthorOrAdmin();
  return (
    <>
      <MediaUploadForm userId={session.user.id} />
    </>
  );
}
