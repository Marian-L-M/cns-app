import { requireAdmin } from "@/lib/auth-guards";

export const metadata = {
  title: "Admin",
};

export default async function AdminOverviewPage() {
  await requireAdmin();

  return <h1>Ello Boss!</h1>;
}
