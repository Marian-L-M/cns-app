"use client";
import { WikiInfoboxItem, WikiInfoboxType } from "@prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog/dialog";
import { Button, buttonVariants } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WikiInfoboxItemSchema } from "@/ValidationSchemas/wiki";
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
import { Textarea } from "../ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UploadComponent } from "../ui/uploader";

interface Props {
  wikiId: number;
  infoboxItem?: WikiInfoboxItem;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export default function InfoboxItemForm({
  wikiId,
  infoboxItem,
  dialogOpen,
  setDialogOpen,
}: Props) {
  const [selectedType, setSelectedType] = useState(infoboxItem?.type || "TEXT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleSelectedType = (type: WikiInfoboxType) => {
    setSelectedType(type);
    form.setValue("type", type);
  };

  const form = useForm<WikiInfoboxItem>({
    resolver: zodResolver(WikiInfoboxItemSchema),
    defaultValues: {
      title: infoboxItem?.title || "",
      order: infoboxItem?.order || 1,
      type: infoboxItem?.type || "TEXT",
      description: infoboxItem?.description || "",
      imageUrl: infoboxItem?.imageUrl || "",
      caption: infoboxItem?.caption || "",
      collections: infoboxItem?.collections || [],
      wikiId: infoboxItem?.wikiId || wikiId,
    },
  });

  useEffect(() => {
    if (infoboxItem) {
      // Reset form with infoboxItem data for editing
      form.reset({
        title: infoboxItem.title || "",
        order: infoboxItem.order || 1,
        type: infoboxItem.type || "TEXT",
        description: infoboxItem.description || "",
        imageUrl: infoboxItem.imageUrl || "",
        caption: infoboxItem.caption || "",
        collections: infoboxItem.collections || [],
        wikiId: infoboxItem.wikiId || wikiId,
      });
    } else {
      // Reset form with default values for new item
      form.reset({
        title: "",
        order: 1,
        type: "TEXT",
        description: "",
        imageUrl: "",
        caption: "",
        collections: [],
        wikiId: wikiId,
      });
    }
  }, [infoboxItem, wikiId, form]);

  const {
    fields: collections,
    append: appendCollection,
    remove: removeCollection,
  } = useFieldArray({
    control: form.control,
    name: "collections",
  });

  const thumbImg = form.watch("imageUrl");

  async function onSubmit(values: WikiInfoboxItem) {
    try {
      setIsSubmitting(true);
      setError("");
      if (infoboxItem) {
        await axios.patch(`/api/infobox/${infoboxItem.id}`, values);
        toast.success("Wiki Infobox item updated succesfully");
      } else {
        await axios.post(`/api/infobox`, values);
        toast.success("Wiki Infobox item added succesfully");
      }
      // form.reset();
      router.push(`/editor/wikis/${wikiId}`);
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Infobox block</DialogTitle>
              <DialogDescription>
                Edit or create a new block for the Infobox
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              {Object.values(WikiInfoboxType).map((type) => (
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
              ))}
            </div>
            <div
              className="h-96 overflow-scroll flex flex-col gap-4"
              id="contents-wrapper"
            >
              {/* General fields */}
              <div className="w-fit">
                <FormField
                  control={form.control}
                  name="order"
                  defaultValue={infoboxItem?.order}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Infobox order..."
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value || 1); // Default to 1 if empty or 0
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Title field */}
              {(selectedType === "TEXT" ||
                selectedType === "TITLE" ||
                selectedType === "COLLECTION") && (
                <div className="w-full">
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="title"
                      defaultValue={infoboxItem?.title}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Title..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              {/* Description field */}
              {(selectedType === "TEXT" || selectedType === "TITLE") && (
                <div className="w-full">
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="description"
                      defaultValue={infoboxItem?.description}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Infobox description..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              {/* Image Field */}
              {selectedType === "IMAGE" && (
                <div className="w-full">
                  <div className="w-full flex flex-col gap-2">
                    <h4>Thumbnail Image</h4>
                    <UploadComponent
                      image={thumbImg || ""}
                      form={form}
                      fieldName="imageUrl"
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="caption"
                      defaultValue={infoboxItem?.caption}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Caption</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Image caption..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              {/* Collection */}
              {selectedType === "COLLECTION" && (
                <div className="w-full">
                  <h4 className="text-sm font-medium">Collections</h4>
                  <div className="space-y-2 mt-2">
                    {collections.map((collection, collectionIndex) => {
                      const collectionData = collection as any;
                      return (
                        <div
                          key={collection.id}
                          className="space-y-2 p-3 border rounded-md"
                        >
                          <FormField
                            control={form.control}
                            name={`collections.${collectionIndex}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Collection Title"
                                    {...field}
                                    value={(field.value as string) || ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Bars section for each collection */}
                          <div className="space-y-1 text-xs">
                            <Label className="text-xs text-muted-foreground">
                              Bars
                            </Label>
                            {collectionData.bars &&
                              Array.isArray(collectionData.bars) &&
                              (collectionData.bars as any[]).map(
                                (bar, barIndex) => (
                                  <div
                                    key={`${collection.id}-${barIndex}`}
                                    className="flex space-x-2"
                                  >
                                    <FormField
                                      control={form.control}
                                      name={`collections.${collectionIndex}.bars.${barIndex}.key`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input
                                              placeholder="Bar Key"
                                              {...field}
                                              value={
                                                (field.value as string) || ""
                                              }
                                              onChange={(e) =>
                                                field.onChange(e.target.value)
                                              }
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`collections.${collectionIndex}.bars.${barIndex}.value`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input
                                              placeholder="Bar Value"
                                              {...field}
                                              value={
                                                (field.value as string) || ""
                                              }
                                              onChange={(e) =>
                                                field.onChange(e.target.value)
                                              }
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        const currentCollections =
                                          form.getValues(
                                            "collections"
                                          ) as any[];
                                        if (
                                          currentCollections &&
                                          currentCollections[collectionIndex]
                                        ) {
                                          const collection = currentCollections[
                                            collectionIndex
                                          ] as any;
                                          if (
                                            collection.bars &&
                                            Array.isArray(collection.bars)
                                          ) {
                                            collection.bars =
                                              collection.bars.filter(
                                                (_: any, idx: number) =>
                                                  idx !== barIndex
                                              );
                                          }
                                          form.setValue(
                                            "collections",
                                            currentCollections
                                          );
                                        }
                                      }}
                                      className={`${buttonVariants({
                                        variant: "destructive",
                                      })} p-1 w-8`}
                                    >
                                      <Trash2 />
                                    </Button>
                                  </div>
                                )
                              )}

                            <Button
                              type="button"
                              onClick={() => {
                                const currentCollections = form.getValues(
                                  "collections"
                                ) as any[];
                                if (
                                  currentCollections &&
                                  currentCollections[collectionIndex]
                                ) {
                                  const collection = currentCollections[
                                    collectionIndex
                                  ] as any;
                                  if (!collection.bars) {
                                    collection.bars = [];
                                  }
                                  collection.bars.push({ key: "", value: "" });
                                  form.setValue(
                                    "collections",
                                    currentCollections
                                  );
                                }
                              }}
                              className={`${buttonVariants({
                                variant: "secondary",
                              })} flex gap-2 text-xs w-2/4`}
                            >
                              <Plus /> Add Bar
                            </Button>
                          </div>

                          <Button
                            type="button"
                            onClick={() => removeCollection(collectionIndex)}
                            className={`${buttonVariants({
                              variant: "destructive",
                            })} w-full text-xs`}
                          >
                            <Trash2 /> Remove Collection
                          </Button>
                        </div>
                      );
                    })}

                    <Button
                      type="button"
                      onClick={() => appendCollection({ title: "", bars: [] })}
                      className={`${buttonVariants({
                        variant: "outline",
                      })} flex gap-2 text-xs w-full`}
                    >
                      <Plus /> Add Collection
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {infoboxItem ? "Update infobox item" : "Add infobox item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
