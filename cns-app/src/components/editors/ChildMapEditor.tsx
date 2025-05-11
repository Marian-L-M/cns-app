"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChildMapSchema } from "@/ValidationSchemas/maps";
import { Map, MapHierarchyChild } from "@prisma/client";
import MapSearchDialog from "../ui/dialog/mapSearchDialog";
import { fetchMapName } from "@/lib/fetchMapData";
import { useChildMapMaker } from "@/hooks/useChildMapMaker";

export type ChildMapFormData = z.infer<typeof ChildMapSchema> & {
  ChildMap: MapHierarchyChild;
};

interface MapWithRectangularArea
  extends HierarchyConnection,
    Map,
    PointRectangularArea {}

interface MasterMapWithChildren {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  parentMapId: number;
  parentMap: Map;
  childMaps: MapWithRectangularArea[];
}

interface ChildMapEditorProps {
  MasterMap: MasterMapWithChildren;
  ChildMap?: MapHierarchyChild;
}

interface ChildMapEditable extends PointRectangularArea {
  mapTitle: string;
}

// 250329 To do: Connect childmap details to state
// 250404 To do: Two areas cannot be submitted for the same map (which is good), but an alarm text is needed
export default function ChildMapEditor({
  MasterMap,
  ChildMap,
}: ChildMapEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [childMapCoordinates, setChildMapCoordinates] =
    useState<ChildMapEditable>({
      x: ChildMap?.x || 100,
      y: ChildMap?.y || 100,
      wx: ChildMap?.wx || 100,
      wy: ChildMap?.wy || 100,
      mapTitle: ChildMap?.mapTitle || "",
    });

  // Set canvas
  const { canvasRef } = useChildMapMaker({
    childMapCoordinates,
    setChildMapCoordinates,
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
      childMapId: ChildMap?.childMapId || 0, // Naming is very confusing childmapid is not the id of the childmap but the related map object
      x: ChildMap?.x || 0,
      y: ChildMap?.y || 0,
      wx: ChildMap?.wx || 0,
      wy: ChildMap?.wy || 0,
    },
  });

  useEffect(() => {
    if (childMapCoordinates) {
      form.setValue("x", childMapCoordinates.x || form.getValues("x"));
      form.setValue("y", childMapCoordinates.y || form.getValues("y"));
      form.setValue("wx", childMapCoordinates.wx || form.getValues("wx"));
      form.setValue("wy", childMapCoordinates.wy || form.getValues("wy"));
    }
  }, [childMapCoordinates, form]);

  async function onSubmit(values: ChildMapFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      if (ChildMap) {
        await axios.patch(`/api/childmaps/${ChildMap.id}`, values);
        router.push(`/maps/mastermaps/${ChildMap.hierarchyId}/edit`);
        router.refresh();
      } else {
        const response = await axios.post(`/api/childmaps`, values);
        const NewChildMap = response.data;
        router.push(`/maps/mastermaps/${NewChildMap.hierarchyId}/edit`);
        router.refresh();
      }
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }

  // Set map & map display name
  const [selectedMapId, setSelectedMapId] = useState<number | undefined>(
    ChildMap?.childMapId
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
            src={`/maps/kamolin-map.jpg`} // make dynamic
            alt="Map of Kamolin"
            width="1024"
            height="1024"
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative z-20 col-span-2 flex flex-col gap-4"
            id="sidebar"
          >
            <div className="w-full" id="parentmap-container">
              <FormField
                control={form.control}
                name="childMapId"
                defaultValue={ChildMap?.childMapId}
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
            <div
              className="flex flex-col gap-4 w-full mt-8"
              id="childmap-fields-container"
            >
              <FormField
                control={form.control}
                name="x"
                defaultValue={ChildMap?.x}
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
                defaultValue={ChildMap?.y}
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
              <FormField
                control={form.control}
                name="wx"
                defaultValue={ChildMap?.wx}
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
                defaultValue={ChildMap?.wy}
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
            <Button type="submit" disabled={isSubmitting}>
              {ChildMap ? "Update Childmap" : "Submit Childmap"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
