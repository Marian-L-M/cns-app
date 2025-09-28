"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Wiki, WikiInfoboxItem } from "@prisma/client";
import { WikiType } from "@prisma/client";

import { Button } from "@/components/ui/button";
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
import { wikiSchema } from "@/ValidationSchemas/wiki";

import "easymde/dist/easymde.min.css";
import { Checkbox } from "../ui/checkbox";
import InfoboxItemForm from "./InfoboxItemForm";
import InfoboxEditListModule from "../displays/InfoboxEditListModule";

import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import { UploadComponent } from "../ui/uploader";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

// 250603 To do: Submission issue (Probably because of new properties added to validation -> add them in the form)
export type WikiFormData = z.infer<typeof wikiSchema>;

interface Props {
  wiki?: Wiki & {
    userWikis: Array<{
      id: string;
      userId: string;
      role: string;
      user: { id: string; name: string; email: string };
    }>;
  };
  infobox?: WikiInfoboxItem[];
}

export default function WikiForm({ wiki, infobox }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInfoboxItem, setCurrentInfoboxItem] = useState<
    WikiInfoboxItem | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const showInfoboxForm = (infoboxItem?: WikiInfoboxItem) => {
    setCurrentInfoboxItem(infoboxItem);
    setIsDialogOpen(true);
  };

  // Form handling
  const form = useForm<WikiFormData>({
    resolver: zodResolver(wikiSchema),
    defaultValues: {
      title: wiki?.title || "",
      description: wiki?.description || "",
      wikiText: wiki?.wikiText || "",
      thumbUrl: wiki?.thumbUrl || "",
      category: wiki?.category || "",
      type: wiki?.type || "GENERAL",
      tags: wiki?.tags || [],
      featured: wiki?.featured || false,
    },
  });

  const thumbImg = form.watch("thumbUrl");

  // 250604 => Next action: Autho fields, featured field still missing + API not set up + authentication
  // Submission logic
  async function onSubmit(values: WikiFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      if (wiki) {
        await axios.patch(`/api/wiki/${wiki.id}`, values);
        router.push(`/editor/wikis/${wiki?.id}`);
        router.refresh();
        toast.success("Wiki updated succesfully");
      } else {
        const response = await axios.post(`/api/wiki`, values);
        const newWiki = response.data;
        router.push(`/editor/wikis/${newWiki.id}`);
        router.refresh();
        toast.success("Wiki created succesfully");
      }
      setIsSubmitting(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
      toast.error("Wiki update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
    }
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-3xl">
          {wiki ? "Update Wiki entry" : "Add new Wiki entry"}
        </h1>
        {wiki && (
          <Button variant={"outline"} asChild>
            <Link href={`/wiki/${wiki.id}`}>View article</Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-wrap gap-y-8 justify-between ">
                {/* Form Upper */}
                <div className="w-full" id="form-top">
                  <div className="w-full" id="title-container">
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
                <div className="w-full" id="left-col">
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
                    <div className="w-full" id="category-container">
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
                    <div className="w-full" id="tags-container">
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
                                        const newTags = [
                                          ...(field.value || []),
                                        ];
                                        newTags[index] = e.target.value;
                                        field.onChange(newTags);
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        const newTags = [
                                          ...(field.value || []),
                                        ];
                                        newTags.splice(index, 1);
                                        field.onChange(newTags);
                                      }}
                                    >
                                      <Trash />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    field.onChange([
                                      ...(field.value || []),
                                      "",
                                    ]);
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
                    <div className="w-full" id="thumbnail-container">
                      <h4>Thumbnail Image</h4>
                      <UploadComponent
                        image={thumbImg || ""}
                        form={form}
                        fieldName="thumbUrl"
                      />
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
                    <Button type="submit" disabled={isSubmitting}>
                      {wiki ? "Update Wiki" : "Submit Wiki"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
        {/* Infobox */}
        <div className="col-span-3 flex flex-col gap-8">
          {wiki ? (
            <div className="w-full flex flex-col gap-4">
              <h4 className="text-lg font-bold">Infobox</h4>
              <Button
                className="self-end"
                variant="default"
                onClick={() => showInfoboxForm()}
              >
                <Plus />
              </Button>
              <InfoboxEditListModule
                infobox={infobox}
                dialogOpen={isDialogOpen}
                setDialogOpen={setIsDialogOpen}
                wikiId={wiki.id}
                showInfoboxForm={showInfoboxForm}
              />
              <InfoboxItemForm
                infoboxItem={currentInfoboxItem}
                dialogOpen={isDialogOpen}
                setDialogOpen={setIsDialogOpen}
                wikiId={wiki.id}
              />
            </div>
          ) : (
            <p>Save wiki to add infobox</p>
          )}
          {wiki && (
            <div className="rounded-md w-full flex flex-col gap-4">
              <h5 className="font-bold">Collaborators</h5>
              <div className="space-y-2">
                {wiki.userWikis?.map((userWiki) => (
                  <div
                    key={userWiki.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <span className="font-medium">{userWiki.user.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({userWiki.role})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
