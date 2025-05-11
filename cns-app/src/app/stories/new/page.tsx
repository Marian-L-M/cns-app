"use client";
import dynamic from "next/dynamic";
import React from "react";

const StoryForm = dynamic(() => import("@/components/forms/StoryForm"), {
  ssr: false,
});

export default function NewStory() {
  return <StoryForm />;
}
