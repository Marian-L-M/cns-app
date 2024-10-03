"use client";
import { createContext, useState, ReactNode } from "react";

interface MapEditorStyleContextType {
  objectColor: string;
  pickObjectColor: (color: string) => void;
}

interface MapEditorContextProviderProps {
  children: ReactNode;
}

export const EditorContext = createContext<MapEditorStyleContextType>({
  objectColor: "red",
  pickObjectColor: () => {},
});

// type EditorObjectStatus = {
//   objectColor: string;
// };

export default function EditorContextProvider({
  children,
}: MapEditorContextProviderProps) {
  const [objectColor, setObjectColor] = useState("");

  const pickObjectColor = (color: string) => setObjectColor(color);

  return (
    <EditorContext.Provider
      value={{
        objectColor,
        pickObjectColor,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
