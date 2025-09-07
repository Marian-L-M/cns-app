export const PageSettingsList = {
  mainTitle: "Add Main Title",
  mainText: "Add Main Text",
  subTitle: "Add Subtitle",
  text: "Add Text",
} as const;

export const ToggleMasterMapSettingsList = {
  mastermapId: "Set Mastermap",
  ...PageSettingsList,
} as const;

export const ToggleWikiSettingsList = {
  setFeaturedWikis: "Set featured section",
  setExploreWikis: "Set explore section",
  setNewWikis: "Set new section",
  ...PageSettingsList,
} as const;

export const AllSettingsList = {
  ...ToggleMasterMapSettingsList,
} as const;
