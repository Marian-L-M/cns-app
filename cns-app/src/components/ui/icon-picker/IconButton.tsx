import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EditorContext } from "@/store/mapEditorContext";
import { useContext } from "react";

interface IconProps {
  name: string;
  url: string;
}

interface IconButtonProps {
  icon: IconProps;
  selectedIcon: GlobalObjectType;
  setOpenIconPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IconButton({
  icon,
  selectedIcon,
  setOpenIconPicker,
}: IconButtonProps) {
  const editorCtx = useContext(EditorContext);
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    editorCtx.updateGlobalObjectSettings({
      name: icon.name,
      url: icon.url,
      x: editorCtx.globalObjectSettings.x || 100,
      y: editorCtx.globalObjectSettings.y || 100,
      size: 40,
      opacity: 100,
    });
    setOpenIconPicker(false);
  };

  const isActiveBtn = editorCtx.globalObjectSettings.name === icon.name;

  return (
    <Button
      onClick={handleButtonClick}
      variant={"outline"}
      disabled={isActiveBtn}
    >
      <Image
        key={icon.name}
        src={icon.url}
        alt={icon.name}
        width={28}
        height={28}
      />
    </Button>
  );
}
