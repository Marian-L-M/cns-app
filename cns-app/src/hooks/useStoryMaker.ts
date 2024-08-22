import { useEffect, useRef, useContext } from "react";
import { drawAreas } from "@/lib/map/drawMap";
import {
  checkClick,
  checkHover,
  checkObjectClick,
} from "@/lib/map/mouseActions";
import { StatusContext } from "@/store/statusContext";

export const useStoryMaker = ({ data, story }: StoryModuleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mapAreas, mapObjects } = data;
  const statusCtx = useContext(StatusContext);

  useEffect(() => {
    // Set canvas
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Areas
    // 240811 Unify draw functions or keep together for future expansion?
    if (mapAreas) {
      mapAreas.forEach((area) => {
        const styles = area.styles;
        ctx.lineWidth = styles.lineWidth || 4;
        ctx.fillStyle = styles.fillStyle || "rgba(256, 256, 256, 0.2)";
        ctx.strokeStyle = styles.strokeStyle || "black";
        drawAreas(ctx, area, cw, ch);
      });
    }

    // TO DO 240816 Draw Objects
    // Draw Objects
    if (mapObjects) {
      mapObjects.forEach((object) => {
        const thumbSize = 40;
        const image = new Image(); // Using optional size for image
        image.src = `/${object.thumbUrl}`;
        image.onload = () => {
          ctx.drawImage(
            image,
            object.x * cw - thumbSize / 2,
            object.y * ch - thumbSize / 2,
            thumbSize,
            thumbSize
          );
        };
      });
    }

    // Draw Story Nodes
    // 240822 Nodes are drawn behind theimage by default, overwriting seems pretty painful, so might be smarter to split the canvas (into 3: image canvas, drawing/interaction canvas, animation canvas) in future iterations.
    if (story) {
      story.forEach((storyObject) => {
        let previousNode: Point;

        storyObject.nodes.forEach((node: storyNode) => {
          // Draw Story Line
          if (previousNode) {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.moveTo(previousNode.x * cw, previousNode.y * ch);
            ctx.lineTo(node.x * cw, node.y * ch);
            ctx.closePath;
            ctx.stroke();
          }
          previousNode = { x: node.x, y: node.y };
        });
        storyObject.nodes.forEach((node: storyNode) => {
          // Draw Current Story node
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.moveTo((node.x - 5) * cw, (node.y - 5) * ch);
          ctx.lineTo((node.x + 5) * cw, (node.y - 5) * ch);
          ctx.lineTo((node.x + 5) * cw, (node.y + 5) * ch);
          ctx.lineTo((node.x - 5) * cw, (node.y + 5) * ch);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        });
      });
    }

    // Hover actions
    //240814 Split hover actions into floating label (Currenlty statusbar)
    canvas.onmousemove = (e) => {
      const hoverArea = checkHover(e, canvas, mapAreas, ctx, cw, ch);
      if (!hoverArea || hoverArea.length == 0) return;
      checkHover(e, canvas, mapAreas, ctx, cw, ch);
      const { title, id, type } = hoverArea[0];
      statusCtx.showStatusBar({
        title: title,
        id: id,
        type: type,
      });
    };

    // Click actions
    // 240814 Split click actions to show infobox
    // 240818 Join mapAreas and mapObjects click events
    canvas.onmousedown = (e) => {
      // Check areas
      const clickedArea = checkClick(e, canvas, mapAreas, ctx, cw, ch);
      if (clickedArea && !(clickedArea.length == 0)) {
        const { title, id, type } = clickedArea[0];
        statusCtx.showInfoBox({
          title: title,
          id: id,
          type: type,
        });
      }

      // Check objects
      const clickedObjects = checkObjectClick(
        e,
        canvas,
        mapObjects,
        ctx,
        cw,
        ch
      );
      if (clickedObjects && !(clickedObjects.length == 0)) {
        const { title, id, type } = clickedObjects[0];
        statusCtx.showInfoBox({
          title: title,
          id: id,
          type: type,
        });
      }
    };
  }, []);

  return { canvasRef };
};
