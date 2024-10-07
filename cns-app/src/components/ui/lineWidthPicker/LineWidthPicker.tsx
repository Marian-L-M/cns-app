"use-client";

import { useState } from "react";
import LineWidthPickerButton from "./LineWidthPickerButton";
import { AnimatePresence, motion } from "framer-motion";
import LineWidthBox from "./LineWidthBox";

interface LineWidthPickerProps {
  icon: React.ReactNode;
}

function LineWidthPicker(props: LineWidthPickerProps) {
  const { icon } = props;
  const [openLineWidthPicker, setOpenLineWidthPicker] =
    useState<boolean>(false);
  return (
    <div className="relative z-100">
      <LineWidthPickerButton
        icon={icon}
        openLineWidthPicker={openLineWidthPicker}
        setOpenLineWidthPicker={setOpenLineWidthPicker}
      />
      <AnimatePresence>
        {openLineWidthPicker && (
          <motion.div
            transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            <LineWidthBox>
              {/* <ColorPanel setOpenColorPicker={setOpenColorPicker} /> */}
            </LineWidthBox>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LineWidthPicker;
