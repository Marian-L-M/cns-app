// Reference
// https://medium.com/@hafizularif/building-a-smooth-color-picker-component-with-next-js-and-framer-motion-dd3b89f6dcc2

// 241002 Todo
// Add state for actually saving the color
// Add regex HEX  &RGBA

import clsx from "clsx";
import { motion } from "framer-motion";

interface ButtonProps {
  icon: React.ReactNode;
  openColorPicker: boolean;
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ColorPickerButton(props: ButtonProps) {
  const { icon, openColorPicker, setOpenColorPicker } = props;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenColorPicker(!openColorPicker);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "text-sm h-10 bg-slate-900 font-medium rounded-full border border-slate-600 p-2 relative transition-colors duration-75 text-slate-500",
        openColorPicker ? "text-slate-300" : "text-slate-500"
      )}
      onClick={handleClick}
    >
      {icon}
    </motion.button>
  );
}
