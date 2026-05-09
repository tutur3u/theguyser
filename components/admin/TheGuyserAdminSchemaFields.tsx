"use client";

import {
  getTheGuyserManifestCollectionSchema,
  type TheGuyserSyncField,
} from "@/lib/theguyser-external-project-manifest";

function toRecord(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return null;
  }
}

function formatFieldValue(value: unknown, field: TheGuyserSyncField) {
  if (field.type === "string-array") {
    return Array.isArray(value) ? value.join(", ") : "";
  }

  if (field.type === "number") {
    return typeof value === "number" ? value.toString() : "";
  }

  if (field.type === "boolean") {
    return value === true;
  }

  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function parseFieldValue(value: string | boolean, field: TheGuyserSyncField) {
  if (field.type === "boolean") {
    return value === true;
  }

  const text = typeof value === "string" ? value.trim() : "";

  if (!text) {
    return undefined;
  }

  if (field.type === "number") {
    const numeric = Number(text);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  if (field.type === "string-array") {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return text;
}

export function TheGuyserAdminSchemaFields({
  collectionSlug,
  onChange,
  profileDataText,
}: {
  collectionSlug: string;
  onChange: (nextProfileDataText: string) => void;
  profileDataText: string;
}) {
  const schema = getTheGuyserManifestCollectionSchema(collectionSlug);
  const profileData = toRecord(profileDataText);
  const fields: TheGuyserSyncField[] = [...(schema?.profileFields ?? [])];

  if (!schema || fields.length === 0 || !profileData) {
    return null;
  }

  const setField = (field: TheGuyserSyncField, value: string | boolean) => {
    const next = { ...profileData };
    const parsedValue = parseFieldValue(value, field);

    if (parsedValue === undefined) {
      delete next[field.key];
    } else {
      next[field.key] = parsedValue;
    }

    onChange(JSON.stringify(next, null, 2));
  };

  return (
    <div className="md:col-span-2">
      <div className="mb-3 border-b border-slate-200 pb-2 dark:border-slate-800">
        <p className="text-xs font-black tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
          Structured profile fields
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{schema.title}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label className="grid gap-2" key={field.key}>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {field.label}
            </span>
            {field.type === "boolean" ? (
              <input
                checked={formatFieldValue(profileData[field.key], field) === true}
                className="h-5 w-5 accent-sky-500"
                onChange={(event) => setField(field, event.target.checked)}
                type="checkbox"
              />
            ) : field.options?.length ? (
              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                onChange={(event) => setField(field, event.target.value)}
                value={String(formatFieldValue(profileData[field.key], field))}
              >
                <option value="">Unset</option>
                {field.options.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                onChange={(event) => setField(field, event.target.value)}
                type={field.type === "number" ? "number" : "text"}
                value={String(formatFieldValue(profileData[field.key], field))}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
