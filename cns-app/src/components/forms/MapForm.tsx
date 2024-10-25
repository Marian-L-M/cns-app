"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { mapSchema } from "@/ValidationSchemas/maps";
import { zodResolver } from "@hookform/resolvers/zod";
import { Map } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

type MapFormData = z.infer<typeof mapSchema>;

interface Props {
  map?: Map;
}

const MapForm = ({ map }: Props) => {
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
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="mapUrl"
                defaultValue={map?.mapUrl}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Map</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="This will turn into an upload field eventually"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Image
                src="/maps/sample-map.jpg"
                width={300}
                height={300}
                alt="Thumbnail"
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
              <Image
                src="/maps/sample-map.jpg"
                width={300}
                height={300}
                alt="Thumbnail"
              />
            </div>
          </div>
          <h3>Map Location & Reference</h3>
          <Image
            src="/maps/sample-world-map.png"
            width={1000}
            height={1000}
            className="w-6/12 bg-white mx-auto"
            alt="Reference World Map"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="x"
              defaultValue={map?.x}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Global X (Top Left)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0-1000"
                      {...field}
                      max={1000}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="y"
              defaultValue={map?.y}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Global Y (Top Left)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0-1000"
                      {...field}
                      max={1000}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wx"
              defaultValue={map?.wx}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Width (Bottom Right)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0-1000"
                      {...field}
                      max={1000}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wy"
              defaultValue={map?.wy}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Height (Bottom Right)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0-1000"
                      {...field}
                      max={1000}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mapScale"
              defaultValue={map?.mapScale}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Zoom Scale</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0-10"
                      {...field}
                      max={10}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
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
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {map ? "Update Map" : "Submit Map"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MapForm;
