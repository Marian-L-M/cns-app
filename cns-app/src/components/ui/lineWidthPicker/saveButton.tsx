import { Check } from "lucide-react";
import { EditorContext } from "@/store/mapEditorContext";
import { useContext } from "react";

interface SaveButtonProps {
  lineWidth: number;
  setOpenLineWidthPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaveButton = ({ lineWidth, setOpenLineWidthPicker }: SaveButtonProps) => {
  const editorCtx = useContext(EditorContext);
  const saveHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    editorCtx.pickLineWidth(lineWidth);
    setOpenLineWidthPicker(false);
  };
  return (
    <div>
      <button
        type="button"
        disabled={lineWidth <= 0}
        className="rounded-full p-1.5 transition-colors duration-75"
        style={{
          backgroundColor: lineWidth <= 0 ? "#1e293b" : "#22c55e",
          color: lineWidth <= 0 ? "#64748b" : "white",
        }}
        onClick={saveHandler}
      >
        <Check className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SaveButton;
