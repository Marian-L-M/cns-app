export const PageSettingsList = {
  mainTitle: "Add Main Title",
  subTitle: "Add Subtitle",
  text: "Add Text",
} as const;

export const ToggleMasterMapSettingsList = {
  mastermapId: "Set Mastermap",
  ...PageSettingsList,
} as const;

export const AllSettingsList = {
  ...ToggleMasterMapSettingsList,
} as const;
