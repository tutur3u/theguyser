import type { DeliveryAsset, DeliveryEntry, TheGuyserDeliveryPayload } from "@/lib/theguyser-content";

type JsonObject = Record<string, unknown>;

export type TheGuyserGamePlayer = {
  description: string;
  externalHref: string | null;
  iframeSrc: string;
  image: string | null;
  slug: string;
  title: string;
};

function asRecord(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function absolutizePlatformUrl(apiBaseUrl: string, value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const parsedBaseUrl = new URL(apiBaseUrl);
  return new URL(value, parsedBaseUrl.origin).toString();
}

export function hasValidTheGuyserWebglPackage(asset: DeliveryAsset | null | undefined) {
  if (!asset || asset.asset_type !== "webgl-package") {
    return false;
  }

  const metadata = asRecord(asset.metadata);
  return metadata.kind === "webgl-package" && Boolean(asString(metadata.entryUrl));
}

export function findTheGuyserWebglPackageAsset(entry: DeliveryEntry | null | undefined) {
  return entry?.assets.find((asset) => hasValidTheGuyserWebglPackage(asset)) ?? null;
}

function getLeadImage(entry: DeliveryEntry) {
  const image = entry.assets
    .filter((asset) => asset.asset_type === "image")
    .sort((left, right) => left.sort_order - right.sort_order)[0];

  return image?.assetUrl ?? image?.source_url ?? null;
}

export function getTheGuyserGamePlayer(
  delivery: TheGuyserDeliveryPayload | null | undefined,
  {
    apiBaseUrl,
    slug,
  }: {
    apiBaseUrl: string;
    slug: string;
  },
): TheGuyserGamePlayer | null {
  if (!delivery || delivery.adapter !== "theguyser") {
    return null;
  }

  const experience = delivery.collections.find((collection) => collection.slug === "experience");
  const entry = experience?.entries.find((item) => {
    const profileData = asRecord(item.profile_data);
    return item.slug === slug && item.status === "published" && (asString(profileData.kind) ?? "game") === "game";
  });

  if (!entry) {
    return null;
  }

  const asset = findTheGuyserWebglPackageAsset(entry);
  const entryUrl = asString(asRecord(asset?.metadata).entryUrl);

  if (!entryUrl) {
    return null;
  }

  const profileData = asRecord(entry.profile_data);

  return {
    description: entry.summary ?? "",
    externalHref: asString(profileData.href),
    iframeSrc: absolutizePlatformUrl(apiBaseUrl, entryUrl),
    image: getLeadImage(entry),
    slug: entry.slug,
    title: entry.title,
  };
}
