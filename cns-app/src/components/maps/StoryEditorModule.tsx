"use client";
import Image from "next/image";
import { fetchMapData } from "@/lib/fetchMapData";
import { fetchStoryData } from "@/lib/fetchStoryData";
import { Entry, Story, Map } from "@prisma/client";
import { useStoryMaker } from "@/hooks/useStoryMaker";

interface EditorProps {
  entry: Entry;
  substory: Story;
  map: Map;
}

function StoryEditorModule({ entry, substory, map }: EditorProps) {
  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  // 250130 TODO create useSubstoryMaker hook
  // // const { canvasRef } = useStoryMaker({ map, substory });

  return (
    <div className="w-full" id="substory-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          className="relative z-10 max-w-screen-lg col-span-4 bg-black"
          id="map-base"
        >
          <canvas
            // onMouseDown={onMouseDown}
            // handlerFunction
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
            className="border border-grey rounded-md relative z-10 w-full"
          />
          <Image
            priority={true}
            className="absolute top-0 left-0 z-1 pointer-events-none"
            src={`/${map?.mapUrl || "maps/placeholder.jpg"}`}
            alt="Map of Kamolin"
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize}
          />
        </div>
        <div className="flex flex-col gap-2" id="sidebar">
          {/* {activeStory && (
              <div
                className="border-2 border-sky-500 rounded-md p-1"
                id="storybox"
              >
                <StoryBox
                  id={activeStory.id}
                  title={activeStory.title}
                  type={activeStory.type}
                  description={activeStory.description}
                />
              </div>
            )} */}
        </div>
      </div>
    </div>
  );
}

export default StoryEditorModule;
