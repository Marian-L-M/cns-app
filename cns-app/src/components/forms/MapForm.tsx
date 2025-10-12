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
import { Map, UserMap } from "@prisma/client";

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
import { mapSchema } from "@/ValidationSchemas/maps";

import "easymde/dist/easymde.min.css";
import MediaLibrary from "../ui/media-library/MediaLibrary";
import { Card, CardContent } from "../ui/card";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type MapFormData = z.infer<typeof mapSchema>;

type MapWithUserMaps = Map & {
  userMaps?: (UserMap & {
    user: {
      id: string;
      name: string;
      role: string;
    };
  })[];
};

interface Props {
  map?: MapWithUserMaps;
}

export default function MapForm({ map }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<MapFormData>({
    resolver: zodResolver(mapSchema),
    defaultValues: {
      title: map?.title || "",
      description: map?.description || "",
      mapUrl: map?.mapUrl || "",
      mapWidth: map?.mapWidth || 1000,
      mapHeight: map?.mapHeight || 1000,
      canvasAspectRatio: map?.canvasAspectRatio || 1,
      imageUrl: map?.imageUrl || "",
      mapTime: map?.mapTime || 1000,
      category: map?.category || "",
      tags: map?.tags || [],
      featured: map?.featured || false,
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
        router.push(`/editor/maps/${map.id}`);
        router.refresh();
        toast.success("Map updated succesfully");
      } else {
        const response = await axios.post(`/api/maps`, values);
        const newMap = response.data;
        router.push(`/editor/maps/${newMap.id}`);
        router.refresh();
        toast.success("Map created succesfully");
      }
      setIsSubmitting(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
      toast.error("Map update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
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
            {mapImg && (
              <Card>
                <CardContent className=" flex flex-col p-4">
                  <h4 className="text-sm font-semibold mb-1">Map Image</h4>
                  <Image
                    src={mapImg}
                    alt={"mapUrl"}
                    className="object-cover object-center"
                    width={240}
                    height={240}
                  />
                  <Button
                    className="p-0"
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => form.setValue("mapUrl", "")}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            )}
            {thumbImg && (
              <Card>
                <CardContent className=" flex flex-col p-4">
                  <h4 className="text-sm font-semibold mb-1">
                    Thumbnail Image
                  </h4>
                  <Image
                    src={thumbImg}
                    alt={"thumbUrl"}
                    className="object-cover object-center"
                    width={240}
                    height={240}
                  />
                  <Button
                    className="p-0"
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => form.setValue("imageUrl", "")}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          <MediaLibrary
            form={form}
            imageFieldName="mapUrl"
            thumbnailFieldName="imageUrl"
          />
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
          {map && (
            <section className="rounded-md border w-full p-4 flex flex-col gap-4">
              <h5 className="font-bold">Collaborators</h5>
              <div className="space-y-2">
                {map.userMaps?.map((userMap) => (
                  <div
                    key={userMap.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <span className="font-medium">{userMap.user.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({userMap.role})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {map ? "Update Map" : "Submit Map"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
