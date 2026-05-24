"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  DEFAULT_PORTFOLIO_CONTENT,
  DEFAULT_LAUNCH_ANIMATION_DURATION,
  DEFAULT_LAUNCH_ANIMATION_ENABLED,
  getPortfolioApps,
  getPortfolioDiscApp,
  getPortfolioMenuItems,
  LAUNCH_ANIMATION_SPEED_OPTIONS,
  LAUNCH_ANIMATION_STORAGE_KEY,
  PORTFOLIO_PREFERENCES_STORAGE_KEY,
} from "@/components/portfolio/data";
import { PortfolioPanels } from "@/components/portfolio/panels";
import { PortfolioHeader, PortfolioFooter, LaunchOverlay, TabletDialog } from "@/components/portfolio/chrome";
import { WaraWaraPlaza } from "@/components/portfolio/common";
import { DashboardMenu } from "@/components/portfolio/menu";
import { useDashboardNavigation } from "@/components/portfolio/use-dashboard-navigation";
import type {
  AppDefinition,
  AppId,
  FocusArea,
  PortfolioContent,
  ResourceLink,
  ThemeMode,
} from "@/components/portfolio/types";

type SerializableContentPayload = Partial<
  Pick<PortfolioContent, "gameProjects" | "profile" | "researchProjects" | "showreelItems">
> & {
  focusAreas?: Array<Omit<FocusArea, "icon">>;
  resourceLinks?: Array<Omit<ResourceLink, "icon">>;
};

function mergeResourceLinks(
  current: ResourceLink[],
  incoming: Array<Omit<ResourceLink, "icon">> | undefined,
) {
  if (!incoming?.length) {
    return current;
  }

  const incomingById = new Map(incoming.map((resource) => [resource.id, resource]));
  const merged = current.map((fallback, index) => {
    const resource = incomingById.get(fallback.id) ?? incoming[index];

    if (!resource) {
      return fallback;
    }

    incomingById.delete(resource.id);

    return {
      ...fallback,
      ...resource,
      icon: fallback.icon,
    };
  });

  for (const resource of incomingById.values()) {
    const fallback =
      current.find((item) => item.id === resource.id) ??
      DEFAULT_PORTFOLIO_CONTENT.resourceLinks[0];

    merged.push({
      ...fallback,
      ...resource,
      icon: fallback.icon,
    });
  }

  return merged;
}

function mergeFocusAreas(
  current: FocusArea[],
  incoming: Array<Omit<FocusArea, "icon">> | undefined,
) {
  if (!incoming?.length) {
    return current;
  }

  return incoming.map((area, index) => {
    const fallback =
      current.find((item) => item.title === area.title) ??
      current[index] ??
      DEFAULT_PORTFOLIO_CONTENT.focusAreas[0];

    return {
      ...fallback,
      ...area,
      icon: fallback.icon,
    };
  });
}

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
    const controller = new AbortController();

    async function loadContent() {
      try {
        const response = await fetch("/api/content", {
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          content?: SerializableContentPayload | null;
        };

        if (!payload.content) {
          return;
        }

        setContent((current) => ({
          ...current,
          focusAreas: mergeFocusAreas(current.focusAreas, payload.content?.focusAreas),
          gameProjects: payload.content?.gameProjects ?? current.gameProjects,
          profile: payload.content?.profile ?? current.profile,
          researchProjects: payload.content?.researchProjects ?? current.researchProjects,
          resourceLinks: mergeResourceLinks(current.resourceLinks, payload.content?.resourceLinks),
          showreelItems: payload.content?.showreelItems ?? current.showreelItems,
        }));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("[theguyser] Failed to load portfolio content", error);
        }
      }
    }

    void loadContent();

    return () => {
      controller.abort();
    };
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
    const nextApp = apps.find((app) => app.id === appId);

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

      <PortfolioHeader
        isDark={resolvedTheme === "dark"}
        mounted={themeReady}
        onThemeToggle={handleThemeToggle}
        profile={content.profile}
        time={time}
      />

      <div className="z-10 flex flex-1 items-start justify-center px-4 pb-12 pt-6 sm:px-5 sm:pb-16 sm:pt-8 md:items-center md:px-8 md:pb-24 md:pt-8">
        <DashboardMenu
          discApp={discApp}
          menuItems={menuItems}
          onAppClick={handleAppClick}
          profile={content.profile}
          selectedMenuId={selectedMenuId}
          setMenuButtonRef={setMenuButtonRef}
          setSelectedMenuId={setSelectedMenuId}
        />
      </div>

      <PortfolioFooter />

      <LaunchOverlay animationDuration={launchAnimationDuration} launchingApp={launchAnimationEnabled ? launchingApp : null} />

      <TabletDialog activeApp={activeApp} onClose={closeActiveApp} profile={content.profile}>
        {activeApp ? (
          <PortfolioPanels
            content={content}
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
