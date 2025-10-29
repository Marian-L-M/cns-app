import { requireAdmin } from "@/lib/auth-guards";
import BackupJsonPage from "./backup-json-form";

export default async function BackupPage() {
  const isAdmin = await requireAdmin();

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Backup</h1>
      </div>
      <BackupJsonPage />
    </section>
  );
}
