import EditorContextProvider from "@/store/mapEditorContext";
import StoryEditorModule from "../maps/StoryEditorModule";

import { Story } from "@prisma/client";

function StoryEditor(story: Story) {
  return (
    <EditorContextProvider>
      <StoryEditorModule story={story} />
    </EditorContextProvider>
  );
}

export default StoryEditor;
