"use client";
import { useMapEditor } from "@/hooks/useMapEditor";
import { Button } from "../ui/button";
import ColorPicker from "../ui/colorPicker/ColorPicker";
import { Menu, Palette } from "lucide-react";
import Image from "next/image";

import { useContext, useEffect, useState } from "react";
import { EditorContext } from "@/store/mapEditorContext";
import { z } from "zod";
import { GlobalArea, GlobalObject } from "@prisma/client";
import axios from "axios";
import {
  GlobalAreasSchema,
  GlobalObjectsSchema,
} from "@/ValidationSchemas/global";
import { useRouter } from "next/navigation";
import LineWidthPicker from "../ui/lineWidthPicker/LineWidthPicker";
import LineColorPicker from "../ui/colorPicker/LineColorPicker";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import IconPicker from "../ui/iconPicker/IconPicker";

interface Props {
  mapId: number;
  globalObject?: GlobalObject;
  globalArea?:
    | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        imageUrl: string;
        infobox: {};
        nodes?: areaNode[];
        styles: {};
        objectTime: number;
        mapId: number;
        wikiId: number;
        type: "GEOGRAPHY" | "ABSTRACT" | "INTERACTIVE";
      }
    | undefined;
  editorMode?: string;
}

export type GlobalAreaFormData = z.infer<typeof GlobalAreasSchema> & {
  globalArea: GlobalArea;
};

interface areaNode {
  id: number;
  x: number;
  y: number;
}

export type GlobalObjectFormData = z.infer<typeof GlobalObjectsSchema> & {
  globalObject: GlobalObject;
};

function MapEditorModule({
  mapId,
  globalArea,
  globalObject,
  editorMode,
}: Props) {
  //250108 TODO - Map this to new object editor
  // if (!globalArea && !globalObject) {
  //   return <div>No Data found</div>;
  // }
  const { canvasRef } = useMapEditor({ globalArea, globalObject });

  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  const area = globalArea;
  const object = globalObject;
  // if (area) {
  //   console.log("area: " + area);
  // }
  // if (object) {
  //   console.log("object: " + object.id);
  //   Object.entries(object).forEach(([key, val]) => {
  //     console.log(key); // the name of the current key.
  //     console.log(val); // the value of the current key.
  //   });
  // }

  return (
    <div className="w-full" id="map-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          className="relative z-10 max-w-screen-lg col-span-4 bg-black"
          id="map-base"
        >
          <canvas
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
            className="border border-grey relative z-10 w-full"
          />
          <Image
            priority={true}
            className="absolute top-0 left-0 z-1 pointer-events-none opacity-70"
            src={`/maps/kamolin-map.jpg`} // make dynamic
            alt="Map of Kamolin"
            width="1024"
            height="1024"
          />
        </div>
        {(globalArea || editorMode === "area") && (
          <AreaForm mapId={mapId} globalArea={globalArea} />
        )}
        {(globalObject || editorMode === "object") && (
          <ObjectForm mapId={mapId} globalObject={globalObject} />
        )}
      </div>
    </div>
  );
}

export default MapEditorModule;

// 241127 To do:
// Split form into area and object form
// Rewiring Area
// Create object form

