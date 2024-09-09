import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/navigation/MainNav";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/navigation/Sidebar";
import TopNav from "@/components/navigation/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clouds and Spaceships",
  description: "Dynamic Map Storytelling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex w-screen h-screen" id="layout-wrapper">
            <Sidebar />
            <div className="main-column w-full h-screen overflow-scroll">
              <TopNav />
              <main className="flex flex-col items-center">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
