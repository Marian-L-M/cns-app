"use client";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema } from "@/ValidationSchemas/users";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateOrCreateUserProfile } from "@/lib/actions/user.actions";

import "easymde/dist/easymde.min.css";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export default function UserProfileSettingsForm({ profile }: any) {
  const userProfile = profile?.userProfile || {};

  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      displayName: userProfile?.displayName || "",
      profileCatch: userProfile?.profileCatch || "",
      profileDescription: userProfile?.profileDescription || "",
      thumbnail: userProfile?.thumbnail || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof userProfileSchema>) => {
    const res = await updateOrCreateUserProfile(values);

    if (!res.success) {
      return toast.error("Profile update failed", {
        description: res.message,
        className: "error",
      });
    }

    toast.success("Profile updated succesfully ", {
      description: res.message,
      className: "success",
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Display Name"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileCatch"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Profile Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Profile Title"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            name="profileDescription"
            control={form.control}
            render={({ field }) => (
              <SimpleMDE placeholder="Profile Description" {...field} />
            )}
          />
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Profile image url"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
