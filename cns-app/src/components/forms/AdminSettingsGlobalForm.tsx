"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSettings, AdminSettingsType } from "@prisma/client";
import { AdminSettingsSchema } from "@/ValidationSchemas/admin";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { UploadComponent } from "../ui/uploader";

interface Props {
  category: AdminSettingsType;
  type: string;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  adminSettingsItem?: AdminSettings;
  subCategory?: string;
}

export default function AdminSettingsGlobalForm({
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

  const uploadImg = form.watch("value");

  async function onSubmit(values: AdminSettings) {
    try {
      setIsSubmitting(true);
      setError("");
      if (adminSettingsItem) {
        await axios.patch(`/api/settings/${adminSettingsItem.id}`, values);
        toast.success("Global settings item updated succesfully");
      } else {
        await axios.post(`/api/settings`, values);
        toast.success("Global settings item added succesfully");
      }
      form.reset();
      router.push(`/admin/general`);
      router.refresh();
      setIsSubmitting(false);
      setDialogOpen(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
      toast.error("Settings update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
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
              {/* Image upload */}
              <div className="w-full">
                {type == "logo" && (
                  <div className="upload-field">
                    <h5 className="font-bold">{type}</h5>
                    <UploadComponent
                      image={uploadImg || ""}
                      form={form}
                      fieldName="value"
                    />
                  </div>
                )}
                {/* Text field */}
                {type == "name" && (
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
