import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { WikiFormData } from "./WikiForm";
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

interface TextItem {
  id: string;
  type: "text";
  title: string;
  content: string;
}

type InfoboxItem = ImageItem | CollectionItem | TextItem;

interface InfoboxFormFieldProps {
  control: Control<WikiFormData>;
  register: UseFormRegister<WikiFormData>;
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
        });
        break;
      case "collection":
        append({
          id: Date.now().toString(),
          type: "collection",
          title: "",
          bars: [{ id: Date.now().toString(), key: "", value: "" }],
        });
        break;
      case "text":
        append({
          id: Date.now().toString(),
          type: "text",
          title: "",
          content: "",
        });
        break;
      default:
        break;
    }
  };

  // 240830 Todo : No real point in having type as an editable input field
  // 240830 Todo : Add a button to add & remove a new bar
  // 240830 Todo: weird auto submission bug when adding text field or completing all inputs?
  // 240830 Collection -> bar -> value not displaying, I suspect its a naming issue somewhere

  return (
    <div>
      <div className="flex space-x-4" id="infobox-control">
        <Button onClick={() => addField("image")}>Add Image</Button>
        <Button onClick={() => addField("collection")}>Add Collection</Button>
        <Button onClick={() => addField("text")}>Add Text</Button>
      </div>
      <div className="flex flex-col gap-2" id="infobox-list">
        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 my-2 flex flex-col gap-4">
            <Button onClick={() => remove(index)} className="p-1 w-8">
              <Trash2 />
            </Button>
            {/* Consider if any issues could arise from the hidden fields */}
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
                <div className="flex flex-col gap-2">
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
                </div>
              )}
              {field.type === "collection" && (
                <div className="flex flex-col gap-2">
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
                </div>
              )}
              {field.type === "text" && (
                <div className="flex flex-col gap-2">
                  <Input
                    {...register(`infobox.${index}.title`)}
                    placeholder="Text Title"
                  />
                  <Input
                    {...register(`infobox.${index}.content`)}
                    placeholder="Text"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WikiInfoboxFormField;
