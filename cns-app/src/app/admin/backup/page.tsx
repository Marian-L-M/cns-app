import { requireAdmin } from "@/lib/auth-guards";

export default async function GeneralSettingsPage() {
  await requireAdmin();

  return (
    <div>
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Backup</h2>
        </div>
      </section>
    </div>
  );
}
