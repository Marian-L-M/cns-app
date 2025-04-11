import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import { CustomTrigger } from "@/components/ui/sidebar/custom-trigger";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | CNS`,
    default: APP_NAME,
  },
  description: `${APP_DESCRIPTION}`,
  metadataBase: new URL(SERVER_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        {/* Consider removing theme provider or committing to it */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
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
                <AppSidebar />
                <main className="w-full h-full p-4">{children}</main>
              </div>
              <Footer />
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
