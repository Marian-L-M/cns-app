import MapForm from "@/components/forms/MapForm";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";

export default async function NewMap() {
  const currentSession = await requireAuthorOrAdmin();

  return <MapForm />;
}
