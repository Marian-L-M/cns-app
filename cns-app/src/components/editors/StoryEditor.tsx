// Delete me if not needed
import { Story } from "@prisma/client";
import EditorContextProvider from "@/store/mapEditorContext";

import StoryEditorModule from "@/components/maps/StoryEditorModule";

interface StoryProps {
  story: Story;
}

export default function StoryEditor({ story }: StoryProps) {
  return (
    <EditorContextProvider>
      <StoryEditorModule story={story} />
    </EditorContextProvider>
  );
}
