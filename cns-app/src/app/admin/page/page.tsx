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
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Page settings</h2>
        <AdminSettingsList AdminSettings={settings} filter={"top"} />
      </section>
    </div>
  );
}
