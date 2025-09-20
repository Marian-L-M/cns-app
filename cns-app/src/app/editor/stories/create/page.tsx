import StoryForm from "@/components/forms/StoryForm";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";
import React from "react";

export default async function NewStory() {
  const session = await requireAuthorOrAdmin();
  if (!session) {
    return <h1>Authentication pending</h1>;
  }
  return <StoryForm user={session.user} />;
}
