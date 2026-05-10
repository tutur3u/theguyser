"use client";

import { GitCompareArrows, LoaderCircle, ShieldAlert, UploadCloud } from "lucide-react";
import { useState } from "react";

async function readAdminError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" && data.error.trim()
    ? data.error
    : `Request failed with status ${response.status}`;
}

async function postAdminJson<T>(url: string, body?: unknown) {
  const response = await fetch(url, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readAdminError(response));
  }

  return (await response.json()) as T;
}

type SyncDiffResponse = {
  hasDestructiveOperations?: boolean;
  operations?: unknown[];
  summary?: {
    archive?: number;
    create?: number;
    delete?: number;
    noop?: number;
    update?: number;
  };
};

export function TheGuyserAdminSyncPanel() {
  const [diff, setDiff] = useState<SyncDiffResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"apply" | "diff" | null>(null);
  const [publicAssetSync, setPublicAssetSync] = useState<{
    skipped?: unknown[];
    uploaded?: unknown[];
  } | null>(null);
  const summary = diff?.summary;
  const totalOperations =
    (summary?.archive ?? 0) +
    (summary?.create ?? 0) +
    (summary?.delete ?? 0) +
    (summary?.update ?? 0);

  const runDiff = async () => {
    setPendingAction("diff");
    setError(null);
    setPublicAssetSync(null);
    try {
      setDiff(await postAdminJson<SyncDiffResponse>("/api/admin/sync/diff"));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Sync request failed.");
    } finally {
      setPendingAction(null);
    }
  };

  const runApply = async (force: boolean) => {
    setPendingAction("apply");
    setError(null);
    try {
      const result = await postAdminJson<{
        diff?: SyncDiffResponse;
        publicAssetSync?: {
          skipped?: unknown[];
          uploaded?: unknown[];
        };
      }>("/api/admin/sync/apply", { force });
      setPublicAssetSync(result.publicAssetSync ?? null);
      setDiff(result.diff ?? (await postAdminJson<SyncDiffResponse>("/api/admin/sync/diff")));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Sync request failed.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <GitCompareArrows className="size-4 text-sky-500" />
            <h2 className="text-xl font-black">Tuturuuu sync</h2>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Diff and push the The Guyser manifest against the Tuturuuu CMS workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            disabled={pendingAction !== null}
            onClick={runDiff}
            type="button"
          >
            {pendingAction === "diff" ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <GitCompareArrows className="size-4" />
            )}
            Check sync
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={pendingAction !== null}
            onClick={() => void runApply(false)}
            type="button"
          >
            {pendingAction === "apply" ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            Push manifest
          </button>
        </div>
      </div>

      {diff ? (
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
          {[
            ["Create", summary?.create ?? 0],
            ["Update", summary?.update ?? 0],
            ["Archive", summary?.archive ?? 0],
            ["Delete", summary?.delete ?? 0],
          ].map(([label, value]) => (
            <div
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
              key={label}
            >
              <span className="text-slate-500 dark:text-slate-400">{label}</span>
              <span className="float-right font-black text-slate-900 dark:text-white">
                {value}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {diff?.hasDestructiveOperations ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
          <span className="inline-flex items-center gap-2">
            <ShieldAlert className="size-4" />
            Destructive operations require explicit force.
          </span>
          <button
            className="rounded-full border border-red-200 px-3 py-1.5 font-black text-red-700 dark:border-red-800 dark:text-red-100"
            disabled={pendingAction !== null}
            onClick={() => void runApply(true)}
            type="button"
          >
            Force apply
          </button>
        </div>
      ) : null}

      {diff && !diff.hasDestructiveOperations ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {totalOperations === 0 ? "Manifest is already in sync." : `${totalOperations} changes ready.`}
        </p>
      ) : null}

      {publicAssetSync ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Uploaded {publicAssetSync.uploaded?.length ?? 0} public assets
          {publicAssetSync.skipped?.length ? `, skipped ${publicAssetSync.skipped.length}` : ""}.
        </p>
      ) : null}

      {error ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      ) : null}
    </section>
  );
}
