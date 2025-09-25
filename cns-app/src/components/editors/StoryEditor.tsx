"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { Palette, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SketchPicker, ColorResult } from "react-color";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useSubStoryEditor } from "@/hooks/useSubStoryEditor";
import { Story, SubStory, Map, CanvasStyleItem } from "@prisma/client";
import { SubstoryNodeType, SubStorySchema } from "@/ValidationSchemas/stories";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog/dialog";
import SelectIcon from "../ui/icon-picker/SelectIcon";
import { iconListMonochrome } from "@/lib/constants/objectIcons";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import StyleEditListModule from "../displays/StyleEditListModule";
import StyleItemForm from "../forms/StyleItemForm";

import "easymde/dist/easymde.min.css";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type ExtendedSubStory = Omit<SubStory, "nodes"> & {
  nodes: StoryNode[];
  canvasStyles: CanvasStyleItem[];
};

interface EditorProps {
  story: Story;
  substory?: SubStory & { nodes: StoryNode[]; canvasStyles: CanvasStyleItem[] };
  map?: Map;
}

// Make local or move to types
export type SubstoryFormData = z.infer<typeof SubStorySchema> & {
  substory: SubStory & { nodes: StoryNode[]; canvasStyles: CanvasStyleItem[] };
  nodes: StoryNode[];
};

