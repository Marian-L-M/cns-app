"use client";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Menu, Palette } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ui/color-picker/ColorPicker";
import LineColorPicker from "@/components/ui/color-picker/LineColorPicker";
import LineWidthPicker from "@/components/ui/linewidth-picker/LineWidthPicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import IconPicker from "@/components/ui/icon-picker/IconPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WikiSearchDialog from "@/components/ui/dialog/wikiSearchDialog";
import { useMapEditor } from "@/hooks/useMapEditor";
import { fetchWikiName } from "@/lib/fetchWikiData";
import { GlobalArea, GlobalObject } from "@prisma/client";
import { EditorContext } from "@/store/mapEditorContext";
import {
  GlobalAreasSchema,
  GlobalObjectsSchema,
} from "@/ValidationSchemas/global";

// To do: Might need to switch to dynamic?
// To do: Split off area and object form. Component is too big
import "easymde/dist/easymde.min.css";
import GlobalObjectForm from "../forms/ObjectForm";
import GlobalAreaForm from "../forms/AreaForm";

const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

// interface Props {
//   map: MapType;
//   globalObject?: GlobalObject;
//   globalArea?:
//     | {
//         id: number;
//         createdAt: Date;
//         updatedAt: Date;
//         title: string;
//         description: string;
//         imageUrl: string;
//         infobox: {};
//         nodes?: areaNode[];
//         styles: {};
//         objectTime: number;
//         mapId: number;
//         wikiId: number;
//         type: "GEOGRAPHY" | "ABSTRACT" | "INTERACTIVE";
//       }
//     | undefined;
//   editorMode?: string;
// }

// export type GlobalAreaFormData = z.infer<typeof GlobalAreasSchema> & {
//   globalArea: GlobalArea;
// };

export default function MapEditorModule({
  map,
  globalArea,
  globalObject,
  editorMode,
}: Props) {
  //250111 TODO - Editormode should be state or context?
  const { canvasRef } = useMapEditor({ globalArea, globalObject, editorMode });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 1024,
    height: 1024,
  });

  // To do -> Turn into custom hook
  // Handle map size
  useEffect(() => {
    // Function to update the container size
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Set the height equal to width for a square canvas, or adjust as needed
        setContainerSize({
          width: Math.min(width, 1024),
          height: Math.min(width, 1024),
        });
      }
    };

    // Initial size update
    updateSize();

    // Add resize event listener
    window.addEventListener("resize", updateSize);

    // Clean up
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="w-full" id="map-editor-module">
      <div>
        <h1>Width: {containerSize.width}</h1>
        <h1>Height:{containerSize.height}</h1>
      </div>
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          className="relative z-10 max-w-screen-lg col-span-4 bg-black"
          id="map-base"
        >
          <canvas
            ref={canvasRef}
            width={containerSize.width}
            height={containerSize.height}
            className="border border-grey relative z-10 w-full"
          />
          {map?.mapUrl && (
            <Image
              priority={true}
              className="absolute top-0 left-0 z-1 pointer-events-none opacity-70"
              src={map.mapUrl}
              alt="Map of Kamolin"
              width={containerSize.width}
              height={containerSize.height}
            />
          )}
        </div>
        {(globalArea || editorMode === "area") && (
          <GlobalAreaForm map={map} globalArea={globalArea} />
        )}
        {(globalObject || editorMode === "object") && (
          <GlobalObjectForm map={map} globalObject={globalObject} />
        )}
      </div>
    </div>
  );
}

// 241127 To do:
// Split form into area and object form
// Rewiring Area
// Create object form

// 20241004 Next actions
// Map editor is designed to be a popup module on top of the map.

// 20241007 Next actions

// For now: One area - one popup
// 2. Create API endpoint for GlobalArea (post)
// 1. Create API endpoint for GlobalArea (patch)
// 3. Create API endpoint for GlobalArea (delete)
// 4. Change Mapeditor module to a form

// 20241023 Next actions
// 1. Add opacity to the fill style
// 2. Clean up the map editor module
// 3. Change map editor to popup + list of global areas
// 4. Add global objects functionality

// 20241217 Solution to editor module not showing the other icons
// Grey out normal map in the back with the edior only rendering the current object (Two canvas elements)
// Would reduce rerendering stress

// Fetch wiki name with wiki id and set the name in wiki
// async function fetchWikiName({ selectedWikiId, setWikiName }: WikiFetchProps) {
//   if (!selectedWikiId) {
//     setWikiName("");
//     return;
//   }

//   try {
//     const response = await axios.get(`/api/wiki/${selectedWikiId}`);
//     if (response.data && response.data.title) {
//       setWikiName(response.data.title);
//     }
//   } catch (error) {
//     console.error("Error fetching wiki data:", error);
//     setWikiName("");
//   }
// }
