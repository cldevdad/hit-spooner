export * from "./blueTheme";
export * from "./darkTheme";
export * from "./lightTheme";
export * from "./greenTheme";
export * from "./newsTheme";
export * from "./purpleTheme";
export * from "./pinkTheme";
export * from "./steelTheme";
export * from "./newsTheme";

export enum ThemeKey {
  LIGHT = "light",
  DARK = "dark",
  GREEN = "green",
  PURPLE = "purple",
  PINK = "pink",
  NEWS = "news",
  STEEL = "steel",
  BLUE = "blue",
}

export const themeOptions = [
  { value: ThemeKey.LIGHT, label: "Morning Stir" },
  { value: ThemeKey.DARK, label: "Shadowed Scoop" },
  { value: ThemeKey.BLUE, label: "Blue Stew" },
  { value: ThemeKey.GREEN, label: "Leafy Mix" },
  { value: ThemeKey.PURPLE, label: "Royal Spoon" },
  { value: ThemeKey.PINK, label: "Sweet Dip" },
  { value: ThemeKey.NEWS, label: "Daily Feed" },
  { value: ThemeKey.STEEL, label: "Metal Spork" },
];
