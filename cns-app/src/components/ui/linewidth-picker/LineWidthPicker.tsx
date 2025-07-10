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
    <div className="w-full">
      {/* <LineWidthBox>
        <LineWidthPanel setOpenLineWidthPicker={setOpenLineWidthPicker} />
      </LineWidthBox> */}
      <LineWidthBox />
    </div>
  );
}
