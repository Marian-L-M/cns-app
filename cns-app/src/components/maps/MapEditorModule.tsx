"use client";
import { useMapEditor } from "@/hooks/useMapEditor";
import { Button } from "../ui/button";
import ColorPicker from "../ui/colorPicker/ColorPicker";
import { Menu, Palette } from "lucide-react";
import Image from "next/image";

import { useContext, useEffect, useState } from "react";
import { EditorContext } from "@/store/mapEditorContext";
import { set, z } from "zod";
import { GlobalArea, GlobalObject } from "@prisma/client";
import axios from "axios";
import { GlobalAreasSchema } from "@/ValidationSchemas/global";
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

interface Props {
  mapId: number;
  globalArea?: GlobalArea;
  globalObject?: GlobalObject;
}

export type GlobalAreaFormData = z.infer<typeof GlobalAreasSchema> & {
  globalArea: GlobalArea;
};

interface areaNode {
  id: number;
  x: number;
  y: number;
}

// 241026 To do
// mapId (id) and global Area are live
// Connect to drawing functions - Form is populated but canvas is not drawn
// For future use consider using API instead of drilling down the data

function MapEditorModule({ mapId, globalArea }: Props) {
  const { canvasRef, styles } = useMapEditor(globalArea?.nodes);
  const editorCtx = useContext(EditorContext);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // To do - make this dynamic
  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  styles.fillStyle = editorCtx.objectColor;
  styles.lineWidth = editorCtx.objectLineWidth;
  styles.strokeStyle = editorCtx.objectLineColor;
  const nodeList = editorCtx.nodeList;

  const area = globalArea;

  // Set form data
  // console.log("nodes:", globalArea?.nodes);
  const form = useForm<GlobalAreaFormData>({
    resolver: zodResolver(GlobalAreasSchema),
    defaultValues: {
      title: area?.title || "",
      description: area?.description || "",
      imageUrl: area?.imageUrl || "",
      mapId: mapId,
      wikiId: area?.wikiId || 2, // temporary fixed wiki id
      type: (area?.type as "GEOGRAPHY" | "POLITICAL" | "OTHER") || "GEOGRAPHY",
      infobox: null,
      nodes: nodeList,
      styles: {
        fillStyle: styles.fillStyle || "rgba(0, 0, 0, 0.5)",
        lineWidth: typeof styles.lineWidth === "number" ? styles.lineWidth : 5,
        strokeStyle: styles.strokeStyle || "black",
      },
      objectTime: area?.objectTime || 1000,
    },
  });

  // Keep form values synchronized with context
  useEffect(() => {
    form.setValue("nodes", editorCtx.nodeList);
    form.setValue("styles", {
      fillStyle: styles.fillStyle || "rgba(0, 0, 0, 0.5)",
      lineWidth: typeof styles.lineWidth === "number" ? styles.lineWidth : 5,
      strokeStyle: styles.strokeStyle || "black",
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
        fillStyle: styles.fillStyle || "rgba(0, 0, 0, 0.5)",
        lineWidth: typeof styles.lineWidth === "number" ? styles.lineWidth : 5,
        strokeStyle: styles.strokeStyle || "black",
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
      router.push(`/maps/${mapId}`);
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
            // {...props}
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
                  defaultValue={area?.title}
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
                  defaultValue={area?.description}
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
                  defaultValue={area?.imageUrl}
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
                  defaultValue={area?.objectTime}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Timestamp</FormLabel>
                      <FormControl>
                        <Input placeholder="Area Timestamp" {...field} />
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
            {/* <Button onClick={onSubmitHandler}>Submit</Button> */}
            <Button
              type="button"
              onClick={() => {
                console.log("NodeList from context:", editorCtx.nodeList);
                console.log("Form nodes value:", form.getValues("nodes"));
              }}
            >
              NodeList check
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Test Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default MapEditorModule;
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
