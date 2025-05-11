"use client";
import { useState } from "react";
import SaveButton from "./saveButton";

interface ViewProps {
  setOpenLineWidthPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LineWidthPanel({ setOpenLineWidthPicker }: ViewProps) {
  const lineDefaults = [1, 2, 4, 8, 16];
  const [selectedLineWidth, setSelectedLineWidth] = useState<number>(0);

  const handleClick = (e: React.MouseEvent, lineWidth: number) => {
    e.preventDefault();
    setSelectedLineWidth(lineWidth);
  };

  return (
    <div className="flex flex-col gap-2">
      {lineDefaults.map((lineWidth) => (
        <button
          key={`bar-${lineWidth}`}
          onClick={(e) => handleClick(e, lineWidth)}
          className={`w-full h-[16px] hover:opacity-75`}
        >
          <div
            className={`w-full h-[${lineWidth}px] ${
              selectedLineWidth == lineWidth ? "bg-slate-100" : "bg-slate-400"
            }`}
          />
        </button>
      ))}
      <SaveButton
        lineWidth={selectedLineWidth}
        setOpenLineWidthPicker={setOpenLineWidthPicker}
      />
    </div>
  );
}
