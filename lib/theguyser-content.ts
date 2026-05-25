import {
  DEFAULT_PORTFOLIO_CONTENT,
  RESUME_PREVIEW_URL,
  RESUME_VIEW_URL,
} from "@/components/portfolio/data";
import { getTheGuyserCmsCoverageReport } from "@/lib/theguyser-cms-coverage";
import { findTheGuyserWebglPackageAsset } from "@/lib/theguyser-webgl";
import type {
  AppId,
  PortfolioAppTile,
  PortfolioContent,
  FocusArea,
  PortfolioPanelContent,
  PortfolioProfile,
  PortfolioQuickLaunchCard,
  PortfolioSiteConfig,
  Project,
  ResourceLink,
  ScreenId,
  ThemeMode,
} from "@/components/portfolio/types";

type JsonObject = Record<string, unknown>;

export type DeliveryBlock = {
  block_type: string;
  content: JsonObject | null;
  id: string;
  title: string | null;
};

export type DeliveryAsset = {
  alt_text: string | null;
  assetUrl: string | null;
  asset_type: string;
  block_id: string | null;
  entry_id: string | null;
  id: string;
  metadata: JsonObject;
  sort_order: number;
  source_url: string | null;
  stable_source_id?: string | null;
  storage_path: string | null;
};

export type DeliveryEntry = {
  assets: DeliveryAsset[];
  blocks: DeliveryBlock[];
  id: string;
  metadata: JsonObject;
  profile_data: JsonObject;
  published_at: string | null;
  slug: string;
  stable_source_id?: string | null;
  status: string;
  subtitle: string | null;
  summary: string | null;
  title: string;
};

export type DeliveryCollection = {
  collection_type: string;
  config: JsonObject | null;
  description: string | null;
  entries: DeliveryEntry[];
  id: string;
  slug: string;
  title: string;
};

export type TheGuyserDeliveryPayload = {
  adapter: string;
  canonicalProjectId: string;
  collections: DeliveryCollection[];
  generatedAt: string;
  loadingData: unknown;
  profileData: JsonObject;
  workspaceId: string;
};

