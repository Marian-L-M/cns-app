import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Later unify with typings -> names are clashing
interface ImageItem {
  id: string;
  type: "image";
  url: string;
  title: string;
  caption: string;
}

interface CollectionItem {
  id: string;
  type: "collection";
  title: string;
  bars: { key: string; value: string }[];
}

interface ContentItem {
  id: string;
  type: "content";
  title: string;
  content: string;
}

type InfoboxItem = ImageItem | CollectionItem | ContentItem;

interface InfoboxFormFieldProps {
  control: Control<{ infobox: InfoboxItem[] }>;
  register: UseFormRegister<{ infobox: InfoboxItem[] }>;
}

const WikiInfoboxFormField: React.FC<InfoboxFormFieldProps> = ({
  control,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "infobox", // Name of the JSON field in the form
  });

  const addField = (type: InfoboxItem["type"]) => {
    switch (type) {
      case "image":
        append({
          id: Date.now().toString(),
          url: "",
          type: "image",
          title: "",
          caption: "",
        } as ImageItem);
        break;
      case "collection":
        append({
          id: Date.now().toString(),
          type: "collection",
          title: "",
          bars: [{ key: "", value: "" }],
        } as CollectionItem);
        break;
      case "content":
        append({
          id: Date.now().toString(),
          type: "content",
          title: "",
          content: "",
        } as ContentItem);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="flex space-x-4">
        <Button onClick={() => addField("image")}>Add Image</Button>
        <Button onClick={() => addField("collection")}>Add Collection</Button>
        <Button onClick={() => addField("content")}>Add Content</Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 my-2">
          <Button onClick={() => remove(index)}>
            <Trash2 />
          </Button>
          <Input {...register(`infobox.${index}.id`)} hidden />
          <Input {...register(`infobox.${index}.type`)} hidden />
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
              {field.bars?.map((bar, barIndex) => (
                <div key={barIndex} className="flex space-x-2">
                  <Input
                    {...register(`infobox.${index}.bars.${barIndex}.key`)}
                    placeholder="Bar Key"
                  />
                  <Input
                    {...register(`infobox.${index}.bars.${barIndex}.value`)}
                    placeholder="Bar Value"
                  />
                </div>
              ))}
            </>
          )}
          {field.type === "content" && (
            <>
              <Input
                {...register(`infobox.${index}.title`)}
                placeholder="Content Title"
              />
              <Input
                {...register(`infobox.${index}.content`)}
                placeholder="Content"
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default WikiInfoboxFormField;
