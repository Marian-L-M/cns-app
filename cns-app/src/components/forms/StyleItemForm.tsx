"use client";
import { CanvasStyleItem } from "@prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CanvasStylesSchema } from "@/ValidationSchemas/styles";
import LineWidthPicker from "../ui/linewidth-picker";
import { Menu } from "lucide-react";
import { SketchPicker, ColorResult } from "react-color";
import {
  CanvasStyleItemType,
  ObjectStyleItemType,
} from "@/lib/constants/styles";

interface Props {
  parentId: number;
  parentType: string;
  parentSlug: string;
  canvasStyleItem?: CanvasStyleItem;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const parentTypeMap: Record<string, string> = {
  map: "mapId",
  globalObject: "globalObjectId",
  globalArea: "globalAreaId",
  mapHierarchyChild: "mapHierarchyChildId",
  subStory: "subStoryId",
};

// const CANVAS_STYLE_TYPES = ["font", "lineWidth", "fillStyle", "strokeStyle"];

export default function StyleItemForm({
  parentId,
  parentType,
  parentSlug,
  canvasStyleItem,
  dialogOpen,
  setDialogOpen,
}: Props) {
  const initialType = parentType === "globalObject" ? "size" : "fillStyle";
  const [selectedType, setSelectedType] = useState(
    canvasStyleItem?.type || "fillStyle"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [currentStyleValue, setCurrentStyleValue] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    canvasStyleItem?.value || "#ffffff"
  );

  const activeStyleSelection =
    parentType === "globalObject" ? ObjectStyleItemType : CanvasStyleItemType;
  const toggleSelectedType = (
    type: CanvasStyleItemType | ObjectStyleItemType
  ) => {
    setSelectedType(type);
    form.setValue("type", type);
  };

  const form = useForm<CanvasStyleItem>({
    resolver: zodResolver(CanvasStylesSchema),
    defaultValues: {
      type: canvasStyleItem?.type || initialType,
      value: canvasStyleItem?.value || "",
    },
  });

  // Handle color change from SketchPicker
  const handleColorChange = (color: ColorResult) => {
    const colorValue = color.rgb;
    setSelectedColor(colorValue);
    setCurrentStyleValue(colorValue);
    form.setValue(
      "value",
      `rgba(${colorValue.r},${colorValue.g},${colorValue.b},${colorValue.a})`
    );
  };

  // link form field value to visual inputs
  useEffect(() => {
    // Update form
    if (currentStyleValue) {
      form.setValue("value", currentStyleValue);
    }
  }, [currentStyleValue]);

  // Reset form on switch
  useEffect(() => {
    const defaultValue = canvasStyleItem?.value || "";
    form.reset({
      type: canvasStyleItem?.type || initialType,
      value: canvasStyleItem?.value || "",
    });

    setSelectedType(canvasStyleItem?.type || initialType);
    setSelectedColor(defaultValue || "#ffffff");
    setCurrentStyleValue(defaultValue);
  }, [canvasStyleItem, parentId, form]);

  async function onSubmit(values: CanvasStyleItem) {
    // Add parent ID to submission values
    const parentFieldName = parentTypeMap[parentType];
    if (parentFieldName) {
      (values as any)[parentFieldName] = parentId;
    }
    try {
      setIsSubmitting(true);
      setError("");
      if (canvasStyleItem) {
        await axios.patch(`/api/styles/${canvasStyleItem.id}`, values);
        toast.success("Styles item updated succesfully");
      } else {
        await axios.post(`/api/styles`, values);
        toast.success("Styles item added succesfully");
      }
      form.reset();
      router.push(`${parentSlug}`);
      router.refresh();
      setIsSubmitting(false);
      setDialogOpen(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>
                {canvasStyleItem ? "Edit style" : "Create style"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              {canvasStyleItem ? (
                <h4 className="text-lg font-bold">{canvasStyleItem.type}</h4>
              ) : (
                Object.values(activeStyleSelection).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => {
                      toggleSelectedType(type);
                    }}
                  >
                    {type}
                  </Button>
                ))
              )}
            </div>
            <div
              className="overflow-scroll flex flex-col gap-8"
              id="contents-wrapper"
            >
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="value"
                  defaultValue={canvasStyleItem?.value}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hidden">Value</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=""
                          {...field}
                          className="hidden"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Line Picker */}
                {selectedType == "lineWidth" && (
                  <LineWidthPicker
                    icon={<Menu className="text-slate-300" />}
                    currentStyleValue={currentStyleValue}
                    setCurrentStyleValue={setCurrentStyleValue}
                  />
                )}
                {/* Size picker */}
                {selectedType == "size" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Size: {currentStyleValue || "1"}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={currentStyleValue || "1"}
                      onChange={(e) =>
                        setCurrentStyleValue(e.target.value.toString())
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1</span>
                      <span>100</span>
                    </div>
                  </div>
                )}
                {/* Color Picker */}
                {(selectedType == "fillStyle" ||
                  selectedType == "strokeStyle") && (
                  <SketchPicker
                    color={selectedColor}
                    onChange={handleColorChange}
                    onChangeComplete={handleColorChange}
                  />
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {canvasStyleItem ? "Update style" : "Add style"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
