"use client";

import type { TheGuyserSyncField } from "@/lib/theguyser-external-project-manifest";
import type { TheGuyserAdminFieldDescriptor } from "@/lib/theguyser-admin-fields";
import { getTheGuyserFieldValue } from "@/lib/theguyser-admin-fields";
import { Plus, Trash2 } from "lucide-react";

type FieldEditorValues = Partial<Record<TheGuyserAdminFieldDescriptor["scope"], Record<string, unknown>>>;

const FIELD_TYPES: TheGuyserSyncField["type"][] = [
  "boolean",
  "date",
  "datetime",
  "json",
  "markdown",
  "number",
  "string",
  "string-array",
];

function controlClass(extra = "") {
  return `rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white ${extra}`;
}

function toArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function formatValue(value: unknown, descriptor: TheGuyserAdminFieldDescriptor) {
  if (descriptor.input === "string-array") {
    return Array.isArray(value) ? value.join(", ") : "";
  }

  if (descriptor.input === "json") {
    return JSON.stringify(value ?? {}, null, 2);
  }

  if (descriptor.input === "number") {
    return typeof value === "number" ? String(value) : "";
  }

  if (descriptor.input === "boolean") {
    return value === true;
  }

  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function parseTextValue(value: string | boolean, descriptor: TheGuyserAdminFieldDescriptor) {
  if (descriptor.input === "boolean") {
    return value === true;
  }

  const text = typeof value === "string" ? value : "";

  if (descriptor.input === "json") {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return undefined;
    }
  }

  if (descriptor.input === "number") {
    const numeric = Number(text);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  if (descriptor.input === "string-array") {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return text.trim() ? text : undefined;
}

function normalizeFieldDefinition(value: unknown): TheGuyserSyncField {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? (value as Partial<TheGuyserSyncField>)
    : {};

  return {
    key: typeof record.key === "string" ? record.key : "",
    label: typeof record.label === "string" ? record.label : "",
    options: Array.isArray(record.options) ? record.options.filter((item): item is string => typeof item === "string") : undefined,
    required: record.required === true,
    type: FIELD_TYPES.includes(record.type as TheGuyserSyncField["type"])
      ? (record.type as TheGuyserSyncField["type"])
      : "string",
  };
}

function FieldListControl({
  onChange,
  value,
}: {
  onChange: (value: TheGuyserSyncField[]) => void;
  value: unknown;
}) {
  const fields = toArray(value).map(normalizeFieldDefinition);

  const updateField = (index: number, patch: Partial<TheGuyserSyncField>) => {
    onChange(fields.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...patch } : field)));
  };

  return (
    <div className="grid gap-3">
      {fields.map((field, index) => (
        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60" key={`${field.key}:${index}`}>
          <div className="grid gap-2 md:grid-cols-[1fr_1fr_10rem_auto]">
            <input
              className={controlClass()}
              onChange={(event) => updateField(index, { key: event.target.value })}
              placeholder="key"
              value={field.key}
            />
            <input
              className={controlClass()}
              onChange={(event) => updateField(index, { label: event.target.value })}
              placeholder="Label"
              value={field.label}
            />
            <select
              className={controlClass()}
              onChange={(event) => updateField(index, { type: event.target.value as TheGuyserSyncField["type"] })}
              value={field.type}
            >
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-950 dark:text-red-200"
              onClick={() => onChange(fields.filter((_, fieldIndex) => fieldIndex !== index))}
              type="button"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <input
            className={controlClass()}
            onChange={(event) =>
              updateField(index, {
                options: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Options, comma separated"
            value={field.options?.join(", ") ?? ""}
          />
        </div>
      ))}
      <button
        className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        onClick={() => onChange([...fields, { key: "", label: "", type: "string" }])}
        type="button"
      >
        <Plus className="size-4" />
        Add field
      </button>
    </div>
  );
}

function FieldControl({
  descriptor,
  onChange,
  value,
}: {
  descriptor: TheGuyserAdminFieldDescriptor;
  onChange: (value: unknown) => void;
  value: unknown;
}) {
  if (descriptor.input === "field-list") {
    return <FieldListControl onChange={onChange} value={value} />;
  }

  if (descriptor.input === "boolean") {
    return (
      <button
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-black transition ${
          value === true
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
            : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950"
        }`}
        onClick={() => onChange(value !== true)}
        type="button"
      >
        {value === true ? "Enabled" : "Disabled"}
      </button>
    );
  }

  if (descriptor.input === "select") {
    return (
      <select
        className={controlClass()}
        onChange={(event) => onChange(parseTextValue(event.target.value, descriptor))}
        value={String(formatValue(value, descriptor))}
      >
        <option value="">Unset</option>
        {descriptor.options?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (["json", "markdown", "textarea"].includes(descriptor.input)) {
    return (
      <textarea
        className={controlClass(descriptor.input === "json" ? "min-h-28 font-mono text-xs leading-5" : "min-h-28 leading-6")}
        onChange={(event) => onChange(parseTextValue(event.target.value, descriptor))}
        value={String(formatValue(value, descriptor))}
      />
    );
  }

  return (
    <input
      className={controlClass()}
      onChange={(event) => onChange(parseTextValue(event.target.value, descriptor))}
      type={descriptor.input === "number" ? "number" : descriptor.input === "email" ? "email" : descriptor.input === "url" ? "url" : descriptor.input === "date" ? "date" : descriptor.input === "datetime" ? "datetime-local" : "text"}
      value={String(formatValue(value, descriptor))}
    />
  );
}

function DescriptorField({
  descriptor,
  onValueChange,
  values,
}: {
  descriptor: TheGuyserAdminFieldDescriptor;
  onValueChange: (descriptor: TheGuyserAdminFieldDescriptor, value: unknown) => void;
  values: FieldEditorValues;
}) {
  const scopeValues = values[descriptor.scope] ?? {};
  const value = getTheGuyserFieldValue(scopeValues, descriptor);

  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{descriptor.label}</span>
      <FieldControl descriptor={descriptor} onChange={(nextValue) => onValueChange(descriptor, nextValue)} value={value} />
      {descriptor.description ? (
        <span className="text-xs leading-5 text-slate-400 dark:text-slate-500">{descriptor.description}</span>
      ) : null}
    </label>
  );
}

export function TheGuyserAdminFieldEditor({
  descriptors,
  onValueChange,
  values,
}: {
  descriptors: TheGuyserAdminFieldDescriptor[];
  onValueChange: (descriptor: TheGuyserAdminFieldDescriptor, value: unknown) => void;
  values: FieldEditorValues;
}) {
  const visibleGroups = ["Content fields", "Metadata", "Additional fields", "Collection schema"];
  const stylingFields = descriptors.filter((descriptor) => descriptor.group === "Advanced styling");

  return (
    <div className="grid gap-5 md:col-span-2">
      {visibleGroups.map((group) => {
        const groupFields = descriptors.filter((descriptor) => descriptor.group === group);

        if (groupFields.length === 0) {
          return null;
        }

        return (
          <section className="grid gap-4" key={group}>
            <div className="border-b border-slate-200 pb-2 dark:border-slate-800">
              <p className="text-xs font-black tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">{group}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {groupFields.map((descriptor) => (
                <DescriptorField descriptor={descriptor} key={`${descriptor.scope}:${descriptor.key}`} onValueChange={onValueChange} values={values} />
              ))}
            </div>
          </section>
        );
      })}
      {stylingFields.length > 0 ? (
        <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          <summary className="cursor-pointer text-sm font-black text-slate-700 dark:text-slate-200">Advanced styling</summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {stylingFields.map((descriptor) => (
              <DescriptorField descriptor={descriptor} key={`${descriptor.scope}:${descriptor.key}`} onValueChange={onValueChange} values={values} />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
