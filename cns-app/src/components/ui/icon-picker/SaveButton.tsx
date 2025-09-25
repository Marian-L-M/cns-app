import { Check } from "lucide-react";
import { useContext } from "react";

import { EditorContext } from "@/store/mapEditorContext";

interface SaveButtonProps {
  selectedIcon: GlobalObjectType;
  setOpenIconPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

// Context update is not working
export default function SaveButton({
  selectedIcon,
  setOpenIconPicker,
}: SaveButtonProps) {
  const editorCtx = useContext(EditorContext);
  const saveHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    editorCtx.updateGlobalObjectSettings({
      name: selectedIcon.name,
      url: selectedIcon.url,
      x: editorCtx.globalObjectSettings.x || 100,
      y: editorCtx.globalObjectSettings.y || 100,
      size: 40,
      opacity: 100,
    });
    setOpenIconPicker(false);
  };
  return (
    <button
      type="button"
      disabled={!selectedIcon}
      className="rounded-full p-1.5 transition-colors duration-75"
      style={{
        backgroundColor: !selectedIcon ? "#1e293b" : "#22c55e",
        color: !selectedIcon ? "#64748b" : "white",
      }}
      onClick={saveHandler}
    >
      <Check className="w-4 h-4" />
    </button>
  );
}
