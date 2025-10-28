import { requireAdmin } from "@/lib/auth-guards";
import BackupForm from "./backup-form";
import ImportForm from "./import-form";
import BackupJsonPage from "./backup-json-form";

export default async function BackupPage() {
  const isAdmin = await requireAdmin();

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Backup</h1>
      </div>
      {/* <BackupForm />
      <ImportForm /> */}
      <BackupJsonPage />
    </section>
  );
}
