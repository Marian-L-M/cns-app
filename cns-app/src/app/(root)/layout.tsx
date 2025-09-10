import { Map, ScrollText, BookMarked, ListStart, User2 } from "lucide-react";
import { cookies } from "next/headers";

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";

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
        { title: "Archive", url: "/wiki/archive" },
        { title: "Featured", url: "/wiki/featured" },
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
        { title: "Archive", url: "/maps/archive" },
        { title: "Featured", url: "/maps/featured" },
        { title: "Search", url: "/maps/search" },
        { title: "Categories", url: "/maps/categories" },
        { title: "Random", url: "" },
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
        className="w-screen h-screen flex flex-col justify-between pt-12"
        id="app-wrapper"
      >
        <Header />
        <div className="h-full w-full flex" id="content-wrapper">
          <AppSidebar menuItems={mainMenuItems} />
          <SidebarInset>
            <main className="w-full h-full px-8 py-4 overflow-y-scroll">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