function asRecord(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

const SCREEN_IDS = new Set<ScreenId>([
  "about",
  "awards",
  "contact",
  "disc",
  "experience",
  "gallery",
  "miiverse",
  "music",
  "resume",
  "skills",
]);

const APP_IDS = new Set<AppId>([
  "about",
  "awards",
  "contact",
  "experience",
  "gallery",
  "miiverse",
  "music",
  "resume",
  "skills",
]);

function asScreenId(value: unknown) {
  const id = asString(value);
  return id && SCREEN_IDS.has(id as ScreenId) ? (id as ScreenId) : null;
}

function asAppId(value: unknown) {
  const id = asString(value);
  return id && APP_IDS.has(id as AppId) ? (id as AppId) : null;
}

function asThemeMode(value: unknown) {
  const theme = asString(value);
  return theme === "light" || theme === "dark" || theme === "system" ? (theme as ThemeMode) : null;
}

function absolutizeUrl(baseUrl: string, value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const parsedBaseUrl = new URL(baseUrl);

  if (value.startsWith("/")) {
    return new URL(value, parsedBaseUrl.origin).toString();
  }

  return new URL(value, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

function getCollection(delivery: TheGuyserDeliveryPayload, slug: string) {
  return delivery.collections.find((collection) => collection.slug === slug) ?? null;
}

function getEntry(collection: DeliveryCollection | null, slug: string) {
  return collection?.entries.find((entry) => entry.slug === slug) ?? null;
}

function getMarkdown(entry: DeliveryEntry | null | undefined) {
  const block = entry?.blocks.find((item) => {
    const content = asRecord(item.content);
    return item.block_type === "markdown" && typeof content.markdown === "string";
  });

  return asString(asRecord(block?.content).markdown);
}

function getLeadImage(entry: DeliveryEntry | null | undefined, apiBaseUrl: string) {
  const asset = entry?.assets
    .filter((item) => item.asset_type === "image")
    .sort((left, right) => left.sort_order - right.sort_order)[0];

  return absolutizeUrl(apiBaseUrl, asset?.assetUrl ?? asset?.source_url ?? null);
}

function getProfile(
  delivery: TheGuyserDeliveryPayload,
  apiBaseUrl: string,
): PortfolioProfile {
  const profileEntry = getEntry(getCollection(delivery, "panel-content"), "profile");
  const profileData = asRecord(profileEntry?.profile_data);

  return {
    email: asString(profileData.email) ?? DEFAULT_PORTFOLIO_CONTENT.profile.email,
    image:
      getLeadImage(profileEntry, apiBaseUrl) ??
      asString(profileData.image) ??
      DEFAULT_PORTFOLIO_CONTENT.profile.image,
    intro: getMarkdown(profileEntry) ?? DEFAULT_PORTFOLIO_CONTENT.profile.intro,
    name: profileEntry?.title ?? DEFAULT_PORTFOLIO_CONTENT.profile.name,
    role: asString(profileData.role) ?? DEFAULT_PORTFOLIO_CONTENT.profile.role,
    summary: profileEntry?.summary ?? DEFAULT_PORTFOLIO_CONTENT.profile.summary,
  };
}

function toProject(entry: DeliveryEntry, apiBaseUrl: string): Project {
  const profileData = asRecord(entry.profile_data);
  const image =
    getLeadImage(entry, apiBaseUrl) ??
    asString(profileData.image) ??
    DEFAULT_PORTFOLIO_CONTENT.profile.image;
  const webglPackage = findTheGuyserWebglPackageAsset(entry);
  const playHref = webglPackage ? `/games/${entry.slug}` : undefined;

  return {
    actionLabel: asString(profileData.actionLabel) ?? "Open",
    category: asString(profileData.category) ?? "Project",
    description: entry.summary ?? getMarkdown(entry) ?? "",
    href: asString(profileData.href) ?? "#",
    id: entry.slug,
    image,
    playHref,
    title: entry.title,
  };
}

function getSiteConfig(delivery: TheGuyserDeliveryPayload): PortfolioSiteConfig {
  const entry = getEntry(getCollection(delivery, "site-config"), "global");
  const profileData = asRecord(entry?.profile_data);
  const fallback = DEFAULT_PORTFOLIO_CONTENT.siteConfig;

  return {
    defaultTheme: asThemeMode(profileData.defaultTheme) ?? fallback.defaultTheme,
    discTitle: asString(profileData.discTitle) ?? fallback.discTitle,
    launchAnimationDuration:
      asNumber(profileData.launchAnimationDuration) ?? fallback.launchAnimationDuration,
    launchAnimationEnabled:
      asBoolean(profileData.launchAnimationEnabled) ?? fallback.launchAnimationEnabled,
    rememberPreferences: asBoolean(profileData.rememberPreferences) ?? fallback.rememberPreferences,
    startLabel: asString(profileData.startLabel) ?? fallback.startLabel,
  };
}

function getAppTiles(delivery: TheGuyserDeliveryPayload): PortfolioAppTile[] {
  const navigation = getCollection(delivery, "navigation");
  const entries = navigation?.entries ?? [];

  if (entries.length === 0) {
    return DEFAULT_PORTFOLIO_CONTENT.appTiles;
  }

  return entries
    .map((entry, index) => {
      const profileData = asRecord(entry.profile_data);
      const id = asScreenId(profileData.appId) ?? asScreenId(entry.slug);

      if (!id) {
        return null;
      }

      const fallback =
        DEFAULT_PORTFOLIO_CONTENT.appTiles.find((tile) => tile.id === id) ??
        DEFAULT_PORTFOLIO_CONTENT.appTiles[index] ??
        DEFAULT_PORTFOLIO_CONTENT.appTiles[0];

      return {
        color: asString(profileData.color) ?? fallback.color,
        iconKey: asString(profileData.iconKey) ?? fallback.iconKey,
        id,
        size: asString(profileData.size) ?? fallback.size,
        sortOrder: asNumber(profileData.sortOrder) ?? fallback.sortOrder,
        title: entry.title || fallback.title,
        visible: asBoolean(profileData.visible) ?? fallback.visible,
      } satisfies PortfolioAppTile;
    })
    .filter((tile): tile is PortfolioAppTile => Boolean(tile))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

function getPanelContent(delivery: TheGuyserDeliveryPayload): Partial<Record<ScreenId, PortfolioPanelContent>> {
  const panelContent = getCollection(delivery, "panel-content");
  const entries = panelContent?.entries ?? [];
  const result: Partial<Record<ScreenId, PortfolioPanelContent>> = {
    ...DEFAULT_PORTFOLIO_CONTENT.panelContent,
  };

  for (const entry of entries) {
    const profileData = asRecord(entry.profile_data);
    const id = asScreenId(profileData.appId) ?? asScreenId(entry.slug);

    if (!id) {
      continue;
    }

    result[id] = {
      body: getMarkdown(entry) ?? result[id]?.body,
      description: entry.summary ?? result[id]?.description,
      eyebrow: asString(profileData.eyebrow) ?? result[id]?.eyebrow,
      title: entry.title || result[id]?.title || id,
    };
  }

  return result;
}

function getQuickLaunchCards(delivery: TheGuyserDeliveryPayload): PortfolioQuickLaunchCard[] {
  const quickLaunch = getCollection(delivery, "quick-launch");
  const entries = quickLaunch?.entries ?? [];

  if (entries.length === 0) {
    return DEFAULT_PORTFOLIO_CONTENT.quickLaunchCards;
  }

  return entries
    .map((entry, index) => {
      const profileData = asRecord(entry.profile_data);
      const appId = asAppId(profileData.appId);
      const section = asScreenId(profileData.section);

      if (!appId || !section) {
        return null;
      }

      const fallback =
        DEFAULT_PORTFOLIO_CONTENT.quickLaunchCards[index] ??
        DEFAULT_PORTFOLIO_CONTENT.quickLaunchCards[0];

      return {
        accent: asString(profileData.accent) ?? fallback.accent,
        appId,
        description: entry.summary ?? fallback.description,
        label: asString(profileData.label) ?? fallback.label,
        section,
        sortOrder: asNumber(profileData.sortOrder) ?? fallback.sortOrder,
        title: entry.title || fallback.title,
      } satisfies PortfolioQuickLaunchCard;
    })
    .filter((card): card is PortfolioQuickLaunchCard => Boolean(card))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

function getProjects(
  delivery: TheGuyserDeliveryPayload,
  apiBaseUrl: string,
  kind: "game" | "research",
) {
  const experience = getCollection(delivery, "experience");
  const entries =
    experience?.entries.filter((entry) => {
      const profileData = asRecord(entry.profile_data);
      return (asString(profileData.kind) ?? "game") === kind;
    }) ?? [];

  return entries.map((entry) => toProject(entry, apiBaseUrl));
}

function getResourceLinks(delivery: TheGuyserDeliveryPayload): ResourceLink[] {
  const contact = getCollection(delivery, "contact-social");
  const entries = contact?.entries ?? [];

  if (entries.length === 0) {
    return DEFAULT_PORTFOLIO_CONTENT.resourceLinks;
  }

  return entries.map((entry, index) => {
    const profileData = asRecord(entry.profile_data);
    const fallback =
      DEFAULT_PORTFOLIO_CONTENT.resourceLinks[index] ??
      DEFAULT_PORTFOLIO_CONTENT.resourceLinks[0];

    return {
      ...fallback,
      href: asString(profileData.href) ?? fallback.href,
      id: entry.slug,
      label: entry.title,
      note: entry.summary ?? fallback.note,
    };
  });
}

function getFocusAreas(delivery: TheGuyserDeliveryPayload): FocusArea[] {
  const focus = getCollection(delivery, "awards");
  const entries = focus?.entries ?? [];

  if (entries.length === 0) {
    return DEFAULT_PORTFOLIO_CONTENT.focusAreas;
  }

  return entries.map((entry, index) => {
    const profileData = asRecord(entry.profile_data);
    const fallback =
      DEFAULT_PORTFOLIO_CONTENT.focusAreas[index] ??
      DEFAULT_PORTFOLIO_CONTENT.focusAreas[0];

    return {
      ...fallback,
      bg: asString(profileData.bg) ?? fallback.bg,
      color: asString(profileData.color) ?? fallback.color,
      description: entry.summary ?? getMarkdown(entry) ?? fallback.description,
      title: entry.title,
    };
  });
}

function getShowreelItems(
  delivery: TheGuyserDeliveryPayload,
  fallbackProjects: Project[],
) {
  const showreel = getCollection(delivery, "showreel");
  const showreelEntries = showreel?.entries ?? [];

  if (showreelEntries.length > 0) {
    return showreelEntries
      .map((entry) => asString(asRecord(entry.profile_data).label) ?? entry.title)
      .filter(Boolean);
  }

  return fallbackProjects.length > 0
    ? fallbackProjects.map((project) => project.title)
    : DEFAULT_PORTFOLIO_CONTENT.showreelItems;
}

export function buildTheGuyserPortfolioData(
  delivery: TheGuyserDeliveryPayload | null | undefined,
  {
    apiBaseUrl,
  }: {
    apiBaseUrl: string;
  },
): PortfolioContent {
  if (!delivery || delivery.adapter !== "theguyser") {
    return DEFAULT_PORTFOLIO_CONTENT;
  }

  const coverage = getTheGuyserCmsCoverageReport(delivery);

  if (!coverage.complete) {
    return DEFAULT_PORTFOLIO_CONTENT;
  }

  const gameProjects = getProjects(delivery, apiBaseUrl, "game");
  const researchProjects = getProjects(delivery, apiBaseUrl, "research");
  const hasExperienceCollection = Boolean(getCollection(delivery, "experience"));
  const projects = [...gameProjects, ...researchProjects];

  return {
    appTiles: getAppTiles(delivery),
    focusAreas: getFocusAreas(delivery),
    gameProjects: hasExperienceCollection
      ? gameProjects
      : DEFAULT_PORTFOLIO_CONTENT.gameProjects,
    panelContent: getPanelContent(delivery),
    profile: getProfile(delivery, apiBaseUrl),
    quickLaunchCards: getQuickLaunchCards(delivery),
    researchProjects: hasExperienceCollection
      ? researchProjects
      : DEFAULT_PORTFOLIO_CONTENT.researchProjects,
    resourceLinks: getResourceLinks(delivery),
    showreelItems: getShowreelItems(delivery, projects),
    siteConfig: getSiteConfig(delivery),
  };
}

export const THEGUYSER_RESUME_PREVIEW_URL = RESUME_PREVIEW_URL;
export const THEGUYSER_RESUME_VIEW_URL = RESUME_VIEW_URL;
