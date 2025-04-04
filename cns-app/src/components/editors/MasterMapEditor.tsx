// To do: Is the MasterMapEditor even needed when we handle editing via childmapeditor
"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import axios from "axios";
import { useMasterMapEditor } from "@/hooks/useMasterMapEditor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MasterMapSchema } from "@/ValidationSchemas/maps";
import { Map, MapHierarchyMaster } from "@prisma/client";
import MapSearchDialog from "../ui/dialog/mapSearchDialog";
import { fetchMapName } from "@/lib/fetchMapData";
import { Edit, Plus, Trash } from "lucide-react";
import Link from "next/link";

export type MasterMapFormData = z.infer<typeof MasterMapSchema> & {
  MasterMap: MapHierarchyMaster;
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

interface MasterMapProps {
  MasterMap?: MasterMapWithChildren;
}

function MasterMapEditor({ MasterMap }: MasterMapProps) {
  const childMaps = MasterMap?.childMaps || [];
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // Set canvas
  const { canvasRef } = useMasterMapEditor({ childMaps });
  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  // Set Form
  const form = useForm<MasterMapFormData>({
    resolver: zodResolver(MasterMapSchema),
    defaultValues: {
      title: MasterMap?.title || "",
      parentMapId: MasterMap?.parentMapId || 0,
    },
  });

  async function onSubmit(values: MasterMapFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      if (MasterMap) {
        await axios.patch(`/api/mastermaps/${MasterMap.id}`, values);
        router.push(`/maps/mastermaps/${MasterMap?.id}/edit`);
        router.refresh();
        setIsSubmitting(false);
      } else {
        const response = await axios.post(`/api/mastermaps`, values);
        const newMasterMap = response.data;
        router.push(`/maps/mastermaps/${newMasterMap?.id}`);
        router.refresh();
        setIsSubmitting(false);
      }
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }

  async function handleDeleteChildMap(id: number) {
    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`/api/childmaps/${id}`);
      router.push(`/maps/mastermaps/${MasterMap?.id}/edit`);
      router.refresh();
    } catch (error) {
      setError("An error occured while deleteing");
    } finally {
      setIsDeleting(false);
      setIsSubmitting(false);
    }
  }

  // Set Mastermap & display name
  const [selectedParentMapId, setSelectedParentMapId] = useState<
    number | undefined
  >(MasterMap?.parentMapId);
  const [parentMapName, setParentMapName] = useState<string>("");

  useEffect(() => {
    // Update Wiki Name
    fetchMapName({
      selectedMapId: selectedParentMapId,
      setMapName: setParentMapName,
    });

    // Update form
    if (selectedParentMapId) {
      form.setValue("parentMapId", selectedParentMapId);
    }
  }, [selectedParentMapId]);

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
            <div className="w-full flex flex-col gap-4" id="form-top">
              <div className="w-9/12 pr-8" id="title-container">
                <FormField
                  control={form.control}
                  name="title"
                  defaultValue={MasterMap?.title}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Wiki Title..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full" id="parentmap-container">
              <FormField
                control={form.control}
                name="parentMapId"
                defaultValue={MasterMap?.parentMapId}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Map</FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        <div className="w-2/3">
                          <Input
                            type="hidden"
                            placeholder="parentMapId"
                            {...field}
                          />
                          {parentMapName && (
                            <div className="p-2 border rounded-md h-10 flex items-center">
                              <p className="truncate text-sm">
                                {parentMapName}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="w-1/3">
                          <MapSearchDialog
                            setSelectedMapId={setSelectedParentMapId}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {MasterMap && (
              <div
                className="flex flex-col gap-4 w-full mt-8"
                id="childmap-container"
              >
                <h3 className="font-semibold text-sm">Child maps</h3>
                <div className="w-full flex flex-col items-center gap-2 border border-slate-200 rounded-sm p-2">
                  {childMaps.map((map) => (
                    <div
                      key={`chilmdap-${map.id}`}
                      className="w-full flex justify-between items-center gap-2 "
                    >
                      <h5>{map.title}</h5>
                      <div className="btn-row flex justify-evenly gap-2 text-xs">
                        <Button variant={"secondary"} asChild>
                          <Link
                            href={`/maps/mastermaps/${map.hierarchyParentId}/childmaps/${map.hierarchyChildId}/edit`}
                          >
                            <Edit />
                          </Link>
                        </Button>
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            handleDeleteChildMap(map.hierarchyChildId);
                          }}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant={"secondary"} asChild>
                    <Link
                      href={`/maps/mastermaps/${MasterMap.id}/childmaps/new`}
                    >
                      <Plus />
                    </Link>
                  </Button>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {MasterMap ? "Update MasterMap" : "Submit MasterMap"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default MasterMapEditor;
