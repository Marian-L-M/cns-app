"use-client";
import { useState } from "react";
import ColorPickerButton from "./ColorPickerButton";
import ColorBox from "./ColorBox";
import { AnimatePresence, motion } from "framer-motion";
import ColorPanel from "./ColorPanel";

interface ColorPickerProps {
  icon: React.ReactNode;
}

const ColorPicker = (props: ColorPickerProps) => {
  const { icon } = props;
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
  return (
    <div className="relative z-100">
      <ColorPickerButton
        icon={icon}
        openColorPicker={openColorPicker}
        setOpenColorPicker={setOpenColorPicker}
      />
      <AnimatePresence>
        {openColorPicker && (
          <motion.div
            transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            <ColorBox>
              <ColorPanel />
            </ColorBox>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
