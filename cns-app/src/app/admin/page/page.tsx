import { requireAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";
import AdminSettingsList from "@/components/forms/AdminSettingsList";

export const metadata = {
  title: "Page settings",
};

export default async function adminPageSettings() {
  await requireAdmin();
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "PAGE",
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div>
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Page settings</h2>
          <p className="text-sm">
            Note: Set order to group and prioritize your settings
          </p>
        </div>
        <AdminSettingsList AdminSettings={settings} filter={"top"} />
        <AdminSettingsList AdminSettings={settings} filter={"wiki"} />
        <AdminSettingsList AdminSettings={settings} filter={"story"} />
        <AdminSettingsList AdminSettings={settings} filter={"map"} />
      </section>
    </div>
  );
}
