import Image from "next/image";
import { Button } from "../button";
import { EditorContext } from "@/store/mapEditorContext";
import { useContext } from "react";
interface IconProps {
  name: string;
  url: string;
}

interface IconButtonProps {
  icon: IconProps;
  setSelectedIcon: React.Dispatch<React.SetStateAction<IconProps>>;
}

function IconButton({ icon, setSelectedIcon }: IconButtonProps) {
  const editorCtx = useContext(EditorContext);
  // console.log(editorCtx);
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedIcon({
      name: icon.name,
      url: icon.url,
    });
  };
  return (
    <Button onClick={handleButtonClick}>
      <Image
        key={icon.name}
        src={icon.url}
        alt={icon.name}
        width={40}
        height={40}
      />
    </Button>
  );
}

export default IconButton;
