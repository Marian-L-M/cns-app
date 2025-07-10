"use client";
import { CanvasStyleItem, CanvasStyleItemType } from "@prisma/client";
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
import LineWidthPicker from "../ui/linewidth-picker/LineWidthPicker";
import { Menu } from "lucide-react";

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

export default function StyleItemForm({
  parentId,
  parentType,
  parentSlug,
  canvasStyleItem,
  dialogOpen,
  setDialogOpen,
}: Props) {
  const [selectedType, setSelectedType] = useState(
    canvasStyleItem?.type || "fillStyle"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleSelectedType = (type: CanvasStyleItemType) => {
    setSelectedType(type);
    form.setValue("type", type);
  };

  const form = useForm<CanvasStyleItem>({
    resolver: zodResolver(CanvasStylesSchema),
    defaultValues: {
      type: canvasStyleItem?.type || "fillStyle",
      value: canvasStyleItem?.value || "",
    },
  });

  useEffect(() => {
    form.reset({
      type: canvasStyleItem?.type || "fillStyle",
      value: canvasStyleItem?.value || "",
    });
    // if (canvasStyleItem) {
    // }
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
                Object.values(CanvasStyleItemType).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => {
                      toggleSelectedType(type);
                    }}
                  >
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </Button>
                ))
              )}
            </div>
            <div
              className="overflow-scroll flex flex-col gap-8"
              id="contents-wrapper"
            >
              {/* General fields */}
              <div className="w-full">
                {(selectedType == "lineWidth" ||
                  canvasStyleItem?.type == "lineWidth") && (
                  <LineWidthPicker icon={<Menu className="text-slate-300" />} />
                )}
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
              </div>
              {/* <div className="flex justify-between gap-1" id="color-pickers">
                <ColorPicker
                  label={"Fill Style"}
                  icon={<Palette className="text-slate-300" />}
                  editorContext={"objectColor"}
                />
                <LineColorPicker
                  label={"Line Style"}
                  icon={<Palette className="text-slate-300" />}
                  editorContext={"lineColor"}
                />
                
              </div> */}
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
