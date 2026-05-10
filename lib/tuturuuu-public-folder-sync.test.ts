import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import {
  linkPublicFolderAssets,
  syncPublicFolderAssets,
} from "@/lib/tuturuuu-public-folder-sync";

function createManifest() {
  return {
    adapter: "theguyser",
    content: {
      entries: [
        {
          assets: [
            {
              assetType: "image",
              metadata: {
                publicPath: "/bao-chua-hero.jpg",
              },
              sourceUrl: "https://remote.example.com/profile.jpg",
              stableSourceId: "theguyser:panel:profile:image",
            },
          ],
          collectionSlug: "panel-content",
          slug: "profile",
          stableSourceId: "theguyser:panel:profile",
          title: "Bao Chua",
        },
      ],
    },
    schema: {
      collections: [],
    },
    version: 1 as const,
  };
}

describe("Tuturuuu public folder sync", () => {
  test("links public assets and preserves the original manifest object", () => {
    const manifest = createManifest();
    const linked = linkPublicFolderAssets(manifest);

    expect(manifest.content.entries[0]?.assets?.[0]?.sourceUrl).toBe(
      "https://remote.example.com/profile.jpg",
    );
    expect(linked.content.entries[0]?.assets?.[0]?.sourceUrl).toBeNull();
    expect(linked.content.entries[0]?.assets?.[0]?.storagePath).toBe(
      "external-projects/theguyser/panel-content/profile/bao-chua-hero.jpg",
    );
  });

  test("uploads linked public assets through Tuturuuu signed upload URLs", async () => {
    const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
    const publicDir = await mkdtemp(join(tmpdir(), "theguyser-public-assets-"));
    await writeFile(join(publicDir, "bao-chua-hero.jpg"), "jpg bytes");

    const fetchImpl: typeof fetch = async (input, init) => {
      calls.push({ init, input });
      if (calls.length === 1) {
        return Response.json({
          fullPath:
            "ws_123/external-projects/theguyser/panel-content/profile/bao-chua-hero.jpg",
          path: "external-projects/theguyser/panel-content/profile/bao-chua-hero.jpg",
          signedUrl: "https://upload.example.com/object",
          token: "upload_token",
        });
      }

      return new Response(null, { status: 200 });
    };

    try {
      const result = await syncPublicFolderAssets({
        accessToken: "admin_token",
        apiBaseUrl: "https://platform.example.com/api/v1",
        fetch: fetchImpl,
        manifest: createManifest(),
        publicDir,
        tokenType: "Bearer",
        workspaceId: "ws_123",
      });

      expect(result.skipped).toEqual([]);
      expect(result.uploaded[0]?.filename).toBe("bao-chua-hero.jpg");
      expect(calls[0]?.input).toBe(
        "https://platform.example.com/api/v1/workspaces/ws_123/external-projects/assets/upload-url",
      );
      expect(new Headers(calls[1]?.init?.headers).get("Content-Type")).toBe("image/jpeg");
    } finally {
      await rm(publicDir, { force: true, recursive: true });
    }
  });
});
