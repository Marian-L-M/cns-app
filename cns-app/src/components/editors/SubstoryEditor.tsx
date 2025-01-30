import EditorContextProvider from "@/store/mapEditorContext";
import StoryEditorModule from "../maps/StoryEditorModule";

import { Entry, Map, Story } from "@prisma/client";

interface EditorProps {
  entry: Entry;
  substory: Story;
  map: Map;
}

async function SubstoryEditor({ entry, substory, map }: EditorProps) {
  return (
    <EditorContextProvider>
      <StoryEditorModule entry={entry} substory={substory} map={map} />
    </EditorContextProvider>
  );
}

export default SubstoryEditor;
