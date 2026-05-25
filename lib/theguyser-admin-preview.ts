import { DEFAULT_PORTFOLIO_CONTENT } from "@/components/portfolio/data";
import type { FocusArea, PortfolioContent, ResourceLink } from "@/components/portfolio/types";
import type {
  JsonObject,
  TheGuyserAdminAsset,
  TheGuyserAdminBlock,
  TheGuyserAdminCollection,
  TheGuyserAdminEntry,
  TheGuyserAdminStudioPayload,
} from "@/lib/theguyser-admin-api";
import {
  buildTheGuyserPortfolioData,
  type DeliveryAsset,
  type DeliveryBlock,
  type DeliveryCollection,
  type DeliveryEntry,
  type TheGuyserDeliveryPayload,
} from "@/lib/theguyser-content";

export const THEGUYSER_ADMIN_PREVIEW_MESSAGE = "theguyser:admin-preview" as const;

export type TheGuyserAdminPreviewMessage = {
  content: TheGuyserAdminSerializablePreviewContent;
  type: typeof THEGUYSER_ADMIN_PREVIEW_MESSAGE;
};

export type TheGuyserAdminSerializablePreviewContent = Omit<
  PortfolioContent,
  "focusAreas" | "resourceLinks"
> & {
  focusAreas: Array<Omit<FocusArea, "icon">>;
  resourceLinks: Array<Omit<ResourceLink, "icon">>;
};

export type TheGuyserAdminEntryDraftPreview = Partial<
  Pick<
    TheGuyserAdminEntry,
    "metadata" | "profile_data" | "scheduled_for" | "slug" | "status" | "subtitle" | "summary" | "title"
  >
> & {
  blockMarkdownText?: string;
  metadata?: JsonObject;
  profileData?: JsonObject;
};

export type TheGuyserAdminAssetDraftPreview = Partial<
  Pick<TheGuyserAdminAsset, "alt_text" | "asset_type" | "metadata" | "sort_order" | "source_url" | "storage_path">
> & {
  asset_url?: string | null;
  preview_url?: string | null;
};

export type TheGuyserAdminCollectionDraftPreview = Partial<
  Pick<TheGuyserAdminCollection, "collection_type" | "config" | "description" | "is_enabled" | "slug" | "title">
>;

export type TheGuyserAdminDraftPreviewInput = {
  assetDrafts?: Record<string, TheGuyserAdminAssetDraftPreview>;
  collectionDrafts?: Record<string, TheGuyserAdminCollectionDraftPreview>;
  entryDrafts?: Record<string, TheGuyserAdminEntryDraftPreview>;
  studio: TheGuyserAdminStudioPayload;
};

function mergeEntryDraft(
  entry: TheGuyserAdminEntry,
  draft: TheGuyserAdminEntryDraftPreview | undefined,
) {
  if (!draft) {
    return entry;
  }

  return {
    ...entry,
    ...draft,
    metadata: draft.metadata ?? entry.metadata,
    profile_data: draft.profileData ?? draft.profile_data ?? entry.profile_data,
  } satisfies TheGuyserAdminEntry;
}

function mergeAssetDraft(
  asset: TheGuyserAdminAsset,
  draft: TheGuyserAdminAssetDraftPreview | undefined,
) {
  return draft
    ? {
        ...asset,
        ...draft,
        asset_url: draft.asset_url ?? draft.preview_url ?? draft.source_url ?? asset.asset_url,
      }
    : asset;
}

function mergeCollectionDraft(
  collection: TheGuyserAdminCollection,
  draft: TheGuyserAdminCollectionDraftPreview | undefined,
) {
  return draft ? { ...collection, ...draft } : collection;
}

