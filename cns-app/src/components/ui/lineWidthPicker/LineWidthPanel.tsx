"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SaveButton from "./saveButton";

interface ViewProps {
  setOpenLineWidthPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const LineWidthPanel = ({ setOpenLineWidthPicker }: ViewProps) => {
  const [selectedLineWidth, setSelectedLineWidth] = useState<number>(0);
  return (
    <div className="flex flex-col gap-2">
      <button
        key={`bar-1`}
        onClick={() => setSelectedLineWidth(1)}
        className={`w-full h-[16px] hover:opacity-75`}
      >
        <div
          className={`w-full h-[1px]  ${
            selectedLineWidth == 1 ? "bg-slate-100" : "bg-slate-400"
          }`}
        />
      </button>
      <button
        key={`bar-2`}
        onClick={() => setSelectedLineWidth(2)}
        className={`w-full h-[16px] hover:opacity-75`}
      >
        <div
          className={`w-full h-[2px] ${
            selectedLineWidth == 2 ? "bg-slate-100" : "bg-slate-400"
          }`}
        />
      </button>
      <button
        key={`bar-3`}
        onClick={() => setSelectedLineWidth(4)}
        className={`w-full h-[16px] hover:opacity-75`}
      >
        <div
          className={`w-full h-[4px] ${
            selectedLineWidth == 4 ? "bg-slate-100" : "bg-slate-400"
          }`}
        />
      </button>
      <button
        key={`bar-4`}
        onClick={() => setSelectedLineWidth(8)}
        className={`w-full h-[16px] hover:opacity-75`}
      >
        <div
          className={`w-full h-[8px] ${
            selectedLineWidth == 8 ? "bg-slate-100" : "bg-slate-400"
          }`}
        />
      </button>
      <button
        key={`bar-5`}
        onClick={() => setSelectedLineWidth(16)}
        className={`w-full h-[16px] hover:opacity-75`}
      >
        <div
          className={`w-full h-[16px] ${
            selectedLineWidth == 16 ? "bg-slate-100" : "bg-slate-400"
          }`}
        />
      </button>
      <SaveButton
        lineWidth={selectedLineWidth}
        setOpenLineWidthPicker={setOpenLineWidthPicker}
      />
    </div>
  );
};

export default LineWidthPanel;
