import { describe, expect, test } from "bun:test";
import { DEFAULT_PORTFOLIO_CONTENT } from "@/components/portfolio/data";
import { getTheGuyserCmsCoverageReport } from "@/lib/theguyser-cms-coverage";
import { buildTheGuyserPortfolioData, type TheGuyserDeliveryPayload } from "@/lib/theguyser-content";
import { theGuyserExternalProjectManifest } from "@/lib/theguyser-external-project-manifest";
import { getTheGuyserGamePlayer } from "@/lib/theguyser-webgl";

const API_BASE_URL = "https://tuturuuu.example/api/v1";

function createDelivery({
  mineBlastWebgl = false,
}: {
  mineBlastWebgl?: boolean;
} = {}): TheGuyserDeliveryPayload {
  return {
    adapter: "theguyser",
    canonicalProjectId: "theguyser",
    collections: theGuyserExternalProjectManifest.schema.collections.map((collectionSchema) => ({
      collection_type: collectionSchema.collection_type,
      config: {
        schema: collectionSchema,
      },
      description: collectionSchema.description ?? null,
      entries: theGuyserExternalProjectManifest.content.entries
        .filter((entry) => entry.collectionSlug === collectionSchema.slug)
        .map((entry) => {
          const assets = (entry.assets ?? []).map((asset, index) => ({
            alt_text: asset.altText ?? null,
            assetUrl: asset.sourceUrl?.startsWith("http")
              ? asset.sourceUrl
              : `/api/v1/workspaces/ws-1/external-projects/assets/${entry.slug}-asset-${index}`,
            asset_type: asset.assetType,
            block_id: null,
            entry_id: `${entry.stableSourceId}:id`,
            id: `${entry.stableSourceId}:asset:${index}`,
            metadata: asset.metadata ?? {},
            sort_order: asset.sortOrder ?? index,
            source_url: asset.sourceUrl ?? null,
            stable_source_id: asset.stableSourceId,
            storage_path: asset.storagePath ?? null,
          }));

          if (mineBlastWebgl && entry.slug === "mine-blast") {
            assets.push({
              alt_text: `${entry.title} WebGL package`,
              assetUrl: null,
              asset_type: "webgl-package",
              block_id: null,
              entry_id: `${entry.stableSourceId}:id`,
              id: `${entry.stableSourceId}:webgl`,
              metadata: {
                entryUrl: `/api/v1/workspaces/ws-1/external-projects/assets/${entry.slug}-webgl/webgl/index.html`,
                kind: "webgl-package",
              },
              sort_order: 10,
              source_url: null,
              stable_source_id: `${entry.stableSourceId}:webgl`,
              storage_path: `external-projects/theguyser/games/${entry.slug}/webgl`,
            });
          }

          return {
            assets,
            blocks: (entry.blocks ?? []).map((block, index) => ({
              block_type: block.blockType,
              content: block.content,
              id: block.stableSourceId,
              title: block.title ?? null,
            })),
            id: `${entry.stableSourceId}:id`,
            metadata: entry.metadata ?? {},
            profile_data: entry.profileData ?? {},
            published_at: "2026-05-09T00:00:00.000Z",
            slug: entry.slug,
            stable_source_id: entry.stableSourceId,
            status: entry.status ?? "published",
            subtitle: entry.subtitle ?? null,
            summary: entry.summary ?? null,
            title: entry.title,
          };
        }),
      id: collectionSchema.slug,
      slug: collectionSchema.slug,
      title: collectionSchema.title,
    })),
    generatedAt: "2026-05-09T00:00:00.000Z",
    loadingData: null,
    profileData: {},
    workspaceId: "ws-1",
  };
}

