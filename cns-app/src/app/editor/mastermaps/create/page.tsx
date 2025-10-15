import MasterMapEditor from "@/components/editors/MasterMapEditor";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";
import CursorContextProvider from "@/store/cursorContext";
import Link from "next/link";

export default async function MasterMapEditorPage() {
  const session = await requireAuthorOrAdmin();

  return (
    <div className="w-full flex flex-col gap-4" id="substory-detail-page">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/editor">Editor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/editor/mastermaps">Mastermaps</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Create Mastermap</h1>
      </div>
      <CursorContextProvider>
        <MasterMapEditor />
      </CursorContextProvider>
    </div>
  );
}