function AreaForm({ mapId, globalArea }: Props) {
  const { styles } = useMapEditor(globalArea?.nodes, globalArea?.styles);
  const editorCtx = useContext(EditorContext);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Set form data
  const form = useForm<GlobalAreaFormData>({
    resolver: zodResolver(GlobalAreasSchema),
    defaultValues: {
      title: globalArea?.title || "",
      description: globalArea?.description || "",
      imageUrl: globalArea?.imageUrl || "",
      mapId: mapId,
      wikiId: globalArea?.wikiId || 2, // temporary fixed wiki id
      type:
        (globalArea?.type as "GEOGRAPHY" | "POLITICAL" | "OTHER") ||
        "GEOGRAPHY",
      infobox: null,
      nodes: globalArea?.nodes || [],
      styles: {
        fillStyle: styles?.fillStyle || "rgba(0, 0, 0, 0.5)",
        lineWidth: typeof styles?.lineWidth === "number" ? styles.lineWidth : 5,
        strokeStyle: styles?.strokeStyle || "black",
      },
      objectTime: globalArea?.objectTime || 1000,
    },
  });

  // Keep form values synchronized with context
  useEffect(() => {
    form.setValue("nodes", editorCtx.nodeList);
    form.setValue("styles", {
      fillStyle: styles?.fillStyle || "rgba(0, 0, 0, 0.5)",
      lineWidth: typeof styles?.lineWidth === "number" ? styles.lineWidth : 5,
      strokeStyle: styles?.strokeStyle || "black",
    });
  }, [editorCtx.nodeList, form, styles]);

  async function onSubmit(values: GlobalAreaFormData) {
    if (editorCtx.nodeList.length < 1) {
      alert("Please draw nodes on the map before submitting");
      return;
    }

    // Set submission values to lates canvas values
    const submissionValues = {
      ...values,
      styles: {
        fillStyle: editorCtx.objectColor || "rgba(0, 0, 0, 0.5)",
        strokeStyle: editorCtx.objectLineColor || "black",
        lineWidth:
          typeof editorCtx.objectLineWidth === "number" ? styles?.lineWidth : 5,
      },
      nodes: editorCtx.nodeList,
    };

    try {
      setIsSubmitting(true);
      setError("");
      console.log("Submitting data:", submissionValues);

      if (globalArea) {
        await axios.patch(`/api/globalarea/${globalArea.id}`, submissionValues);
      } else {
        await axios.post("/api/globalarea", submissionValues);
      }

      setIsSubmitting(false);
      router.push(`/maps/${mapId}/edit`);
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative z-20 col-span-2 flex flex-col gap-4"
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
            <h4 className="font-bold">Description</h4>
            <Controller
              name="description"
              defaultValue={globalArea?.description}
              control={form.control}
              render={({ field }) => (
                <SimpleMDE placeholder="Area description" {...field} />
              )}
            />
          </div>
          <div className="w-full" id="thumbnail-container">
            <FormField
              control={form.control}
              name="imageUrl"
              defaultValue={globalArea?.imageUrl}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input placeholder="Area Thumbnail" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <SelectItem value="GEOGRAPHY">Geography</SelectItem>
                      <SelectItem value="POLITICAL">Political</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Move pickers into an overlay over the map editor */}
        <div className="flex justify-between gap-1" id="color-pickers">
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
          <LineWidthPicker icon={<Menu className="text-slate-300" />} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

function ObjectForm({ mapId, globalObject }: Props) {
  const editorCtx = useContext(EditorContext);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<GlobalObjectFormData>({
    resolver: zodResolver(GlobalObjectsSchema),
    defaultValues: {
      title: globalObject?.title || "",
      description: globalObject?.description || "",
      imageUrl: globalObject?.imageUrl || "",
      thumbUrl: globalObject?.thumbUrl || "",
      mapId: mapId,
      wikiId: globalObject?.wikiId || 2, // temporary fixed wiki id
      x: globalObject?.x || 100,
      y: globalObject?.y || 100,
    },
  });

  // Keep form values synchronized with context
  useEffect(() => {
    form.setValue("thumbUrl", editorCtx.globalObjectSettings.url);
    form.setValue("x", editorCtx.globalObjectSettings.x);
    form.setValue("y", editorCtx.globalObjectSettings.y);
  }, [editorCtx.globalObjectSettings]);

  async function onSubmit(values: GlobalObjectFormData) {
    console.log("click");
    const submissionValues = {
      ...values,
      mapId: mapId,
    };

    try {
      setIsSubmitting(true);
      setError("");
      console.log("Submitting data:", submissionValues);

      if (globalObject) {
        await axios.patch(
          `/api/globalobject/${globalObject.id}`,
          submissionValues
        );
      } else {
        await axios.post("/api/globalobject", submissionValues);
      }

      setIsSubmitting(false);
      router.push(`/maps/${mapId}/edit/objects`);
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
                  <FormControl>
                    <Input placeholder="Object Title..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-full" id="description-container">
            <h4 className="font-bold">Description</h4>
            <Controller
              name="description"
              defaultValue={globalObject?.description}
              control={form.control}
              render={({ field }) => (
                <SimpleMDE placeholder="Object description" {...field} />
              )}
            />
          </div>
          <div className="w-full" id="image-container">
            <FormField
              control={form.control}
              name="imageUrl"
              defaultValue={globalObject?.imageUrl}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input placeholder="Object Image" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-full" id="thumbnail-container">
            <FormField
              control={form.control}
              name="thumbUrl"
              defaultValue={globalObject?.thumbUrl}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input placeholder="Object Thumbnail" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-full" id="icon-container">
            <IconPicker />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

// 20241004 Next actions
// Map editor is designed to be a popup module on top of the map.

// 20241007 Next actions

// For now: One area - one popup
// 2. Create API endpoint for GlobalArea (post)
// 1. Create API endpoint for GlobalArea (patch)
// 3. Create API endpoint for GlobalArea (delete)
// 4. Change Mapeditor module to a form

// 20241023 Next actions
// 1. Add opacity to the fill style
// 2. Clean up the map editor module
// 3. Change map editor to popup + list of global areas
// 4. Add global objects functionality

// 20241217 Solution to editor module not showing the other icons
// Grey out normal map in the back with the edior only rendering the current object (Two canvas elements)
// Would reduce rerendering stress
