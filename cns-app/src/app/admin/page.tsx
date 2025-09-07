import { requireAdmin } from "@/lib/auth-guards";

export const metadata = {
  title: "Admin",
};

// Set alerts etc. if pages have not been set up

export default async function AdminOverviewPage() {
  await requireAdmin();

  return <h1>Ello Boss!</h1>;
}
