"use client";
import { createContext, useState, ReactNode } from "react";

interface areaNode {
  id: number;
  x: number;
  y: number;
}

interface MapEditorStyleContextType {
  objectColor: string;
  pickObjectColor: (color: string) => void;
  objectLineColor: string;
  pickLineColor: (color: string) => void;
  objectLineWidth: number;
  pickLineWidth: (lineWidth: number) => void;
  nodeList: areaNode[];
  updateNodeList: (nodeList: areaNode[]) => void;
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
  nodeList: [],
  updateNodeList: () => {},
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
  const [nodeList, setNodeList] = useState<areaNode[]>([]);

  const pickObjectColor = (color: string) => setObjectColor(color);
  const pickLineColor = (color: string) => setLineObjectColor(color);
  const pickLineWidth = (lineWidth: number) => setObjectLineWidth(lineWidth);
  const updateNodeList = (nodeList: areaNode[]) => setNodeList(nodeList);

  return (
    <EditorContext.Provider
      value={{
        objectColor,
        pickObjectColor,
        objectLineColor,
        pickLineColor,
        objectLineWidth,
        pickLineWidth,
        nodeList,
        updateNodeList,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
