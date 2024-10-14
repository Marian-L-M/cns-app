"use-client";
import { useState } from "react";
import ColorBox from "./ColorBox";
import ColorPanel from "./ColorPanel";
import ColorPickerButton from "./ColorPickerButton";
import { AnimatePresence, motion } from "framer-motion";

interface ColorPickerProps {
  icon: React.ReactNode;
  label: string;
  editorContext: string;
}

const LineColorPicker = (props: ColorPickerProps) => {
  const { icon, label, editorContext } = props;
  const [openFillColorPicker, setOpenFillColorPicker] =
    useState<boolean>(false);
  return (
    <div className="relative z-100">
      <ColorPickerButton
        icon={icon}
        openColorPicker={openFillColorPicker}
        setOpenColorPicker={setOpenFillColorPicker}
      />
      <AnimatePresence>
        {openFillColorPicker && (
          <motion.div
            transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            <ColorBox label={label}>
              <ColorPanel
                setOpenColorPicker={setOpenFillColorPicker}
                editorContext={editorContext}
              />
            </ColorBox>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LineColorPicker;
