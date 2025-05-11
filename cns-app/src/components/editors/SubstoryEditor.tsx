import { Map, Story, SubStory } from "@prisma/client";
import EditorContextProvider from "@/store/mapEditorContext";

import StoryEditorModule from "@/components/maps/StoryEditorModule";

interface EditorProps {
  story: Story;
  substory?: SubStory;
  map: Map;
}

export default async function SubStoryEditor({
  story,
  substory,
  map,
}: EditorProps) {
  return (
    <EditorContextProvider>
      <StoryEditorModule story={story} substory={substory} map={map} />
    </EditorContextProvider>
  );
}
