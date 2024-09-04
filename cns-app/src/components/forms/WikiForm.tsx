"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { z } from "zod";
import { wikiSchema } from "@/ValidationSchemas/wiki";
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

export type WikiFormData = z.infer<typeof wikiSchema>;

interface Props {
  wiki?: Wiki;
}

const WikiForm = ({ wiki }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<WikiFormData>({
    resolver: zodResolver(wikiSchema),
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
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
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
        </form>
      </Form>
    </div>
  );
};

export default WikiForm;
