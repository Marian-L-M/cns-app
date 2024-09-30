// Reference
// https://medium.com/@hafizularif/building-a-smooth-color-picker-component-with-next-js-and-framer-motion-dd3b89f6dcc2

import clsx from "clsx";
import { motion } from "framer-motion";

interface ButtonProps {
  icon: React.ReactNode;
  openColorPicker: boolean;
  setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const ColorPickerButton = (props: ButtonProps) => {
  const { icon, openColorPicker, setOpenColorPicker } = props;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "text-sm h-10 bg-slate-900 font-medium rounded-fill border border-slate-600 p-2 relative transition-colors duration-75 text-slate-500",
        openColorPicker ? "text-slate-300" : "text-slate-500"
      )}
      onClick={() => setOpenColorPicker(!openColorPicker)}
    >
      {icon}
    </motion.button>
  );
};

export default ColorPickerButton;
