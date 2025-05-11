import { cookies } from "next/headers";

import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import { CustomTrigger } from "@/components/ui/sidebar/custom-trigger";
import { Toaster } from "@/components/ui/sonner";

import { ScrollText, BookMarked, Settings } from "lucide-react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const mainMenuItems = [
    {
      title: "Profile",
      url: "/user/profile",
      icon: BookMarked,
    },
    {
      title: "Works",
      url: "/user/works",
      icon: ScrollText,
    },
    {
      title: "Settings",
      url: "/user/settings",
      icon: Settings,
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
          {/* Better handle this system side than css */}
          <div className="md:hidden" id="mobile-sidebar">
            <CustomTrigger />
          </div>
          <AppSidebar menuItems={mainMenuItems} />
          <main className="w-full h-full p-4 overflow-y-scroll">
            {children}
          </main>
          <Toaster />
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
