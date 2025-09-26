"use client";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AdminSettings, AdminSettingsType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSettingsSchema } from "@/ValidationSchemas/admin";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

import "easymde/dist/easymde.min.css";
import { fetchMapName, fetchMastermapName } from "@/lib/fetchMapData";
import MastermapSearchDialog from "../ui/dialog/mastermapSearchDialog";
import StorySearchDialog from "../ui/dialog/storySearchDialog";
import { fetchStoryName } from "@/lib/fetchStoryData";
import MapSearchDialog from "../ui/dialog/mapSearchDialog";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface Props {
  category: AdminSettingsType;
  type: string;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  adminSettingsItem?: AdminSettings;
  subCategory?: string;
}

export default function AdminSettingsItemForm({
  adminSettingsItem,
  category,
  type,
  dialogOpen,
  setDialogOpen,
  subCategory,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | undefined>(
    adminSettingsItem?.id ?? undefined
  );
  const [displayName, setDisplayName] = useState<string>("");

  const form = useForm<AdminSettings>({
    resolver: zodResolver(AdminSettingsSchema),
    defaultValues: {
      category: adminSettingsItem?.category || category || "OTHER",
      subCategory: adminSettingsItem?.subCategory || subCategory || "",
      type: adminSettingsItem?.type || type,
      value: adminSettingsItem?.value || "",
      order: adminSettingsItem?.order || 1,
    },
  });

  // Reset form on switch
  useEffect(() => {
    form.reset({
      category: adminSettingsItem?.category || category || "OTHER",
      subCategory: adminSettingsItem?.subCategory || subCategory || "",
      type: adminSettingsItem?.type || type,
      value: adminSettingsItem?.value || "",
      order: adminSettingsItem?.order || 1,
    });
  }, [adminSettingsItem, category, type, subCategory, form]);

  // Fetch mastermap name when mastermap id changes
  useEffect(() => {
    // Update display name
    if (type == "mastermapId") {
      fetchMastermapName({
        selectedMastermapId: selectedId,
        setMastermapName: setDisplayName,
      });
    } else if (type == "storyId") {
      fetchStoryName({
        selectedStoryId: selectedId,
        setStoryName: setDisplayName,
      });
    } else if (type == "mapId") {
      fetchMapName({
        selectedMapId: selectedId,
        setMapName: setDisplayName,
      });
    }
    // Update form
    if (
      (selectedId && type == "mastermapId") ||
      (selectedId && type == "storyId") ||
      (selectedId && type == "mapId")
    ) {
      form.setValue("value", selectedId.toString());
    }
  }, [selectedId, form]);

  async function onSubmit(values: AdminSettings) {
    try {
      setIsSubmitting(true);
      setError("");
      if (adminSettingsItem) {
        await axios.patch(`/api/settings/${adminSettingsItem.id}`, values);
        toast.success("Settings item updated succesfully");
      } else {
        await axios.post(`/api/settings`, values);
        toast.success("Settings item added succesfully");
      }
      form.reset();
      router.push(`/admin/${category.toLowerCase()}`);
      router.refresh();
      setIsSubmitting(false);
      setDialogOpen(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>
                {adminSettingsItem
                  ? `Edit ${type.toLowerCase()} settings`
                  : `Add ${type.toLowerCase()} settings`}
              </DialogTitle>
            </DialogHeader>
            <div
              className="overflow-scroll flex flex-col gap-8"
              id="contents-wrapper"
            >
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="order"
                  defaultValue={adminSettingsItem?.order}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Infobox order..."
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.onChange(value || 1); // Default to 1 if empty or 0
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                {/* ================= */}
                {/* TOP PAGE SETTINGS */}
                {/* ================= */}
                {/* Mastermap search dialog */}
                {(type == "mastermapId" ||
                  type == "storyId" ||
                  type == "mapId") && (
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select id</FormLabel>
                        <FormMessage />
                        <FormControl>
                          <div className="flex flex-row gap-2">
                            {displayName && (
                              <div className="w-2/3">
                                <Input
                                  type="hidden"
                                  placeholder="Mastermap Id"
                                  {...field}
                                />
                                <div className="p-2 border rounded-md h-10 flex items-center">
                                  <p className="truncate text-sm">
                                    {displayName}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="w-1/3">
                              {type == "mastermapId" && (
                                <MastermapSearchDialog
                                  setSelectedId={setSelectedId}
                                />
                              )}
                              {type == "storyId" && (
                                <StorySearchDialog
                                  setSelectedId={setSelectedId}
                                />
                              )}
                              {type == "mapId" && (
                                <MapSearchDialog
                                  setSelectedMapId={setSelectedId}
                                />
                              )}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {/* ================= */}
                {/* Wiki PAGE SETTINGS */}
                {/* ================= */}
                {(type == "setFeaturedWikis" ||
                  type == "setFeaturedStories" ||
                  type == "setExploreWikis" ||
                  type == "setNewWikis" ||
                  type == "setNewMaps" ||
                  type == "setNewMasterMaps" ||
                  type == "setExploreMaps" ||
                  type == "setFeaturedMaps" ||
                  type == "setExploreMasterMaps" ||
                  type == "setFeaturedMasterMaps" ||
                  type == "setStoryList" ||
                  type == "setExploreStories" ||
                  type == "setNewStories") && (
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Set number of posts to display</FormLabel>
                        <FormMessage />
                        <FormDescription>
                          Delete or zero to hide section
                        </FormDescription>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {/* Text editor */}
                {(type == "mainText" || type == "text") && (
                  <div className="flex flex-col gap-4">
                    <h5 className="">Text</h5>
                    <Controller
                      name="value"
                      defaultValue={adminSettingsItem?.value}
                      control={form.control}
                      render={({ field }) => (
                        <SimpleMdeEditor placeholder="Text field" {...field} />
                      )}
                    />
                  </div>
                )}
                {/* Text field */}
                {(type == "mainTitle" || type == "subTitle") && (
                  <FormField
                    control={form.control}
                    name="value"
                    defaultValue={adminSettingsItem?.value}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{type}</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {adminSettingsItem ? "Update Settings" : "Add Settings"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <p className="text-destructive">{error}</p>
      </DialogContent>
    </Dialog>
  );
}
