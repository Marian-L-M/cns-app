import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="w-screen h-screen flex flex-col justify-between"
      id="app-wrapper"
    >
      <div className="h-full w-full flex flex-center" id="content-wrapper">
        {children}
      </div>
    </div>
  );
}
