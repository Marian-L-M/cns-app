"use-client";
import { SetStateAction, useState } from "react";

interface LineWidthPickerProps {
  icon: React.ReactNode;
  currentStyleValue: string;
  setCurrentStyleValue: React.Dispatch<SetStateAction<string>>;
}

export default function LineWidthPicker({
  icon,
  currentStyleValue,
  setCurrentStyleValue,
}: LineWidthPickerProps) {
  const lineDefaults = [1, 2, 4, 8, 16];
  const [selectedLineWidth, setSelectedLineWidth] = useState<number>(
    parseInt(currentStyleValue) | 0
  );
  const heightClasses: Record<number, string> = {
    1: "h-[1px]",
    2: "h-[2px]",
    4: "h-[4px]",
    8: "h-[8px]",
    16: "h-[16px]",
  };

  const handleClick = (e: React.MouseEvent, lineWidth: number) => {
    e.preventDefault();
    setSelectedLineWidth(lineWidth);
    setCurrentStyleValue(lineWidth.toString());
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {lineDefaults.map((lineWidth) => (
        <button
          key={`bar-${lineWidth}`}
          onClick={(e) => handleClick(e, lineWidth)}
          className={`w-full flex items-center gap-2 h-fit hover:opacity-75`}
        >
          <span className="w-12">{lineWidth}px</span>
          <span
            className={`w-full ${heightClasses[lineWidth]} ${
              selectedLineWidth == lineWidth ? "bg-slate-800" : "bg-slate-400"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
