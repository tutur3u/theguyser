"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  APPS,
  DEFAULT_LAUNCH_ANIMATION_DURATION,
  DEFAULT_LAUNCH_ANIMATION_ENABLED,
  LAUNCH_ANIMATION_SPEED_OPTIONS,
  LAUNCH_ANIMATION_STORAGE_KEY,
  PORTFOLIO_PREFERENCES_STORAGE_KEY,
} from "@/components/portfolio/data";
import { PortfolioPanels } from "@/components/portfolio/panels";
import { PortfolioHeader, PortfolioFooter, LaunchOverlay, TabletDialog } from "@/components/portfolio/chrome";
import { WaraWaraPlaza } from "@/components/portfolio/common";
import { DashboardMenu } from "@/components/portfolio/menu";
import { useDashboardNavigation } from "@/components/portfolio/use-dashboard-navigation";
import type { AppDefinition, AppId, ThemeMode } from "@/components/portfolio/types";

type PortfolioPreferences = {
  launchAnimationEnabled: boolean;
  launchAnimationDuration: number;
  rememberPreferences: boolean;
};

const DEFAULT_PREFERENCES: PortfolioPreferences = {
  launchAnimationEnabled: DEFAULT_LAUNCH_ANIMATION_ENABLED,
  launchAnimationDuration: DEFAULT_LAUNCH_ANIMATION_DURATION,
  rememberPreferences: true,
};

function normalizeLaunchAnimationDuration(value: number) {
  return LAUNCH_ANIMATION_SPEED_OPTIONS.includes(value as (typeof LAUNCH_ANIMATION_SPEED_OPTIONS)[number])
    ? value
    : DEFAULT_LAUNCH_ANIMATION_DURATION;
}

function readInitialPreferences(): PortfolioPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  const storedPreferences = window.localStorage.getItem(PORTFOLIO_PREFERENCES_STORAGE_KEY);

  if (storedPreferences) {
    try {
      const parsedPreferences = JSON.parse(storedPreferences) as Partial<PortfolioPreferences>;

      return {
        launchAnimationEnabled:
          typeof parsedPreferences.launchAnimationEnabled === "boolean"
            ? parsedPreferences.launchAnimationEnabled
            : DEFAULT_LAUNCH_ANIMATION_ENABLED,
        launchAnimationDuration:
          typeof parsedPreferences.launchAnimationDuration === "number"
            ? normalizeLaunchAnimationDuration(parsedPreferences.launchAnimationDuration)
            : DEFAULT_LAUNCH_ANIMATION_DURATION,
        rememberPreferences: parsedPreferences.rememberPreferences !== false,
      };
    } catch {}
  }

  const legacyLaunchAnimation = window.localStorage.getItem(LAUNCH_ANIMATION_STORAGE_KEY);

  if (legacyLaunchAnimation !== null) {
    return {
      ...DEFAULT_PREFERENCES,
      launchAnimationEnabled: legacyLaunchAnimation === "true",
    };
  }

  return DEFAULT_PREFERENCES;
}

export default function PortfolioPage() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [activeApp, setActiveApp] = useState<AppDefinition | null>(null);
  const [launchingApp, setLaunchingApp] = useState<AppDefinition | null>(null);
  const [preferences, setPreferences] = useState<PortfolioPreferences>(readInitialPreferences);
  const [time, setTime] = useState("");
  const { selectedMenuId, setMenuButtonRef, setSelectedMenuId } = useDashboardNavigation({
    disabled: activeApp !== null || launchingApp !== null,
  });
  const themeReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const themeMode: ThemeMode =
    theme === "light" || theme === "dark" || theme === "system" ? theme : "system";
  const { launchAnimationDuration, launchAnimationEnabled, rememberPreferences } = preferences;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace(/\s/g, "\u00A0"));
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!rememberPreferences) {
      window.localStorage.removeItem(PORTFOLIO_PREFERENCES_STORAGE_KEY);
      window.localStorage.removeItem(LAUNCH_ANIMATION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      PORTFOLIO_PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        launchAnimationDuration,
        launchAnimationEnabled,
        rememberPreferences,
      } satisfies PortfolioPreferences),
    );
    window.localStorage.removeItem(LAUNCH_ANIMATION_STORAGE_KEY);
  }, [launchAnimationDuration, launchAnimationEnabled, rememberPreferences]);

  const openApp = (app: AppDefinition, { fromDialog = false }: { fromDialog?: boolean } = {}) => {
    setSelectedMenuId(app.id);

    if (fromDialog || !launchAnimationEnabled) {
      setLaunchingApp(null);
      setActiveApp(app);
      return;
    }

    setLaunchingApp(app);
    window.setTimeout(() => {
      setActiveApp(app);
      setLaunchingApp(null);
    }, launchAnimationDuration * 1000);
  };

  const handleAppClick = (app: AppDefinition) => {
    openApp(app);
  };

  const handleLaunchApp = (appId: AppId) => {
    const nextApp = APPS.find((app) => app.id === appId);

    if (!nextApp) {
      return;
    }

    openApp(nextApp, { fromDialog: activeApp !== null });
  };

  const closeActiveApp = () => {
    setActiveApp(null);
  };

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <main className="wii-bg relative flex min-h-screen flex-col overflow-x-hidden">
      <WaraWaraPlaza />

      <PortfolioHeader isDark={resolvedTheme === "dark"} mounted={themeReady} onThemeToggle={handleThemeToggle} time={time} />

      <div className="z-10 flex flex-1 items-start justify-center px-4 pb-12 pt-6 sm:px-5 sm:pb-16 sm:pt-8 md:items-center md:px-8 md:pb-24 md:pt-8">
        <DashboardMenu onAppClick={handleAppClick} selectedMenuId={selectedMenuId} setMenuButtonRef={setMenuButtonRef} />
      </div>

      <PortfolioFooter />

      <LaunchOverlay animationDuration={launchAnimationDuration} launchingApp={launchAnimationEnabled ? launchingApp : null} />

      <TabletDialog activeApp={activeApp} onClose={closeActiveApp}>
        {activeApp ? (
          <PortfolioPanels
            id={activeApp.id}
            options={{
              launchAnimationDuration,
              launchAnimationEnabled,
              onLaunchApp: handleLaunchApp,
              rememberPreferences,
              setLaunchAnimationEnabled: (enabled) => setPreferences((current) => ({ ...current, launchAnimationEnabled: enabled })),
              setLaunchAnimationDuration: (duration) =>
                setPreferences((current) => ({
                  ...current,
                  launchAnimationDuration: normalizeLaunchAnimationDuration(duration),
                })),
              setRememberPreferences: (enabled) =>
                setPreferences((current) => ({
                  ...current,
                  rememberPreferences: enabled,
                })),
              setThemeMode: (nextTheme) => setTheme(nextTheme),
              themeMode,
              themeReady,
            }}
          />
        ) : null}
      </TabletDialog>
    </main>
  );
}
