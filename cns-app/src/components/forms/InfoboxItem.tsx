import { Plus, Trash2 } from "lucide-react";
import {
  Control,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/uploadthing/utils";

import { WikiFormData } from "./WikiForm";

interface InfoboxItem {
  id: string;
  type: "image" | "collection" | "text";
  url?: string;
  title: string;
  caption?: string;
  content?: string;
  bars?: { id: string; key: string; value: string }[];
}

interface InfoboxItemProps {
  field: InfoboxItem;
  index: number;
  register: UseFormRegister<WikiFormData>;
  control: Control<WikiFormData>;
  setValue: UseFormSetValue<WikiFormData>;
  remove: (index: number) => void;
}

export default function InfoboxItem({
  field,
  index,
  register,
  control,
  setValue,
  remove,
}: InfoboxItemProps) {
  const {
    fields: bars,
    append: appendBar,
    remove: removeBar,
  } = useFieldArray({
    control,
    name: `infobox.${index}.bars`,
  });

  return (
    <div className="w-full border p-4 my-2 flex flex-col gap-4">
      <div className="flex justify-between items-center" id="meta-bar">
        <p className="capitalize">{field.type}</p>
        <Button
          type="button"
          onClick={() => remove(index)}
          className={`${buttonVariants({ variant: "destructive" })} p-1 w-8`}
        >
          <Trash2 />
        </Button>
      </div>
      <Input
        {...register(`infobox.${index}.id`)}
        className="invisible absolute"
        hidden
      />
      <Input
        {...register(`infobox.${index}.type`)}
        className="invisible absolute"
        hidden
      />
      <div className="flex flex-col gap-2">
        {field.type === "image" && (
          <>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: { url: string }[]) => {
                setValue(`infobox.${index}.url`, res[0].url);
                toast.success("Image uploaded successfully!");
              }}
              onUploadError={(error: Error) => {
                toast.error("Thumbnail image upload failed", {
                  className: "error",
                  description: `ERROR! ${error.message}`,
                });
              }}
            />
            <Input
              {...register(`infobox.${index}.url`)}
              placeholder="Image URL"
            />
            <Input
              {...register(`infobox.${index}.title`)}
              placeholder="Title"
            />
            <Input
              {...register(`infobox.${index}.caption`)}
              placeholder="Caption"
            />
          </>
        )}
        {field.type === "collection" && (
          <>
            <Input
              {...register(`infobox.${index}.title`)}
              placeholder="Collection Title"
            />
            {bars?.map((bar, barIndex) => (
              <div key={bar.id} className="flex space-x-2">
                <Input
                  {...register(`infobox.${index}.bars.${barIndex}.key`)}
                  placeholder="Bar Key"
                />
                <Input
                  {...register(`infobox.${index}.bars.${barIndex}.value`)}
                  placeholder="Bar Value"
                />
                <Button
                  type="button"
                  onClick={() => removeBar(barIndex)}
                  className={`${buttonVariants({
                    variant: "destructive",
                  })} p-1 w-8`}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                appendBar({ id: Date.now().toString(), key: "", value: "" })
              }
              className={`${buttonVariants({
                variant: "secondary",
              })} flex gap-2 text-xs w-2/4"`}
            >
              <Plus /> Bar
            </Button>
          </>
        )}
        {field.type === "text" && (
          <>
            <Input
              {...register(`infobox.${index}.title`)}
              placeholder="Text Title"
            />
            <Input
              {...register(`infobox.${index}.content`)}
              placeholder="Text Content"
            />
          </>
        )}
      </div>
    </div>
  );
}
