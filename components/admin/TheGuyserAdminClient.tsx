"use client";

import { TheGuyserAdminMediaImage } from "@/components/admin/TheGuyserAdminMediaImage";
import { TheGuyserAdminFieldEditor } from "@/components/admin/TheGuyserAdminFieldEditor";
import { TheGuyserAdminSyncPanel } from "@/components/admin/TheGuyserAdminSyncPanel";
import {
  buildTheGuyserCollectionConfigFieldDescriptors,
  buildTheGuyserEntryFieldDescriptors,
  getTheGuyserCollectionSchemaConfig,
  setTheGuyserCollectionSchemaValue,
  setTheGuyserFieldValue,
  type TheGuyserAdminFieldDescriptor,
} from "@/lib/theguyser-admin-fields";
import {
  buildTheGuyserAdminDraftPortfolioContent,
  THEGUYSER_ADMIN_PREVIEW_MESSAGE,
  type TheGuyserAdminAssetDraftPreview,
  type TheGuyserAdminCollectionDraftPreview,
  type TheGuyserAdminEntryDraftPreview,
  type TheGuyserAdminPreviewMessage,
} from "@/lib/theguyser-admin-preview";
import type {
  JsonObject,
  TheGuyserAdminAsset,
  TheGuyserAdminBlock,
  TheGuyserAdminCollection,
  TheGuyserAdminEntry,
  TheGuyserAdminStudioPayload,
  TheGuyserEntryStatus,
} from "@/lib/theguyser-admin-api";
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Eye,
  FileText,
  ImageIcon,
  Layers,
  Link as LinkIcon,
  LoaderCircle,
  LogOut,
  Monitor,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Send,
  Settings2,
  Trash2,
  Undo2,
} from "lucide-react";
import type { PortfolioContent } from "@/components/portfolio/types";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type AdminLink = {
  actionLabel: string;
  cmsHref: string;
  description: string;
  key: string;
  label: string;
  loginHref: string;
};

type EntryDraft = {
  blockMarkdownText: string;
  metadataText: string;
  profileDataText: string;
  scheduledFor: string;
  slug: string;
  status: TheGuyserEntryStatus;
  subtitle: string;
  summary: string;
  title: string;
};

type AssetDraft = {
  altText: string;
  assetType: string;
  metadataText: string;
  sortOrder: string;
  sourceUrl: string;
  storagePath: string;
};

type CollectionDraft = {
  configText: string;
  description: string;
  isEnabled: boolean;
  slug: string;
  title: string;
};

const ENTRY_STATUSES: TheGuyserEntryStatus[] = ["draft", "scheduled", "published", "archived"];

function mergeEntry(studio: TheGuyserAdminStudioPayload, entry: TheGuyserAdminEntry) {
  const exists = studio.entries.some((item) => item.id === entry.id);

  return {
    ...studio,
    entries: exists
      ? studio.entries.map((item) => (item.id === entry.id ? entry : item))
      : [entry, ...studio.entries],
  };
}

function mergeCollection(
  studio: TheGuyserAdminStudioPayload,
  collection: TheGuyserAdminCollection,
) {
  const exists = studio.collections.some((item) => item.id === collection.id);

  return {
    ...studio,
    collections: exists
      ? studio.collections.map((item) => (item.id === collection.id ? collection : item))
      : [collection, ...studio.collections],
  };
}

function mergeBlock(studio: TheGuyserAdminStudioPayload, block: TheGuyserAdminBlock) {
  const exists = studio.blocks.some((item) => item.id === block.id);

  return {
    ...studio,
    blocks: exists
      ? studio.blocks.map((item) => (item.id === block.id ? block : item))
      : [...studio.blocks, block],
  };
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "None";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function stringifyJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2);
}

function parseJsonObject(value: string, label: string): JsonObject {
  const parsed = JSON.parse(value) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }

  return parsed as JsonObject;
}

function parseJsonObjectSafe(value: string): JsonObject | null {
  try {
    return parseJsonObject(value, "JSON");
  } catch {
    return null;
  }
}

function toDatetimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value.trim()) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function readAdminError(response: Response) {
  const fallback = `Request failed with status ${response.status}`;
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" && data.error.trim() ? data.error : fallback;
}

async function fetchAdminJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await readAdminError(response));
  }

  return (await response.json()) as T;
}

function getEntryMarkdownBlock(
  entry: TheGuyserAdminEntry,
  blocks: TheGuyserAdminBlock[],
) {
  return (
    blocks
      .filter((block) => block.entry_id === entry.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .find((block) => block.block_type === "markdown") ?? null
  );
}

function getEntryDraft(entry: TheGuyserAdminEntry, blocks: TheGuyserAdminBlock[]): EntryDraft {
  const markdownBlock = getEntryMarkdownBlock(entry, blocks);

  return {
    blockMarkdownText:
      typeof markdownBlock?.content?.markdown === "string"
        ? markdownBlock.content.markdown
        : "",
    metadataText: stringifyJson(entry.metadata),
    profileDataText: stringifyJson(entry.profile_data),
    scheduledFor: toDatetimeLocal(entry.scheduled_for),
    slug: entry.slug,
    status: entry.status,
    subtitle: entry.subtitle ?? "",
    summary: entry.summary ?? "",
    title: entry.title,
  };
}

function getAssetDraft(asset: TheGuyserAdminAsset | null | undefined): AssetDraft {
  return {
    altText: asset?.alt_text ?? "",
    assetType: asset?.asset_type ?? "image",
    metadataText: stringifyJson(asset?.metadata),
    sortOrder: String(asset?.sort_order ?? 0),
    sourceUrl: asset?.source_url ?? asset?.asset_url ?? asset?.preview_url ?? "",
    storagePath: asset?.storage_path ?? "",
  };
}

function getCollectionDraft(collection: TheGuyserAdminCollection): CollectionDraft {
  return {
    configText: stringifyJson(collection.config),
    description: collection.description ?? "",
    isEnabled: collection.is_enabled,
    slug: collection.slug,
    title: collection.title,
  };
}

function getStatusClass(status: TheGuyserEntryStatus) {
  if (status === "published") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200";
  }

  if (status === "scheduled") {
    return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200";
  }

  if (status === "archived") {
    return "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500";
  }

  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200";
}

