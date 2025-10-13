import { Map, ScrollText, BookMarked, ListStart, User2 } from "lucide-react";
import { cookies } from "next/headers";

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import prisma from "../../../prisma/db";
import { Toaster } from "sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const mainMenuItems = [
    {
      title: "Overview",
      url: "/",
      icon: ListStart,
    },
    {
      title: "Wiki",
      url: "/wiki",
      icon: BookMarked,
      subLinks: [
        { title: "Featured", url: "/wiki/featured" },
        { title: "Archive", url: "/wiki/archive" },
      ],
    },
    {
      title: "Stories",
      url: "/stories",
      icon: ScrollText,
      subLinks: [
        { title: "Featured", url: "/stories/featured" },
        { title: "Archive", url: "/stories/archive" },
      ],
    },
    {
      title: "Maps",
      url: "/maps",
      icon: Map,
      subLinks: [
        { title: "Mastermaps", url: "/mastermaps" },
        { title: "Map Archive", url: "/maps/archive" },
        { title: "Featured Maps", url: "/maps/featured" },
      ],
    },
    {
      title: "Authors",
      url: "/authors",
      icon: User2,
    },
  ];

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
    <SidebarProvider defaultOpen={defaultOpen}>
      <div
        className="w-screen h-screen flex flex-col justify-between pt-12"
        id="app-wrapper"
      >
        <Header />
        <div className="h-full w-full flex" id="content-wrapper">
          <AppSidebar menuItems={mainMenuItems} settings={settings} />
          <SidebarInset>
            <main className="w-full h-full px-8 py-4 overflow-y-scroll">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
