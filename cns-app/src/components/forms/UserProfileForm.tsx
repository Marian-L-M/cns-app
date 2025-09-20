"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserProfile } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userProfileSchema } from "@/ValidationSchemas/users";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing/utils";

import "easymde/dist/easymde.min.css";
import SocialsForm from "./SocialsForm";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface Props {
  user: User;
}

export default function UserProfileForm({ user }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const profile: UserProfile = user.userProfile;

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      displayName: profile?.displayName || "",
      profileCatch: profile?.profileCatch || "",
      profileDescription: profile?.profileDescription || "",
      banner: profile?.banner || "",
      thumbnail: profile?.thumbnail || "",
      socials: profile?.socials || [],
      userId: profile?.userId || user.id,
    },
  });

  const bannerUrl = form.watch("banner");
  const thumbUrl = form.watch("thumbnail");

  async function onSubmit(values: z.infer<typeof userProfileSchema>) {
    try {
      setIsSubmitting(true);
      setError("");
      if (profile) {
        await axios.patch(`/api/profile/${profile.id}`, values);
        toast.success("Profile updated succesfully");
      } else {
        await axios.post(`/api/profile/`, values);
        toast.success("Profile created succesfully");
      }
      setIsSubmitting(false);
      router.push(`/admin/users/${user.id}/profile`);
      router.refresh();
    } catch (error) {
      toast.error("Profile update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
      setIsSubmitting(false);
    }
  }
  return (
    <div className="rounded-md border w-full p-4 flex flex-col gap-4">
      <div className="rounded-md border w-full p-4">
        <h1 className="text-xl">
          Profile: {profile?.displayName ? profile?.displayName : user.name}
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="displayName"
            defaultValue={profile?.displayName || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input placeholder="Display Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileCatch"
            defaultValue={profile?.profileCatch || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Title</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input placeholder="Profile title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="w-full" id="description-container">
            <h5 className="">Description</h5>
            <Controller
              name="profileDescription"
              defaultValue={profile?.profileDescription || ""}
              control={form.control}
              render={({ field }) => (
                <SimpleMdeEditor placeholder="Profile Description" {...field} />
              )}
            />
          </div>
          {/* Thumbnail upload */}
          <div className="upload-field">
            <h4>Thumbnail Image</h4>
            <Card>
              <CardContent className="space-y-2 mt-2">
                {thumbUrl && (
                  <Image
                    src={thumbUrl}
                    alt="thumbnail image"
                    className="object-cover object-center"
                    width={240}
                    height={240}
                  />
                )}

                {!thumbUrl && (
                  <UploadButton
                    appearance={{
                      button: {
                        background: "#3b82f6",
                        color: "white",
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      },
                      container: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                      },
                      allowedContent: {
                        color: "#6b7280",
                        fontSize: "14px",
                      },
                    }}
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue("thumbnail", res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      toast.error("Thumbnail image upload failed", {
                        className: "error",
                        description: `ERROR! ${error.message}`,
                      });
                    }}
                  />
                )}
                <FormField
                  control={form.control}
                  name="thumbnail"
                  defaultValue={profile?.thumbnail || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="Thumbnail" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          {/* Banner upload field */}
          <div className="upload-field">
            <h4>Banner Image</h4>
            <Card>
              <CardContent className="space-y-2 mt-2">
                {bannerUrl && (
                  <Image
                    src={bannerUrl}
                    alt="banner image"
                    className="object-cover object-center"
                    width={240}
                    height={240}
                  />
                )}

                {!bannerUrl && (
                  <UploadButton
                    appearance={{
                      button: {
                        background: "#3b82f6",
                        color: "white",
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      },
                      container: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                      },
                      allowedContent: {
                        color: "#6b7280",
                        fontSize: "14px",
                      },
                    }}
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue("banner", res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      toast.error("Banner image upload failed", {
                        className: "error",
                        description: `ERROR! ${error.message}`,
                      });
                    }}
                  />
                )}
                <FormField
                  control={form.control}
                  name="banner"
                  defaultValue={profile?.banner || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="banner" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <SocialsForm socialIcons={profile?.socials || []} />
          <Button type="submit" disabled={isSubmitting}>
            {profile ? "Update Profile" : "Submit Profile"}
          </Button>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  );
}
