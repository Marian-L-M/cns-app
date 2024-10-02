import { Check } from "lucide-react";

interface SaveButtonProps {
  color: string;
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaveButton = ({ color, setOpenColorPicker }: SaveButtonProps) => {
  return (
    <div>
      <button
        disabled={color === ""}
        className="rounded-full p-1.5 transition-colors duration-75"
        style={{
          backgroundColor: color === "" ? "#1e293b" : "#22c55e",
          color: color === "" ? "#64748b" : "white",
        }}
        onClick={() => setOpenColorPicker(false)}
      >
        <Check className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SaveButton;
