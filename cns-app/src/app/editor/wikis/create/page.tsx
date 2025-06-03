import { requireAuthorOrAdmin } from "@/lib/auth-guards";
import WikiForm from "@/components/forms/WikiForm";

// 250603 Unnecessary structure, clean up
// const WikiForm = dynamic(() => import("@/components/forms/WikiForm"), {
//   ssr: false,
// });

export default async function NewWiki() {
  const currentSession = await requireAuthorOrAdmin();
  return <WikiForm user={currentSession.user} />;
}
