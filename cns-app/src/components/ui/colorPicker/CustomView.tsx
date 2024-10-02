import { Check } from "lucide-react";
import Input from "./Input";

interface SaveButtonProps {
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomView = ({ setOpenColorPicker }: SaveButtonProps) => {
  return (
    <div className="relative flex my-4 items-center">
      <div className="flex flex-col gap-1 items-center">
        <Input label="HEX" />
        <Input label="R" />
        <Input label="G" />
        <Input label="B" />
        <Input label="A" />
      </div>
      <div className="absolute -bottom-4 right-0">
        <button
          className="rounded-full p-1.5 transition-colors duration-75"
          style={{ backgroundColor: "#22c553", color: "#fff" }}
          onClick={() => setOpenColorPicker(false)}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomView;
