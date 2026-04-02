import type { LucideIcon } from "lucide-react";

export type AppId =
  | "about"
  | "skills"
  | "browser"
  | "contact"
  | "experience"
  | "miiverse"
  | "awards"
  | "gallery"
  | "music"
  | "github"
  | "friends"
  | "eshop";

export type ScreenId = AppId | "disc";

export type ThemeMode = "light" | "dark" | "system";

export type AppDefinition = {
  id: ScreenId;
  title: string;
  icon: LucideIcon;
  color: string;
  size: string;
  artwork?: string[];
};

export type Project = {
  id: string;
  category: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  image: string;
};

export type ResourceLink = {
  id: string;
  label: string;
  note: string;
  href: string;
  icon: LucideIcon;
  color: string;
  appId?: AppId;
};

export type FocusArea = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

export type AppRenderOptions = {
  launchAnimationEnabled: boolean;
  launchAnimationDuration: number;
  onLaunchApp: (appId: AppId) => void;
  rememberPreferences: boolean;
  setLaunchAnimationEnabled: (enabled: boolean) => void;
  setLaunchAnimationDuration: (duration: number) => void;
  setRememberPreferences: (enabled: boolean) => void;
  setThemeMode: (theme: ThemeMode) => void;
  themeMode: ThemeMode;
  themeReady: boolean;
};
