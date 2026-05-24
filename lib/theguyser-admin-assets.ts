export type TheGuyserAdminImageAsset = {
  asset_url?: string | null;
  id?: string | null;
  preview_url?: string | null;
  source_url?: string | null;
  storage_path?: string | null;
};

export type TheGuyserAdminImageTransform = {
  format?: "origin";
  height?: number;
  quality?: number;
  resize?: "contain" | "cover" | "fill";
  width?: number;
};

export type TheGuyserAdminAssetSourceOptions = {
  apiBaseUrl?: string | null;
};

const DEFAULT_ADMIN_IMAGE_TRANSFORM = {
  height: 1600,
  quality: 82,
  resize: "cover",
  width: 1600,
} satisfies TheGuyserAdminImageTransform;

function appendTransformParams(
  params: URLSearchParams,
  transform: TheGuyserAdminImageTransform,
) {
  if (transform.width !== undefined) {
    params.set("width", transform.width.toString());
  }

  if (transform.height !== undefined) {
    params.set("height", transform.height.toString());
  }

  if (transform.resize) {
    params.set("resize", transform.resize);
  }

  if (transform.quality !== undefined) {
    params.set("quality", transform.quality.toString());
  }

  if (transform.format) {
    params.set("format", transform.format);
  }
}

export function getTheGuyserAdminAssetProxyPath(
  asset: TheGuyserAdminImageAsset | null | undefined,
  transform: TheGuyserAdminImageTransform = DEFAULT_ADMIN_IMAGE_TRANSFORM,
) {
  if (!asset?.id?.trim()) {
    return null;
  }

  const params = new URLSearchParams();
  appendTransformParams(params, transform);

  const query = params.toString();
  return `/api/admin/assets/${encodeURIComponent(asset.id)}${query ? `?${query}` : ""}`;
}

function compactUniqueSources(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const sources: string[] = [];

  for (const value of values) {
    const source = value?.trim();

    if (!source || seen.has(source)) {
      continue;
    }

    seen.add(source);
    sources.push(source);
  }

  return sources;
}

function normalizePlatformAssetUrl(
  value: string | null | undefined,
  apiBaseUrl: string | null | undefined,
) {
  const source = value?.trim();

  if (!source) {
    return null;
  }

  if (!apiBaseUrl || /^https?:\/\//i.test(source) || source.startsWith("/api/admin/")) {
    return source;
  }

  try {
    const apiUrl = new URL(apiBaseUrl);

    if (source.startsWith("/api/v1/")) {
      return new URL(source, apiUrl.origin).toString();
    }

    if (source.startsWith("/workspaces/")) {
      return new URL(
        `${apiUrl.pathname.replace(/\/+$/, "")}${source}`,
        apiUrl.origin,
      ).toString();
    }
  } catch {}

  return source;
}

export function getTheGuyserAdminAssetSources(
  asset: TheGuyserAdminImageAsset | null | undefined,
  options: TheGuyserAdminAssetSourceOptions = {},
) {
  return compactUniqueSources([
    getTheGuyserAdminAssetProxyPath(asset),
    normalizePlatformAssetUrl(asset?.preview_url, options.apiBaseUrl),
    normalizePlatformAssetUrl(asset?.asset_url, options.apiBaseUrl),
    normalizePlatformAssetUrl(asset?.source_url, options.apiBaseUrl),
  ]);
}
