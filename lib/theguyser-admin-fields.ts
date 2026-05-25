import type {
  TheGuyserSyncCollectionSchema,
  TheGuyserSyncField,
} from "@/lib/theguyser-external-project-manifest";
import { getTheGuyserManifestCollectionSchema } from "@/lib/theguyser-external-project-manifest";

export type TheGuyserAdminFieldInput =
  | "boolean"
  | "date"
  | "datetime"
  | "email"
  | "field-list"
  | "json"
  | "markdown"
  | "number"
  | "select"
  | "string-array"
  | "text"
  | "textarea"
  | "url";

export type TheGuyserAdminFieldScope = "config" | "metadata" | "profileData";

export type TheGuyserAdminFieldDescriptor = {
  advanced: boolean;
  description?: string | null;
  group: "Additional fields" | "Advanced styling" | "Collection schema" | "Content fields" | "Metadata";
  input: TheGuyserAdminFieldInput;
  key: string;
  label: string;
  options?: string[];
  required?: boolean;
  scope: TheGuyserAdminFieldScope;
  styling: boolean;
};

const STYLING_FIELD_KEYS = new Set([
  "accent",
  "background",
  "bg",
  "className",
  "color",
  "iconKey",
  "size",
  "textColor",
]);

const COLLECTION_SCHEMA_KEYS = [
  "assetTypes",
  "blockTypes",
  "profileFields",
  "metadataFields",
] as const;

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function titleizeKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function inferInputFromKey(key: string, fallback: TheGuyserAdminFieldInput = "text") {
  const normalized = key.toLowerCase();

  if (normalized.includes("email")) {
    return "email";
  }

  if (normalized === "href" || normalized.endsWith("url") || normalized.includes("url")) {
    return "url";
  }

  if (normalized.includes("body") || normalized.includes("summary") || normalized.includes("description")) {
    return "textarea";
  }

  return fallback;
}

function getInputForSyncField(field: TheGuyserSyncField): TheGuyserAdminFieldInput {
  if (field.options?.length) {
    return "select";
  }

  if (field.type === "string") {
    return inferInputFromKey(field.key);
  }

  return field.type;
}

function inferInputFromValue(key: string, value: unknown): TheGuyserAdminFieldInput {
  if (typeof value === "boolean") {
    return "boolean";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return "string-array";
  }

  if (value && typeof value === "object") {
    return "json";
  }

  return inferInputFromKey(key);
}

function descriptorFromSyncField(
  field: TheGuyserSyncField,
  scope: TheGuyserAdminFieldScope,
): TheGuyserAdminFieldDescriptor {
  const styling = STYLING_FIELD_KEYS.has(field.key);

  return {
    advanced: styling,
    description: field.description ?? null,
    group: styling ? "Advanced styling" : scope === "metadata" ? "Metadata" : "Content fields",
    input: getInputForSyncField(field),
    key: field.key,
    label: field.label,
    options: field.options,
    required: field.required,
    scope,
    styling,
  };
}

function descriptorFromUnknownField(
  key: string,
  value: unknown,
  scope: Exclude<TheGuyserAdminFieldScope, "config">,
): TheGuyserAdminFieldDescriptor {
  const styling = STYLING_FIELD_KEYS.has(key);

  return {
    advanced: styling,
    group: styling ? "Advanced styling" : "Additional fields",
    input: inferInputFromValue(key, value),
    key,
    label: titleizeKey(key),
    scope,
    styling,
  };
}

export function buildTheGuyserEntryFieldDescriptors({
  collectionSlug,
  metadata,
  profileData,
}: {
  collectionSlug: string | null | undefined;
  metadata: Record<string, unknown>;
  profileData: Record<string, unknown>;
}) {
  const schema = getTheGuyserManifestCollectionSchema(collectionSlug) as TheGuyserSyncCollectionSchema | null;
  const profileFields = schema?.profileFields ?? [];
  const metadataFields = schema?.metadataFields ?? [];
  const descriptors: TheGuyserAdminFieldDescriptor[] = [
    ...profileFields.map((field) => descriptorFromSyncField(field, "profileData")),
    ...metadataFields.map((field) => descriptorFromSyncField(field, "metadata")),
  ];
  const knownProfileKeys = new Set(profileFields.map((field) => field.key));
  const knownMetadataKeys = new Set(metadataFields.map((field) => field.key));

  for (const [key, value] of Object.entries(profileData)) {
    if (!knownProfileKeys.has(key)) {
      descriptors.push(descriptorFromUnknownField(key, value, "profileData"));
    }
  }

  for (const [key, value] of Object.entries(metadata)) {
    if (!knownMetadataKeys.has(key)) {
      descriptors.push(descriptorFromUnknownField(key, value, "metadata"));
    }
  }

  return descriptors;
}

function getCollectionSchemaObject(config: Record<string, unknown>) {
  const schema = toRecord(config.schema);
  return Object.keys(schema).length > 0 ? schema : config;
}

export function buildTheGuyserCollectionConfigFieldDescriptors({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const schema = getCollectionSchemaObject(config);
  const descriptors: TheGuyserAdminFieldDescriptor[] = COLLECTION_SCHEMA_KEYS.map((key) => ({
    advanced: key === "metadataFields",
    group: "Collection schema",
    input: key.endsWith("Fields") ? "field-list" : "string-array",
    key,
    label: titleizeKey(key),
    scope: "config",
    styling: false,
  }));

  for (const key of Object.keys(schema)) {
    if (COLLECTION_SCHEMA_KEYS.includes(key as (typeof COLLECTION_SCHEMA_KEYS)[number])) {
      continue;
    }

    descriptors.push({
      advanced: key === "config",
      group: "Additional fields",
      input: inferInputFromValue(key, schema[key]),
      key,
      label: titleizeKey(key),
      scope: "config",
      styling: false,
    });
  }

  return descriptors;
}

export function getTheGuyserFieldValue(
  source: Record<string, unknown>,
  descriptor: Pick<TheGuyserAdminFieldDescriptor, "key">,
) {
  return source[descriptor.key];
}

export function setTheGuyserFieldValue(
  source: Record<string, unknown>,
  descriptor: Pick<TheGuyserAdminFieldDescriptor, "key">,
  value: unknown,
) {
  const next = { ...source };

  if (value === undefined || value === null || value === "") {
    delete next[descriptor.key];
  } else {
    next[descriptor.key] = value;
  }

  return next;
}

export function getTheGuyserCollectionSchemaConfig(config: Record<string, unknown>) {
  const hasWrappedSchema = Boolean(config.schema && typeof config.schema === "object" && !Array.isArray(config.schema));
  const schema = getCollectionSchemaObject(config);

  return { hasWrappedSchema, schema };
}

export function setTheGuyserCollectionSchemaValue(
  config: Record<string, unknown>,
  descriptor: Pick<TheGuyserAdminFieldDescriptor, "key">,
  value: unknown,
) {
  const { hasWrappedSchema, schema } = getTheGuyserCollectionSchemaConfig(config);
  const nextSchema = setTheGuyserFieldValue(schema, descriptor, value);

  return hasWrappedSchema
    ? {
        ...config,
        schema: nextSchema,
      }
    : nextSchema;
}
