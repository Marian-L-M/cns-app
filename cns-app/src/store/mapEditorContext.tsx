"use client";
import { createContext, useState, ReactNode } from "react";

interface areaNode {
  id: number;
  x: number;
  y: number;
}

interface globalObject {
  name: string;
  url: string;
  size: number;
  opacity: number;
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
  globalObjectSettings: globalObject;
  updateGlobalObjectSettings: (globalObject: globalObject) => void;
}

interface MapEditorContextProviderProps {
  children: ReactNode;
}

export const EditorContext = createContext<MapEditorStyleContextType>({
  objectColor: "grey",
  pickObjectColor: () => {},
  objectLineColor: "black",
  pickLineColor: () => {},
  objectLineWidth: 1,
  pickLineWidth: () => {},
  nodeList: [],
  updateNodeList: () => {},
  globalObjectSettings: {
    name: "",
    url: "",
    size: 40,
    opacity: 100,
    x: 0,
    y: 0,
  },
  updateGlobalObjectSettings: () => {},
});

export default function EditorContextProvider({
  children,
}: MapEditorContextProviderProps) {
  const [objectColor, setObjectColor] = useState("");
  const [objectLineColor, setLineObjectColor] = useState("");
  const [objectLineWidth, setObjectLineWidth] = useState<number>(0);
  const [nodeList, setNodeList] = useState<areaNode[]>([]);
  const [globalObjectSettings, setGlobalObjectSettings] =
    useState<globalObject>({
      name: "",
      url: "",
      size: 40,
      opacity: 100,
      x: 0,
      y: 0,
    });

  const pickObjectColor = (color: string) => setObjectColor(color);
  const pickLineColor = (color: string) => setLineObjectColor(color);
  const pickLineWidth = (lineWidth: number) => setObjectLineWidth(lineWidth);
  const updateNodeList = (nodeList: areaNode[]) => setNodeList(nodeList);
  const updateGlobalObjectSettings = (globalObjectSettings: globalObject) => {
    setGlobalObjectSettings(globalObjectSettings);
  };

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
        globalObjectSettings,
        updateGlobalObjectSettings,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
