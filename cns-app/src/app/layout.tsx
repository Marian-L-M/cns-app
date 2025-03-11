import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import Sidebar from "@/components/navigation/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import TopNav from "@/components/navigation/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | CNS`,
    default: APP_NAME,
  },
  description: `${APP_DESCRIPTION}`,
  metadataBase: new URL(SERVER_URL),
};

// Remove extra attribute error
// https://stackoverflow.com/questions/78456897/how-to-remove-extra-attributes-error-in-nextjs-andclerk
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className="flex w-screen h-screen bg-slate-100"
            id="layout-wrapper"
          >
            <Sidebar />
            <div className="main-column w-full h-screen overflow-scroll ">
              <TopNav />
              <main className="flex flex-col items-center pr-8 h-full">
                <div
                  className=" w-full pl-6 py-6 pr-12 bg-white rounded relative"
                  id="contents"
                >
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
