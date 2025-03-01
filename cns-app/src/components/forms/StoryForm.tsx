"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { storiesSchema } from "@/ValidationSchemas/stories";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Entry, Story } from "@prisma/client";
import Link from "next/link";
import prisma from "../../../prisma/db";
import MapSearchDialog from "../ui/dialog/mapSearchDialog";
// Rendering issue with Simplemde, need to fix
// Needs to be created dynamically

type StoryFormData = z.infer<typeof storiesSchema>;

interface Props {
  story?: Entry;
  substories?: Story[];
}

interface MapFetchProps {
  selectedMapId: number | undefined;
  setMapName: React.Dispatch<React.SetStateAction<string>>;
}

const StoryForm = ({ story, substories }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [selectedMapId, setSelectedMapId] = useState<number | undefined>(
    story?.assignedToMapID ?? undefined
  );
  const [mapName, setMapName] = useState<string>("");

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storiesSchema),
  });

  // Fetch wiki name when wikiId changes
  useEffect(() => {
    // Update Wiki Name
    fetchMapName({ selectedMapId, setMapName });

    // Update form
    if (selectedMapId) {
      form.setValue("assignedToMapID", selectedMapId);
    }
  }, [selectedMapId]);

  async function onSubmit(values: z.infer<typeof storiesSchema>) {
    try {
      setIsSubmitting(true);
      setError("");
      if (story) {
        await axios.patch(`/api/entry/${story.id}`, values);
      } else {
        await axios.post("/api/entry", values);
      }
      setIsSubmitting(false);
      router.push("/stories");
      router.refresh();
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <section className="rounded-md border w-full p-4 flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="title"
              defaultValue={story?.title}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Story Title..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Controller
              name="description"
              defaultValue={story?.description}
              control={form.control}
              render={({ field }) => (
                <SimpleMDE placeholder="Description" {...field} />
              )}
            />
            <div className="flex w-full space-x-4">
              <FormField
                control={form.control}
                name="status"
                defaultValue={story?.status}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Status..."
                            defaultValue={story?.status}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UPCOMING">Upcoming</SelectItem>
                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                defaultValue={story?.rating}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={(field.value ?? 1).toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Rating..."
                            defaultValue={story?.rating}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storyTime"
                defaultValue={story?.storyTime}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Time</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0000 - 9999"
                        {...field}
                        max={9999}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              defaultValue={story?.imageUrl}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="This will turn into an upload field eventually"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              defaultValue={story?.category}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="This will turn into a dynamic cat dropdown later"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-1/3" id="map-container">
              <FormField
                control={form.control}
                name="assignedToMapID"
                defaultValue={story?.assignedToMapID ?? undefined}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map</FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        <div className="w-2/3">
                          <Input type="hidden" placeholder="MapId" {...field} />
                          {mapName && (
                            <div className="p-2 border rounded-md h-10 flex items-center">
                              <p className="truncate text-sm">{mapName}</p>
                            </div>
                          )}
                        </div>
                        <div className="w-1/3">
                          <MapSearchDialog
                            setSelectedMapId={setSelectedMapId}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {story ? "Update Story" : "Submit Story"}
            </Button>
          </form>
        </Form>
      </section>
      {story && (
        <section
          className="rounded-md border w-full p-4 flex flex-col gap-4"
          id="substories"
        >
          <h5 className="font-bold">Substories</h5>
          {substories && (
            <ol>
              {substories.map((subStory) => (
                <li key={`substory-${subStory.id}`} className="flex gap-2">
                  {subStory.title}
                  <Link
                    href={`/stories/${story.id}/substories/${subStory.id}/edit`}
                  >
                    <Button variant={"secondary"}>edit</Button>
                  </Link>
                </li>
              ))}
            </ol>
          )}
          <div id="link-container" className="flex gap-2">
            <Link href={`/stories/${story.id}/substories/`}>
              <Button variant={"secondary"}>Overview</Button>
            </Link>
            <Link href={`/stories/${story.id}/substories/add`}>
              <Button variant={"default"}>Add</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default StoryForm;

// Fetch map name
// To do - consider a separate api endpoint for fetching names or something more efficient
// Refactor toget thumbnail as well
async function fetchMapName({ selectedMapId, setMapName }: MapFetchProps) {
  if (!selectedMapId) {
    setMapName("");
    return;
  }

  try {
    const response = await axios.get(`/api/maps/${selectedMapId}`);
    if (response.data && response.data.title) {
      setMapName(response.data.title);
    }
  } catch (error) {
    console.error("Error fetching map data:", error);
    setMapName("");
  }
}
