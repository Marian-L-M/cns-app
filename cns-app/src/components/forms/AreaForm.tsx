"use client";
import axios from "axios";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WikiSearchDialog from "@/components/ui/dialog/wikiSearchDialog";
import StyleEditListModule from "@/components/displays/StyleEditListModule";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchWikiName } from "@/lib/fetchWikiData";
import { UploadButton } from "@/lib/uploadthing/utils";
import { CanvasStyleItem, GlobalArea } from "@prisma/client";
import { EditorContext } from "@/store/mapEditorContext";
import { GlobalAreasSchema } from "@/ValidationSchemas/global";

import "easymde/dist/easymde.min.css";
import StyleItemForm from "./StyleItemForm";

const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface areaNode {
  id: number;
  x: number;
  y: number;
}

interface Props {
  map: MapType;
  editorMode?: string;
  globalArea?:
    | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        imageUrl: string;
        nodes?: areaNode[];
        objectTime: number;
        mapId: number;
        wikiId: number;
        type: "GEOGRAPHY" | "ABSTRACT" | "INTERACTIVE";
        canvasStyles: CanvasStyleItem[];
      }
    | undefined;
}

export type GlobalAreaFormData = z.infer<typeof GlobalAreasSchema> & {
  globalArea: GlobalArea;
};

export default function GlobalAreaForm({ map, globalArea }: Props) {
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
    globalArea?.wikiId ?? undefined
  );
  const [wikiName, setWikiName] = useState<string>("");

  const styles = {
    fillStyle: editorCtx.objectColor,
    lineWidth: editorCtx.objectLineWidth,
    strokeStyle: editorCtx.objectLineWidth,
  };

  const showStyleForm = (canvasStyle?: CanvasStyleItem) => {
    setCurrentStyleItem(canvasStyle);
    setIsDialogOpen(true);
  };

  // --- Form settings ---
  // Set form data
  const form = useForm<GlobalAreaFormData>({
    resolver: zodResolver(GlobalAreasSchema),
    defaultValues: {
      title: globalArea?.title || "",
      description: globalArea?.description || "",
      imageUrl: globalArea?.imageUrl || "",
      mapId: globalArea?.mapId || map.id,
      wikiId: globalArea?.wikiId ?? undefined,
      type:
        (globalArea?.type as "GEOGRAPHY" | "POLITICAL" | "OTHER") ||
        "GEOGRAPHY",
      nodes: globalArea?.nodes || [],
      objectTime: globalArea?.objectTime || 1000,
    },
  });

  // Keep form values synchronized with context
  useEffect(() => {
    form.setValue("nodes", editorCtx.nodeList);
  }, [editorCtx.nodeList, form, styles]);

  // Fetch wiki name when wikiId changes
  useEffect(() => {
    fetchWikiName({ selectedWikiId, setWikiName });

    // Update form
    if (selectedWikiId) {
      form.setValue("wikiId", selectedWikiId);
    }
  }, [selectedWikiId, form]);

  const thumbImg = form.watch("imageUrl");

  async function onSubmit(values: GlobalAreaFormData) {
    if (editorCtx.nodeList.length < 1) {
      alert("Please draw nodes on the map before submitting");
      return;
    }

    // Set submission values to latest canvas values
    const submissionValues = {
      ...values,
      nodes: editorCtx.nodeList,
    };

    try {
      setIsSubmitting(true);
      setError("");
      console.log("Submitting data:", submissionValues);

      if (globalArea?.id) {
        await axios.patch(`/api/globalarea/${globalArea.id}`, submissionValues);
      } else {
        await axios.post("/api/globalarea", submissionValues);
      }

      setIsSubmitting(false);
      router.push(`/editor/maps/${map.id}?modal=areas`);
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
                className="flex flex-col gap-4"
                id="sidebar"
              >
                <div className="w-full flex flex-col gap-4" id="form-top">
                  <div className="w-full" id="title-container">
                    <FormField
                      control={form.control}
                      name="title"
                      defaultValue={globalArea?.title}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Area Title..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full" id="description-container">
                    <h5 className="">Description</h5>
                    <Controller
                      name="description"
                      defaultValue={globalArea?.description}
                      control={form.control}
                      render={({ field }) => (
                        <SimpleMdeEditor
                          placeholder="Area description"
                          {...field}
                        />
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
                              form.setValue("imageUrl", res[0].url);
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
                          name="imageUrl"
                          defaultValue={map?.imageUrl}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Thumbnail" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-full" id="timestamp-container">
                    <FormField
                      control={form.control}
                      name="objectTime"
                      defaultValue={globalArea?.objectTime}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area Timestamp</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Area Timestamp"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              value={field.value || ""}
                            />
                          </FormControl>
                        </FormItem>
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
                              <SelectItem value="GEOGRAPHY">
                                Geography
                              </SelectItem>
                              <SelectItem value="POLITICAL">
                                Political
                              </SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
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
            {globalArea ? (
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
                  canvasStyles={globalArea.canvasStyles}
                  showStyleForm={showStyleForm}
                  currentPage={`/editor/maps/${map.id}/areas/${globalArea.id}`}
                />
                <StyleItemForm
                  parentId={globalArea.id}
                  parentType="globalArea"
                  parentSlug={`/editor/maps/${map.id}/areas/${globalArea.id}`}
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
