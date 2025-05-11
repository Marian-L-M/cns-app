import clsx from "clsx";
import { motion } from "framer-motion";
import { Image } from "lucide-react";

interface ButtonProps {
  openIconPicker: boolean;
  setOpenIconPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IconPickerButton(props: ButtonProps) {
  const { openIconPicker, setOpenIconPicker } = props;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenIconPicker(!openIconPicker);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "text-sm h-10 bg-slate-900 font-medium rounded-full border border-slate-600 p-2 relative transition-colors duration-75 text-slate-500",
        openIconPicker ? "text-slate-300" : "text-slate-500"
      )}
      onClick={handleClick}
    >
      <Image />
    </motion.button>
  );
}