// Default values for a new substory
// 250209 - Todo: find a way to get rid of temporary id for new substories
const defaultSubstory: SubStory & {
  nodes: StoryNode[];
  canvasStyles: CanvasStyleItem[];
} = {
  id: 0,
  title: "",
  description: "",
  objectTime: 0,
  storyId: 0,
  nodes: [],
  canvasStyles: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function StoryEditor({ story, substory, map }: EditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [editableSubStory, setEditableSubStory] = useState<ExtendedSubStory>(
    substory || { ...defaultSubstory, storyId: story.id }
  );
  const [activeSubstoryID, setActiveSubstoryID] = useState<number | undefined>(
    undefined
  );

  // Re-render canvas when styles change
  useEffect(() => {
    if (substory) {
      setEditableSubStory((prev) => ({
        ...prev,
        canvasStyles: substory.canvasStyles || [],
      }));
    }
  }, [substory?.canvasStyles]);

  // Canvas
  const { canvasRef } = useSubStoryEditor({
    editableSubStory,
    setEditableSubStory,
    activeSubstoryID,
    setActiveSubstoryID,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 1024,
    height: 1024,
  });

  // Style items
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStyleItem, setCurrentStyleItem] = useState<
    CanvasStyleItem | undefined
  >(undefined);
  const showStyleForm = (canvasStyle?: CanvasStyleItem) => {
    setCurrentStyleItem(canvasStyle);
    setIsDialogOpen(true);
  };

  // Reusable color change handler
  const createColorChangeHandler = (formFieldPath: string) => {
    return (color: ColorResult) => {
      const colorValue = color.rgb;
      const rgbaString = `rgba(${colorValue.r},${colorValue.g},${colorValue.b},${colorValue.a})`;
      form.setValue(formFieldPath as any, rgbaString);
    };
  };

  // Handle map size
  useEffect(() => {
    // Function to update the container size
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Set the height equal to width for a square canvas, or adjust as needed
        setContainerSize({
          width: Math.min(width, 1024),
          height: Math.min(width, 1024),
        });
      }
    };

    // Initial size update
    updateSize();

    // Add resize event listener
    window.addEventListener("resize", updateSize);

    // Clean up
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const form = useForm<SubstoryFormData>({
    resolver: zodResolver(SubStorySchema),
    defaultValues: {
      id: editableSubStory.id,
      title: editableSubStory.title,
      description: editableSubStory.description,
      nodes: editableSubStory.nodes as StoryNode[],
      objectTime: editableSubStory.objectTime,
      storyId: editableSubStory.storyId,
    },
  });

  useEffect(() => {
    const values = {
      id: editableSubStory.id || form.getValues("id"),
      title: editableSubStory.title || form.getValues("title"),
      description:
        editableSubStory.description || form.getValues("description"),
      nodes: editableSubStory.nodes,
      objectTime: editableSubStory.objectTime || form.getValues("objectTime"),
      storyId: editableSubStory.storyId || form.getValues("storyId"),
    };
    form.reset(values);
  }, [editableSubStory, form]);

  // 250721 quite messy -> cleanup
  async function onSubmit(values: SubstoryFormData) {
    // to do 250617 Unify structure with other editors
    try {
      setIsSubmitting(true);
      setError("");
      console.log("Submitting data:", values); // Add this for debugging

      if (substory) {
        await axios.patch(`/api/substories/${editableSubStory.id}`, values);
        router.push(
          `/editor/stories/${editableSubStory.storyId}/substories/${substory.id}`
        );
        router.refresh();
        toast.success("Substory updated succesfully");
      } else {
        const { id, nodes, ...submitData } = values;
        const cleanedNodes = nodes.map(({ ...node }) => node);
        const response = await axios.post(`/api/substories`, {
          ...submitData,
          nodes: cleanedNodes,
        });
        const newSubStory = response.data;
        router.push(
          `/editor/stories/${editableSubStory.storyId}/substories/${newSubStory.id}`
        );
        router.refresh();
        toast.success("Substory added succesfully");
      }

      setIsSubmitting(false);

      // Update local state to trigger canvas redraw
      setEditableSubStory((prev) => ({
        ...prev,
        ...values,
        nodes: values.nodes,
      }));
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error.response?.data?.message || "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full" id="substory-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div className="flex flex-col max-w-screen-lg col-span-4">
          <div className="flex items-center space-x-2 bg-slate-100 p-2">
            <Switch
              id="edit-mode"
              checked={activeSubstoryID ? true : false}
              onCheckedChange={() => {
                setActiveSubstoryID(undefined);
              }}
              disabled={activeSubstoryID ? false : true}
            />
            <Label htmlFor="airplane-mode">
              <h4 className="text-lg">
                {activeSubstoryID ? "Edit Node Mode" : "Add Node Mode"}
              </h4>
            </Label>
          </div>
          <div className="relative z-10 bg-black" id="map-base">
            <canvas
              ref={canvasRef}
              width={containerSize.width}
              height={containerSize.height}
              className="border border-grey relative z-10 w-full"
            />
            {map?.mapUrl && (
              <Image
                priority={true}
                className="absolute top-0 left-0 z-1 pointer-events-none opacity-70"
                src={map.mapUrl}
                alt="Map of Kamolin"
                width={containerSize.width}
                height={containerSize.height}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-8 col-span-2">
          <Tabs defaultValue={"form"} className="w-full">
            <TabsList>
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            <TabsContent value="form">
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
                      defaultValue={editableSubStory.title}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Title..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                      control={form.control}
                      name={`description`}
                      defaultValue={editableSubStory.description}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Description..." {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    /> */}
                    <Controller
                      name="description"
                      defaultValue={editableSubStory.description}
                      control={form.control}
                      render={({ field }) => (
                        <SimpleMDE placeholder="Description" {...field} />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`objectTime`}
                      defaultValue={editableSubStory.objectTime}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Object Time..."
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div
                    className="flex flex-col col-span-2 gap-2"
                    id="nodes-editor"
                  >
                    <h3 className="text-15xl">Story Nodes</h3>
                    {editableSubStory &&
                      editableSubStory.nodes?.map((node, number) => (
                        <div
                          key={(node as StoryNode)?.id}
                          className="border-2 border-indigo-500 rounded-md  hover:bg-slate-100 cursor-pointer p-2"
                          id="infobox"
                        >
                          {/* todo 20250723 rethink concept - Collapsibles are not great use of space, change to dialogs with palettes as popovers */}
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
                              <div
                                className="flex flex-col gap-2"
                                id="form-content"
                              >
                                <FormField
                                  control={form.control}
                                  name={`nodes.${number}.name`}
                                  defaultValue={(node as StoryNode).name}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Name..."
                                          {...field}
                                        />
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
                                          <Input
                                            type="number"
                                            placeholder="x"
                                            {...field}
                                            onChange={(e) => {
                                              const value =
                                                e.target.valueAsNumber;
                                              field.onChange(
                                                isNaN(value) ? 0 : value
                                              );
                                            }}
                                          />
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
                                          <Input
                                            type="number"
                                            placeholder="y"
                                            {...field}
                                            onChange={(e) => {
                                              const value =
                                                e.target.valueAsNumber;
                                              field.onChange(
                                                isNaN(value) ? 0 : value
                                              );
                                            }}
                                          />
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
                                    defaultValue={
                                      (node as StoryNode)?.timeStart
                                    }
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Time start: </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            placeholder="Time start"
                                            {...field}
                                            onChange={(e) => {
                                              const value =
                                                e.target.valueAsNumber;
                                              field.onChange(
                                                isNaN(value) ? 0 : value
                                              );
                                            }}
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
                                          <Input
                                            type="number"
                                            placeholder="Time end"
                                            {...field}
                                            onChange={(e) => {
                                              const value =
                                                e.target.valueAsNumber;
                                              field.onChange(
                                                isNaN(value) ? 0 : value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`nodes.${number}.iconType`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Type</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value || "SQUARE"}
                                        value={field.value || "SQUARE"}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select node type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {SubstoryNodeType.options.map(
                                            (nodeType) => (
                                              <SelectItem
                                                key={`${number}-${nodeType}-select-option`}
                                                value={nodeType || "SQUARE"}
                                              >
                                                {nodeType}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {/* 250727 to do Connect to state */}
                                {/* Icons are only showing when editor is opened. Rendering issue. */}
                                {editableSubStory.nodes[number].iconType ==
                                  "ICON" && (
                                  <FormField
                                    control={form.control}
                                    name={`nodes.${number}.iconUrl`}
                                    defaultValue={
                                      (node as StoryNode).iconUrl || ""
                                    }
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Icon</FormLabel>
                                        <FormControl>
                                          <div className="space-y-2">
                                            {/* Icon picker component */}
                                            <SelectIcon
                                              path={`nodes.${number}.iconUrl`}
                                              currentIcon={field.value || ""}
                                              setValue={form.setValue}
                                              iconList={iconListMonochrome}
                                            />
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                )}
                                <FormField
                                  control={form.control}
                                  name={`nodes.${number}.iconColor`}
                                  defaultValue={
                                    (node as StoryNode).iconColor ||
                                    "rgba(252,252,252,1)"
                                  }
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Icon Color</FormLabel>
                                      <FormControl>
                                        <div className="flex items-center gap-4">
                                          <Input
                                            placeholder="Icon Color..."
                                            {...field}
                                            readOnly
                                          />
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant={"outline"}
                                                className="py-1 px-2 text-md"
                                              >
                                                <Palette />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xs">
                                              <DialogHeader>
                                                <DialogTitle>
                                                  Set icon color
                                                </DialogTitle>
                                              </DialogHeader>
                                              <SketchPicker
                                                className="m-auto"
                                                color={
                                                  field.value ||
                                                  "rgba(252,252,252,1)"
                                                }
                                                onChange={createColorChangeHandler(
                                                  `nodes.${number}.iconColor`
                                                )}
                                                onChangeComplete={createColorChangeHandler(
                                                  `nodes.${number}.iconColor`
                                                )}
                                              />
                                              <DialogFooter>
                                                <DialogClose
                                                  asChild
                                                  className="w-full"
                                                >
                                                  <Button variant="default">
                                                    Close
                                                  </Button>
                                                </DialogClose>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`nodes.${number}.iconSize`}
                                  defaultValue={
                                    (node as StoryNode)?.iconSize || 10
                                  }
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Icon Size: {field.value}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          className="max-w-48"
                                          min="1"
                                          max="100"
                                          type="range"
                                          placeholder="Icon Size..."
                                          {...field}
                                          onChange={(e) => {
                                            const value =
                                              e.target.valueAsNumber;
                                            field.onChange(
                                              isNaN(value) ? 10 : value
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`nodes.${number}.label`}
                                  defaultValue={(node as StoryNode).label}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Label</FormLabel>
                                      <FormControl>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`nodes-${number}-has-label`}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                          <label
                                            htmlFor={`nodes-${number}-has-label`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            Has label?
                                          </label>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`nodes.${number}.labelColor`}
                                  defaultValue={
                                    (node as StoryNode).labelColor ||
                                    "rgba(255,255,255,0.8)"
                                  }
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Label Color</FormLabel>
                                      <FormControl>
                                        <div className="flex items-center gap-4">
                                          <Input
                                            placeholder="Label Color..."
                                            {...field}
                                            readOnly
                                          />
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant={"outline"}
                                                className="py-1 px-2 text-md"
                                              >
                                                <Palette />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xs">
                                              <DialogHeader>
                                                <DialogTitle>
                                                  Set label color
                                                </DialogTitle>
                                              </DialogHeader>
                                              <SketchPicker
                                                className="m-auto"
                                                color={
                                                  field.value ||
                                                  "rgba(255,255,255,0.8)"
                                                }
                                                onChange={createColorChangeHandler(
                                                  `nodes.${number}.labelColor`
                                                )}
                                                onChangeComplete={createColorChangeHandler(
                                                  `nodes.${number}.labelColor`
                                                )}
                                              />
                                              <DialogFooter>
                                                <DialogClose
                                                  asChild
                                                  className="w-full"
                                                >
                                                  <Button variant="default">
                                                    Close
                                                  </Button>
                                                </DialogClose>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`nodes.${number}.fontColor`}
                                  defaultValue={
                                    (node as StoryNode).fontColor ||
                                    "rgba(0,0,0,1)"
                                  }
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Font Color</FormLabel>
                                      <FormControl>
                                        <div className="flex items-center gap-4">
                                          <Input
                                            placeholder="Font Color..."
                                            {...field}
                                          />
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant={"outline"}
                                                className="py-1 px-2 text-md"
                                              >
                                                <Palette />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xs">
                                              <DialogHeader>
                                                <DialogTitle>
                                                  Set font color
                                                </DialogTitle>
                                              </DialogHeader>
                                              <SketchPicker
                                                className="m-auto"
                                                color={
                                                  field.value || "rgba(0,0,0,1)"
                                                }
                                                onChange={createColorChangeHandler(
                                                  `nodes.${number}.fontColor`
                                                )}
                                                onChangeComplete={createColorChangeHandler(
                                                  `nodes.${number}.fontColor`
                                                )}
                                              />
                                              <DialogFooter>
                                                <DialogClose
                                                  asChild
                                                  className="w-full"
                                                >
                                                  <Button variant="default">
                                                    Close
                                                  </Button>
                                                </DialogClose>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
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
                                    removeNodeFromSubStory(
                                      editableSubStory,
                                      setEditableSubStory,
                                      (node as StoryNode).id // Cast to StoryNode to access id
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
                      : editableSubStory.id === 0
                      ? "Create Substory"
                      : "Update Substory"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="styles">
              <div className="w-full">
                {/* Style column */}
                {substory ? (
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full gap-2 flex items-center justify-between">
                      <h4 className="text-lg">Styles</h4>
                      <Button
                        type="button"
                        className="self-end"
                        variant="default"
                        onClick={() => showStyleForm()}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <StyleEditListModule
                      canvasStyles={substory.canvasStyles}
                      showStyleForm={showStyleForm}
                      currentPage={`/editor/stories/${editableSubStory.storyId}/substories/${substory.id}`}
                    />

                    <StyleItemForm
                      parentId={substory.id}
                      parentType="subStory"
                      parentSlug={`/editor/stories/${editableSubStory.storyId}/substories/${substory.id}`}
                      dialogOpen={isDialogOpen}
                      setDialogOpen={setIsDialogOpen}
                      canvasStyleItem={currentStyleItem}
                    />
                  </div>
                ) : (
                  <p>Save substory to add style</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export function removeNodeFromSubStory(
  editableSubStory: ExtendedSubStory,
  setEditableSubStory: React.Dispatch<React.SetStateAction<ExtendedSubStory>>,
  nodeId: number
) {
  const updatedSubstory: ExtendedSubStory = {
    ...editableSubStory,
    nodes: editableSubStory.nodes.filter((node) => node.id !== nodeId),
  };
  setEditableSubStory(updatedSubstory);
}