function getCollectionTitle(collections: TheGuyserAdminCollection[], collectionId: string) {
  return collections.find((collection) => collection.id === collectionId)?.title ?? "Unsorted";
}

function getPrimaryAsset(entry: TheGuyserAdminEntry, assets: TheGuyserAdminAsset[]) {
  return assets
    .filter((asset) => asset.entry_id === entry.id && asset.asset_type === "image")
    .sort((a, b) => a.sort_order - b.sort_order)[0];
}

function AdminButton({
  children,
  disabled,
  onClick,
  tone = "secondary",
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  tone?: "danger" | "primary" | "secondary";
  type?: "button" | "submit";
}) {
  const toneClass =
    tone === "primary"
      ? "border-sky-500 bg-sky-500 text-white shadow-md hover:bg-sky-600"
      : tone === "danger"
        ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
        : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${toneClass}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  return (
    <input
      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
  );
}

function TextArea({
  minRows = 4,
  onChange,
  value,
}: {
  minRows?: number;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <textarea
      className="min-h-[7rem] resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs leading-5 text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      onChange={(event) => onChange(event.target.value)}
      rows={minRows}
      value={value}
    />
  );
}

function TheGuyserAdminFullSitePreview({ content }: { content: PortfolioContent }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const postPreview = useCallback(() => {
    const message = {
      content,
      type: THEGUYSER_ADMIN_PREVIEW_MESSAGE,
    } satisfies TheGuyserAdminPreviewMessage;

    iframeRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [content]);

  useEffect(() => {
    postPreview();
  }, [postPreview]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === "theguyser:admin-preview-ready") {
        postPreview();
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postPreview]);

  return (
    <details className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-slate-900 dark:text-white">
        <span className="inline-flex items-center gap-2 text-lg font-black">
          <Monitor className="size-5 text-sky-500" />
          Full-site draft preview
        </span>
        <span className="text-xs font-bold text-slate-400">unsaved draft</span>
      </summary>
      <div className="border-t border-slate-200 bg-slate-950 p-3 dark:border-slate-800">
        <iframe
          className="h-[42rem] w-full rounded-2xl border border-slate-800 bg-white"
          onLoad={postPreview}
          ref={iframeRef}
          src="/admin/preview"
          title="TheGuyser full-site draft preview"
        />
      </div>
    </details>
  );
}

