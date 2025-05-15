"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Map } from "@prisma/client";

import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "../ui/card";

type MapFormData = z.infer<typeof mapSchema>;

interface Props {
  map?: Map;
}

export default function MapForm({ map }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<MapFormData>({
    resolver: zodResolver(mapSchema),
  });

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
      router.push("/maps");
      router.refresh();
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }

  // const images = form.watch("images");
  // const isFeatured = form.watch('isFeatured');
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
              <SimpleMDE placeholder="Description" {...field} />
            )}
          />
          <h3>Images</h3>
          <div className="flex gap-8 mb-8">
            <div className="upload-field">
              {/* isFeatured */}
              <h4>Map Image</h4>
              <Card>
                <CardContent className="space-y-2 mt-2">
                  {mapImg && (
                    <Image
                      src={mapImg}
                      alt="map image"
                      className="object-cover object-center"
                      width={400}
                      height={400}
                    />
                  )}

                  {!mapImg && (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("mapUrl", res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error("Image upload failed", {
                          className: "error",
                          description: `ERROR! ${error.message}`,
                        });
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="flex-col">
              <FormField
                control={form.control}
                name="imageUrl"
                defaultValue={map?.imageUrl}
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="This will turn into an upload field eventually"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
            defaultValue={map?.category || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder=""
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* tags array add form field  here */}
          <FormField
            control={form.control}
            name="featured"
            defaultValue={map?.featured}
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
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
          {map?.id && (
            <>
              <Link href={`/maps/${map.id}/edit/areas`}>
                <Button variant={"secondary"}>Edit Areas</Button>
              </Link>
              <Link href={`/maps/${map.id}/edit/objects`}>
                <Button variant={"secondary"}>Edit Objects</Button>
              </Link>
            </>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {map ? "Update Map" : "Submit Map"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
