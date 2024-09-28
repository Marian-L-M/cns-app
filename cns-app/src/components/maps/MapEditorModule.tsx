"use client";
import { useMapEditor } from "@/hooks/useMapEditor";
import React from "react";
import { Button } from "../ui/button";

function MapEditorModule() {
  const { canvasRef, nodeList, styles } = useMapEditor();
  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  const onSubmitHandler = (event: any) => {
    event.preventDefault();
    console.log("Submit");
    console.log(nodeList);
    console.log(styles);
  };
  return (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div className="relative max-w-screen-lg col-span-4 " id="map-base">
          <canvas
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
            className="border border-grey relative z-10 w-full"
            // {...props}
          />
        </div>
        <div className="col-span-2" id="sidebar">
          <Button onClick={onSubmitHandler}>Submit</Button>
        </div>
      </div>
    </div>
  );
}

export default MapEditorModule;
