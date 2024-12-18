import { Button } from "../button";
import IconButton from "./IconButton";

interface IconButtonProps {
  name: string;
  url: string;
}

interface IconGridProps {
  iconList: IconButtonProps[];
}

function IconGrid({ iconList }: IconGridProps) {
  const handleButtonClick = () => {
    alert("let's goooo!");
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      {iconList.map((icon) => (
        <Button onClick={handleButtonClick}>
          <IconButton icon={icon} />
        </Button>
      ))}
    </div>
  );
}

export default IconGrid;
