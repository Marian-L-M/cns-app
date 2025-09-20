export const PageSettingsList = {
  mainTitle: "Main Title",
  mainText: "Main Text",
  subTitle: "Subtitle",
  text: "Text",
} as const;

export const ToggleMasterMapSettingsList = {
  mastermapId: "Mastermap",
  ...PageSettingsList,
} as const;

export const ToggleWikiSettingsList = {
  setFeaturedWikis: "Featured section",
  setExploreWikis: "Explore section",
  setNewWikis: "New section",
  ...PageSettingsList,
} as const;

export const ToggleStorySettingsList = {
  storyId: "Main story",
  setStoryList: "Story list",
  setNewStories: "New story section",
  setExploreStories: "Explore section",
  setFeaturedStories: "Featured section",
  ...PageSettingsList,
} as const;

export const ToggleMapSettingsList = {
  mapId: "Map",
  mastermapId: "Master Map",
  setNewMaps: "New Map Section",
  setNewMasterMaps: "New Mastermap section",
  setExploreMaps: "Explore maps",
  setExploreMasterMaps: "Explore Mastermaps",
  setFeaturedMaps: "Featured maps",
  setFeaturedMasterMaps: "Featured Mastermaps",
  ...PageSettingsList,
} as const;

export const AllSettingsList = {
  ...ToggleMasterMapSettingsList,
} as const;

export const ToggleGlobalSettingsList = {
  logo: "System display logo",
  name: "System display name",
} as const;
