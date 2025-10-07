"use client";

import { MediaItemSchema } from "@/ValidationSchemas/media";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MediaItem } from "@prisma/client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { UploadMediaItem } from "../ui/uploader";

type MediaFormData = z.infer<typeof MediaItemSchema>;

interface Props {
  userId: string;
  mediaItem?: MediaItem;
}
export default function MediaUploadForm({ mediaItem, userId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  //   const router = useRouter();

  // Set form data
  const form = useForm<MediaFormData>({
    resolver: zodResolver(MediaItemSchema),
    defaultValues: {
      filename: mediaItem?.filename || "",
      originalName: mediaItem?.originalName || "",
      fileKey: mediaItem?.fileKey || "",

      mimeType: mediaItem?.mimeType || "",
      fileSize: mediaItem?.fileSize || 0,
      width: mediaItem?.width || undefined,
      height: mediaItem?.height || undefined,

      provider: mediaItem?.provider || "",
      url: mediaItem?.url || "",
      thumbnailUrl: mediaItem?.thumbnailUrl || "",

      title: mediaItem?.title || "",
      alt: mediaItem?.alt || "",
      caption: mediaItem?.caption || "",
      tags: mediaItem?.tags || [],
    },
  });

  const originalImg = form.watch("url");
  const thumbImg = form.watch("thumbnailUrl");

  // Submission logic
  async function onSubmit(values: MediaFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      console.log("Submitting data:", values);
      if (mediaItem) {
        await axios.patch(`/api/media/${mediaItem.id}`, values);
        router.push(`/editor/media/${mediaItem.id}`);
        router.refresh();
        toast.success("Media item updated succesfully");
      } else {
        const response = await axios.post("/api/media", values);
        const newMedia = response.data;
        router.push(`/editor/media/${newMedia.id}`);
        router.refresh();
        toast.success("Media item created succesfully");
      }
      setIsSubmitting(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
      toast.error("Area update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
    }
  }

  return (
    <div className="flex flex-col gap-8 col-span-2">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative z-20 col-span-2 flex flex-col gap-4 text-black"
          >
            <div className="w-full flex flex-col gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="filename"
                  defaultValue={mediaItem?.filename || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filename</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="Filename" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="originalName"
                  defaultValue={mediaItem?.originalName || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Name</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input
                          placeholder="Original Name"
                          {...field}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="fileKey"
                  defaultValue={mediaItem?.fileKey || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Key</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="filekey" {...field} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="mimeType"
                  defaultValue={mediaItem?.mimeType || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mime Type</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="mimeType" {...field} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="fileSize"
                  defaultValue={mediaItem?.fileSize || 0}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Size</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="File Size"
                          {...field}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="width"
                  defaultValue={mediaItem?.width || 0}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input type="number" placeholder="Width" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="height"
                  defaultValue={mediaItem?.height || 0}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input type="number" placeholder="Height" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="provider"
                  defaultValue={mediaItem?.provider}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormMessage />
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={mediaItem?.provider} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="uploadthing">
                            Uploadthing
                          </SelectItem>
                          {/* <SelectItem value="bunny">Bunny</SelectItem>
                          <SelectItem value="aws">AWS</SelectItem>
                          <SelectItem value="other">Other</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <div className="upload-field">
                  <h4>Image</h4>
                  <UploadMediaItem
                    image={originalImg || ""}
                    form={form}
                    fieldName="url"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="url"
                  defaultValue={mediaItem?.url || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Url</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="url" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  defaultValue={mediaItem?.thumbnailUrl || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Url</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="thumbnailUrl" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="title"
                  defaultValue={mediaItem?.title || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="alt"
                  defaultValue={mediaItem?.alt || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="alt" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="caption"
                  defaultValue={mediaItem?.caption || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="caption" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="tags"
                  defaultValue={mediaItem?.tags || []}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div>
                          {(field.value || []).map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 mb-2"
                            >
                              <Input
                                value={tag}
                                onChange={(e) => {
                                  const newTags = [...(field.value || [])];
                                  newTags[index] = e.target.value;
                                  field.onChange(newTags);
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newTags = [...(field.value || [])];
                                  newTags.splice(index, 1);
                                  field.onChange(newTags);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              field.onChange([...(field.value || []), ""]);
                            }}
                          >
                            Add Tag
                          </Button>
                        </div>
                      </FormControl>
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
    </div>
  );
}
