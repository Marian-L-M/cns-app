"use-client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import LineWidthBox from "./LineWidthBox";
import LineWidthPanel from "./LineWidthPanel";
import LineWidthPickerButton from "./LineWidthPickerButton";

interface LineWidthPickerProps {
  icon: React.ReactNode;
}

export default function LineWidthPicker(props: LineWidthPickerProps) {
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
              <LineWidthPanel setOpenLineWidthPicker={setOpenLineWidthPicker} />
            </LineWidthBox>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
