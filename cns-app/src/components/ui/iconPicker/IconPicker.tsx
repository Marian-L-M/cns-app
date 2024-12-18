import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IconPickerButton from "./IconPickerButton";
import IconGrid from "./IconGrid";

interface IconPickerProps {
  editorContext: string;
}

interface iconButton {
  name: string;
  url: string;
}

function IconPicker(editorContext: IconPickerProps) {
  const [openIconPicker, setOpenIconPicker] = useState<boolean>(false);
  const iconList: iconButton[] = [
    { name: "airship", url: "/objects/icons/airship.svg" },
  ];
  console.log(iconList);
  return (
    <div>
      <IconPickerButton
        openIconPicker={openIconPicker}
        setOpenIconPicker={setOpenIconPicker}
      />
      <AnimatePresence>
        {openIconPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <IconGrid iconList={iconList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IconPicker;
