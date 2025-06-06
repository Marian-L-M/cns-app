"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Wiki } from "@prisma/client";
import { WikiType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing/utils";
import {
  barItemSchema,
  infoBoxItemSchema,
  wikiSchema,
} from "@/ValidationSchemas/wiki";

import WikiInfoboxFormField from "./WikiInfoboxForm";

import "easymde/dist/easymde.min.css";
import { Checkbox } from "../ui/checkbox";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

// 250603 To do: Submission issue (Probably because of new properties added to validation -> add them in the form)

type bar = z.infer<typeof barItemSchema>;
type InfoboxItem = z.infer<typeof infoBoxItemSchema>;
export type WikiFormData = z.infer<typeof wikiSchema> & {
  infobox: InfoboxItem[];
};

interface Props {
  wiki?: Wiki;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function WikiForm({ wiki, user }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const parseInfobox = (data: unknown): InfoboxItem[] => {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse infobox data:", e);
        return [];
      }
    }

    if (Array.isArray(data)) {
      return data.map((item) => ({
        id: item.id || "",
        type: item.type as "image" | "collection" | "text",
        title: item.title || "",
        url: item.url || "",
        caption: item.caption || "",
        content: item.content || "",
        bars: Array.isArray(item.bars)
          ? item.bars.map((bar: bar) => ({
              id: bar.id || "",
              key: bar.key || "",
              value: bar.value || "",
            }))
          : [],
      }));
    }
    return [];
  };

  // Form handling
  const form = useForm<WikiFormData>({
    resolver: zodResolver(wikiSchema),
    defaultValues: {
      title: wiki?.title || "",
      description: wiki?.description || "",
      wikiText: wiki?.wikiText || "",
      infobox: parseInfobox(wiki?.infobox),
      thumbUrl: wiki?.thumbUrl || "",
      category: wiki?.category || "",
      type: wiki?.type || "GENERAL",
      tags: wiki?.tags || [],
      featured: wiki?.featured || false,
      authors: wiki?.authors?.wiki((author) => author.id) || [user.id],
    },
  });

  const errors = form.formState.errors;
  const thumbImg = form.watch("thumbUrl");

  // 250604 => Next action: Autho fields, featured field still missing + API not set up + authentication
  // Submission logic
  async function onSubmit(values: WikiFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      if (wiki) {
        await axios.patch(`/api/wiki/${wiki.id}`, values);
        router.push(`/wiki/${wiki?.id}`);
        router.refresh();
      } else {
        const response = await axios.post(`/api/wiki`, values);
        const newWiki = response.data;
        router.push(`/wiki/${newWiki.id}`);
        router.refresh();
      }
      setIsSubmitting(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-20 w-full">
      <h1 className="text-3xl">
        {wiki ? "Update Wiki entry" : "Add new Wiki entry"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-y-8 justify-between ">
            {/* Form Upper */}
            <div className="w-full" id="form-top">
              <div className="w-9/12 pr-8" id="title-container">
                <FormField
                  control={form.control}
                  name="title"
                  defaultValue={wiki?.title}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormDescription>
                        Display title of your Wiki
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Wiki Title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Form lower - left column */}
            <div className="w-9/12 pr-8" id="left-col">
              <div className="flex flex-col gap-4" id="content-col">
                <div className="flex w-full gap-4">
                  <div className="w-9/12" id="type-container">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wiki Type</FormLabel>
                          <FormDescription>
                            Type of Wiki (System side)
                          </FormDescription>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select wiki type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(WikiType).map((wikiType) => (
                                <SelectItem key={wikiType} value={wikiType}>
                                  {wikiType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-3/12" id="featured-container">
                    <FormField
                      control={form.control}
                      name="featured"
                      defaultValue={wiki?.featured}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end h-full pb-4">
                          <FormLabel>Featured</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="featured"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <label
                                htmlFor="featured"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Is featured?
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="w-9/12 pr-8" id="category-container">
                  <FormField
                    control={form.control}
                    name="category"
                    defaultValue={wiki?.category || ""}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {/* 250605 To do: Create tags component */}
                <div className="w-9/12 pr-8" id="tags-container">
                  <FormField
                    control={form.control}
                    name="tags"
                    defaultValue={wiki?.tags || []}
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
                <div className="w-9/12 pr-8" id="thumbnail-container">
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
                          onClientUploadComplete={(res: { url: string }[]) => {
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
                        defaultValue={wiki?.thumbUrl}
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
                <div className="markdown-group">
                  <h4 className="font-bold">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    Wiki article introduction section
                  </p>
                  <Controller
                    name="description"
                    defaultValue={wiki?.description}
                    control={form.control}
                    render={({ field }) => (
                      <SimpleMdeEditor
                        placeholder="Wiki Description"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 mb-12" id="main-content">
                <div className="markdown-group">
                  <h4 className="font-bold">Wiki Body</h4>
                  <p className="text-sm text-muted-foreground">
                    Wiki article main text
                  </p>
                  <Controller
                    name="wikiText"
                    defaultValue={wiki?.wikiText}
                    control={form.control}
                    render={({ field }) => (
                      <SimpleMdeEditor placeholder="Wiki Text" {...field} />
                    )}
                  />
                </div>
                <div className="authors">
                  <h4 className="font-bold">Wiki Body</h4>
                  {/* Authors array field -- To do: Replace with search input */}
                  {user.role == "ADMIN" && (
                    <FormField
                      control={form.control}
                      name="authors"
                      defaultValue={
                        wiki?.authors
                          ? wiki?.authors?.map((author) => author.id)
                          : [user.id]
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <div>
                              {(field.value || []).map((author, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 mb-2"
                                >
                                  <Input
                                    value={author}
                                    onChange={(e) => {
                                      const newAuthors = [
                                        ...(field.value || []),
                                      ];
                                      newAuthors[index] = e.target.value;
                                      field.onChange(newAuthors);
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newAuthors = [
                                        ...(field.value || []),
                                      ];
                                      newAuthors.splice(index, 1);
                                      field.onChange(newAuthors);
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
                                Add Author
                              </Button>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {wiki ? "Update Wiki" : "Submit Wiki"}
                </Button>
              </div>
            </div>
            {/* 250605: Split infobox into separate component */}
            <div className="w-3/12 flex flex-col " id="info-box">
              <h4 className="font-bold">Infobox</h4>
              <p className="text-sm text-muted-foreground">Article infobox</p>
              <div className="p-4 pb-20 bg-slate-100" id="form-wrapper">
                <FormField
                  control={form.control}
                  name="infobox"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <WikiInfoboxFormField
                          control={form.control}
                          register={form.register}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
