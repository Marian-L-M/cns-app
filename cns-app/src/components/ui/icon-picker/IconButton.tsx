import Image from "next/image";

import { Button } from "@/components/ui/button";

interface IconProps {
  name: string;
  url: string;
}

interface IconButtonProps {
  icon: IconProps;
  setSelectedIcon: React.Dispatch<React.SetStateAction<IconProps>>;
}

export default function IconButton({ icon, setSelectedIcon }: IconButtonProps) {
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
        src={`/${icon.url}`}
        alt={icon.name}
        width={40}
        height={40}
      />
    </Button>
  );
}
