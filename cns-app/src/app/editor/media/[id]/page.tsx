import MediaUploadForm from "@/components/forms/MediaUploadForm";
import prisma from "@/../prisma/db";
import { requireMediaOwnerOrAdmin } from "@/lib/auth-guards";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMediaPage({ params }: Props) {
  const resolvedParams = await params;

  const mediaItem = await prisma.mediaItem.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!mediaItem) {
    return <div className="flex flex-col gap-20 w-full">Media not found</div>;
  }

  const session = await requireMediaOwnerOrAdmin({ mediaItem });

  return (
    <div className="flex flex-col gap-20 w-full">
      <div className="w-full grid grid-cols-12 gap-4 mx-auto relative">
        <div className="col-span-8">
          <h1 className="text-lg font-semibold">Edit Media</h1>
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink href="/editor">Editor</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/editor/media">Media</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{mediaItem.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <MediaUploadForm mediaItem={mediaItem} />
        </div>
      </div>
    </div>
  );
}
