import {
  DEFAULT_APP_TILES,
  DEFAULT_PANEL_CONTENT,
  DEFAULT_QUICK_LAUNCH_CARDS,
  DEFAULT_SITE_CONFIG,
  FOCUS_AREAS,
  GAME_PROJECTS,
  PROFILE,
  RESEARCH_PROJECTS,
  RESOURCE_LINKS,
  RESUME_PREVIEW_URL,
  RESUME_VIEW_URL,
  SHOWREEL_ITEMS,
} from "@/components/portfolio/data";
import type { Project } from "@/components/portfolio/types";

export type TheGuyserSyncField = {
  description?: string | null;
  key: string;
  label: string;
  options?: string[];
  required?: boolean;
  type: "boolean" | "date" | "datetime" | "json" | "markdown" | "number" | "string" | "string-array";
};

export type TheGuyserSyncCollectionSchema = {
  assetTypes?: string[];
  blockTypes?: string[];
  collection_type: string;
  description?: string | null;
  metadataFields?: TheGuyserSyncField[];
  profileFields?: TheGuyserSyncField[];
  slug: string;
  title: string;
};

export type TheGuyserExternalProjectManifest = {
  adapter: "theguyser";
  content: {
    entries: Array<{
      assets?: Array<{
        altText?: string | null;
        assetType: string;
        metadata?: Record<string, unknown>;
        sortOrder?: number;
        sourceUrl?: string | null;
        stableSourceId: string;
        storagePath?: string | null;
      }>;
      blocks?: Array<{
        blockType: string;
        content: Record<string, unknown>;
        sortOrder?: number;
        stableSourceId: string;
        title?: string | null;
      }>;
      collectionSlug: string;
      metadata?: Record<string, unknown>;
      profileData?: Record<string, unknown>;
      slug: string;
      stableSourceId: string;
      status?: "draft" | "scheduled" | "published" | "archived";
      subtitle?: string | null;
      summary?: string | null;
      title: string;
    }>;
  };
  schema: {
    collections: TheGuyserSyncCollectionSchema[];
    metadataFields?: TheGuyserSyncField[];
    profileFields?: TheGuyserSyncField[];
  };
  version: 1;
};

const panelProfileFields = [
  { key: "email", label: "Email", type: "string" },
  { key: "role", label: "Role", type: "string" },
  { key: "image", label: "Fallback image URL", type: "string" },
  { key: "appId", label: "Panel app ID", type: "string" },
  { key: "eyebrow", label: "Eyebrow", type: "string" },
  { key: "body", label: "Body or line-separated details", type: "markdown" },
] satisfies TheGuyserSyncField[];

const projectProfileFields = [
  {
    key: "kind",
    label: "Project kind",
    options: ["game", "research"],
    type: "string",
  },
  { key: "category", label: "Category", type: "string" },
  { key: "href", label: "Primary URL", type: "string" },
  { key: "actionLabel", label: "Action label", type: "string" },
] satisfies TheGuyserSyncField[];

const focusProfileFields = [
  { key: "iconKey", label: "Icon key", type: "string" },
  { key: "color", label: "Icon color classes", type: "string" },
  { key: "bg", label: "Background classes", type: "string" },
] satisfies TheGuyserSyncField[];

const linkProfileFields = [
  { key: "href", label: "URL", type: "string" },
  { key: "note", label: "Note", type: "string" },
  { key: "appId", label: "Internal app", type: "string" },
] satisfies TheGuyserSyncField[];

const showreelProfileFields = [
  { key: "label", label: "Display label", type: "string" },
] satisfies TheGuyserSyncField[];

const siteConfigProfileFields = [
  { key: "defaultTheme", label: "Default theme", type: "string" },
  { key: "discTitle", label: "Disc title", type: "string" },
  { key: "launchAnimationDuration", label: "Launch animation duration", type: "number" },
  { key: "launchAnimationEnabled", label: "Launch animation enabled", type: "boolean" },
  { key: "rememberPreferences", label: "Remember preferences", type: "boolean" },
  { key: "resumePreviewUrl", label: "Resume preview URL", type: "string" },
  { key: "resumeViewUrl", label: "Resume view URL", type: "string" },
  { key: "startLabel", label: "Start button label", type: "string" },
] satisfies TheGuyserSyncField[];

