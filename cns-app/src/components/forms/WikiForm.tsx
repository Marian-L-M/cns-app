"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Wiki } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  barItemSchema,
  infoBoxItemSchema,
  wikiSchema,
} from "@/ValidationSchemas/wiki";

import WikiInfoboxFormField from "./WikiInfoboxForm";

import "easymde/dist/easymde.min.css";
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

  const form = useForm<WikiFormData>({
    resolver: zodResolver(wikiSchema),
    defaultValues: {
      title: wiki?.title || "",
      description: wiki?.description || "",
      wikiText: wiki?.wikiText || "",
      infobox: parseInfobox(wiki?.infobox),
      thumbUrl: wiki?.thumbUrl || "",
      category: wiki?.category || "",
      tags: wiki?.tags || [],
      featured: wiki?.featured || false,
      authors: wiki?.authors?.wiki((author) => author.id) || [user.id],
    },
  });

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
          <div className="flex flex-wrap gap-y-8 justify-between">
            <div className="w-full" id="form-top">
              <div className="w-9/12 pr-8" id="title-container">
                <FormField
                  control={form.control}
                  name="title"
                  defaultValue={wiki?.title}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Wiki Title..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-9/12 pr-8" id="left-col">
              <div className="flex flex-col gap-4" id="content-col">
                <div className="markdown-group">
                  <h4 className="font-bold">Description</h4>
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
                <h4 className="font-bold">Wiki Body</h4>
                <Controller
                  name="wikiText"
                  defaultValue={wiki?.wikiText}
                  control={form.control}
                  render={({ field }) => (
                    <SimpleMdeEditor placeholder="Wiki Text" {...field} />
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {wiki ? "Update Wiki" : "Submit Wiki"}
                </Button>
              </div>
            </div>
            <div className="w-3/12 flex flex-col " id="info-box">
              <h4 className="font-bold">Infobox</h4>
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
