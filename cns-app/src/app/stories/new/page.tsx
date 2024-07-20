import dynamic from "next/dynamic";
import React from "react";

const StoryForm = dynamic(() => import("@/components/forms/StoryForm"), {
  ssr: false,
});

const NewStory = () => {
  return <StoryForm />;
};

export default NewStory;
