"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  DEFAULT_LAUNCH_ANIMATION_DURATION,
  DEFAULT_LAUNCH_ANIMATION_ENABLED,
  DEFAULT_PORTFOLIO_CONTENT,
  getPortfolioApps,
  getPortfolioDiscApp,
  getPortfolioMenuItems,
  LAUNCH_ANIMATION_SPEED_OPTIONS,
} from "@/components/portfolio/data";
import { PortfolioFooter, PortfolioHeader, LaunchOverlay, TabletDialog } from "@/components/portfolio/chrome";
import { WaraWaraPlaza } from "@/components/portfolio/common";
import { DashboardMenu } from "@/components/portfolio/menu";
import { PortfolioPanels } from "@/components/portfolio/panels";
import { useDashboardNavigation } from "@/components/portfolio/use-dashboard-navigation";
import type { AppDefinition, AppId, PortfolioContent, ThemeMode } from "@/components/portfolio/types";
import {
  THEGUYSER_ADMIN_PREVIEW_MESSAGE,
  type TheGuyserAdminPreviewMessage,
} from "@/lib/theguyser-admin-preview";

type PortfolioPreferences = {
  launchAnimationDuration: number;
  launchAnimationEnabled: boolean;
  rememberPreferences: boolean;
};

const DEFAULT_PREFERENCES: PortfolioPreferences = {
  launchAnimationDuration: DEFAULT_LAUNCH_ANIMATION_DURATION,
  launchAnimationEnabled: DEFAULT_LAUNCH_ANIMATION_ENABLED,
  rememberPreferences: true,
};

function normalizeLaunchAnimationDuration(value: number) {
  return LAUNCH_ANIMATION_SPEED_OPTIONS.includes(value as (typeof LAUNCH_ANIMATION_SPEED_OPTIONS)[number])
    ? value
    : DEFAULT_LAUNCH_ANIMATION_DURATION;
}

function isPreviewMessage(value: MessageEvent["data"]): value is TheGuyserAdminPreviewMessage {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as Partial<TheGuyserAdminPreviewMessage>).type === THEGUYSER_ADMIN_PREVIEW_MESSAGE &&
      (value as Partial<TheGuyserAdminPreviewMessage>).content,
  );
}

export function TheGuyserAdminDraftPreviewClient() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [activeApp, setActiveApp] = useState<AppDefinition | null>(null);
  const [launchingApp, setLaunchingApp] = useState<AppDefinition | null>(null);
  const [preferences, setPreferences] = useState<PortfolioPreferences>(DEFAULT_PREFERENCES);
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_PORTFOLIO_CONTENT);
  const [time, setTime] = useState("");
  const themeReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const themeMode: ThemeMode =
    theme === "light" || theme === "dark" || theme === "system" ? theme : "system";
  const { launchAnimationDuration, launchAnimationEnabled, rememberPreferences } = preferences;
  const apps = useMemo(() => getPortfolioApps(content), [content]);
  const discApp = useMemo(() => getPortfolioDiscApp(content), [content]);
  const menuItems = useMemo(() => getPortfolioMenuItems(content), [content]);
  const { selectedMenuId, setMenuButtonRef, setSelectedMenuId } = useDashboardNavigation({
    disabled: activeApp !== null || launchingApp !== null,
    menuItems,
  });

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (isPreviewMessage(event.data)) {
        setContent(event.data.content);
      }
    };

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "theguyser:admin-preview-ready" }, "*");

    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace(/\s/g, "\u00A0"));
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

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

  const handleLaunchApp = (appId: AppId) => {
    const nextApp = apps.find((app) => app.id === appId);

    if (nextApp) {
      openApp(nextApp, { fromDialog: activeApp !== null });
    }
  };

  return (
    <main className="wii-bg relative flex min-h-screen flex-col overflow-x-hidden">
      <WaraWaraPlaza />
      <PortfolioHeader
        isDark={resolvedTheme === "dark"}
        mounted={themeReady}
        onThemeToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        profile={content.profile}
        time={time}
      />
      <div className="z-10 flex flex-1 items-start justify-center px-4 pb-12 pt-6 sm:px-5 sm:pb-16 sm:pt-8 md:items-center md:px-8 md:pb-24 md:pt-8">
        <DashboardMenu
          discApp={discApp}
          menuItems={menuItems}
          onAppClick={(app) => openApp(app)}
          profile={content.profile}
          selectedMenuId={selectedMenuId}
          setMenuButtonRef={setMenuButtonRef}
          setSelectedMenuId={setSelectedMenuId}
        />
      </div>
      <PortfolioFooter />
      <LaunchOverlay animationDuration={launchAnimationDuration} launchingApp={launchAnimationEnabled ? launchingApp : null} />
      <TabletDialog activeApp={activeApp} onClose={() => setActiveApp(null)} profile={content.profile}>
        {activeApp ? (
          <PortfolioPanels
            content={content}
            id={activeApp.id}
            options={{
              launchAnimationDuration,
              launchAnimationEnabled,
              onLaunchApp: handleLaunchApp,
              rememberPreferences,
              setLaunchAnimationDuration: (duration) =>
                setPreferences((current) => ({
                  ...current,
                  launchAnimationDuration: normalizeLaunchAnimationDuration(duration),
                })),
              setLaunchAnimationEnabled: (enabled) =>
                setPreferences((current) => ({ ...current, launchAnimationEnabled: enabled })),
              setRememberPreferences: (enabled) =>
                setPreferences((current) => ({ ...current, rememberPreferences: enabled })),
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
