import EditorHeader from "@/components/shared/editor-header";
import { Toaster } from "@/components/ui/sonner";
import prisma from "../../../prisma/db";

const menuList = [
  { title: "Overview", url: "/editor" },
  { title: "Stories", url: "/editor/stories" },
  { title: "Maps", url: "/editor/maps" },
  { title: "Mastermaps", url: "/editor/mastermaps" },
  { title: "Wiki", url: "/editor/wikis" },
  { title: "Media", url: "/editor/media" },
];

export default async function EditorLayout({
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
        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
      <Toaster />
    </>
  );
}
