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
import { Map, User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/uploadthing/utils";
import { mapSchema } from "@/ValidationSchemas/maps";

import "easymde/dist/easymde.min.css";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type MapFormData = z.infer<typeof mapSchema>;

type MapWithAuthors = Map & {
  authors: User[];
};

interface Props {
  map?: MapWithAuthors;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function MapForm({ map, user }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<MapFormData>({
    resolver: zodResolver(mapSchema),
    defaultValues: {
      title: map?.title || "",
      description: map?.description || "",
      mapUrl: map?.mapUrl || "",
      imageUrl: map?.imageUrl || "",
      mapTime: map?.mapTime || 1000,
      category: map?.category || "",
      tags: map?.tags || [],
      featured: map?.featured || false,
      authors: map?.authors?.map((author) => author.id) || [user.id],
    },
  });

  // const session = await auth();
  // console.log(session);

  async function onSubmit(values: z.infer<typeof mapSchema>) {
    try {
      setIsSubmitting(true);
      setError("");
      if (map) {
        await axios.patch(`/api/maps/${map.id}`, values);
      } else {
        await axios.post(`/api/maps`, values);
      }
      setIsSubmitting(false);
      router.push("/editor/maps");
      router.refresh();
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }

  const thumbImg = form.watch("imageUrl");
  const mapImg = form.watch("mapUrl");

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
            defaultValue={map?.title}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Map Title..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Controller
            name="description"
            defaultValue={map?.description}
            control={form.control}
            render={({ field }) => (
              <SimpleMdeEditor placeholder="Description" {...field} />
            )}
          />
          <h3>Images</h3>
          <div className="flex gap-8 mb-8">
            <div className="upload-field">
              <h4>Map Image</h4>
              <Card>
                <CardContent className="space-y-2 mt-2">
                  {mapImg && (
                    <Image
                      src={mapImg}
                      alt="map image"
                      className="object-cover object-center"
                      width={240}
                      height={240}
                    />
                  )}

                  {!mapImg && (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("mapUrl", res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error("Map image upload failed", {
                          className: "error",
                          description: `ERROR! ${error.message}`,
                        });
                      }}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="mapUrl"
                    defaultValue={map?.mapUrl}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Base Map" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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
                      onClientUploadComplete={(res: { url: string }[]) => {
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
          </div>
          <FormField
            control={form.control}
            name="mapTime"
            defaultValue={map?.mapTime}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Map Global Time</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0-9999"
                    {...field}
                    max={9999}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            defaultValue={map?.category}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Tags array field */}
          <FormField
            control={form.control}
            name="tags"
            defaultValue={map?.tags || []}
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
          <FormField
            control={form.control}
            name="featured"
            defaultValue={map?.featured}
            render={({ field }) => (
              <FormItem>
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
          {/* Authors array field -- To do: Replace with search input */}
          {user.role == "ADMIN" && (
            <FormField
              control={form.control}
              name="authors"
              defaultValue={
                map?.authors
                  ? map?.authors?.map((author) => author.id)
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
                              const newAuthors = [...(field.value || [])];
                              newAuthors[index] = e.target.value;
                              field.onChange(newAuthors);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newAuthors = [...(field.value || [])];
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
          <Button type="submit" disabled={isSubmitting}>
            {map ? "Update Map" : "Submit Map"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
