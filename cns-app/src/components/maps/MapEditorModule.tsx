"use client";
import { useMapEditor } from "@/hooks/useMapEditor";
import { Button } from "../ui/button";
import ColorPicker from "../ui/colorPicker/ColorPicker";
import { Palette } from "lucide-react";

import { useContext, useState } from "react";
import { EditorContext } from "@/store/mapEditorContext";
import { set, z } from "zod";
import { GlobalArea } from "@prisma/client";
import axios from "axios";
import { GlobalAreasSchema } from "@/ValidationSchemas/global";
import { useRouter } from "next/navigation";

interface GlobalAreaProps {
  globalArea?: GlobalArea;
}

function MapEditorModule({ globalArea }: GlobalAreaProps) {
  const { canvasRef, nodeList, styles } = useMapEditor();
  const editorCtx = useContext(EditorContext);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // To do - make this dynamic
  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }
  const styleCheck = (event: any) => {
    event.preventDefault();
    console.log(editorCtx.objectColor);
  };

  //241004 - Issue with apllying styles to canvas
  // Updating styles will create new context
  // Current object will not be updated/remains as a dead object
  // Proceed with submission logic and isolating each drawn object, before returning to this issue
  styles.fillStyle = editorCtx.objectColor;

  const constructSubmissionData = () => {
    return {
      title: "Crowland2",
      description: "A multicultural nation in the Northern Heart of Kamolin",
      imageUrl: "/placeholder.pnh",
      mapId: 2, // Required field from schema
      nodes: nodeList || null,
      styles: {
        fillStyle: styles.fillStyle || "rgba(0, 0, 0, 0.5)",
        lineWidth: typeof styles.lineWidth === "number" ? styles.lineWidth : 5,
        strokeStyle: styles.strokeStyle || "black",
      },
      objectTime: 1000,
      type: "GEOGRAPHY",
      infobox: null,
      wikiId: 2,
    };
  };

  // const onSubmitHandler = (event: any) => {
  //   event.preventDefault();
  //   console.log("Submit");
  //   console.log(nodeList);
  //   console.log(styles);
  // };

  // To do: How to get map id?
  // const testSubmit = async (values: z.infer<typeof GlobalAreasSchema>) => {
  const testSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const submissionData = constructSubmissionData();
      console.log("Submitting data:", submissionData); // Debug log

      // Validate the data before sending
      const validatedData = GlobalAreasSchema.parse(submissionData);
      console.log("Validated data:", validatedData); // Debug log

      if (globalArea) {
        await axios.patch(`/api/globalarea/${globalArea.id}`, validatedData);
      } else {
        await axios.post("/api/globalarea", validatedData);
      }
      setIsSubmitting(false);
      router.push("/maps/create");
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(
          "Validation error: " + error.errors.map((e) => e.message).join(", ")
        );
        console.error("Validation error:", error.errors);
      } else if (axios.isAxiosError(error)) {
        setError(
          `Server error: ${error.response?.data?.message || error.message}`
        );
        console.error("Server response:", error.response?.data);
      } else {
        setError("An unexpected error occurred");
        console.error("Unknown error:", error);
      }
    }
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
          {/* <Button onClick={onSubmitHandler}>Submit</Button> */}
          {/* <Button onClick={styleCheck}>Style</Button> */}
          <Button onClick={testSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Test Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MapEditorModule;

// 20241004 Next actions
// Map editor is designed to be a popup module on top of the map.
// For now: One area - one popup
// 1. Create API endpoint for GlobalArea (patch)
// 2. Create API endpoint for GlobalArea (post)
// 3. Create API endpoint for GlobalArea (delete)
// 4. Change Mapeditor module to a form
