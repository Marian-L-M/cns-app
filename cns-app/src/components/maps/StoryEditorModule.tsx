"use client";
import Image from "next/image";
import { fetchMapData } from "@/lib/fetchMapData";
import { fetchStoryData } from "@/lib/fetchStoryData";
import { Entry, Story, Map } from "@prisma/client";
import { useSubStoryMaker } from "@/hooks/useSubStoryMaker";
import { useEffect, useState } from "react";
import { storyObjectsSchema } from "@/ValidationSchemas/stories";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditorProps {
  entry: Entry;
  substory: Story & { nodes: StoryNode[] };
  map: Map;
}

type StoryNode = {
  id: number;
  x: number;
  y: number;
  name: string;
  description: string;
  timeStart?: number;
  timeEnd?: number;
};

export type SubstoryFormData = z.infer<typeof storyObjectsSchema> & {
  substory: Story & { nodes: StoryNode[] };
};

// 250203 - Attempting to use state instead of context
function StoryEditorModule({ entry, substory, map }: EditorProps) {
  const [editableSubstory, setEditableSubstory] = useState<
    Story & { nodes: StoryNode[] }
  >(substory);
  const [activeSubstoryID, setActiveSubstoryID] = useState<number | undefined>(
    undefined
  );

  const { canvasRef } = useSubStoryMaker({
    editableSubstory,
    setEditableSubstory,
    activeSubstoryID,
    setActiveSubstoryID,
  });

  const form = useForm<SubstoryFormData>({
    resolver: zodResolver(storyObjectsSchema),
    // Most of the story fields should not be editable from this screen
    //Is the hidden form even necessary?
    defaultValues: {
      title: editableSubstory.title,
      nodes: editableSubstory.nodes as StoryNode[],
      description: editableSubstory.description,
      objectTime: editableSubstory.objectTime,
      entryId: editableSubstory.id,
    },
  });

  if (!editableSubstory.nodes && editableSubstory.nodes.length === 0) {
    return <h1>No nodes found</h1>;
  }

  const updateNode = (nodeId: number, updates: Partial<StoryNode>) => {
    setEditableSubstory((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    }));
  };

  // This should be in the useSubStoryMaker hook
  const handleNodeDrag = (nodeId: number, x: number, y: number) => {
    updateNode(nodeId, { x, y });
  };

  const handleNodeRename = (nodeId: number, newName: string) => {
    updateNode(nodeId, { name: newName });
  };

  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  // console.log(editableSubstory);
  // console.log(substory);

  // 250130 TODO create useSubstoryMaker hook
  // 250201* Concept object editor with multiple objects

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
        <div className="flex flex-col col-span-2 gap-2" id="sidebar">
          {/* This should be a form with toggle boxes for input */}
          {editableSubstory.nodes?.map((node) => (
            <div
              key={node?.id}
              className="border-2 border-indigo-500 rounded-md p-1  hover:bg-slate-100 cursor-pointer"
              id="infobox"
            >
              {activeSubstoryID === node.id ? "active" : "not active"}
              <div className="text-center">{node?.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoryEditorModule;
