"use client";
import { createContext, useState, ReactNode } from "react";

interface MapEditorStyleContextType {
  objectColor: string;
  pickObjectColor: (color: string) => void;
  objectLineWidth: number;
  pickLineWidth: (lineWidth: number) => void;
}

interface MapEditorContextProviderProps {
  children: ReactNode;
}

export const EditorContext = createContext<MapEditorStyleContextType>({
  objectColor: "red",
  pickObjectColor: () => {},
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
  const [objectLineWidth, setObjectLineWidth] = useState<number>(0);

  const pickObjectColor = (color: string) => setObjectColor(color);
  const pickLineWidth = (lineWidth: number) => setObjectLineWidth(lineWidth);

  return (
    <EditorContext.Provider
      value={{
        objectColor,
        pickObjectColor,
        objectLineWidth,
        pickLineWidth,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
