import { describe, expect, test } from "bun:test";
import { buildTheGuyserPortfolioData } from "@/lib/theguyser-content";

describe("theguyser content delivery normalization", () => {
  test("maps Tuturuuu delivery collections into portfolio data", () => {
    const content = buildTheGuyserPortfolioData(
      {
        adapter: "theguyser",
        canonicalProjectId: "theguyser-main",
        collections: [
          {
            collection_type: "panel-content",
            config: {},
            description: null,
            entries: [
              {
                assets: [
                  {
                    alt_text: "Bao portrait",
                    assetUrl: "/api/v1/workspaces/ws-1/external-projects/assets/profile-image",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "profile-entry",
                    id: "profile-image",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: "external-projects/theguyser/profile.jpg",
                  },
                ],
                blocks: [
                  {
                    block_type: "markdown",
                    content: {
                      markdown: "Updated profile intro.",
                    },
                    id: "profile-block",
                    title: null,
                  },
                ],
                id: "profile-entry",
                metadata: {},
                profile_data: {
                  email: "bao@example.com",
                  role: "Designer",
                },
                published_at: "2026-05-09T00:00:00.000Z",
                slug: "profile",
                status: "published",
                subtitle: null,
                summary: "Updated profile summary.",
                title: "Bao Chua",
              },
            ],
            id: "panel-content",
            slug: "panel-content",
            title: "Panel Content",
          },
          {
            collection_type: "experience",
            config: {},
            description: null,
            entries: [
              {
                assets: [
                  {
                    alt_text: "Project art",
                    assetUrl: "/api/v1/workspaces/ws-1/external-projects/assets/project-image",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "game-entry",
                    id: "project-image",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: "external-projects/theguyser/games/project.jpg",
                  },
                ],
                blocks: [],
                id: "game-entry",
                metadata: {},
                profile_data: {
                  actionLabel: "Play",
                  category: "Puzzle Game",
                  href: "https://example.com/play",
                  kind: "game",
                  playHref: "/games/example",
                },
                published_at: "2026-05-09T00:00:00.000Z",
                slug: "example-game",
                status: "published",
                subtitle: null,
                summary: "A platform-managed game.",
                title: "Example Game",
              },
            ],
            id: "experience",
            slug: "experience",
            title: "Experience",
          },
        ],
        generatedAt: "2026-05-09T00:00:00.000Z",
        loadingData: null,
        profileData: {},
        workspaceId: "ws-1",
      },
      {
        apiBaseUrl: "https://tuturuuu.example/api/v1",
      },
    );

    expect(content.profile).toMatchObject({
      email: "bao@example.com",
      image: "https://tuturuuu.example/api/v1/workspaces/ws-1/external-projects/assets/profile-image",
      intro: "Updated profile intro.",
      name: "Bao Chua",
      role: "Designer",
      summary: "Updated profile summary.",
    });
    expect(content.gameProjects).toEqual([
      expect.objectContaining({
        actionLabel: "Play",
        description: "A platform-managed game.",
        image: "https://tuturuuu.example/api/v1/workspaces/ws-1/external-projects/assets/project-image",
        playHref: "/games/example",
        title: "Example Game",
      }),
    ]);
    expect(content.researchProjects).toHaveLength(0);
    expect(content.showreelItems).toEqual(["Example Game"]);
  });
});
