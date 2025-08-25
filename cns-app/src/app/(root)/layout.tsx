import { Map, ScrollText, BookMarked, ListStart, User2 } from "lucide-react";
import { cookies } from "next/headers";

import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

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
        { title: "Search", url: "/wiki/search" },
        { title: "Categories", url: "/wiki/categories" },
        { title: "Random", url: "" },
      ],
      options: [
        { title: "Add", url: "/wiki/new" },
        { title: "Manage", url: "/wiki/" },
      ],
    },
    {
      title: "Stories",
      url: "/stories",
      icon: ScrollText,
      subLinks: [
        { title: "Featured", url: "/stories/featured" },
        { title: "Search", url: "/stories/search" },
        { title: "Categories", url: "/stories/categories" },
        { title: "Random", url: "" },
      ],
      options: [
        { title: "Add", url: "/stories/new" },
        { title: "Manage", url: "/stories/" },
      ],
    },
    {
      title: "Maps",
      url: "/maps",
      icon: Map,
      subLinks: [
        { title: "Featured", url: "/maps/featured" },
        { title: "Search", url: "/maps/search" },
        { title: "Categories", url: "/maps/categories" },
        { title: "Random", url: "" },
      ],
      options: [
        { title: "Add", url: "/maps/new" },
        { title: "MasterMaps", url: "/maps/mastermaps" },
        { title: "Manage", url: "/maps/" },
      ],
    },
    {
      title: "Authors",
      url: "/authors",
      icon: User2,
    },
  ];

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div
        className="w-screen h-screen flex flex-col justify-between"
        id="app-wrapper"
      >
        <Header />
        <div className="h-full w-full flex" id="content-wrapper">
          <AppSidebar menuItems={mainMenuItems} />
          <main className="w-full h-full p-4 overflow-y-scroll">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
