"use client";
import axios from "axios";
import Image from "next/image";
import dynamic from "next/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import WikiSearchDialog from "@/components/ui/dialog/wikiSearchDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import IconPicker from "@/components/ui/icon-picker/IconPicker";
import { Button } from "@/components/ui/button";
import { fetchWikiName } from "@/lib/fetchWikiData";
import { CanvasStyleItem, GlobalObject, MapObjectType } from "@prisma/client";
import { EditorContext } from "@/store/mapEditorContext";
import {
  GlobalObjectsSchema,
  MapObjectTypeList,
} from "@/ValidationSchemas/global";

import "easymde/dist/easymde.min.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import StyleEditListModule from "../displays/StyleEditListModule";
import { Plus } from "lucide-react";
import StyleItemForm from "./StyleItemForm";
import { Card, CardContent } from "../ui/card";
import { UploadButton } from "@/lib/uploadthing/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface Props {
  map: MapType;
  editorMode?: string;
  globalObject?: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    iconUrl: string;
    thumbUrl: string;
    objectTime: number;
    x: number;
    y: number;
    mapId: number;
    wikiId: number;
    type: MapObjectType;
    canvasStyles: CanvasStyleItem[];
  };
}

type GlobalObjectFormData = z.infer<typeof GlobalObjectsSchema>;