const navigationProfileFields = [
  { key: "appId", label: "App ID", type: "string" },
  { key: "iconKey", label: "Icon key", type: "string" },
  { key: "color", label: "Tile color classes", type: "string" },
  { key: "size", label: "Grid size classes", type: "string" },
  { key: "sortOrder", label: "Sort order", type: "number" },
  { key: "visible", label: "Visible", type: "boolean" },
] satisfies TheGuyserSyncField[];

const quickLaunchProfileFields = [
  { key: "accent", label: "Accent classes", type: "string" },
  { key: "appId", label: "Launch app ID", type: "string" },
  { key: "label", label: "Label", type: "string" },
  { key: "section", label: "Source panel", type: "string" },
  { key: "sortOrder", label: "Sort order", type: "number" },
] satisfies TheGuyserSyncField[];

const PUBLISHED_STATUS = "published" as const;

function focusSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectEntry(project: Project, kind: "game" | "research") {
  return {
    assets: [
      {
        altText: `${project.title} image`,
        assetType: "image",
        metadata: {
          caption: project.title,
        },
        sortOrder: 0,
        sourceUrl: project.image,
        stableSourceId: `theguyser:${kind}:${project.id}:image`,
      },
    ],
    blocks: [],
    collectionSlug: "experience",
    profileData: {
      actionLabel: project.actionLabel,
      category: project.category,
      href: project.href,
      kind,
    },
    slug: project.id,
    stableSourceId: `theguyser:${kind}:${project.id}`,
    status: PUBLISHED_STATUS,
    summary: project.description,
    title: project.title,
  };
}

