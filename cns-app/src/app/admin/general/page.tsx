import { requireAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";
import GlobalSettingsList from "@/components/forms/GlobalSettingsList";

export default async function GeneralSettingsPage() {
  await requireAdmin();
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "GLOBAL",
    },
    orderBy: {
      order: "asc",
    },
  });
  return (
    <div>
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Global settings</h2>
          <p className="text-sm">
            Note: Set order to group and prioritize your settings
          </p>
        </div>
        <GlobalSettingsList AdminSettings={settings} filter={"header"} />
      </section>
    </div>
  );
}
