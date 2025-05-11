import { Check } from "lucide-react";
import { EditorContext } from "@/store/mapEditorContext";
import React, { useContext } from "react";

interface SaveButtonProps {
  color: string;
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  editorContext: string;
}

export default function SaveButton({
  color,
  setOpenColorPicker,
  editorContext,
}: SaveButtonProps) {
  const editorCtx = useContext(EditorContext);
  const saveHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    switch (editorContext) {
      case "objectColor":
        editorCtx.pickObjectColor(color);
        break;
      case "lineColor":
        editorCtx.pickLineColor(color);
        break;
      default:
        console.log("Invalid editor context");
        break;
    }
    setOpenColorPicker(false);
  };
  return (
    <div>
      <button
        type="button"
        disabled={color === ""}
        className="rounded-full p-1.5 transition-colors duration-75"
        style={{
          backgroundColor: color === "" ? "#1e293b" : "#22c55e",
          color: color === "" ? "#64748b" : "white",
        }}
        onClick={saveHandler}
      >
        <Check className="w-4 h-4" />
      </button>
    </div>
  );
}
