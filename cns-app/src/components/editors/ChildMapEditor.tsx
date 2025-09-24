"use client";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MapSearchDialog from "@/components/ui/dialog/mapSearchDialog";
import { useChildMapMaker } from "@/hooks/useChildMapMaker";
import { fetchMapName } from "@/lib/fetchMapData";
import {
  CanvasStyleItem,
  Map,
  MapHierarchyChild,
  MapHierarchyMaster,
  UserMapHierarchy,
} from "@prisma/client";
import { ChildMapSchema } from "@/ValidationSchemas/maps";
import { Plus } from "lucide-react";
import StyleEditListModule from "../displays/StyleEditListModule";
import StyleItemForm from "../forms/StyleItemForm";

export type ChildMapFormData = z.infer<typeof ChildMapSchema> & {
  ChildMap: MapHierarchyChild;
};

interface ChildMapWithStyle extends MapHierarchyChild {
  canvasStyles: CanvasStyleItem[];
  childMap: Map;
  wx: number;
  wy: number;
  x: number;
  y: number;
}

interface MasterMapWithChildren extends MapHierarchyMaster {
  childMaps: ChildMapWithStyle[];
  parentMap: Map;
  userMapHierarchies: UserMapHierarchy[];
}

interface ChildMapEditorProps {
  MasterMap: MasterMapWithChildren;
}

interface ChildMapEditorItem {
  mapTitle: string;
  x: number;
  y: number;
  wx: number;
  wy: number;
  canvasStyles: CanvasStyleItem[];
}

