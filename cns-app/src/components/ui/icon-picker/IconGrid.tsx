import { useState } from "react";
import IconButton from "./IconButton";

interface IconButtonProps {
  name: string;
  url: string;
}

interface IconGridProps {
  iconList: IconButtonProps[];
  setOpenIconPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IconGrid({
  iconList,
  setOpenIconPicker,
}: IconGridProps) {
  const [selectedIcon, setSelectedIcon] = useState({
    name: "",
    url: "",
  });

  return (
    <div className="grid grid-cols-8 gap-2">
      {iconList.map((icon) => (
        <IconButton
          key={`ib-${icon.name}`}
          icon={icon}
          selectedIcon={selectedIcon}
          setOpenIconPicker={setOpenIconPicker}
        />
      ))}
    </div>
  );
}
