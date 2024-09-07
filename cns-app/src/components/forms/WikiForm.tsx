"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { z } from "zod";
import {
  barItemSchema,
  infoBoxItemSchema,
  wikiSchema,
} from "@/ValidationSchemas/wiki";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wiki } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button } from "../ui/button";
import WikiInfoboxFormField from "./WikiInfoboxForm";

type bar = z.infer<typeof barItemSchema>;
type InfoboxItem = z.infer<typeof infoBoxItemSchema>;
export type WikiFormData = z.infer<typeof wikiSchema> & {
  infobox: InfoboxItem[];
};

interface Props {
  wiki?: Wiki;
}

const WikiForm = ({ wiki }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const parseInfobox = (data: unknown): InfoboxItem[] => {
    if (Array.isArray(data)) {
      return data.map((item) => ({
        id: item.id || "",
        type: item.type as "image" | "collection" | "text",
        title: item.title || "",
        url: item.url,
        caption: item.caption,
        content: item.content,
        bars: Array.isArray(item.bars)
          ? item.bars.map((bar: bar) => ({
              id: bar.id || "",
              key: bar.key || "",
              value: bar.value || "",
            }))
          : undefined,
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
    },
  });

  async function onSubmit(values: WikiFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      if (wiki) {
        await axios.patch(`/api/wiki/${wiki.id}`, values);
      } else {
        await axios.post(`/api/wiki`, values);
      }
      setIsSubmitting(false);
      router.push("/wiki");
      router.refresh();
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-20 w-5/6 max-w-screen-xl mt-10">
      <h1 className="text-3xl">Add new Wiki entry</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 grid-cols-8">
            <div className="content-col col-span-5">
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
              <FormField
                control={form.control}
                name="description"
                defaultValue={wiki?.description}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Wiki description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div
              className="col-span-3 flex flex-col  gap-4 p-4 pb-20 bg-slate-100"
              id="info-box"
            >
              <FormField
                control={form.control}
                name="infobox"
                render={() => (
                  <FormItem>
                    <FormLabel>Infobox</FormLabel>
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
          <div className="flex flex-col gap-4 mb-12" id="main-content">
            <h4 className="font-bold">Wiki Body</h4>
            <Controller
              name="wikiText"
              defaultValue={wiki?.wikiText}
              control={form.control}
              render={({ field }) => (
                <SimpleMDE placeholder="Wiki Text" {...field} />
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {wiki ? "Update Wiki" : "Submit Wiki"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WikiForm;
