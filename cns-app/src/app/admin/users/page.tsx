import { requireAdmin } from "@/lib/auth-guards";

export default async function adminPage() {
  await requireAdmin();

  return <h1>Ello Boss!</h1>;
}
