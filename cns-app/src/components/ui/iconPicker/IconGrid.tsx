import { useState } from "react";
import IconButton from "./IconButton";
import SaveButton from "./SaveButton";

interface IconButtonProps {
  name: string;
  url: string;
}

interface IconGridProps {
  iconList: IconButtonProps[];
  setOpenIconPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

function IconGrid({ iconList, setOpenIconPicker }: IconGridProps) {
  const [selectedIcon, setSelectedIcon] = useState({
    name: "",
    url: "",
  });

  return (
    <div className="grid grid-cols-3 gap-2">
      {iconList.map((icon) => (
        <IconButton
          key={`ib-${icon.name}`}
          icon={icon}
          setSelectedIcon={setSelectedIcon}
        />
      ))}
      <SaveButton
        selectedIcon={selectedIcon}
        setOpenIconPicker={setOpenIconPicker}
      />
    </div>
  );
}

export default IconGrid;
