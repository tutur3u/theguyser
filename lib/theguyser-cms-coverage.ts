import { theGuyserExternalProjectManifest, type TheGuyserExternalProjectManifest } from "@/lib/theguyser-external-project-manifest";
import type { DeliveryCollection, DeliveryEntry, TheGuyserDeliveryPayload } from "@/lib/theguyser-content";
import { hasValidTheGuyserWebglPackage } from "@/lib/theguyser-webgl";

type MissingGroups = {
  assets: string[];
  collections: string[];
  entries: string[];
  fields: string[];
  webglPackages: string[];
};

export type TheGuyserCmsCoverageReport = {
  complete: boolean;
  missing: MissingGroups;
  summary: {
    presentAssets: number;
    presentCollections: number;
    presentEntries: number;
    presentFields: number;
    presentWebglPackages: number;
    requiredAssets: number;
    requiredCollections: number;
    requiredEntries: number;
    requiredFields: number;
    requiredWebglPackages: number;
  };
};

const EMPTY_MISSING: MissingGroups = {
  assets: [],
  collections: [],
  entries: [],
  fields: [],
  webglPackages: [],
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getCollectionSchema(collection: DeliveryCollection | null | undefined) {
  const config = asRecord(collection?.config);
  const schema = config.schema;

  return schema && typeof schema === "object" && !Array.isArray(schema)
    ? (schema as Record<string, unknown>)
    : null;
}

function listFieldKeys(schema: Record<string, unknown> | null, scope: "metadata" | "profile") {
  const fields = schema?.[scope === "profile" ? "profileFields" : "metadataFields"];

  return Array.isArray(fields)
    ? fields
        .map((field) => asString(asRecord(field).key))
        .filter((field): field is string => Boolean(field))
    : [];
}

function getManifestEntryKey(entry: TheGuyserExternalProjectManifest["content"]["entries"][number]) {
  return entry.stableSourceId || `${entry.collectionSlug}:${entry.slug}`;
}

function getDeliveryEntryKey(collectionSlug: string, entry: DeliveryEntry) {
  return entry.stable_source_id ?? `${collectionSlug}:${entry.slug}`;
}

function findDeliveryEntry(
  collectionSlug: string,
  entriesByKey: Map<string, DeliveryEntry>,
  manifestEntry: TheGuyserExternalProjectManifest["content"]["entries"][number],
) {
  return (
    entriesByKey.get(getManifestEntryKey(manifestEntry)) ??
    entriesByKey.get(`${collectionSlug}:${manifestEntry.slug}`) ??
    null
  );
}

function hasManifestAsset(deliveryEntry: DeliveryEntry | null, manifestAsset: { assetType: string; stableSourceId: string }) {
  if (!deliveryEntry) {
    return false;
  }

  return deliveryEntry.assets.some(
    (asset) => asset.stable_source_id === manifestAsset.stableSourceId || asset.asset_type === manifestAsset.assetType,
  );
}

export function getTheGuyserCmsCoverageReport(
  delivery: TheGuyserDeliveryPayload | null | undefined,
  manifest: TheGuyserExternalProjectManifest = theGuyserExternalProjectManifest,
): TheGuyserCmsCoverageReport {
  if (!delivery || delivery.adapter !== "theguyser") {
    return {
      complete: false,
      missing: {
        ...EMPTY_MISSING,
        collections: manifest.schema.collections.map((collection) => collection.slug),
        entries: manifest.content.entries.map(getManifestEntryKey),
      },
      summary: {
        presentAssets: 0,
        presentCollections: 0,
        presentEntries: 0,
        presentFields: 0,
        presentWebglPackages: 0,
        requiredAssets: manifest.content.entries.reduce((count, entry) => count + (entry.assets?.length ?? 0), 0),
        requiredCollections: manifest.schema.collections.length,
        requiredEntries: manifest.content.entries.length,
        requiredFields: manifest.schema.collections.reduce(
          (count, collection) => count + (collection.profileFields?.length ?? 0) + (collection.metadataFields?.length ?? 0),
          0,
        ),
        requiredWebglPackages: 0,
      },
    };
  }

  const collectionBySlug = new Map(delivery.collections.map((collection) => [collection.slug, collection]));
  const entriesByKey = new Map<string, DeliveryEntry>();

  for (const collection of delivery.collections) {
    for (const entry of collection.entries) {
      entriesByKey.set(getDeliveryEntryKey(collection.slug, entry), entry);
      entriesByKey.set(`${collection.slug}:${entry.slug}`, entry);
    }
  }

  const missing: MissingGroups = {
    assets: [],
    collections: [],
    entries: [],
    fields: [],
    webglPackages: [],
  };

  let requiredFields = 0;
  let presentFields = 0;

  for (const collectionSchema of manifest.schema.collections) {
    const collection = collectionBySlug.get(collectionSchema.slug) ?? null;

    if (!collection) {
      missing.collections.push(collectionSchema.slug);
    }

    const deliveredSchema = getCollectionSchema(collection);
    const requiredProfileFields = collectionSchema.profileFields?.map((field) => field.key) ?? [];
    const requiredMetadataFields = collectionSchema.metadataFields?.map((field) => field.key) ?? [];
    const presentProfileFields = new Set(listFieldKeys(deliveredSchema, "profile"));
    const presentMetadataFields = new Set(listFieldKeys(deliveredSchema, "metadata"));

    requiredFields += requiredProfileFields.length + requiredMetadataFields.length;

    for (const field of requiredProfileFields) {
      if (presentProfileFields.has(field)) {
        presentFields += 1;
      } else {
        missing.fields.push(`${collectionSchema.slug}:profile:${field}`);
      }
    }

    for (const field of requiredMetadataFields) {
      if (presentMetadataFields.has(field)) {
        presentFields += 1;
      } else {
        missing.fields.push(`${collectionSchema.slug}:metadata:${field}`);
      }
    }
  }

  let requiredAssets = 0;
  let presentAssets = 0;
  let presentWebglPackages = 0;

  for (const manifestEntry of manifest.content.entries) {
    const deliveryEntry = findDeliveryEntry(manifestEntry.collectionSlug, entriesByKey, manifestEntry);

    if (!deliveryEntry) {
      missing.entries.push(getManifestEntryKey(manifestEntry));
    }

    for (const asset of manifestEntry.assets ?? []) {
      requiredAssets += 1;

      if (hasManifestAsset(deliveryEntry, asset)) {
        presentAssets += 1;
      } else {
        missing.assets.push(asset.stableSourceId);
      }
    }

    if (deliveryEntry?.assets.some((asset) => hasValidTheGuyserWebglPackage(asset))) {
      presentWebglPackages += 1;
    }
  }

  return {
    complete: Object.values(missing).every((items) => items.length === 0),
    missing,
    summary: {
      presentAssets,
      presentCollections: manifest.schema.collections.length - missing.collections.length,
      presentEntries: manifest.content.entries.length - missing.entries.length,
      presentFields,
      presentWebglPackages,
      requiredAssets,
      requiredCollections: manifest.schema.collections.length,
      requiredEntries: manifest.content.entries.length,
      requiredFields,
      requiredWebglPackages: 0,
    },
  };
}
