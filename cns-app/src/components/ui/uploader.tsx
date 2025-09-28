import Image from "next/image";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing/utils";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

interface UploadComponentProps<T extends FieldValues> {
  image: string;
  form: UseFormReturn<T>;
  fieldName: Path<T>;
}

export function UploadComponent<T extends FieldValues>({
  image,
  form,
  fieldName,
}: UploadComponentProps<T>) {
  return (
    <Card>
      <CardContent className="space-y-2 mt-2 flex flex-col gap-2">
        {image && (
          <Image
            src={image}
            alt={fieldName}
            className="object-cover object-center"
            width={240}
            height={240}
          />
        )}
        <UploadButton
          appearance={{
            button: {
              background: "#fff",
              color: "#6b7280",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              border: "1px solid #6b7280",
              cursor: "pointer",
              transition: "all 0.2s",
            },
            container: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            },
            allowedContent: {
              color: "#6b7280",
              fontSize: "14px",
            },
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res: { url: string }[]) => {
            form.setValue(fieldName, res[0].url as PathValue<T, Path<T>>);
          }}
          onUploadError={(error: Error) => {
            toast.error("Image upload failed", {
              className: "error",
              description: `ERROR! ${error.message}`,
            });
          }}
        />
      </CardContent>
    </Card>
  );
}
