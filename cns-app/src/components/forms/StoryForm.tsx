"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Story, SubStory, Map, Role, ContentRole } from "@prisma/client";
import { StoriesSchema } from "@/ValidationSchemas/stories";

import { Button } from "@/components/ui/button";
import MapSearchDialog from "@/components/ui/dialog/mapSearchDialog";
import {
  Form,
  FormControl,
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

import { toast } from "sonner";

import "easymde/dist/easymde.min.css";
import { Checkbox } from "../ui/checkbox";
import MediaLibrary from "../ui/media-library/MediaLibrary";
import { Card, CardContent } from "../ui/card";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type StoryFormData = z.infer<typeof StoriesSchema>;

interface Props {
  story?: Story & {
    userStories: Array<{
      id: number; // Changed from string to number
      userId: string;
      storyId: number;
      role: ContentRole;
      user: {
        id: string;
        name: string;
        role: Role;
      };
    }>;
    assignedToMap?: Map | null;
  };
  substories?: SubStory[]; // Changed from Story[] to SubStory[]
}

interface MapFetchProps {
  selectedMapId: number | undefined;
  setMapName: React.Dispatch<React.SetStateAction<string>>;
}

export default function StoryForm({ story, substories }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [selectedMapId, setSelectedMapId] = useState<number | undefined>(
    story?.assignedToMapID ?? undefined
  );
  const [mapName, setMapName] = useState<string>("");

  const form = useForm<StoryFormData>({
    resolver: zodResolver(StoriesSchema),
    defaultValues: {
      title: story?.title || "",
      description: story?.description || "",
      imageUrl: story?.imageUrl || "",
      bannerUrl: story?.bannerUrl || "",
      storyTime: story?.storyTime || 1000,
      status: story?.status || "UPCOMING",
      category: story?.category || "",
      tags: story?.tags || [],
      featured: story?.featured || false,
      rating: story?.rating || 0,
      assignedToMapID: story?.assignedToMapID || 0,
    },
  });

  // Fetch wiki name when wikiId changes
  useEffect(() => {
    fetchMapName({ selectedMapId, setMapName });

    if (selectedMapId) {
      form.setValue("assignedToMapID", selectedMapId);
    }
  }, [selectedMapId]);

  async function onSubmit(values: z.infer<typeof StoriesSchema>) {
    try {
      setIsSubmitting(true);
      setError("");
      if (story) {
        await axios.patch(`/api/story/${story.id}`, values);
        router.push(`/editor/stories/${story.id}`);
        router.refresh();
        toast.success("Story updated succesfully");
      } else {
        const response = await axios.post("/api/story", values);
        const newStory = response.data;
        router.push(`/editor/stories/${newStory.id}`);
        router.refresh();
        toast.success("Story created succesfully");
      }
      setIsSubmitting(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
      toast.error("Story update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
    }
  }

  const thumbImg = form.watch("imageUrl");
  const bannerImg = form.watch("bannerUrl");

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
                    <FormMessage />
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
                name="storyTime"
                defaultValue={story?.storyTime}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Time</FormLabel>
                    <FormMessage />
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
            <div className="flex flex-col gap-2">
              <h3>Images</h3>
              <div className="flex gap-8 mb-8">
                <Card>
                  <CardContent className=" flex flex-col gap-2 p-4">
                    <h4 className=" text-sm font-semibold mb-1">
                      Banner Image
                    </h4>
                    {bannerImg && (
                      <div className="flex flex-col gap-2">
                        <Image
                          src={bannerImg}
                          alt={"bannerImg"}
                          className="object-cover object-center"
                          width={240}
                          height={240}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => form.setValue("bannerUrl", "")}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    <MediaLibrary form={form} imageFieldName="bannerUrl" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className=" flex flex-col p-4">
                    <h4 className=" text-sm font-semibold mb-1">
                      Thumbnail Image
                    </h4>
                    {thumbImg && (
                      <div className="flex flex-col gap-2">
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
                      </div>
                    )}
                    <MediaLibrary form={form} imageFieldName="imageUrl" />
                  </CardContent>
                </Card>
              </div>
            </div>
            <FormField
              control={form.control}
              name="category"
              defaultValue={story?.category || ""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormMessage />
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
              defaultValue={story?.tags || []}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormMessage />
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
              defaultValue={story?.featured}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured</FormLabel>
                  <FormMessage />
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
            <div className="w-1/3" id="map-container">
              <FormField
                control={form.control}
                name="assignedToMapID"
                defaultValue={story?.assignedToMapID ?? undefined}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map</FormLabel>
                    <FormMessage />
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
                    href={`/editor/stories/${story.id}/substories/${subStory.id}`}
                  >
                    <Button variant={"secondary"}>edit</Button>
                  </Link>
                </li>
              ))}
            </ol>
          )}
          <div id="link-container" className="flex gap-2">
            <Link href={`/editor/stories/${story.id}/substories/create`}>
              <Button variant={"default"}>Add</Button>
            </Link>
          </div>
        </section>
      )}
      {story && (
        <section className="rounded-md border w-full p-4 flex flex-col gap-4">
          <h5 className="font-bold">Collaborators</h5>
          <div className="space-y-2">
            {story.userStories?.map((userStory) => (
              <div
                key={userStory.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <span className="font-medium">{userStory.user.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({userStory.role})
                  </span>
                </div>
                {/* 250831  TO DO: Add collaboration  capabilities*/}
                {/* {userStory.role === "EDITOR" && (
                  <Button
                    variant="outline"
                    size="sm"
                    // onClick={() => removeCollaborator(userStory.id)}
                  >
                    Remove
                  </Button>
                )} */}
              </div>
            ))}
          </div>
          {/* <Button
            variant="outline"
            // onClick={() => setShowAddCollaborator(true)}
          >
            Add Collaborator
          </Button> */}
        </section>
      )}
    </div>
  );
}

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
