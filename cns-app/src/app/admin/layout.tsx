import EditorHeader from "@/components/shared/editor-header";
import { Toaster } from "@/components/ui/sonner";
import prisma from "@/../prisma/db";

const menuList = [
  { title: "Overview", url: "/admin" },
  { title: "General", url: "/admin/general" },
  { title: "Users", url: "/admin/users" },
  { title: "Page", url: "/admin/page" },
  { title: "Backup", url: "/admin/backup" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "GLOBAL",
      subCategory: "header",
    },
    orderBy: {
      order: "asc",
    },
  });
  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <EditorHeader menuList={menuList} settings={settings} />
        <div className="w-full max-w-7xl space-y-4 p-8 pt-6 mx-auto">
          {children}
        </div>
      </div>
      <Toaster />
    </>
  );
}
