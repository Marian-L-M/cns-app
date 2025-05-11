import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import IconPickerButton from "./IconPickerButton";
import IconGrid from "./IconGrid";

interface iconButton {
  name: string;
  url: string;
}

export default function IconPicker() {
  const [openIconPicker, setOpenIconPicker] = useState<boolean>(false);
  const iconList: iconButton[] = [
    { name: "airplane", url: "objects/icons/airplane.svg" },
    { name: "airship_submarine", url: "objects/icons/airship_submarine.svg" },
    { name: "alert_error", url: "objects/icons/alert_error.svg" },
    { name: "anchor", url: "objects/icons/anchor.svg" },
    { name: "aperture", url: "objects/icons/aperture.svg" },
    { name: "arrow_down", url: "objects/icons/arrow_down.svg" },
    { name: "arrow_gps", url: "objects/icons/arrow_gps.svg" },
    { name: "arrow_join_path", url: "objects/icons/arrow_join_path.svg" },
    { name: "arrow_up", url: "objects/icons/arrow_up.svg" },
    { name: "art_canvas", url: "objects/icons/art_canvas.svg" },
    { name: "atom", url: "objects/icons/atom.svg" },
  ];

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
            <IconGrid
              iconList={iconList}
              setOpenIconPicker={setOpenIconPicker}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
