import { useState } from "react";

const options = [1, 2, 4, 8, 16];

interface PresetViewProps {
  setLineWidthPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const LineWidthView = ({ setLineWidthPicker }: PresetViewProps) => {
  const [selectedLineWidth, setSelectedLineWidth] = useState<number>(0);

  return (
    <>
      <div className="flex flex-col gap-1 my-4">
        {options.map((option) => (
          <div
            key={`bar-${option}`}
            onClick={() => setSelectedLineWidth(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </>
  );
};

export default LineWidthView;
