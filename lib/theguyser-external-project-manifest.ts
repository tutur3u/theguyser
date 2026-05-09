import {
  FOCUS_AREAS,
  GAME_PROJECTS,
  PROFILE,
  RESEARCH_PROJECTS,
  RESOURCE_LINKS,
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
  { key: "playHref", label: "Internal play URL", type: "string" },
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
      playHref: project.playHref ?? null,
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
        assets: [
          {
            altText: `${PROFILE.name} portrait`,
            assetType: "image",
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
    ],
  },
  schema: {
    collections: [
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
        assetTypes: ["image"],
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
