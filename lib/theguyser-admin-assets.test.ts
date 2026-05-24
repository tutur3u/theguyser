import { describe, expect, test } from "bun:test";
import {
  getTheGuyserAdminAssetProxyPath,
  getTheGuyserAdminAssetSources,
} from "@/lib/theguyser-admin-assets";

describe("theguyser admin assets", () => {
  test("builds authenticated local proxy paths for admin images", () => {
    expect(
      getTheGuyserAdminAssetProxyPath(
        {
          id: "asset/with space",
        },
        {
          height: 640,
          quality: 72,
          resize: "contain",
          width: 960,
        },
      ),
    ).toBe("/api/admin/assets/asset%2Fwith%20space?width=960&height=640&resize=contain&quality=72");
  });

  test("prefers local proxy before platform fallbacks", () => {
    expect(
      getTheGuyserAdminAssetSources({
        asset_url: "https://platform.example/assets/source.png",
        id: "asset-1",
        preview_url: "https://platform.example/assets/preview.png",
        source_url: "https://cdn.example/source.png",
      }),
    ).toEqual([
      "/api/admin/assets/asset-1?width=1600&height=1600&resize=cover&quality=82",
      "https://platform.example/assets/preview.png",
      "https://platform.example/assets/source.png",
      "https://cdn.example/source.png",
    ]);
  });

  test("dedupes empty and repeated sources", () => {
    expect(
      getTheGuyserAdminAssetSources({
        asset_url: "https://cdn.example/reused.png",
        id: null,
        preview_url: "https://cdn.example/reused.png",
        source_url: " ",
      }),
    ).toEqual(["https://cdn.example/reused.png"]);
  });

  test("normalizes platform-relative asset URLs for external admin apps", () => {
    expect(
      getTheGuyserAdminAssetSources(
        {
          asset_url: "/api/v1/workspaces/ws-1/external-projects/assets/asset-1",
          id: "asset-1",
          preview_url:
            "/api/v1/workspaces/ws-1/external-projects/assets/asset-1?width=1200",
          source_url: "/workspaces/ws-1/external-projects/assets/source",
        },
        {
          apiBaseUrl: "https://platform.example.com/api/v1",
        },
      ),
    ).toEqual([
      "/api/admin/assets/asset-1?width=1600&height=1600&resize=cover&quality=82",
      "https://platform.example.com/api/v1/workspaces/ws-1/external-projects/assets/asset-1?width=1200",
      "https://platform.example.com/api/v1/workspaces/ws-1/external-projects/assets/asset-1",
      "https://platform.example.com/api/v1/workspaces/ws-1/external-projects/assets/source",
    ]);
  });
});
