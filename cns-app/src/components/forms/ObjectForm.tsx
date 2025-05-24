"use client";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import IconPicker from "@/components/ui/icon-picker/IconPicker";
import { Button } from "@/components/ui/button";
import { fetchWikiName } from "@/lib/fetchWikiData";
import { GlobalObject } from "@prisma/client";
import { EditorContext } from "@/store/mapEditorContext";
import { GlobalObjectsSchema } from "@/ValidationSchemas/global";

import "easymde/dist/easymde.min.css";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface Props {
  map: MapType;
  globalObject?: GlobalObject;
  editorMode?: string;
}

export default function GlobalObjectForm({
  map,
  globalObject,
  editorMode,
}: Props) {
  const editorCtx = useContext(EditorContext);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [selectedWikiId, setSelectedWikiId] = useState<number | undefined>(
    globalObject?.wikiId
  );
  const [wikiName, setWikiName] = useState<string>("");

  type GlobalObjectFormData = z.infer<typeof GlobalObjectsSchema> & {
    globalObject: GlobalObject;
  };

  const form = useForm<GlobalObjectFormData>({
    resolver: zodResolver(GlobalObjectsSchema),
    defaultValues: {
      title: globalObject?.title || "",
      description: globalObject?.description || "",
      imageUrl: globalObject?.imageUrl || "",
      thumbUrl: globalObject?.thumbUrl || "",
      mapId: globalObject?.mapId,
      wikiId: globalObject?.wikiId || 0,
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

  // Fetch wiki name when wikiId changes
  useEffect(() => {
    // Update Wiki Name
    fetchWikiName({ selectedWikiId, setWikiName });

    // Update form
    if (selectedWikiId) {
      form.setValue("wikiId", selectedWikiId);
    }
  }, [selectedWikiId]);

  async function onSubmit(values: GlobalObjectFormData) {
    const submissionValues = {
      ...values,
      mapId: map.id,
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
      router.push(`editor/maps/${map.id}?modal=objects`);
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
            <h5 className="">Description</h5>
            <Controller
              name="description"
              defaultValue={globalObject?.description}
              control={form.control}
              render={({ field }) => (
                <SimpleMdeEditor placeholder="Object description" {...field} />
              )}
            />
          </div>
          <div className="w-full" id="wiki-container">
            <FormField
              control={form.control}
              name="wikiId"
              defaultValue={globalObject?.wikiId}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wiki</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-2">
                      <div className="w-2/3">
                        <Input type="hidden" placeholder="WikiId" {...field} />
                        {wikiName && (
                          <div className="p-2 border rounded-md h-10 flex items-center">
                            <p className="truncate text-sm">{wikiName}</p>
                          </div>
                        )}
                      </div>
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
            <h5 className="">Map Icon</h5>
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
