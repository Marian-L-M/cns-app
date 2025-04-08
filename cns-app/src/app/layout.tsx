import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
// import Sidebar from "@/components/shared/sidebar/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <SidebarProvider>
            <AppSidebar />
            {/* <Header /> */}
            <main>
              {/* <SidebarTrigger /> */}
              <CustomTrigger />
              {children}
            </main>
            {/* <Footer /> */}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
