import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormSetValue } from "react-hook-form";
// import { Image } from "lucide-react";
// import NextImage from "next/image";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface SelectIconProps {
  path: string;
  currentIcon: string;
  setValue: UseFormSetValue<any>;
  trigger?: React.ReactNode;
}

const iconList = [
  {
    name: "swords",
    url: "/icons/story/swords.svg",
  },
  //   {
  //     name: "shield",
  //     url: "/icons/story/shield.svg",
  //   },
  //   {
  //     name: "castle",
  //     url: "/icons/story/castle.svg",
  //   },
  //   {
  //     name: "crown",
  //     url: "/icons/story/crown.svg",
  //   },
  //   {
  //     name: "home",
  //     url: "/icons/story/home.svg",
  //   },
  //   {
  //     name: "mountain",
  //     url: "/icons/story/mountain.svg",
  //   },
  //   {
  //     name: "forest",
  //     url: "/icons/story/forest.svg",
  //   },
  //   {
  //     name: "water",
  //     url: "/icons/story/water.svg",
  //   },
  //   {
  //     name: "sun",
  //     url: "/icons/story/sun.svg",
  //   },
  //   {
  //     name: "moon",
  //     url: "/icons/story/moon.svg",
  //   },
  // Add more icons as needed
];

export default function SelectIcon({
  path,
  currentIcon,
  setValue,
  trigger,
}: SelectIconProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Find the current icon data based on URL
  const currentIconData = iconList.find((icon) => icon.url === currentIcon);

  // Filter icons based on search term
  const filteredIcons = iconList.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconUrl: string) => {
    setValue(path, iconUrl);
    setIsOpen(false);
  };

  const handleClearIcon = () => {
    setValue(path, "");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
          >
            {currentIcon ? (
              <Image
                src={currentIcon}
                alt="Selected icon"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            ) : (
              <ImageIcon size={20} />
            )}
            {currentIconData?.name || "Select Icon"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search input */}
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Current selection display */}
          {currentIcon && currentIconData && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Image
                  src={currentIcon}
                  alt={currentIconData.name}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">
                  {currentIconData.name}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearIcon}
              >
                Clear
              </Button>
            </div>
          )}

          {/* Icon grid */}
          <div className="h-80 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2 p-2">
              {filteredIcons.map((icon) => {
                const isSelected = currentIcon === icon.url;

                return (
                  <button
                    key={icon.url}
                    type="button"
                    onClick={() => handleIconSelect(icon.url)}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-md border transition-colors
                      hover:bg-gray-100 hover:border-gray-300
                      ${
                        isSelected
                          ? "bg-blue-100 border-blue-300 text-blue-700"
                          : "bg-white border-gray-200"
                      }
                    `}
                    title={icon.name}
                  >
                    <Image
                      src={icon.url}
                      alt={icon.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 mb-1"
                    />
                    <span className="text-xs truncate w-full text-center">
                      {icon.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No icons found matching `&quot;`{searchTerm}`&quot;`
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
