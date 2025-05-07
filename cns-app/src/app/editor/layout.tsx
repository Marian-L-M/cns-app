import EditorHeader from "@/components/shared/editor-header";
import Menu from "@/components/shared/header/menu";
// import MainNav from "./admin-nav";
// import AdminSearch from "@/components/admin/admin-search";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <EditorHeader />
        <div className="container mx-auto">
          <div className="flex items-center h-16 px-4">
            {/* <MainNav className="mx-6" /> */}
            <div className="ml-auto items-center flex space-x-4">
              {/* <AdminSearch /> */}
              {/* <Menu /> */}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
