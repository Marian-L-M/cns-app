import EditorHeader from "@/components/shared/editor-header";
import { Toaster } from "@/components/ui/sonner";
import prisma from "@/../prisma/db";

const menuList = [
  { title: "Overview", url: "/admin" },
  { title: "General", url: "/admin/general" },
  { title: "Users", url: "/admin/users" },
  { title: "Page", url: "/admin/page" },
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
        <div className="container mx-auto">
          <div className="flex items-center h-16 px-4">
            {/* <MainNav className="mx-6" /> */}
            <div className="ml-auto items-center flex space-x-4">
              {/* <AdminSearch /> */}
              {/* <Menu /> */}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6 mx-auto">{children}</div>
      </div>
      <Toaster />
    </>
  );
}
