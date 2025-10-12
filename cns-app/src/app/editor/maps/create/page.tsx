import MapForm from "@/components/forms/MapForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";

export const metadata = {
  title: `Create Map`,
};

export default async function NewMap() {
  const session = await requireAuthorOrAdmin();

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Create Map</h1>
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/editor">Editor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Maps</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <MapForm />
    </div>
  );
}
