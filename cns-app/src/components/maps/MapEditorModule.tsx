"use client";
import { useMapEditor } from "@/hooks/useMapEditor";
import { Button } from "../ui/button";
import ColorPicker from "../ui/colorPicker/ColorPicker";
import { Palette } from "lucide-react";

import { useContext } from "react";
import { EditorContext } from "@/store/mapEditorContext";

function MapEditorModule() {
  const { canvasRef, nodeList, styles } = useMapEditor();
  const editorCtx = useContext(EditorContext);

  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }
  const styleCheck = (event: any) => {
    event.preventDefault();
    editorCtx.pickObjectColor("red");
    console.log(editorCtx.objectColor);
  };

  const onSubmitHandler = (event: any) => {
    event.preventDefault();
    console.log("Submit");
    console.log(nodeList);
    console.log(styles);
  };
  return (
    <div className="w-full" id="map-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          className="relative z-10 max-w-screen-lg col-span-4 "
          id="map-base"
        >
          <canvas
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
            className="border border-grey relative z-10 w-full"
            // {...props}
          />
        </div>
        <div className="relative z-20 col-span-2" id="sidebar">
          <div className="flex justify-between gap-1" id="color-pickers">
            <ColorPicker icon={<Palette className="text-slate-300" />} />
          </div>
          <Button onClick={onSubmitHandler}>Submit</Button>
          <Button onClick={styleCheck}>Style</Button>
        </div>
      </div>
    </div>
  );
}

export default MapEditorModule;