export default function GlobalObjectForm({ map, globalObject }: Props) {
  const editorCtx = useContext(EditorContext);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Style items
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStyleItem, setCurrentStyleItem] = useState<
    CanvasStyleItem | undefined
  >(undefined);

  // Wiki search
  const [selectedWikiId, setSelectedWikiId] = useState<number | undefined>(
    globalObject?.wikiId ?? undefined
  );
  const [wikiName, setWikiName] = useState<string>("");

  const showStyleForm = (canvasStyle?: CanvasStyleItem) => {
    setCurrentStyleItem(canvasStyle);
    setIsDialogOpen(true);
  };

  const form = useForm<GlobalObjectFormData>({
    resolver: zodResolver(GlobalObjectsSchema),
    defaultValues: {
      title: globalObject?.title || "",
      description: globalObject?.description || "",
      thumbUrl: globalObject?.thumbUrl || "",
      iconUrl: globalObject?.iconUrl || "",
      mapId: globalObject?.mapId || map.id,
      wikiId: globalObject?.wikiId ?? undefined,
      x: globalObject?.x || 100,
      y: globalObject?.y || 100,
      objectTime: globalObject?.objectTime || 1000,
      type: globalObject?.type || "LOCATION",
    },
  });

  const thumbImg = form.watch("thumbUrl");

  // Keep form values synchronized with context
  useEffect(() => {
    form.setValue("iconUrl", editorCtx.globalObjectSettings.url);
    form.setValue("x", editorCtx.globalObjectSettings.x);
    form.setValue("y", editorCtx.globalObjectSettings.y);
  }, [editorCtx.globalObjectSettings, form]);

  // Fetch wiki name when wikiId changes
  useEffect(() => {
    // Update Wiki Name
    fetchWikiName({ selectedWikiId, setWikiName });

    // Update form
    if (selectedWikiId) {
      form.setValue("wikiId", selectedWikiId);
    }
  }, [selectedWikiId, form]);

  async function onSubmit(values: GlobalObjectFormData) {
    const submissionValues = {
      ...values,
      mapId: map.id,
    };
    try {
      setIsSubmitting(true);
      setError("");
      console.log("Submitting data:", submissionValues);
      if (globalObject?.id) {
        await axios.patch(
          `/api/globalobject/${globalObject.id}`,
          submissionValues
        );
      } else {
        await axios.post("/api/globalobject", submissionValues);
      }
      setIsSubmitting(false);
      router.push(`/editor/maps/${map.id}?modal=objects`);
      router.refresh();
    } catch (error) {
      handleError(error);
    }
  }

  const handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      setError(
        "Validation error: " + error.errors.map((e) => e.message).join(", ")
      );
      console.error("Validation error:", error.errors);
    } else if (axios.isAxiosError(error)) {
      setError(
        `Server error: ${error.response?.data?.message || error.message}`
      );
      console.error("Server response:", error.response?.data);
    } else {
      setError("An unexpected error occurred");
      console.error("Unknown error:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-8 col-span-2">
      <Tabs defaultValue={"form"} className="w-full">
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative z-20 col-span-2 flex flex-col gap-4 text-black"
                id="sidebar"
              >
                <div className="w-full flex flex-col gap-4" id="form-top">
                  <div className="w-full" id="title-container">
                    <FormField
                      control={form.control}
                      name="title"
                      defaultValue={globalObject?.title}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormMessage />
                          <FormControl>
                            <Input placeholder="Object Title..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full" id="description-container">
                    <h5 className="">Description</h5>
                    <Controller
                      name="description"
                      defaultValue={globalObject?.description}
                      control={form.control}
                      render={({ field }) => (
                        <SimpleMdeEditor
                          placeholder="Object description"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="w-full" id="type-container">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormMessage />
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Type..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MapObjectTypeList.options.map((objectType) => (
                                <SelectItem
                                  key={`${objectType}-select-option`}
                                  value={objectType}
                                >
                                  {objectType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full" id="wiki-container">
                    <FormField
                      control={form.control}
                      name="wikiId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wiki</FormLabel>
                          <FormMessage />
                          <FormControl>
                            <div className="flex flex-row gap-2">
                              {wikiName && (
                                <div className="w-2/3">
                                  <Input
                                    type="hidden"
                                    placeholder="WikiId"
                                    {...field}
                                  />
                                  <div className="p-2 border rounded-md h-10 flex items-center">
                                    <p className="truncate text-sm">
                                      {wikiName}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="w-1/3">
                                <WikiSearchDialog
                                  setSelectedWikiId={setSelectedWikiId}
                                />
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="upload-field">
                    <h4>Thumbnail Image</h4>
                    <Card>
                      <CardContent className="space-y-2 mt-2">
                        {thumbImg && (
                          <Image
                            src={thumbImg}
                            alt="thumbnail image"
                            className="object-cover object-center"
                            width={240}
                            height={240}
                          />
                        )}

                        {!thumbImg && (
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(
                              res: { url: string }[]
                            ) => {
                              form.setValue("thumbUrl", res[0].url);
                            }}
                            onUploadError={(error: Error) => {
                              toast.error("Thumbnail image upload failed", {
                                className: "error",
                                description: `ERROR! ${error.message}`,
                              });
                            }}
                          />
                        )}
                        <FormField
                          control={form.control}
                          name="thumbUrl"
                          defaultValue={map?.imageUrl}
                          render={({ field }) => (
                            <FormItem>
                              <FormMessage />
                              <FormControl>
                                <Input placeholder="Thumbnail" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-full" id="icon-container">
                    <FormField
                      control={form.control}
                      name="iconUrl"
                      defaultValue={globalObject?.iconUrl}
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage />
                          <FormLabel>Icon</FormLabel>
                          <FormControl>
                            <Input placeholder="Object icon" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full" id="icon-container">
                    <h5 className="">Map Icon</h5>
                    <IconPicker />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
        <TabsContent value="styles">
          <div className="w-full">
            {/* Style column */}
            {globalObject ? (
              <div className="w-full flex flex-col gap-4">
                <div className="w-full gap-2 flex items-center justify-between">
                  <h4 className="text-lg">Styles</h4>
                  <Button
                    type="button"
                    className="self-end"
                    variant="default"
                    onClick={() => showStyleForm()}
                  >
                    <Plus />
                  </Button>
                </div>
                <StyleEditListModule
                  canvasStyles={globalObject.canvasStyles}
                  showStyleForm={showStyleForm}
                  currentPage={`/editor/maps/${map.id}/objects/${globalObject.id}`}
                />
                <StyleItemForm
                  parentId={globalObject.id}
                  parentType="globalObject"
                  parentSlug={`/editor/maps/${map.id}/objects/${globalObject.id}`}
                  dialogOpen={isDialogOpen}
                  setDialogOpen={setIsDialogOpen}
                  canvasStyleItem={currentStyleItem}
                />
              </div>
            ) : (
              <p>Save area to change style</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
