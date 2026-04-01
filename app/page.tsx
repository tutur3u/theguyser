"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { APPS, LAUNCH_ANIMATION_STORAGE_KEY } from "@/components/portfolio/data";
import { PortfolioPanels } from "@/components/portfolio/panels";
import { PortfolioHeader, PortfolioFooter, LaunchOverlay, TabletDialog } from "@/components/portfolio/chrome";
import { WaraWaraPlaza } from "@/components/portfolio/common";
import { DashboardMenu } from "@/components/portfolio/menu";
import { useDashboardNavigation } from "@/components/portfolio/use-dashboard-navigation";
import type { AppDefinition, AppId, ThemeMode } from "@/components/portfolio/types";

export default function PortfolioPage() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [activeApp, setActiveApp] = useState<AppDefinition | null>(null);
  const [launchingApp, setLaunchingApp] = useState<AppDefinition | null>(null);
  const [launchAnimationEnabled, setLaunchAnimationEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(LAUNCH_ANIMATION_STORAGE_KEY) === "true";
  });
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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LAUNCH_ANIMATION_STORAGE_KEY, String(launchAnimationEnabled));
  }, [launchAnimationEnabled]);

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
    }, 1500);
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
    <main className="wii-bg relative flex min-h-screen flex-col overflow-hidden">
      <WaraWaraPlaza />

      <PortfolioHeader isDark={resolvedTheme === "dark"} mounted={themeReady} onThemeToggle={handleThemeToggle} time={time} />

      <div className="z-10 flex flex-1 items-center justify-center p-4 pb-24 md:p-8">
        <DashboardMenu onAppClick={handleAppClick} selectedMenuId={selectedMenuId} setMenuButtonRef={setMenuButtonRef} />
      </div>

      <PortfolioFooter />

      <LaunchOverlay launchingApp={launchAnimationEnabled ? launchingApp : null} />

      <TabletDialog activeApp={activeApp} onClose={closeActiveApp}>
        {activeApp ? (
          <PortfolioPanels
            id={activeApp.id}
            options={{
              launchAnimationEnabled,
              onLaunchApp: handleLaunchApp,
              setLaunchAnimationEnabled,
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
