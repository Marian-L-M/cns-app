import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Props {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  storyIndex: number;
  setStoryIndex: (index: number) => void;
  storyData: {
    title?: string;
    description?: string;
    storyId: number;
    nodes?: StoryNode[];
  };
}

interface StoryNode {
  id: number;
  name: string;
  description: string;
  timeEnd: number;
  timeStart: number;
  x: number;
  y: number;
}

export default function StoryDrawer({
  storyData,
  storyIndex,
  setStoryIndex,
  drawerOpen,
  setDrawerOpen,
}: Props) {
  function changeStoryNodeIndex(increment: number) {
    const storyLength = storyData?.nodes?.length;
    if (
      storyLength &&
      storyLength > storyIndex + increment &&
      storyIndex + increment >= 0
    ) {
      setStoryIndex(storyIndex + increment);
    }
  }

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{storyData?.title}</DrawerTitle>
          <DrawerDescription>{storyData?.description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 py-4 px-8">
          <div className="flex gap-4" id="story-progress">
            {storyData?.nodes?.map((node) => {
              return (
                <div key={`progress-node-${node.id}`}>
                  {node.name}{" "}
                  {node.id == storyData?.nodes?.[storyIndex].id && (
                    <span>(active)</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => changeStoryNodeIndex(-1)}
              id="prev-story-node"
            >
              Previous
            </Button>
            <div id="story-node-text">
              <h4>{storyData?.nodes?.[storyIndex].name}</h4>
              <p>{storyData?.nodes?.[storyIndex].description}</p>
            </div>
            <Button
              onClick={() => changeStoryNodeIndex(1)}
              id="next-story-node"
            >
              Next
            </Button>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Hide</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
