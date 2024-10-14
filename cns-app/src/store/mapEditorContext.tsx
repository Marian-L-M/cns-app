"use client";
import { createContext, useState, ReactNode } from "react";

interface MapEditorStyleContextType {
  objectColor: string;
  pickObjectColor: (color: string) => void;
  objectLineColor: string;
  pickLineColor: (color: string) => void;
  objectLineWidth: number;
  pickLineWidth: (lineWidth: number) => void;
}

interface MapEditorContextProviderProps {
  children: ReactNode;
}

export const EditorContext = createContext<MapEditorStyleContextType>({
  objectColor: "red",
  pickObjectColor: () => {},
  objectLineColor: "black",
  pickLineColor: () => {},
  objectLineWidth: 1,
  pickLineWidth: () => {},
});

// type EditorObjectStatus = {
//   objectColor: string;
// };

export default function EditorContextProvider({
  children,
}: MapEditorContextProviderProps) {
  const [objectColor, setObjectColor] = useState("");
  const [objectLineColor, setLineObjectColor] = useState("");
  const [objectLineWidth, setObjectLineWidth] = useState<number>(0);

  const pickObjectColor = (color: string) => setObjectColor(color);
  const pickLineColor = (color: string) => setLineObjectColor(color);
  const pickLineWidth = (lineWidth: number) => setObjectLineWidth(lineWidth);

  return (
    <EditorContext.Provider
      value={{
        objectColor,
        pickObjectColor,
        objectLineColor,
        pickLineColor,
        objectLineWidth,
        pickLineWidth,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
