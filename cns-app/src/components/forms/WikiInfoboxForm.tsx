import React from "react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { WikiFormData } from "./WikiForm";
import { ImagePlus, ListPlus, SquarePlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import InfoboxItem from "./InfoboxItem";

interface InfoboxFormFieldProps {
  control: Control<WikiFormData>;
  register: UseFormRegister<WikiFormData>;
}

export default function WikiInfoboxFormField({
  control,
  register,
}: InfoboxFormFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "infobox",
  });

  // Broke during refactoring (Removed React.Fc)
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
    <div className="flex flex-col  gap-4 py-4 pb-20 bg-slate-100" id="info-box">
      <div className="flex flex-col gap-4" id="infobox-control">
        <div
          className="flex flex-col items-center gap-4 bg-slate-200 rounded-md py-4 px-2"
          id="infoboxitem-container"
        >
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
          <div className="flex flex-row gap-1 justify-center">
            <Button
              className={`${buttonVariants({
                variant: "secondary",
              })} flex gap-2 text-xs w-2/4 block"`}
              type="button"
              onClick={() => addField("image")}
            >
              <ImagePlus />
              Image
            </Button>
            <Button
              className={`${buttonVariants({
                variant: "secondary",
              })} flex gap-2 text-xs w-2/4 block"`}
              type="button"
              onClick={() => addField("collection")}
            >
              <ListPlus /> Collection
            </Button>
            <Button
              className={`${buttonVariants({
                variant: "secondary",
              })} flex gap-2 text-xs w-2/4 block"`}
              type="button"
              onClick={() => addField("text")}
            >
              <SquarePlus />
              Text
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
