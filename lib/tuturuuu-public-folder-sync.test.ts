import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import {
  discoverPublicFolderFiles,
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

function createFilenameOnlyManifest() {
  const manifest = createManifest();
  const asset = manifest.content.entries[0]?.assets?.[0];

  if (asset) {
    asset.metadata = {};
    asset.sourceUrl = "https://remote.example.com/assets/bao-chua-hero.jpg?v=1";
  }

  return manifest;
}

function createLocalOnlyManifest() {
  const manifest = createManifest();
  const asset = manifest.content.entries[0]?.assets?.[0];

  if (asset) {
    asset.metadata = {
      publicPath: "/missing.jpg",
    };
    asset.sourceUrl = null;
  }

  return manifest;
}

function createUploadFetch(calls: Array<{ init?: RequestInit; input: RequestInfo | URL }>) {
  return (async (input, init) => {
    calls.push({ init, input });

    if (String(input).includes("/external-projects/assets/upload-url")) {
      return Response.json({
        fullPath:
          "ws_123/external-projects/theguyser/panel-content/profile/bao-chua-hero.jpg",
        path: "external-projects/theguyser/panel-content/profile/bao-chua-hero.jpg",
        signedUrl: "https://upload.example.com/object",
        token: "upload_token",
      });
    }

    return new Response(null, { status: 200 });
  }) satisfies typeof fetch;
}

describe("Tuturuuu public folder sync", () => {
  test("discovers root-relative public files and ignores dotfiles", async () => {
    const publicDir = await mkdtemp(join(tmpdir(), "theguyser-public-discovery-"));

    try {
      await writeFile(join(publicDir, "bao-chua-hero.jpg"), "jpg bytes");
      await writeFile(join(publicDir, ".DS_Store"), "ignored");
      await mkdir(join(publicDir, "nested"));
      await writeFile(join(publicDir, "nested", "card.webp"), "webp bytes");

      const files = await discoverPublicFolderFiles(publicDir);

      expect([...files.keys()].sort()).toEqual([
        "/bao-chua-hero.jpg",
        "/nested/card.webp",
      ]);
      expect(files.get("/bao-chua-hero.jpg")?.filename).toBe("bao-chua-hero.jpg");
    } finally {
      await rm(publicDir, { force: true, recursive: true });
    }
  });

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

  test("links public assets by matching discovered filenames from source URLs", async () => {
    const publicDir = await mkdtemp(join(tmpdir(), "theguyser-public-filename-"));

    try {
      await writeFile(join(publicDir, "bao-chua-hero.jpg"), "jpg bytes");
      const publicFiles = await discoverPublicFolderFiles(publicDir);
      const linked = linkPublicFolderAssets(createFilenameOnlyManifest(), { publicFiles });

      expect(linked.content.entries[0]?.assets?.[0]?.metadata?.publicPath).toBe(
        "/bao-chua-hero.jpg",
      );
      expect(linked.content.entries[0]?.assets?.[0]?.sourceUrl).toBeNull();
      expect(linked.content.entries[0]?.assets?.[0]?.storagePath).toBe(
        "external-projects/theguyser/panel-content/profile/bao-chua-hero.jpg",
      );
    } finally {
      await rm(publicDir, { force: true, recursive: true });
    }
  });

  test("uploads linked public assets through Tuturuuu signed upload URLs", async () => {
    const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
    const publicDir = await mkdtemp(join(tmpdir(), "theguyser-public-assets-"));
    await writeFile(join(publicDir, "bao-chua-hero.jpg"), "jpg bytes");

    try {
      const result = await syncPublicFolderAssets({
        accessToken: "admin_token",
        apiBaseUrl: "https://platform.example.com/api/v1",
        fetch: createUploadFetch(calls),
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

  test("falls back to fetching root-relative public assets when filesystem reads fail", async () => {
    const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      calls.push({ init, input });

      if (input === "https://theguyser.example/bao-chua-hero.jpg") {
        return new Response("jpg bytes", {
          status: 200,
          headers: {
            "Content-Type": "image/jpeg",
          },
        });
      }

      if (String(input).includes("/external-projects/assets/upload-url")) {
        return Response.json({
          path: "external-projects/theguyser/panel-content/profile/bao-chua-hero.jpg",
          signedUrl: "https://upload.example.com/object",
          token: "upload_token",
        });
      }

      return new Response(null, { status: 200 });
    };

    const result = await syncPublicFolderAssets({
      accessToken: "admin_token",
      apiBaseUrl: "https://platform.example.com/api/v1",
      fetch: fetchImpl,
      manifest: createManifest(),
      publicDir: join(tmpdir(), "theguyser-missing-public-dir"),
      publicOrigin: "https://theguyser.example",
      tokenType: "Bearer",
      workspaceId: "ws_123",
    });

    expect(result.skipped).toEqual([]);
    expect(result.uploaded[0]?.publicPath).toBe("/bao-chua-hero.jpg");
    expect(calls.map((call) => call.input)).toEqual([
      "https://theguyser.example/bao-chua-hero.jpg",
      "https://platform.example.com/api/v1/workspaces/ws_123/external-projects/assets/upload-url",
      "https://upload.example.com/object",
    ]);
  });

  test("reports skipped assets only when filesystem and HTTP fallback fail", async () => {
    const result = await syncPublicFolderAssets({
      accessToken: "admin_token",
      apiBaseUrl: "https://platform.example.com/api/v1",
      fetch: (async () => new Response(null, { status: 404 })) as typeof fetch,
      manifest: createLocalOnlyManifest(),
      publicDir: join(tmpdir(), "theguyser-missing-public-dir"),
      publicOrigin: "https://theguyser.example",
      tokenType: "Bearer",
      workspaceId: "ws_123",
    });

    expect(result.uploaded).toEqual([]);
    expect(result.skipped[0]).toMatchObject({
      publicPath: "/missing.jpg",
      stableSourceId: "theguyser:panel:profile:image",
    });
  });
});