describe("theguyser content delivery normalization", () => {
  test("reports incomplete CMS coverage and keeps static fallback before cutover", () => {
    const delivery = createDelivery();
    delivery.collections = delivery.collections.filter((collection) => collection.slug !== "navigation");
    const coverage = getTheGuyserCmsCoverageReport(delivery);
    const content = buildTheGuyserPortfolioData(delivery, {
      apiBaseUrl: API_BASE_URL,
    });

    expect(coverage.complete).toBe(false);
    expect(coverage.missing.collections).toContain("navigation");
    expect(content).toEqual(DEFAULT_PORTFOLIO_CONTENT);
  });

  test("treats seeded CMS content as complete without WebGL packages", () => {
    const delivery = createDelivery();
    const coverage = getTheGuyserCmsCoverageReport(delivery);
    const content = buildTheGuyserPortfolioData(delivery, {
      apiBaseUrl: API_BASE_URL,
    });

    expect(coverage.complete).toBe(true);
    expect(coverage.summary.requiredWebglPackages).toBe(0);
    expect(coverage.missing.webglPackages).toEqual([]);
    expect(content).not.toEqual(DEFAULT_PORTFOLIO_CONTENT);
    expect(content.gameProjects.find((project) => project.id === "necrolist")?.playHref).toBeUndefined();
  });

  test("maps complete Tuturuuu delivery collections into all public portfolio sections", () => {
    const delivery = createDelivery({ mineBlastWebgl: true });
    const navigation = delivery.collections.find((collection) => collection.slug === "navigation");
    const gamesTile = navigation?.entries.find((entry) => entry.slug === "experience");

    if (gamesTile) {
      gamesTile.title = "Browser Games";
      gamesTile.profile_data = {
        ...gamesTile.profile_data,
        iconKey: "gamepad",
        sortOrder: 5,
      };
    }

    const content = buildTheGuyserPortfolioData(delivery, {
      apiBaseUrl: API_BASE_URL,
    });

    expect(getTheGuyserCmsCoverageReport(delivery).complete).toBe(true);
    expect(content.appTiles.find((tile) => tile.id === "experience")).toMatchObject({
      sortOrder: 5,
      title: "Browser Games",
    });
    expect(content.panelContent.contact).toMatchObject({
      title: "Connect",
    });
    expect(content.quickLaunchCards.some((card) => card.section === "about")).toBe(true);
    expect(content.siteConfig).toMatchObject({
      discTitle: "Bao's Portfolio",
      startLabel: "START",
    });
    expect(content.gameProjects.find((project) => project.id === "necrolist")?.playHref).toBeUndefined();
    expect(content.gameProjects.find((project) => project.id === "mine-blast")?.playHref).toBe("/games/mine-blast");
  });

  test("resolves CMS WebGL player metadata for published games", () => {
    const delivery = createDelivery({ mineBlastWebgl: true });
    const player = getTheGuyserGamePlayer(delivery, {
      apiBaseUrl: API_BASE_URL,
      slug: "mine-blast",
    });

    expect(player).toMatchObject({
      iframeSrc: "https://tuturuuu.example/api/v1/workspaces/ws-1/external-projects/assets/mine-blast-webgl/webgl/index.html",
      slug: "mine-blast",
      title: "Mine Blast!",
    });
    expect(
      getTheGuyserGamePlayer(createDelivery(), {
        apiBaseUrl: API_BASE_URL,
        slug: "necrolist",
      }),
    ).toBeNull();
    expect(
      getTheGuyserGamePlayer(delivery, {
        apiBaseUrl: API_BASE_URL,
        slug: "unknown",
      }),
    ).toBeNull();
  });

  test("manifest covers visible landing-page sections and seeded public content", () => {
    const collectionSlugs = theGuyserExternalProjectManifest.schema.collections.map((collection) => collection.slug);
    const stableIds = theGuyserExternalProjectManifest.content.entries.map((entry) => entry.stableSourceId);

    expect(collectionSlugs).toEqual(
      expect.arrayContaining([
        "awards",
        "contact-social",
        "experience",
        "navigation",
        "panel-content",
        "quick-launch",
        "showreel",
        "site-config",
      ]),
    );
    expect(stableIds).toEqual(
      expect.arrayContaining([
        "theguyser:site-config:global",
        "theguyser:navigation:experience",
        "theguyser:panel:profile",
        "theguyser:quick-launch:about:experience:0",
        "theguyser:game:necrolist",
        "theguyser:research:console-culture",
      ]),
    );
  });
});
