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
import SocialsForm from "./SocialsForm";

import "easymde/dist/easymde.min.css";
import { Card, CardContent } from "../ui/card";
import MediaLibrary from "../ui/media-library/MediaLibrary";
const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

type UserWithProfile = User & {
  userProfile: UserProfile | null;
};

type SocialsType = {
  platform?:
    | "discord"
    | "facebook"
    | "github"
    | "instagram"
    | "reddit"
    | "tiktok"
    | "twitter"
    | "deviantart"
    | "youtube"
    | "website"
    | "other";
  url?: string;
  label?: string;
}[];

interface Props {
  user: UserWithProfile;
}

export default function UserProfileForm({ user }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const profile = user.userProfile;

  //To do fix: Ugly Ai solution
  const safeSocials = (): SocialsType => {
    if (!profile?.socials) return [];

    try {
      // Cast to unknown first, then to your expected type
      return profile.socials as unknown as SocialsType;
    } catch {
      return [];
    }
  };

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      displayName: profile?.displayName || "",
      profileCatch: profile?.profileCatch || "",
      profileDescription: profile?.profileDescription || "",
      banner: profile?.banner || "",
      thumbnail: profile?.thumbnail || "",
      socials: safeSocials(),
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
        const response = await axios.patch(
          `/api/profile/${profile.id}`,
          values
        );
        toast.success("Profile updated succesfully");
      } else {
        await axios.post(`/api/profile/`, values);
        toast.success("Profile created succesfully");
      }
      setIsSubmitting(false);
      router.push(`/user/profile`);
      router.refresh();
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
      toast.error("Profile update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
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
          <div className="flex flex-col gap-2">
            <h3>Images</h3>
            <div className="flex gap-8 mb-8">
              <div className="flex flex-col gap-2">
                <h4 className=" text-sm font-semibold mb-1">Banner Image</h4>
                {bannerUrl && (
                  <Card>
                    <CardContent className=" flex flex-col p-4">
                      <Image
                        src={bannerUrl}
                        alt={"banner"}
                        className="object-cover object-center"
                        width={240}
                        height={240}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => form.setValue("banner", "")}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                )}
                <MediaLibrary form={form} imageFieldName="banner" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className=" text-sm font-semibold mb-1">Thumbnail Image</h4>
                {thumbUrl && (
                  <Card>
                    <CardContent className=" flex flex-col p-4">
                      <Image
                        src={thumbUrl}
                        alt={"thumbnail"}
                        className="object-cover object-center"
                        width={240}
                        height={240}
                      />
                      <Button
                        className="p-0"
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => form.setValue("thumbnail", "")}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                )}
                <MediaLibrary form={form} imageFieldName="thumbnail" />
              </div>
            </div>
          </div>
          <SocialsForm socialIcons={(profile?.socials || []) as Social[]} />
          <Button type="submit" disabled={isSubmitting}>
            {profile ? "Update Profile" : "Submit Profile"}
          </Button>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  );
}
