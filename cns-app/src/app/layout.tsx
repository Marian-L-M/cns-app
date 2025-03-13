import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className="flex w-screen h-screen bg-slate-100"
            id="layout-wrapper"
          >
            <Sidebar />
            <div
              className="flex-3 w-full h-screen overflow-scroll "
              id="column-main"
            >
              <Header />
              <main className="flex flex-col items-center pl-4 pr-8 h-full">
                <div
                  className=" w-full pl-6 py-6 pr-12 bg-white rounded relative"
                  id="contents"
                >
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
