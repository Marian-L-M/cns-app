import EditorContextProvider from "@/store/mapEditorContext";
import StoryEditorModule from "../maps/StoryEditorModule";

import { Map, Story, SubStory } from "@prisma/client";

interface EditorProps {
  story: Story;
  substory?: SubStory;
  map: Map;
}

async function SubStoryEditor({ story, substory, map }: EditorProps) {
  return (
    <EditorContextProvider>
      <StoryEditorModule story={story} substory={substory} map={map} />
    </EditorContextProvider>
  );
}

export default SubStoryEditor;