// 250329 To do: Connect childmap details to state
// 250404 To do: Two areas cannot be submitted for the same map (which is good), but an alarm text is needed
export default function ChildMapEditor({ MasterMap }: ChildMapEditorProps) {
  console.log(MasterMap);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const childMap = MasterMap.childMaps[0];
  const [childMapEditorItem, setChildMapEditorItem] =
    useState<ChildMapEditorItem>({
      x: childMap?.x || 100,
      y: childMap?.y || 100,
      wx: childMap?.wx || 100,
      wy: childMap?.wy || 100,
      mapTitle: childMap?.childMap.title || "",
      canvasStyles: childMap?.canvasStyles || [],
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

  // Re-render canvas when styles change
  useEffect(() => {
    if (childMap) {
      setChildMapEditorItem((prev) => ({
        ...prev,
        canvasStyles: childMap.canvasStyles || [],
      }));
    }
  }, [childMap?.canvasStyles]);

  // Set canvas
  const { canvasRef } = useChildMapMaker({
    childMapEditorItem,
    setChildMapEditorItem,
  });
  // To do write a hook for handling map size
  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  // Set Form
  const form = useForm<ChildMapFormData>({
    resolver: zodResolver(ChildMapSchema),
    defaultValues: {
      hierarchyId: MasterMap.id,
      childMapId: childMap?.childMapId || 0, // Naming is very confusing childmapid is not the id of the childmap but the related map object
      x: childMap?.x || 0,
      y: childMap?.y || 0,
      wx: childMap?.wx || 0,
      wy: childMap?.wy || 0,
    },
  });

  useEffect(() => {
    if (childMapEditorItem) {
      form.setValue("x", childMapEditorItem.x || form.getValues("x"));
      form.setValue("y", childMapEditorItem.y || form.getValues("y"));
      form.setValue("wx", childMapEditorItem.wx || form.getValues("wx"));
      form.setValue("wy", childMapEditorItem.wy || form.getValues("wy"));
    }
  }, [childMapEditorItem, form]);

  async function onSubmit(values: ChildMapFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      if (childMap) {
        await axios.patch(`/api/childmaps/${childMap.id}`, values);
        router.push(
          `/editor/mastermaps/${MasterMap.id}/childmaps/${childMap.id}`
        );
        router.refresh();
        toast.success("Childmap updated succesfully");
        setIsSubmitting(false);
      } else {
        const response = await axios.post(`/api/childmaps`, values);
        const NewChildMap = response.data;
        router.push(
          `/editor/mastermaps/${MasterMap.id}/childmaps/${NewChildMap.id}`
        );
        router.refresh();
        toast.success("Childmap created succesfully");
        setIsSubmitting(false);
      }
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
      toast.error("Childmap update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
    }
  }

  // Set map & map display name
  const [selectedMapId, setSelectedMapId] = useState<number | undefined>(
    childMap?.childMapId
  );
  const [mapName, setMapName] = useState<string>("");

  useEffect(() => {
    // Update Wiki Name
    fetchMapName({
      selectedMapId: selectedMapId,
      setMapName: setMapName,
    });

    // Update form
    if (selectedMapId) {
      form.setValue("childMapId", selectedMapId);
    }
  }, [selectedMapId, form]);

  return (
    <div className="w-full" id="map-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          className="relative z-10 max-w-screen-lg col-span-4 bg-black"
          id="map-base"
        >
          <canvas
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
            className="border border-grey relative z-10 w-full"
          />
          <Image
            priority={true}
            className="absolute top-0 left-0 z-1 pointer-events-none opacity-70"
            src={MasterMap?.parentMap.mapUrl}
            alt={MasterMap?.parentMap.title}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
          />
        </div>
        <div className="w-full flex flex-col gap-8 col-span-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative z-20  flex flex-col gap-4 w-full"
              id="sidebar"
            >
              <div className="w-full" id="parentmap-container">
                <FormField
                  control={form.control}
                  name="childMapId"
                  defaultValue={childMap?.childMapId}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Map as child map</FormLabel>
                      <FormControl>
                        <div className="flex flex-row gap-2">
                          <div className="w-2/3">
                            <Input
                              type="hidden"
                              placeholder="childMapId"
                              {...field}
                            />
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
              <div id="form-wrapp" className="flex flex-col gap-8">
                <div
                  className="flex flex-col gap-4 w-full mt-8"
                  id="childmap-fields-container"
                >
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="x"
                      defaultValue={childMap?.x}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Map X</FormLabel>
                          <FormControl>
                            <div className="flex flex-row gap-2">
                              <div className="w-2/3">
                                <Input
                                  type="number"
                                  placeholder="X"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.valueAsNumber;
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="y"
                      defaultValue={childMap?.y}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Map Y</FormLabel>
                          <FormControl>
                            <div className="flex flex-row gap-2">
                              <div className="w-2/3">
                                <Input
                                  type="number"
                                  placeholder="Y"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.valueAsNumber;
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="wx"
                      defaultValue={childMap?.wx}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Map Width</FormLabel>
                          <FormControl>
                            <div className="flex flex-row gap-2">
                              <div className="w-2/3">
                                <Input
                                  type="number"
                                  placeholder="wx"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.valueAsNumber;
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="wy"
                      defaultValue={childMap?.wy}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Map Height</FormLabel>
                          <FormControl>
                            <div className="flex flex-row gap-2">
                              <div className="w-2/3">
                                <Input
                                  type="number"
                                  placeholder="WY"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.valueAsNumber;
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {childMap ? "Update Childmap" : "Submit Childmap"}
              </Button>
            </form>
          </Form>
          <div className="w-full">
            {/* Style column */}
            {childMap ? (
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
                  canvasStyles={childMap.canvasStyles}
                  showStyleForm={showStyleForm}
                  currentPage={`/editor/mastermaps/${MasterMap.id}/childmaps/${childMap.id}`}
                />
                <StyleItemForm
                  parentId={childMap.id}
                  parentType="mapHierarchyChild"
                  parentSlug={`/editor/mastermaps/${MasterMap.id}/childmaps/${childMap.id}`}
                  dialogOpen={isDialogOpen}
                  setDialogOpen={setIsDialogOpen}
                  canvasStyleItem={currentStyleItem}
                />
              </div>
            ) : (
              <p>Save child map to change style</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
