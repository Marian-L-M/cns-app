// Delete me if not needed
import EditorContextProvider from "@/store/mapEditorContext";
import StoryEditorModule from "../maps/StoryEditorModule";

import { Entry } from "@prisma/client";

interface EntryProps {
  entry: Entry;
}

function StoryEditor({ entry }: EntryProps) {
  return (
    <EditorContextProvider>
      <StoryEditorModule entry={entry} />
    </EditorContextProvider>
  );
}

export default StoryEditor;
