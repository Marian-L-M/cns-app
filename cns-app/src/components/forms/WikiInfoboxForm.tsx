import React from "react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { WikiFormData } from "./WikiForm";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InfoboxItem {
  id: string;
  type: "image" | "collection" | "text";
  url?: string;
  title: string;
  caption?: string;
  content?: string;
  bars?: { id: string; key: string; value: string }[];
}

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
    name: "infobox",
  });

  const addField = (type: InfoboxItem["type"]) => {
    const newItem: InfoboxItem = {
      id: Date.now().toString(),
      type,
      title: "",
    };

    switch (type) {
      case "image":
        newItem.url = "";
        newItem.caption = "";
        break;
      case "collection":
        newItem.bars = [{ id: Date.now().toString(), key: "", value: "" }];
        break;
      case "text":
        newItem.content = "";
        break;
    }

    append(newItem);
  };

  return (
    <div>
      <div className="flex space-x-4" id="infobox-control">
        <Button type="button" onClick={() => addField("image")}>
          Add Image
        </Button>
        <Button type="button" onClick={() => addField("collection")}>
          Add Collection
        </Button>
        <Button type="button" onClick={() => addField("text")}>
          Add Text
        </Button>
      </div>
      <div className="flex flex-col gap-2" id="infobox-list">
        {fields.map((field, index) => (
          <InfoboxItem
            key={field.id}
            field={field}
            index={index}
            register={register}
            control={control}
            remove={remove}
          />
        ))}
      </div>
    </div>
  );
};

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
    <div className="border p-4 my-2 flex flex-col gap-4">
      <Button type="button" onClick={() => remove(index)} className="p-1 w-8">
        <Trash2 />
      </Button>
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
            <p>Image group</p>
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
                <p>Bar Group</p>
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
                  className="p-1 w-8"
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
              className="mt-2"
            >
              <Plus /> Add Bar
            </Button>
          </>
        )}
        {field.type === "text" && (
          <>
            <p>Text group</p>
            <Input
              {...register(`infobox.${index}.title`)}
              placeholder="Text Title"
            />
            <Input
              {...register(`infobox.${index}.content`)}
              placeholder="Text"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WikiInfoboxFormField;
