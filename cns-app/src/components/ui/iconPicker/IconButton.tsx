import Image from "next/image";
interface IconButtonProps {
  name: string;
  url: string;
}

interface IconProps {
  icon: IconButtonProps;
}

function IconButton({ icon }: IconProps) {
  return (
    <Image
      key={icon.name}
      src={icon.url}
      alt={icon.name}
      width={40}
      height={40}
    />
  );
}

export default IconButton;
