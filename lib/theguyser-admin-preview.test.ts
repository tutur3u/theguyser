import { describe, expect, test } from "bun:test";
import type { TheGuyserAdminStudioPayload } from "@/lib/theguyser-admin-api";
import {
  buildTheGuyserAdminDraftDelivery,
  buildTheGuyserAdminDraftPortfolioContent,
  THEGUYSER_ADMIN_PREVIEW_MESSAGE,
} from "@/lib/theguyser-admin-preview";
import { theGuyserExternalProjectManifest } from "@/lib/theguyser-external-project-manifest";

const API_BASE_URL = "https://tuturuuu.example/api/v1";

function createStudio(): TheGuyserAdminStudioPayload {
  const collections = theGuyserExternalProjectManifest.schema.collections.map((collection) => ({
    collection_type: collection.collection_type,
    config: { schema: collection },
    created_at: null,
    description: collection.description ?? null,
    id: `collection:${collection.slug}`,
    is_enabled: true,
    slug: collection.slug,
    title: collection.title,
    updated_at: null,
  }));

  const entries = theGuyserExternalProjectManifest.content.entries.map((entry) => ({
    collection_id: `collection:${entry.collectionSlug}`,
    created_at: null,
    id: entry.stableSourceId,
    metadata: entry.metadata ?? {},
    profile_data: entry.profileData ?? {},
    published_at: entry.status === "published" ? "2026-05-01T00:00:00.000Z" : null,
    scheduled_for: null,
    slug: entry.slug,
    status: entry.status ?? "published",
    subtitle: entry.subtitle ?? null,
    summary: entry.summary ?? null,
    title: entry.title,
    updated_at: null,
  }));

  const blocks = theGuyserExternalProjectManifest.content.entries.flatMap((entry) =>
    (entry.blocks ?? []).map((block, index) => ({
      block_type: block.blockType,
      content: block.content,
      entry_id: entry.stableSourceId,
      id: block.stableSourceId,
      sort_order: block.sortOrder ?? index,
      title: block.title ?? null,
    })),
  );

  const assets = theGuyserExternalProjectManifest.content.entries.flatMap((entry) =>
    (entry.assets ?? []).map((asset, index) => ({
      alt_text: asset.altText ?? null,
      asset_type: asset.assetType,
      asset_url: asset.sourceUrl ?? null,
      block_id: null,
      entry_id: entry.stableSourceId,
      id: asset.stableSourceId,
      metadata: asset.metadata ?? {},
      preview_url: asset.sourceUrl ?? null,
      sort_order: asset.sortOrder ?? index,
      source_url: asset.sourceUrl ?? null,
      storage_path: asset.storagePath ?? null,
    })),
  );

  return {
    assets,
    blocks,
    collections,
    entries,
    importJobs: [],
    loadingData: null,
    profileData: {},
    publishEvents: [],
  };
}

describe("theguyser admin draft preview", () => {
  test("exports a stable preview message type", () => {
    expect(THEGUYSER_ADMIN_PREVIEW_MESSAGE).toBe("theguyser:admin-preview");
  });

  test("maps unsaved entry field edits into portfolio content", () => {
    const content = buildTheGuyserAdminDraftPortfolioContent({
      apiBaseUrl: API_BASE_URL,
      entryDrafts: {
        "theguyser:navigation:experience": {
          profileData: {
            appId: "experience",
            color: "bg-blue-500",
            iconKey: "gamepad",
            size: "col-span-2",
            sortOrder: 5,
            visible: true,
          },
          title: "Playable Work",
        },
      },
      studio: createStudio(),
    });

    expect(content.appTiles.find((tile) => tile.id === "experience")).toMatchObject({
      sortOrder: 5,
      title: "Playable Work",
    });
  });

  test("maps unsaved markdown block edits into panel previews", () => {
    const content = buildTheGuyserAdminDraftPortfolioContent({
      apiBaseUrl: API_BASE_URL,
      entryDrafts: {
        "theguyser:panel:profile": {
          blockMarkdownText: "Draft profile intro from admin.",
        },
      },
      studio: createStudio(),
    });

    expect(content.profile.intro).toBe("Draft profile intro from admin.");
  });

  test("maps unsaved asset edits into project cover previews", () => {
    const content = buildTheGuyserAdminDraftPortfolioContent({
      apiBaseUrl: API_BASE_URL,
      assetDrafts: {
        "theguyser:game:mine-blast:image": {
          source_url: "https://cdn.example.com/mine-blast-draft.png",
        },
      },
      studio: createStudio(),
    });

    expect(content.gameProjects.find((project) => project.id === "mine-blast")?.image).toBe(
      "https://cdn.example.com/mine-blast-draft.png",
    );
  });

  test("preserves collection config edits in draft delivery", () => {
    const delivery = buildTheGuyserAdminDraftDelivery({
      collectionDrafts: {
        "collection:panel-content": {
          config: {
            schema: {
              collection_type: "panel-content",
              profileFields: [{ key: "headline", label: "Headline", type: "string" }],
              slug: "panel-content",
              title: "Panel Content",
            },
          },
        },
      },
      studio: createStudio(),
    });

    expect(
      delivery.collections.find((collection) => collection.slug === "panel-content")?.config,
    ).toMatchObject({
      schema: {
        profileFields: [{ key: "headline", label: "Headline", type: "string" }],
      },
    });
  });
});
