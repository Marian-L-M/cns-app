import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IconPickerButton from "./IconPickerButton";

interface IconPickerProps {
  editorContext: string;
}

function IconPicker(editorContext: IconPickerProps) {
  const [openIconPicker, setOpenIconPicker] = useState<boolean>(false);
  return (
    <div>
      <IconPickerButton
        openIconPicker={openIconPicker}
        setOpenIconPicker={setOpenIconPicker}
      />
      <AnimatePresence>
        {openIconPicker && <div>Grid of icons</div>}
      </AnimatePresence>
    </div>
  );
}

export default IconPicker;
