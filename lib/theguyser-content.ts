import {
  DEFAULT_PORTFOLIO_CONTENT,
  RESUME_PREVIEW_URL,
  RESUME_VIEW_URL,
} from "@/components/portfolio/data";
import type {
  PortfolioContent,
  PortfolioProfile,
  Project,
  ResourceLink,
} from "@/components/portfolio/types";

type JsonObject = Record<string, unknown>;

type DeliveryBlock = {
  block_type: string;
  content: JsonObject | null;
  id: string;
  title: string | null;
};

type DeliveryAsset = {
  alt_text: string | null;
  assetUrl: string | null;
  asset_type: string;
  block_id: string | null;
  entry_id: string | null;
  id: string;
  metadata: JsonObject;
  sort_order: number;
  source_url: string | null;
  storage_path: string | null;
};

type DeliveryEntry = {
  assets: DeliveryAsset[];
  blocks: DeliveryBlock[];
  id: string;
  metadata: JsonObject;
  profile_data: JsonObject;
  published_at: string | null;
  slug: string;
  status: string;
  subtitle: string | null;
  summary: string | null;
  title: string;
};

type DeliveryCollection = {
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

  return {
    actionLabel: asString(profileData.actionLabel) ?? "Open",
    category: asString(profileData.category) ?? "Project",
    description: entry.summary ?? getMarkdown(entry) ?? "",
    href: asString(profileData.href) ?? "#",
    id: entry.slug,
    image,
    playHref: asString(profileData.playHref) ?? undefined,
    title: entry.title,
  };
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

  const gameProjects = getProjects(delivery, apiBaseUrl, "game");
  const researchProjects = getProjects(delivery, apiBaseUrl, "research");
  const hasExperienceCollection = Boolean(getCollection(delivery, "experience"));
  const projects = [...gameProjects, ...researchProjects];

  return {
    focusAreas: DEFAULT_PORTFOLIO_CONTENT.focusAreas,
    gameProjects: hasExperienceCollection
      ? gameProjects
      : DEFAULT_PORTFOLIO_CONTENT.gameProjects,
    profile: getProfile(delivery, apiBaseUrl),
    researchProjects: hasExperienceCollection
      ? researchProjects
      : DEFAULT_PORTFOLIO_CONTENT.researchProjects,
    resourceLinks: getResourceLinks(delivery),
    showreelItems:
      projects.length > 0
        ? projects.map((project) => project.title)
        : DEFAULT_PORTFOLIO_CONTENT.showreelItems,
  };
}

export const THEGUYSER_RESUME_PREVIEW_URL = RESUME_PREVIEW_URL;
export const THEGUYSER_RESUME_VIEW_URL = RESUME_VIEW_URL;
