"use client";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Story, SubStory, Map } from "@prisma/client";
import { useSubStoryMaker } from "@/hooks/useSubStoryMaker";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { SubStorySchema } from "@/ValidationSchemas/stories";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface EditorProps {
  story: Story;
  substory?: SubStory & { nodes: StoryNode[] };
  map: Map;
}

type StoryNode = {
  id: number;
  x: number;
  y: number;
  name: string;
  description: string;
  timeStart?: number;
  timeEnd?: number;
};

export type SubstoryFormData = z.infer<typeof SubStorySchema> & {
  substory: SubStory & { nodes: StoryNode[] };
  nodes: StoryNode[];
};

// Default values for a new substory
// 250209 - Todo: find a way to get rid of temporary id for new substories
const defaultSubstory: SubStory & { nodes: StoryNode[] } = {
  id: 0,
  title: "",
  description: "",
  objectTime: 0,
  storyId: 0,
  nodes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function StoryEditorModule({ story, substory, map }: EditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [editableSubstory, setEditableSubstory] = useState<
    SubStory & { nodes: StoryNode[] }
  >(substory || { ...defaultSubstory, storyId: story.id });
  const [activeSubstoryID, setActiveSubstoryID] = useState<number | undefined>(
    undefined
  );

  const { canvasRef } = useSubStoryMaker({
    editableSubstory,
    setEditableSubstory,
    activeSubstoryID,
    setActiveSubstoryID,
  });

  const form = useForm<SubstoryFormData>({
    resolver: zodResolver(SubStorySchema),
    defaultValues: {
      id: editableSubstory.id,
      title: editableSubstory.title,
      description: editableSubstory.description,
      nodes: editableSubstory.nodes as StoryNode[],
      objectTime: editableSubstory.objectTime,
      storyId: editableSubstory.storyId,
    },
  });

  useEffect(() => {
    const values = {
      id: editableSubstory.id || form.getValues("id"),
      title: editableSubstory.title || form.getValues("title"),
      description:
        editableSubstory.description || form.getValues("description"),
      nodes: editableSubstory.nodes,
      objectTime: editableSubstory.objectTime || form.getValues("objectTime"),
      storyId: editableSubstory.storyId || form.getValues("storyId"),
    };
    form.reset(values);
    console.log("values");
    console.log(values);
  }, [editableSubstory, form]);

  async function onSubmit(values: SubstoryFormData) {
    // 250416 Suspect an issue with how nodes are being cleaned
    try {
      setIsSubmitting(true);
      setError("");
      console.log("Submitting data:", values); // Add this for debugging

      if (substory) {
        await axios.patch(`/api/substories/${editableSubstory.id}`, values);
      } else {
        const { id, nodes, ...submitData } = values;
        const cleanedNodes = nodes.map(({ ...node }) => node);
        console.log(cleanedNodes);
        await axios.post(`/api/substories`, {
          ...submitData,
          nodes: cleanedNodes,
        });
      }
      setIsSubmitting(false);
      router.push(`/stories/${editableSubstory.storyId}/substories`);
      router.refresh();
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error.response?.data?.message || "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  // 250206 Todo: Add form fields and submission logic

  return (
    <div className="w-full" id="substory-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          className="relative z-10 max-w-screen-lg col-span-4 bg-black"
          id="map-base"
        >
          <canvas
            // onMouseDown={onMouseDown}
            // handlerFunction
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
            className="border border-grey rounded-md relative z-10 w-full"
          />
          <Image
            priority={true}
            className="absolute top-0 left-0 z-1 pointer-events-none"
            src={`/${map?.mapUrl || "maps/placeholder.jpg"}`}
            alt="Map of Kamolin"
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col col-span-2 gap-2"
            id="sidebar"
          >
            <div
              className="flex flex-col col-span-2 gap-2"
              id="susbtory-editor"
            >
              <FormField
                control={form.control}
                name={`title`}
                defaultValue={editableSubstory.title}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`description`}
                defaultValue={editableSubstory.description}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`objectTime`}
                defaultValue={editableSubstory.objectTime}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Object Time..."
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col col-span-2 gap-2" id="nodes-editor">
              <h3 className="text-15xl">Story Nodes</h3>
              {editableSubstory &&
                editableSubstory.nodes?.map((node, number) => (
                  <div
                    key={node?.id}
                    className="border-2 border-indigo-500 rounded-md  hover:bg-slate-100 cursor-pointer p-2"
                    id="infobox"
                  >
                    <Collapsible
                      open={activeSubstoryID === (node as StoryNode).id}
                      onClick={() =>
                        setActiveSubstoryID((node as StoryNode).id)
                      }
                    >
                      <CollapsibleTrigger>
                        <h4 className="text-center text-2l">
                          {(node as StoryNode).name}
                        </h4>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-col gap-2" id="form-content">
                          <FormField
                            control={form.control}
                            name={`nodes.${number}.name`}
                            defaultValue={(node as StoryNode).name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Name..." {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div
                            className="flex flex-row gap-2 justify-between"
                            id="coordinates"
                          >
                            <FormField
                              control={form.control}
                              name={`nodes.${number}.x`}
                              defaultValue={(node as StoryNode).x}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>X: </FormLabel>
                                  <FormControl>
                                    <Input placeholder="x" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`nodes.${number}.y`}
                              defaultValue={(node as StoryNode).y}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Y: </FormLabel>
                                  <FormControl>
                                    <Input placeholder="y" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div
                            className="flex flex-row gap-2 justify-between"
                            id="timeSpan"
                          >
                            <FormField
                              control={form.control}
                              name={`nodes.${number}.timeStart`}
                              defaultValue={(node as StoryNode)?.timeStart}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Time start: </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Time start"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`nodes.${number}.timeEnd`}
                              defaultValue={(node as StoryNode)?.timeEnd}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Time end: </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Time end" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name={`nodes.${number}.description`}
                            defaultValue={(node as StoryNode).description}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    className="h-32 bg-white"
                                    placeholder="Description..."
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              removeNodeFromStory(
                                editableSubstory,
                                setEditableSubstory,
                                node?.id
                              );
                            }}
                            variant="destructive"
                          >
                            <span>Delete Node</span>
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editableSubstory.id === 0
                ? "Create Substory"
                : "Update Substory"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default StoryEditorModule;

export function removeNodeFromStory(
  editableSubstory: Story,
  setEditableSubstory: React.Dispatch<React.SetStateAction<Story>>,
  nodeId: number
) {
  //To do 250310 Fix type issue
  const updatedSubstory = {
    ...editableSubstory,
    nodes: editableSubstory.nodes.filter((node) => node?.id !== nodeId),
  };
  setEditableSubstory(updatedSubstory);
  return;
}

// 250214 - Todo: Add active node highlighting
