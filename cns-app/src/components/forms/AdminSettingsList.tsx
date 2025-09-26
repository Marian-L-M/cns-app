"use client";
import { AdminSettings } from "@prisma/client";
import { Button } from "../ui/button";
import { useState } from "react";
import AdminSettingsItemForm from "./AdminSettingsItemForm";
import {
  PageSettingsList,
  ToggleMasterMapSettingsList,
  AllSettingsList,
  ToggleWikiSettingsList,
  ToggleStorySettingsList,
  ToggleMapSettingsList,
} from "@/lib/constants/settings";

import { Pen, PlusCircleIcon } from "lucide-react";
import DeleteButton from "../buttons/DeleteButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  AdminSettings: AdminSettings[];
  filter: string;
}

export default function AdminSettingsList({ AdminSettings, filter }: Props) {
  // Settings items
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentSettingsItem, setCurrentSettingsItem] = useState<
    AdminSettings | undefined
  >(undefined);
  const [currentSettingsType, setCurrentSettingsType] = useState<
    (typeof AllSettingsList)[keyof typeof AllSettingsList] | ""
  >("");

  console.log(currentSettingsItem);

  const showSettingsForm = (
    SettingsItem?: AdminSettings,
    settingsType?: string
  ) => {
    if (SettingsItem) {
      // Editing existing item
      setCurrentSettingsType(
        SettingsItem.type as (typeof AllSettingsList)[keyof typeof AllSettingsList]
      );
      setCurrentSettingsItem(SettingsItem);
    } else {
      // Adding new item
      if (settingsType) {
        console.log(settingsType);
        setCurrentSettingsType(
          settingsType as (typeof AllSettingsList)[keyof typeof AllSettingsList]
        );
      }
      setCurrentSettingsItem(undefined);
    }
    setIsDialogOpen(true);
    setIsDropdownOpen(false);
  };

  const activeSettingsSelection = (filter: string) => {
    switch (filter) {
      case "top":
        return ToggleMasterMapSettingsList;
      case "wiki":
        return ToggleWikiSettingsList;
      case "story":
        return ToggleStorySettingsList;
      case "map":
        return ToggleMapSettingsList;
      default:
        return PageSettingsList;
    }
  };

  const filteredSettings = AdminSettings.filter(
    (setting) => setting.subCategory === filter
  );

  return (
    <div className="w-full">
      {/* Style column */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full gap-2 flex items-center justify-between">
          <h4 className="text-lg capitalize">{filter}</h4>
          <div className="flex flex-wrap  justify-end gap-2">
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger>
                <PlusCircleIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Add settings item</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(activeSettingsSelection(filter)).map(
                  ([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => {
                        setCurrentSettingsType(
                          AllSettingsList[key as keyof typeof AllSettingsList]
                        );
                        showSettingsForm(undefined, key);
                      }}
                    >
                      {label}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <AdminSettingsItemForm
          adminSettingsItem={currentSettingsItem}
          category={"PAGE"}
          subCategory={filter}
          type={currentSettingsType}
          dialogOpen={isDialogOpen}
          setDialogOpen={setIsDialogOpen}
        />
        {/* Settings list */}
        <div className="p-4 border border-slate-200 rounded-md flex flex-col gap-2">
          {filteredSettings.map((setting) => (
            <div
              className="flex justify-between gap-2"
              key={`${setting.type}- ${setting.value.substring(0, 10)}`}
            >
              <div className="flex items-center gap-2">
                <h5 className="text-sm flex items-center justify-center text-bold border border-slate-300 rounded-md w-6 aspect-square">
                  {setting.order}
                </h5>
                <h5 className="text-md text-bold">{setting.type}:</h5>
                <span className="text-xs">
                  {setting.value.substring(0, 20)}
                </span>
              </div>
              <div className="btn-container flex gap-2">
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    showSettingsForm(setting);
                  }}
                >
                  <Pen />
                </Button>
                <DeleteButton
                  objectId={setting.id}
                  type="Settings"
                  path="settings"
                  redirect={`/admin/page`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
