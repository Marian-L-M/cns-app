import EditorContextProvider from "@/store/mapEditorContext";
import StoryEditorModule from "../maps/StoryEditorModule";

import { Entry } from "@prisma/client";

interface EntryProps {
  entry: Entry;
}

function StoryEditor({ entry }: EntryProps) {
  return (
    <EditorContextProvider>
      {/* <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative"> */}
      <StoryEditorModule entry={entry} />
      {/* </div> */}
    </EditorContextProvider>
  );
}

export default StoryEditor;
