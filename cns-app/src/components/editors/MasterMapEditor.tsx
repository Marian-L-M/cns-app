"use client";
import axios from "axios";
import { Edit, Plus, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useMasterMapEditor } from "@/hooks/useMasterMapEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Map,
  MapHierarchyChild,
  MapHierarchyMaster,
  User,
  UserMapHierarchy,
} from "@prisma/client";
import { MasterMapSchema } from "@/ValidationSchemas/maps";

import { Button } from "@/components/ui/button";
import MapSearchDialog from "@/components/ui/dialog/mapSearchDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { fetchMapName } from "@/lib/fetchMapData";

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
  childMaps: MapHierarchyChildEditable[];
  userMapHierarchies: UserMapHierarchy[];
}

interface MasterMapProps {
  MasterMap?: MasterMapWithChildren;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface MapHierarchyChildEditable extends MapHierarchyChild {
  title: string;
}

export default function MasterMapEditor({ MasterMap, user }: MasterMapProps) {
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
        toast.success("Mastermap updated succesfully");
        setIsSubmitting(false);
      } else {
        const response = await axios.post(`/api/mastermaps`, values);
        const newMasterMap = response.data;
        router.push(`/editor/mastermaps/${newMasterMap?.id}`);
        router.refresh();
        toast.success("Mastermap created succesfully");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Mastermap update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
      setIsSubmitting(false);
    }
  }

  async function handleDeleteChildMap(id: number) {
    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`/api/childmaps/${id}`);
      router.push(`/editor/mastermaps/${MasterMap?.id}`);
      router.refresh();
      toast.success("Childmap removed succesfully");
    } catch (error) {
      setError("An error occured while deleteing");
      toast.error("Childmap removal failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
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
        {MasterMap?.parentMap && (
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
        )}
        <div
          className="relative z-20 col-span-2 flex flex-col gap-4"
          id="sidebar"
        >
          <Form {...form}>
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
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
                          <Input placeholder="Master Map Title..." {...field} />
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
                <section className="rounded-md border w-full p-4 flex flex-col gap-4">
                  <h5 className="font-bold">Collaborators</h5>
                  <div className="space-y-2">
                    {MasterMap.userMapHierarchies?.map((userHierarchy) => (
                      <div
                        key={userHierarchy.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div>
                          <span className="font-medium">
                            {userHierarchy.user.name}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({userHierarchy.role})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {MasterMap ? "Update Parent Map" : "Set Parent Map"}
              </Button>
            </form>
          </Form>
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
                          href={`/editor/mastermaps/${MasterMap.id}/childmaps/${map.hierarchyChildId}`}
                        >
                          <Edit />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the childmap relation for [
                              {map.title}]
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => {
                                handleDeleteChildMap(map.hierarchyChildId);
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
                <Button variant={"secondary"} asChild>
                  <Link
                    href={`/editor/mastermaps/${MasterMap.id}/childmaps/create`}
                  >
                    <Plus />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
