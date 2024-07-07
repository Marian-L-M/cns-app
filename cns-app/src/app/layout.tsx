import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clouds and Spaceships",
  description: "Dynamic map storytelling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col items-center bg-green-500">
          <div className="max-w-6xl w-full bg-slate-100">{children}</div>
        </div>
      </body>
    </html>
  );
}