function getEntryBlocks(
  entry: TheGuyserAdminEntry,
  blocks: TheGuyserAdminBlock[],
  draft: TheGuyserAdminEntryDraftPreview | undefined,
) {
  const entryBlocks = blocks
    .filter((block) => block.entry_id === entry.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (draft?.blockMarkdownText === undefined) {
    return entryBlocks;
  }

  const markdownBlock = entryBlocks.find((block) => block.block_type === "markdown");

  if (markdownBlock) {
    return entryBlocks.map((block) =>
      block.id === markdownBlock.id
        ? {
            ...block,
            content: { markdown: draft.blockMarkdownText },
          }
        : block,
    );
  }

  return [
    ...entryBlocks,
    {
      block_type: "markdown",
      content: { markdown: draft.blockMarkdownText },
      entry_id: entry.id,
      id: `${entry.id}:draft-markdown`,
      sort_order: 0,
      title: null,
    } satisfies TheGuyserAdminBlock,
  ];
}

function toDeliveryBlock(block: TheGuyserAdminBlock): DeliveryBlock {
  return {
    block_type: block.block_type,
    content: block.content,
    id: block.id,
    title: block.title,
  };
}

function toDeliveryAsset(asset: TheGuyserAdminAsset): DeliveryAsset {
  return {
    alt_text: asset.alt_text,
    assetUrl: asset.asset_url ?? asset.preview_url,
    asset_type: asset.asset_type,
    block_id: asset.block_id,
    entry_id: asset.entry_id,
    id: asset.id,
    metadata: asset.metadata,
    sort_order: asset.sort_order,
    source_url: asset.source_url,
    stable_source_id: asset.id,
    storage_path: asset.storage_path,
  };
}

function toDeliveryEntry({
  assets,
  blocks,
  entry,
}: {
  assets: TheGuyserAdminAsset[];
  blocks: TheGuyserAdminBlock[];
  entry: TheGuyserAdminEntry;
}): DeliveryEntry {
  return {
    assets: assets.map(toDeliveryAsset),
    blocks: blocks.map(toDeliveryBlock),
    id: entry.id,
    metadata: entry.metadata,
    profile_data: entry.profile_data,
    published_at: entry.published_at,
    slug: entry.slug,
    stable_source_id: entry.id,
    status: entry.status,
    subtitle: entry.subtitle,
    summary: entry.summary,
    title: entry.title,
  };
}

function toDeliveryCollection({
  assets,
  blocks,
  collection,
  entries,
  entryDrafts,
}: {
  assets: TheGuyserAdminAsset[];
  blocks: TheGuyserAdminBlock[];
  collection: TheGuyserAdminCollection;
  entries: TheGuyserAdminEntry[];
  entryDrafts: Record<string, TheGuyserAdminEntryDraftPreview>;
}): DeliveryCollection {
  return {
    collection_type: collection.collection_type,
    config: collection.config,
    description: collection.description,
    entries: entries
      .filter((entry) => entry.collection_id === collection.id)
      .map((entry) => {
        const draft = entryDrafts[entry.id];
        const mergedEntry = mergeEntryDraft(entry, draft);

        return toDeliveryEntry({
          assets: assets.filter((asset) => asset.entry_id === entry.id),
          blocks: getEntryBlocks(entry, blocks, draft),
          entry: mergedEntry,
        });
      }),
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
  };
}

export function buildTheGuyserAdminDraftDelivery({
  assetDrafts = {},
  collectionDrafts = {},
  entryDrafts = {},
  studio,
}: TheGuyserAdminDraftPreviewInput): TheGuyserDeliveryPayload {
  const collections = studio.collections
    .map((collection) => mergeCollectionDraft(collection, collectionDrafts[collection.id]))
    .filter((collection) => collection.is_enabled !== false);
  const assets = studio.assets.map((asset) => mergeAssetDraft(asset, assetDrafts[asset.id]));

  return {
    adapter: "theguyser",
    canonicalProjectId: studio.binding?.canonical_id ?? "theguyser",
    collections: collections.map((collection) =>
      toDeliveryCollection({
        assets,
        blocks: studio.blocks,
        collection,
        entries: studio.entries,
        entryDrafts,
      }),
    ),
    generatedAt: new Date(0).toISOString(),
    loadingData: studio.loadingData,
    profileData: {},
    workspaceId: studio.binding?.workspace_id ?? "preview",
  };
}

export function buildTheGuyserAdminDraftPortfolioContent({
  apiBaseUrl,
  ...input
}: TheGuyserAdminDraftPreviewInput & {
  apiBaseUrl: string;
}) {
  const delivery = buildTheGuyserAdminDraftDelivery(input);
  const content = buildTheGuyserPortfolioData(delivery, { apiBaseUrl });

  return content ?? DEFAULT_PORTFOLIO_CONTENT;
}

export function serializeTheGuyserAdminPreviewContent(
  content: PortfolioContent,
): TheGuyserAdminSerializablePreviewContent {
  return {
    ...content,
    focusAreas: content.focusAreas.map(({ icon: _icon, ...focusArea }) => focusArea),
    resourceLinks: content.resourceLinks.map(({ icon: _icon, ...resourceLink }) => resourceLink),
  };
}

function hydrateResourceLinks(
  incoming: TheGuyserAdminSerializablePreviewContent["resourceLinks"],
) {
  const incomingById = new Map(incoming.map((resource) => [resource.id, resource]));
  const merged = DEFAULT_PORTFOLIO_CONTENT.resourceLinks.map((fallback, index) => {
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
      DEFAULT_PORTFOLIO_CONTENT.resourceLinks.find((item) => item.id === resource.id) ??
      DEFAULT_PORTFOLIO_CONTENT.resourceLinks[0];

    merged.push({
      ...fallback,
      ...resource,
      icon: fallback.icon,
    });
  }

  return merged;
}

function hydrateFocusAreas(incoming: TheGuyserAdminSerializablePreviewContent["focusAreas"]) {
  return incoming.map((area, index) => {
    const fallback =
      DEFAULT_PORTFOLIO_CONTENT.focusAreas.find((item) => item.title === area.title) ??
      DEFAULT_PORTFOLIO_CONTENT.focusAreas[index] ??
      DEFAULT_PORTFOLIO_CONTENT.focusAreas[0];

    return {
      ...fallback,
      ...area,
      icon: fallback.icon,
    };
  });
}

export function hydrateTheGuyserAdminPreviewContent(
  content: TheGuyserAdminSerializablePreviewContent,
): PortfolioContent {
  return {
    ...DEFAULT_PORTFOLIO_CONTENT,
    ...content,
    focusAreas: hydrateFocusAreas(content.focusAreas),
    resourceLinks: hydrateResourceLinks(content.resourceLinks),
  };
}
