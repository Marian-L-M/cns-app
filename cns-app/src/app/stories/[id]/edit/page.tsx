import dynamic from "next/dynamic";
import prisma from "../../../../../prisma/db";
import Image from "next/image";
import StoryDetail from "../StoryDetail";

interface Props {
  params: { id: string };
}

const StoryForm = dynamic(() => import("@/components/forms/StoryForm"), {
  ssr: false,
});

const EditStory = async ({ params }: Props) => {
  const story = await prisma?.entry.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!story) {
    return <p className="text-destructive">Story not found</p>;
  }
  return (
    <div className="w-full" id="story-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div className="col-span-4" id="map-base">
          {/* Switch detail module to editor module (without the infobox) */}
          <StoryDetail story={story} />
        </div>
        <div className="col-span-2" id="form-base">
          <StoryForm story={story} />
        </div>
      </div>
    </div>
  );
};

export default EditStory;