function EntryInlinePreview({
  apiBaseUrl,
  asset,
  assetDraft,
  collectionSlug,
  draft,
}: {
  apiBaseUrl: string;
  asset: TheGuyserAdminAsset | undefined;
  assetDraft: AssetDraft;
  collectionSlug: string;
  draft: EntryDraft;
}) {
  const profileData = parseJsonObjectSafe(draft.profileDataText) ?? {};
  const imageUrl = assetDraft.sourceUrl.trim();
  const previewAsset = asset
    ? {
        ...asset,
        alt_text: assetDraft.altText.trim() || draft.title,
        asset_url: imageUrl || asset.asset_url,
        preview_url: imageUrl || asset.preview_url,
        source_url: imageUrl || asset.source_url,
      }
    : null;
  const heading = draft.title.trim() || "Untitled";
  const summary = draft.summary.trim();

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
          <Eye className="size-4 text-sky-500" />
          Inline preview
        </div>
        <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-black text-slate-400 dark:border-slate-800">{collectionSlug}</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {collectionSlug === "navigation" ? (
          <div className="grid gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg font-black text-slate-900 dark:text-white">{heading}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500 dark:bg-slate-800">{profileData.visible === false ? "Hidden" : "Visible"}</span>
            </div>
            <p className="font-mono text-xs text-slate-400">{String(profileData.appId ?? draft.slug)}</p>
          </div>
        ) : collectionSlug === "quick-launch" ? (
          <div className="grid gap-2 p-4">
            <span className="text-xs font-black text-sky-500">{String(profileData.label ?? "Launch")}</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{heading}</h3>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{summary || "No description yet."}</p>
          </div>
        ) : collectionSlug === "experience" ? (
          <div className="grid sm:grid-cols-[9rem_minmax(0,1fr)]">
            <div className="relative min-h-44 bg-slate-950">
              <TheGuyserAdminMediaImage alt={assetDraft.altText || heading} apiBaseUrl={apiBaseUrl} asset={previewAsset} />
            </div>
            <div className="grid content-center gap-2 p-4">
              <span className="text-xs font-black text-sky-500">{String(profileData.category ?? "Project")}</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{heading}</h3>
              <p className="line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{summary || draft.blockMarkdownText || "No project summary yet."}</p>
              <span className="text-xs font-bold text-slate-400">{String(profileData.actionLabel ?? "Open")}</span>
            </div>
          </div>
        ) : collectionSlug === "awards" ? (
          <div className="grid gap-2 p-4">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800"><Palette className="size-5" /></span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{heading}</h3>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{summary || "No focus description yet."}</p>
          </div>
        ) : collectionSlug === "contact-social" ? (
          <div className="flex items-center gap-3 p-4">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950"><LinkIcon className="size-5" /></span>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white">{heading}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{String(profileData.note ?? profileData.href ?? "No link set")}</p>
            </div>
          </div>
        ) : collectionSlug === "site-config" ? (
          <div className="grid gap-2 p-4 text-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{String(profileData.discTitle ?? heading)}</h3>
            <p className="text-slate-500 dark:text-slate-400">Start label: {String(profileData.startLabel ?? "START")}</p>
            <p className="text-slate-500 dark:text-slate-400">Theme: {String(profileData.defaultTheme ?? "system")}</p>
          </div>
        ) : (
          <div className="grid gap-2 p-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{heading}</h3>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{summary || draft.blockMarkdownText || "No previewable content yet."}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function EntryEditor({
  apiBaseUrl,
  assets,
  blocks,
  collectionSlug,
  collectionTitle,
  entry,
  isPublishing,
  isSaving,
  onDraftChange,
  onPublish,
  onSave,
  onSaveAsset,
  onSaveBlock,
}: {
  apiBaseUrl: string;
  assets: TheGuyserAdminAsset[];
  blocks: TheGuyserAdminBlock[];
  collectionSlug: string;
  collectionTitle: string;
  entry: TheGuyserAdminEntry;
  isPublishing: boolean;
  isSaving: boolean;
  onDraftChange: (
    entryId: string,
    entryDraft: TheGuyserAdminEntryDraftPreview,
    assetId: string | null,
    assetDraft: TheGuyserAdminAssetDraftPreview | null,
  ) => void;
  onPublish: (entryId: string, eventKind: "publish" | "unpublish") => void;
  onSaveAsset: (assetId: string, payload: Record<string, unknown>) => void;
  onSaveBlock: (payload: {
    blockId: string | null;
    entryId: string;
    markdown: string;
  }) => void;
  onSave: (entryId: string, payload: Record<string, unknown>) => void;
}) {
  const [draft, setDraft] = useState(() => getEntryDraft(entry, blocks));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const primaryAsset = getPrimaryAsset(entry, assets);
  const [assetDraft, setAssetDraft] = useState(() => getAssetDraft(primaryAsset));
  const markdownBlock = getEntryMarkdownBlock(entry, blocks);
  const profileData = useMemo(
    () => parseJsonObjectSafe(draft.profileDataText) ?? entry.profile_data,
    [draft.profileDataText, entry.profile_data],
  );
  const metadata = useMemo(
    () => parseJsonObjectSafe(draft.metadataText) ?? entry.metadata,
    [draft.metadataText, entry.metadata],
  );
  const assetMetadata = useMemo(
    () => parseJsonObjectSafe(assetDraft.metadataText) ?? primaryAsset?.metadata ?? {},
    [assetDraft.metadataText, primaryAsset?.metadata],
  );
  const fieldDescriptors = useMemo(
    () =>
      buildTheGuyserEntryFieldDescriptors({
        collectionSlug,
        metadata,
        profileData,
      }),
    [collectionSlug, metadata, profileData],
  );

  const setDraftValue = (key: keyof EntryDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const setAssetDraftValue = (key: keyof AssetDraft, value: string) => {
    setAssetDraft((current) => ({ ...current, [key]: value }));
  };

  const setStructuredField = (descriptor: TheGuyserAdminFieldDescriptor, value: unknown) => {
    if (descriptor.scope === "profileData") {
      setDraftValue("profileDataText", stringifyJson(setTheGuyserFieldValue(profileData, descriptor, value)));
      return;
    }

    if (descriptor.scope === "metadata") {
      setDraftValue("metadataText", stringifyJson(setTheGuyserFieldValue(metadata, descriptor, value)));
    }
  };

  useEffect(() => {
    onDraftChange(
      entry.id,
      {
        blockMarkdownText: draft.blockMarkdownText,
        metadata,
        profileData,
        scheduled_for: fromDatetimeLocal(draft.scheduledFor),
        slug: draft.slug.trim(),
        status: draft.status,
        subtitle: draft.subtitle.trim() || null,
        summary: draft.summary.trim() || null,
        title: draft.title.trim(),
      },
      primaryAsset?.id ?? null,
      primaryAsset
        ? {
            alt_text: assetDraft.altText.trim() || null,
            asset_type: assetDraft.assetType.trim() || "image",
            asset_url: assetDraft.sourceUrl.trim() || null,
            metadata: assetMetadata,
            preview_url: assetDraft.sourceUrl.trim() || null,
            sort_order: Number(assetDraft.sortOrder) || 0,
            source_url: assetDraft.sourceUrl.trim() || null,
            storage_path: assetDraft.storagePath.trim() || null,
          }
        : null,
    );
  }, [assetDraft, assetMetadata, draft, entry.id, metadata, onDraftChange, primaryAsset, profileData]);

  const saveEntry = () => {
    try {
      setJsonError(null);
      onSave(entry.id, {
        metadata: parseJsonObject(draft.metadataText, "Metadata"),
        profile_data: parseJsonObject(draft.profileDataText, "Profile data"),
        scheduled_for: fromDatetimeLocal(draft.scheduledFor),
        slug: draft.slug.trim(),
        status: draft.status,
        subtitle: draft.subtitle.trim() || null,
        summary: draft.summary.trim() || null,
        title: draft.title.trim(),
      });
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON payload.");
    }
  };

  const saveAsset = () => {
    if (!primaryAsset) {
      return;
    }

    try {
      setJsonError(null);
      onSaveAsset(primaryAsset.id, {
        alt_text: assetDraft.altText.trim() || null,
        asset_type: assetDraft.assetType.trim() || "image",
        metadata: parseJsonObject(assetDraft.metadataText, "Asset metadata"),
        sort_order: Number(assetDraft.sortOrder) || 0,
        source_url: assetDraft.sourceUrl.trim() || null,
        storage_path: assetDraft.storagePath.trim() || null,
      });
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid asset JSON payload.");
    }
  };

  return (
    <section className="grid min-h-[44rem] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800 lg:border-r lg:border-b-0">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
          <TheGuyserAdminMediaImage
            alt={primaryAsset?.alt_text ?? entry.title}
            apiBaseUrl={apiBaseUrl}
            asset={primaryAsset}
          />
        </div>
        <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between gap-3">
            <span>Collection</span>
            <span className="text-right font-black text-slate-900 dark:text-white">{collectionTitle}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Published</span>
            <span className="text-right">{formatDate(entry.published_at)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Updated</span>
            <span className="text-right">{formatDate(entry.updated_at)}</span>
          </div>
        </div>
        <div className="mt-5">
          <EntryInlinePreview
            apiBaseUrl={apiBaseUrl}
            asset={primaryAsset}
            assetDraft={assetDraft}
            collectionSlug={collectionSlug}
            draft={draft}
          />
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
              <ImageIcon className="size-4 text-sky-500" />
              Media
            </div>
            {primaryAsset ? (
              <AdminButton disabled={isSaving} onClick={saveAsset}>
                {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save media
              </AdminButton>
            ) : null}
          </div>
          {primaryAsset ? (
            <div className="grid gap-3">
              <Field label="Alt text">
                <TextInput onChange={(value) => setAssetDraftValue("altText", value)} value={assetDraft.altText} />
              </Field>
              <Field label="Source URL">
                <TextInput onChange={(value) => setAssetDraftValue("sourceUrl", value)} value={assetDraft.sourceUrl} />
              </Field>
              <Field label="Storage path">
                <TextInput onChange={(value) => setAssetDraftValue("storagePath", value)} value={assetDraft.storagePath} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Type">
                  <TextInput onChange={(value) => setAssetDraftValue("assetType", value)} value={assetDraft.assetType} />
                </Field>
                <Field label="Sort">
                  <TextInput onChange={(value) => setAssetDraftValue("sortOrder", value)} value={assetDraft.sortOrder} />
                </Field>
              </div>
              <details className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-sm font-black text-slate-700 dark:text-slate-200">Asset metadata JSON</summary>
                <div className="mt-3">
                  <TextArea minRows={4} onChange={(value) => setAssetDraftValue("metadataText", value)} value={assetDraft.metadataText} />
                </div>
              </details>
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">No image asset is attached to this entry yet.</p>
          )}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            WebGL packages: {assets.filter((assetItem) => assetItem.entry_id === entry.id && assetItem.asset_type === "webgl-package").length}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/92 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/92">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-black ${getStatusClass(entry.status)}`}>
                {entry.status}
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{entry.title}</h2>
              <p className="mt-2 break-all font-mono text-xs text-slate-400 dark:text-slate-500">{entry.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AdminButton disabled={isSaving} onClick={saveEntry} tone="primary">
                {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save
              </AdminButton>
              {entry.status === "published" ? (
                <AdminButton disabled={isPublishing} onClick={() => onPublish(entry.id, "unpublish")} tone="danger">
                  {isPublishing ? <LoaderCircle className="size-4 animate-spin" /> : <Undo2 className="size-4" />}
                  Unpublish
                </AdminButton>
              ) : (
                <AdminButton disabled={isPublishing} onClick={() => onPublish(entry.id, "publish")}>
                  {isPublishing ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Publish
                </AdminButton>
              )}
            </div>
          </div>
          {jsonError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
              {jsonError}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Title">
            <TextInput onChange={(value) => setDraftValue("title", value)} value={draft.title} />
          </Field>
          <Field label="Slug">
            <TextInput onChange={(value) => setDraftValue("slug", value)} value={draft.slug} />
          </Field>
          <Field label="Subtitle">
            <TextInput onChange={(value) => setDraftValue("subtitle", value)} value={draft.subtitle} />
          </Field>
          <Field label="Status">
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  status: event.target.value as TheGuyserEntryStatus,
                }))
              }
              value={draft.status}
            >
              {ENTRY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Scheduled for">
            <input
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              onChange={(event) => setDraftValue("scheduledFor", event.target.value)}
              type="datetime-local"
              value={draft.scheduledFor}
            />
          </Field>
          <Field label="Summary">
            <textarea
              className="min-h-[6rem] resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              onChange={(event) => setDraftValue("summary", event.target.value)}
              value={draft.summary}
            />
          </Field>
          <TheGuyserAdminFieldEditor
            descriptors={fieldDescriptors}
            onValueChange={setStructuredField}
            values={{ metadata, profileData }}
          />
          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Markdown block
              </span>
              <AdminButton
                disabled={isSaving}
                onClick={() =>
                  onSaveBlock({
                    blockId: markdownBlock?.id ?? null,
                    entryId: entry.id,
                    markdown: draft.blockMarkdownText,
                  })
                }
              >
                {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save block
              </AdminButton>
            </div>
            <TextArea
              minRows={7}
              onChange={(value) => setDraftValue("blockMarkdownText", value)}
              value={draft.blockMarkdownText}
            />
          </div>
          <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50 md:col-span-2">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
              <Code2 className="size-4" />
              Advanced JSON
            </summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Profile data JSON">
                <TextArea minRows={8} onChange={(value) => setDraftValue("profileDataText", value)} value={draft.profileDataText} />
              </Field>
              <Field label="Metadata JSON">
                <TextArea minRows={8} onChange={(value) => setDraftValue("metadataText", value)} value={draft.metadataText} />
              </Field>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

function CollectionEditor({
  collection,
  isSaving,
  onDraftChange,
  onSave,
}: {
  collection: TheGuyserAdminCollection;
  isSaving: boolean;
  onDraftChange: (collectionId: string, draft: TheGuyserAdminCollectionDraftPreview) => void;
  onSave: (collectionId: string, payload: Record<string, unknown>) => void;
}) {
  const [draft, setDraft] = useState(() => getCollectionDraft(collection));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const config = useMemo(
    () => parseJsonObjectSafe(draft.configText) ?? collection.config,
    [collection.config, draft.configText],
  );
  const configDescriptors = useMemo(
    () => buildTheGuyserCollectionConfigFieldDescriptors({ config }),
    [config],
  );

  const setConfigField = (descriptor: TheGuyserAdminFieldDescriptor, value: unknown) => {
    setDraft((current) => ({
      ...current,
      configText: stringifyJson(setTheGuyserCollectionSchemaValue(config, descriptor, value)),
    }));
  };

  useEffect(() => {
    onDraftChange(collection.id, {
      config,
      description: draft.description.trim() || null,
      is_enabled: draft.isEnabled,
      slug: draft.slug.trim(),
      title: draft.title.trim(),
    });
  }, [collection.id, config, draft.description, draft.isEnabled, draft.slug, draft.title, onDraftChange]);

  const saveCollection = () => {
    try {
      setJsonError(null);
      onSave(collection.id, {
        config: parseJsonObject(draft.configText, "Collection config"),
        description: draft.description.trim() || null,
        is_enabled: draft.isEnabled,
        slug: draft.slug.trim(),
        title: draft.title.trim(),
      });
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid collection JSON.");
    }
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Settings2 className="size-4" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Collection settings</h2>
          </div>
          <p className="mt-1 font-mono text-xs text-slate-400 dark:text-slate-500">{collection.collection_type}</p>
        </div>
        <AdminButton disabled={isSaving} onClick={saveCollection}>
          {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save collection
        </AdminButton>
      </div>
      {jsonError ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
          {jsonError}
        </div>
      ) : null}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <TextInput onChange={(value) => setDraft((current) => ({ ...current, title: value }))} value={draft.title} />
        </Field>
        <Field label="Slug">
          <TextInput onChange={(value) => setDraft((current) => ({ ...current, slug: value }))} value={draft.slug} />
        </Field>
        <Field label="Description">
          <textarea
            className="min-h-[6rem] resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            value={draft.description}
          />
        </Field>
        <div className="grid content-start gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Visibility</span>
          <button
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-black transition ${
              draft.isEnabled
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950"
            }`}
            onClick={() => setDraft((current) => ({ ...current, isEnabled: !current.isEnabled }))}
            type="button"
          >
            <Check className="size-4" />
            {draft.isEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
        <TheGuyserAdminFieldEditor
          descriptors={configDescriptors}
          onValueChange={setConfigField}
          values={{ config: getTheGuyserCollectionSchemaConfig(config).schema }}
        />
        <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50 md:col-span-2">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
            <Code2 className="size-4" />
            Advanced config JSON
          </summary>
          <div className="mt-4">
            <TextArea minRows={7} onChange={(value) => setDraft((current) => ({ ...current, configText: value }))} value={draft.configText} />
          </div>
        </details>
      </div>
    </section>
  );
}

export function TheGuyserAdminClient({
  adminLinks,
  apiBaseUrl,
  cmsBaseUrl,
  initialStudio,
  initialTarget,
  userEmail,
  webAppUrl,
  workspaceId,
}: {
  adminLinks: AdminLink[];
  apiBaseUrl: string;
  cmsBaseUrl: string;
  initialStudio: TheGuyserAdminStudioPayload;
  initialTarget: string | null;
  userEmail: string | null;
  webAppUrl: string;
  workspaceId: string;
}) {
  const [studio, setStudio] = useState(initialStudio);
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<TheGuyserEntryStatus | "all">("all");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(initialStudio.entries[0]?.id ?? null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(initialStudio.collections[0]?.id ?? null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "asset" | "block" | "collection" | "entry" | "publish" | "refresh" | null
  >(null);
  const [entryDrafts, setEntryDrafts] = useState<Record<string, TheGuyserAdminEntryDraftPreview>>({});
  const [assetDrafts, setAssetDrafts] = useState<Record<string, TheGuyserAdminAssetDraftPreview>>({});
  const [collectionDrafts, setCollectionDrafts] = useState<Record<string, TheGuyserAdminCollectionDraftPreview>>({});
  const advancedLink = adminLinks.find((link) => link.key === initialTarget) ?? adminLinks[0];

  const filteredEntries = useMemo(
    () =>
      studio.entries.filter((entry) => {
        const collectionMatches = collectionFilter === "all" || entry.collection_id === collectionFilter;
        const statusMatches = statusFilter === "all" || entry.status === statusFilter;
        return collectionMatches && statusMatches;
      }),
    [collectionFilter, statusFilter, studio.entries],
  );
  const selectedEntry = studio.entries.find((entry) => entry.id === selectedEntryId) ?? filteredEntries[0] ?? null;
  const selectedCollection =
    studio.collections.find((collection) => collection.id === selectedCollectionId) ??
    studio.collections.find((collection) => collection.id === selectedEntry?.collection_id) ??
    studio.collections[0] ??
    null;
  const counts = useMemo(
    () => ({
      draft: studio.entries.filter((entry) => entry.status === "draft").length,
      published: studio.entries.filter((entry) => entry.status === "published").length,
      scheduled: studio.entries.filter((entry) => entry.status === "scheduled").length,
    }),
    [studio.entries],
  );
  const draftPreviewContent = useMemo(
    () =>
      buildTheGuyserAdminDraftPortfolioContent({
        apiBaseUrl,
        assetDrafts,
        collectionDrafts,
        entryDrafts,
        studio,
      }),
    [apiBaseUrl, assetDrafts, collectionDrafts, entryDrafts, studio],
  );

  const updateEntryPreviewDraft = useCallback(
    (
      entryId: string,
      entryDraft: TheGuyserAdminEntryDraftPreview,
      assetId: string | null,
      assetDraft: TheGuyserAdminAssetDraftPreview | null,
    ) => {
      setEntryDrafts((current) => ({ ...current, [entryId]: entryDraft }));
      if (assetId && assetDraft) {
        setAssetDrafts((current) => ({ ...current, [assetId]: assetDraft }));
      }
    },
    [],
  );

  const updateCollectionPreviewDraft = useCallback(
    (collectionId: string, draft: TheGuyserAdminCollectionDraftPreview) => {
      setCollectionDrafts((current) => ({ ...current, [collectionId]: draft }));
    },
    [],
  );

  useEffect(() => {
    if (selectedEntry && selectedEntry.id !== selectedEntryId) {
      setSelectedEntryId(selectedEntry.id);
    }
  }, [selectedEntry, selectedEntryId]);

  const refreshStudio = async () => {
    setPendingAction("refresh");
    setMutationError(null);
    try {
      setStudio(await fetchAdminJson<TheGuyserAdminStudioPayload>("/api/admin/studio"));
      setStatusMessage("Studio refreshed.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to refresh studio.");
    } finally {
      setPendingAction(null);
    }
  };

  const saveEntry = async (entryId: string, payload: Record<string, unknown>) => {
    setPendingAction("entry");
    setMutationError(null);
    try {
      const entry = await fetchAdminJson<TheGuyserAdminEntry>(`/api/admin/entries/${encodeURIComponent(entryId)}`, {
        body: JSON.stringify(payload),
        method: "PATCH",
      });
      setStudio((current) => mergeEntry(current, entry));
      setStatusMessage("Entry saved.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to save entry.");
    } finally {
      setPendingAction(null);
    }
  };

  const saveAsset = async (assetId: string, payload: Record<string, unknown>) => {
    setPendingAction("asset");
    setMutationError(null);
    try {
      const asset = await fetchAdminJson<TheGuyserAdminAsset>(`/api/admin/assets/${encodeURIComponent(assetId)}`, {
        body: JSON.stringify(payload),
        method: "PATCH",
      });
      setStudio((current) => ({
        ...current,
        assets: current.assets.map((item) => (item.id === asset.id ? asset : item)),
      }));
      setStatusMessage("Media saved.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to save media.");
    } finally {
      setPendingAction(null);
    }
  };

  const createEntry = async () => {
    const collectionId = selectedCollection?.id ?? studio.collections[0]?.id;

    if (!collectionId) {
      setMutationError("Create a collection before adding entries.");
      return;
    }

    setPendingAction("entry");
    setMutationError(null);
    try {
      const entry = await fetchAdminJson<TheGuyserAdminEntry>("/api/admin/entries", {
        body: JSON.stringify({
          collection_id: collectionId,
          metadata: {},
          profile_data: {},
          scheduled_for: null,
          slug: `draft-${Date.now()}`,
          status: "draft",
          subtitle: null,
          summary: null,
          title: "Untitled entry",
        }),
        method: "POST",
      });
      setStudio((current) => mergeEntry(current, entry));
      setSelectedEntryId(entry.id);
      setSelectedCollectionId(entry.collection_id);
      setStatusMessage("Entry created.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to create entry.");
    } finally {
      setPendingAction(null);
    }
  };

  const duplicateEntry = async () => {
    if (!selectedEntry) {
      return;
    }

    setPendingAction("entry");
    setMutationError(null);
    try {
      const entry = await fetchAdminJson<TheGuyserAdminEntry>(
        `/api/admin/entries/${encodeURIComponent(selectedEntry.id)}/duplicate`,
        {
          method: "POST",
        },
      );
      setStudio((current) => mergeEntry(current, entry));
      setSelectedEntryId(entry.id);
      setSelectedCollectionId(entry.collection_id);
      setStatusMessage("Entry duplicated.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to duplicate entry.");
    } finally {
      setPendingAction(null);
    }
  };

  const deleteEntry = async () => {
    if (!selectedEntry || !window.confirm(`Delete "${selectedEntry.title}"?`)) {
      return;
    }

    setPendingAction("entry");
    setMutationError(null);
    try {
      await fetchAdminJson<{ id: string }>(
        `/api/admin/entries/${encodeURIComponent(selectedEntry.id)}`,
        {
          method: "DELETE",
        },
      );
      setStudio((current) => ({
        ...current,
        assets: current.assets.filter((asset) => asset.entry_id !== selectedEntry.id),
        blocks: current.blocks.filter((block) => block.entry_id !== selectedEntry.id),
        entries: current.entries.filter((entry) => entry.id !== selectedEntry.id),
      }));
      setSelectedEntryId(null);
      setStatusMessage("Entry deleted.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to delete entry.");
    } finally {
      setPendingAction(null);
    }
  };

  const saveBlock = async ({
    blockId,
    entryId,
    markdown,
  }: {
    blockId: string | null;
    entryId: string;
    markdown: string;
  }) => {
    setPendingAction("block");
    setMutationError(null);
    try {
      const block = await fetchAdminJson<TheGuyserAdminBlock>(
        blockId ? `/api/admin/blocks/${encodeURIComponent(blockId)}` : "/api/admin/blocks",
        {
          body: JSON.stringify({
            block_type: "markdown",
            content: {
              markdown,
            },
            entry_id: entryId,
            sort_order: 0,
            title: null,
          }),
          method: blockId ? "PATCH" : "POST",
        },
      );
      setStudio((current) => mergeBlock(current, block));
      setStatusMessage("Block saved.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to save block.");
    } finally {
      setPendingAction(null);
    }
  };

  const publishEntry = async (entryId: string, eventKind: "publish" | "unpublish") => {
    setPendingAction("publish");
    setMutationError(null);
    try {
      const entry = await fetchAdminJson<TheGuyserAdminEntry>(`/api/admin/entries/${encodeURIComponent(entryId)}/publish`, {
        body: JSON.stringify({ eventKind }),
        method: "POST",
      });
      setStudio((current) => mergeEntry(current, entry));
      setStatusMessage(entry.status === "published" ? "Entry published." : "Entry unpublished.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to publish entry.");
    } finally {
      setPendingAction(null);
    }
  };

  const saveCollection = async (collectionId: string, payload: Record<string, unknown>) => {
    setPendingAction("collection");
    setMutationError(null);
    try {
      const collection = await fetchAdminJson<TheGuyserAdminCollection>(`/api/admin/collections/${encodeURIComponent(collectionId)}`, {
        body: JSON.stringify(payload),
        method: "PATCH",
      });
      setStudio((current) => mergeCollection(current, collection));
      setStatusMessage("Collection saved.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to save collection.");
    } finally {
      setPendingAction(null);
    }
  };

  const createCollection = async () => {
    setPendingAction("collection");
    setMutationError(null);
    try {
      const suffix = Date.now();
      const collection = await fetchAdminJson<TheGuyserAdminCollection>(
        "/api/admin/collections",
        {
          body: JSON.stringify({
            collection_type: "custom",
            config: {},
            description: "Custom TheGuyser content collection.",
            slug: `custom-${suffix}`,
            title: "Untitled collection",
          }),
          method: "POST",
        },
      );
      setStudio((current) => mergeCollection(current, collection));
      setSelectedCollectionId(collection.id);
      setCollectionFilter(collection.id);
      setStatusMessage("Collection created.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to create collection.");
    } finally {
      setPendingAction(null);
    }
  };

  const deleteCollection = async () => {
    if (!selectedCollection || !window.confirm(`Delete "${selectedCollection.title}" and its entries?`)) {
      return;
    }

    setPendingAction("collection");
    setMutationError(null);
    try {
      await fetchAdminJson<{ id: string }>(
        `/api/admin/collections/${encodeURIComponent(selectedCollection.id)}`,
        {
          method: "DELETE",
        },
      );
      setStudio((current) => {
        const entryIds = new Set(
          current.entries
            .filter((entry) => entry.collection_id === selectedCollection.id)
            .map((entry) => entry.id),
        );

        return {
          ...current,
          assets: current.assets.filter((asset) => !asset.entry_id || !entryIds.has(asset.entry_id)),
          blocks: current.blocks.filter((block) => !entryIds.has(block.entry_id)),
          collections: current.collections.filter(
            (collection) => collection.id !== selectedCollection.id,
          ),
          entries: current.entries.filter((entry) => entry.collection_id !== selectedCollection.id),
        };
      });
      setSelectedCollectionId(null);
      setSelectedEntryId(null);
      setCollectionFilter("all");
      setStatusMessage("Collection deleted.");
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Failed to delete collection.");
    } finally {
      setPendingAction(null);
    }
  };

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 pt-24 pb-16 text-slate-900 dark:bg-slate-950 dark:text-white md:px-6">
      <div className="mx-auto max-w-[96rem]">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900">{workspaceId}</span>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900">{userEmail ?? "Authenticated"}</span>
            </div>
            <h1 className="mt-4 text-4xl font-black text-slate-900 dark:text-white md:text-5xl">The Guyser content</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton disabled={pendingAction === "refresh"} onClick={() => void refreshStudio()}>
              {pendingAction === "refresh" ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Refresh
            </AdminButton>
            <AdminButton disabled={pendingAction === "entry"} onClick={() => void createEntry()} tone="primary">
              {pendingAction === "entry" ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
              New entry
            </AdminButton>
            <a className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" href={advancedLink?.cmsHref ?? cmsBaseUrl} rel="noreferrer" target="_blank">
              <ArrowUpRight className="size-4" />
              Full CMS
            </a>
            <a className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" href={webAppUrl} rel="noreferrer" target="_blank">
              <Eye className="size-4" />
              Platform
            </a>
            <AdminButton onClick={signOut}>
              <LogOut className="size-4" />
              Sign out
            </AdminButton>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Collections", studio.collections.length],
            ["Entries", studio.entries.length],
            ["Drafts", counts.draft],
            ["Scheduled", counts.scheduled],
            ["Published", counts.published],
          ].map(([label, value]) => (
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" key={label}>
              <p className="text-xs font-black tracking-[0.18em] text-slate-400 uppercase">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{value}</p>
            </div>
          ))}
        </section>

        {mutationError ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
            {mutationError}
          </div>
        ) : null}

        {statusMessage ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-5">
          <TheGuyserAdminSyncPanel />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <AdminButton disabled={pendingAction === "entry"} onClick={() => void createEntry()} tone="primary">
                    <Plus className="size-4" />
                    Entry
                  </AdminButton>
                  <AdminButton disabled={pendingAction === "collection"} onClick={() => void createCollection()}>
                    <Layers className="size-4" />
                    Collection
                  </AdminButton>
                  <AdminButton disabled={!selectedEntry || pendingAction === "entry"} onClick={() => void duplicateEntry()}>
                    <Copy className="size-4" />
                    Duplicate
                  </AdminButton>
                  <AdminButton disabled={!selectedEntry || pendingAction === "entry"} onClick={() => void deleteEntry()} tone="danger">
                    <Trash2 className="size-4" />
                    Delete
                  </AdminButton>
                </div>
                <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" onChange={(event) => setCollectionFilter(event.target.value)} value={collectionFilter}>
                  <option value="all">All collections</option>
                  {studio.collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>{collection.title}</option>
                  ))}
                </select>
                <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" onChange={(event) => setStatusFilter(event.target.value as TheGuyserEntryStatus | "all")} value={statusFilter}>
                  <option value="all">All statuses</option>
                  {ENTRY_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="max-h-[38rem] overflow-auto">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => {
                  const entryAsset = getPrimaryAsset(entry, studio.assets);

                  return (
                    <button
                      className={`grid w-full grid-cols-[3.25rem_minmax(0,1fr)] gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 ${selectedEntry?.id === entry.id ? "bg-sky-50 dark:bg-sky-950/30" : ""}`}
                      key={entry.id}
                      onClick={() => {
                        setSelectedEntryId(entry.id);
                        setSelectedCollectionId(entry.collection_id);
                      }}
                      type="button"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                        <TheGuyserAdminMediaImage
                          alt={entryAsset?.alt_text ?? entry.title}
                          apiBaseUrl={apiBaseUrl}
                          asset={entryAsset}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <span className="line-clamp-2 text-sm font-black text-slate-900 dark:text-white">{entry.title}</span>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-black ${getStatusClass(entry.status)}`}>{entry.status}</span>
                        </div>
                        <span className="mt-1 block truncate font-mono text-xs text-slate-400">{entry.slug}</span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{getCollectionTitle(studio.collections, entry.collection_id)}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="grid min-h-48 place-items-center px-4 text-center text-sm text-slate-500">
                  No entries match the current filters.
                </div>
              )}
            </div>
          </aside>

          <main className="grid gap-5">
            <TheGuyserAdminFullSitePreview content={draftPreviewContent} />
            {selectedEntry ? (
              <EntryEditor
                assets={studio.assets}
                apiBaseUrl={apiBaseUrl}
                blocks={studio.blocks}
                collectionSlug={selectedCollection?.slug ?? ""}
                collectionTitle={getCollectionTitle(studio.collections, selectedEntry.collection_id)}
                entry={selectedEntry}
                isPublishing={pendingAction === "publish"}
                isSaving={pendingAction === "entry" || pendingAction === "block" || pendingAction === "asset"}
                key={`${selectedEntry.id}:${selectedEntry.updated_at ?? ""}:${selectedEntry.status}`}
                onDraftChange={updateEntryPreviewDraft}
                onPublish={(entryId, eventKind) => void publishEntry(entryId, eventKind)}
                onSave={(entryId, payload) => void saveEntry(entryId, payload)}
                onSaveAsset={(assetId, payload) => void saveAsset(assetId, payload)}
                onSaveBlock={(payload) => void saveBlock(payload)}
              />
            ) : (
              <section className="grid min-h-[32rem] place-items-center rounded-[2rem] border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="grid justify-items-center gap-3">
                  <FileText className="size-8" />
                  <p>No entry selected.</p>
                </div>
              </section>
            )}

            {selectedCollection ? (
              <CollectionEditor
                collection={selectedCollection}
                isSaving={pendingAction === "collection"}
                key={`${selectedCollection.id}:${selectedCollection.updated_at ?? ""}`}
                onDraftChange={updateCollectionPreviewDraft}
                onSave={(collectionId, payload) => void saveCollection(collectionId, payload)}
              />
            ) : null}
            {selectedCollection ? (
              <div className="flex justify-end">
                <AdminButton
                  disabled={pendingAction === "collection"}
                  onClick={() => void deleteCollection()}
                  tone="danger"
                >
                  <Trash2 className="size-4" />
                  Delete collection
                </AdminButton>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