export const theGuyserExternalProjectManifest = {
  adapter: "theguyser",
  content: {
    entries: [
      {
        blocks: [],
        collectionSlug: "site-config",
        profileData: {
          ...DEFAULT_SITE_CONFIG,
          resumePreviewUrl: RESUME_PREVIEW_URL,
          resumeViewUrl: RESUME_VIEW_URL,
        },
        slug: "global",
        stableSourceId: "theguyser:site-config:global",
        status: PUBLISHED_STATUS,
        summary: "Public landing-page defaults and resume URLs.",
        title: "Global Site Config",
      },
      ...DEFAULT_APP_TILES.map((tile) => ({
        blocks: [],
        collectionSlug: "navigation",
        profileData: {
          appId: tile.id,
          color: tile.color,
          iconKey: tile.iconKey,
          size: tile.size,
          sortOrder: tile.sortOrder,
          visible: tile.visible,
        },
        slug: tile.id,
        stableSourceId: "theguyser:navigation:" + tile.id,
        status: PUBLISHED_STATUS,
        summary: tile.title,
        title: tile.title,
      })),
      ...Object.entries(DEFAULT_PANEL_CONTENT)
        .filter(([panelId]) => panelId !== "disc")
        .map(([panelId, panel]) => ({
          blocks: panel?.body
            ? [
                {
                  blockType: "markdown",
                  content: { markdown: panel.body },
                  sortOrder: 0,
                  stableSourceId: "theguyser:panel:" + panelId + ":body",
                },
              ]
            : [],
          collectionSlug: "panel-content",
          profileData: {
            appId: panelId,
            eyebrow: panel?.eyebrow ?? null,
          },
          slug: panelId,
          stableSourceId: "theguyser:panel:" + panelId,
          status: PUBLISHED_STATUS,
          summary: panel?.description ?? null,
          title: panel?.title ?? panelId,
        })),
      ...DEFAULT_QUICK_LAUNCH_CARDS.map((card, index) => ({
        blocks: [],
        collectionSlug: "quick-launch",
        profileData: {
          accent: card.accent,
          appId: card.appId,
          label: card.label,
          section: card.section,
          sortOrder: card.sortOrder,
        },
        slug: card.section + "-" + card.appId + "-" + index,
        stableSourceId: "theguyser:quick-launch:" + card.section + ":" + card.appId + ":" + index,
        status: PUBLISHED_STATUS,
        summary: card.description,
        title: card.title,
      })),
      {
        assets: [
          {
            altText: `${PROFILE.name} portrait`,
            assetType: "image",
            metadata: {
              publicPath: "/bao-chua-hero.jpg",
            },
            sortOrder: 0,
            sourceUrl: PROFILE.image,
            stableSourceId: "theguyser:panel:profile:image",
          },
        ],
        blocks: [
          {
            blockType: "markdown",
            content: {
              markdown: PROFILE.intro,
            },
            sortOrder: 0,
            stableSourceId: "theguyser:panel:profile:intro",
          },
        ],
        collectionSlug: "panel-content",
        profileData: {
          email: PROFILE.email,
          image: PROFILE.image,
          role: PROFILE.role,
        },
        slug: "profile",
        stableSourceId: "theguyser:panel:profile",
        status: PUBLISHED_STATUS,
        summary: PROFILE.summary,
        title: PROFILE.name,
      },
      ...GAME_PROJECTS.map((project) => projectEntry(project, "game")),
      ...RESEARCH_PROJECTS.map((project) => projectEntry(project, "research")),
      ...FOCUS_AREAS.map((area) => ({
        blocks: [],
        collectionSlug: "awards",
        profileData: {
          bg: area.bg,
          color: area.color,
          iconKey: focusSlug(area.title),
        },
        slug: focusSlug(area.title),
        stableSourceId: `theguyser:focus:${focusSlug(area.title)}`,
        status: PUBLISHED_STATUS,
        summary: area.description,
        title: area.title,
      })),
      ...RESOURCE_LINKS.map((resource) => ({
        blocks: [],
        collectionSlug: "contact-social",
        profileData: {
          appId: resource.appId ?? null,
          href: resource.href,
          note: resource.note,
        },
        slug: resource.id,
        stableSourceId: `theguyser:contact:${resource.id}`,
        status: PUBLISHED_STATUS,
        summary: resource.note,
        title: resource.label,
      })),
      ...SHOWREEL_ITEMS.map((item, index) => ({
        blocks: [],
        collectionSlug: "showreel",
        profileData: {
          label: item,
        },
        slug: focusSlug(item),
        stableSourceId: `theguyser:showreel:${focusSlug(item)}`,
        status: PUBLISHED_STATUS,
        summary: null,
        title: item,
        metadata: {
          sortOrder: index,
        },
      })),
    ],
  },
  schema: {
    collections: [
      {
        collection_type: "site-config",
        description: "Global landing-page defaults, section labels, and resume URLs.",
        profileFields: siteConfigProfileFields,
        slug: "site-config",
        title: "Site Config",
      },
      {
        collection_type: "navigation",
        description: "Dashboard app/menu tiles, icon keys, colors, visibility, and order.",
        profileFields: navigationProfileFields,
        slug: "navigation",
        title: "Navigation Tiles",
      },
      {
        collection_type: "quick-launch",
        description: "Quick-launch cards embedded inside visible panels.",
        profileFields: quickLaunchProfileFields,
        slug: "quick-launch",
        title: "Quick Launch Cards",
      },
      {
        assetTypes: ["image"],
        blockTypes: ["markdown"],
        collection_type: "panel-content",
        description: "Profile and top-level app panel copy.",
        profileFields: panelProfileFields,
        slug: "panel-content",
        title: "Panel Content",
      },
      {
        assetTypes: ["image", "webgl-package"],
        collection_type: "experience",
        description: "Game and research projects shown in the portfolio.",
        profileFields: projectProfileFields,
        slug: "experience",
        title: "Experience",
      },
      {
        collection_type: "awards",
        description: "Focus-area cards shown in the portfolio.",
        profileFields: focusProfileFields,
        slug: "awards",
        title: "Awards & Focus",
      },
      {
        blockTypes: ["links"],
        collection_type: "contact-social",
        description: "Contact methods and outbound resource links.",
        profileFields: linkProfileFields,
        slug: "contact-social",
        title: "Contact & Social",
      },
      {
        collection_type: "showreel",
        description: "Showreel labels and section ordering.",
        profileFields: showreelProfileFields,
        slug: "showreel",
        title: "Showreel",
      },
    ],
    profileFields: [
      { key: "brand", label: "Brand", type: "string" },
      { key: "deliveryPreset", label: "Delivery preset", type: "string" },
    ],
  },
  version: 1,
} satisfies TheGuyserExternalProjectManifest;

export function getTheGuyserManifestCollectionSchema(
  collectionSlug: string | null | undefined,
) {
  return (
    theGuyserExternalProjectManifest.schema.collections.find(
      (collection) => collection.slug === collectionSlug,
    ) ?? null
  );
}
