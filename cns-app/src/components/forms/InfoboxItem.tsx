import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { WikiFormData } from "./WikiForm";
import { Button, buttonVariants } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";

//20240912 Consisting issue with updating the infobox (not posting) - updates dont go to their respective infobox item. Too complex for AI.

//20240913 The issue is not the barindex but the infoboxitem index

interface InfoboxItem {
  id: string;
  type: "image" | "collection" | "text";
  url?: string;
  title: string;
  caption?: string;
  content?: string;
  bars?: { id: string; key: string; value: string }[];
}

const InfoboxItem: React.FC<{
  field: InfoboxItem;
  index: number;
  register: UseFormRegister<WikiFormData>;
  control: Control<WikiFormData>;
  remove: (index: number) => void;
}> = ({ field, index, register, control, remove }) => {
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
};

export default InfoboxItem;
