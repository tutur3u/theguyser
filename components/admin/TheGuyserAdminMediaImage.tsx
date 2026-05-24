"use client";

import {
  getTheGuyserAdminAssetSources,
  type TheGuyserAdminImageAsset,
} from "@/lib/theguyser-admin-assets";
import { ImageIcon, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export function TheGuyserAdminMediaImage({
  alt,
  apiBaseUrl,
  asset,
}: {
  alt: string;
  apiBaseUrl?: string | null;
  asset: TheGuyserAdminImageAsset | null | undefined;
}) {
  const sources = useMemo(
    () => getTheGuyserAdminAssetSources(asset, { apiBaseUrl }),
    [apiBaseUrl, asset],
  );
  const sourceKey = sources.join("\n");
  const [loadState, setLoadState] = useState(() => ({
    failedSources: [] as string[],
    loadedSource: null as string | null,
    sourceKey,
  }));

  let currentLoadState = loadState;

  if (currentLoadState.sourceKey !== sourceKey) {
    currentLoadState = {
      failedSources: [],
      loadedSource: null,
      sourceKey,
    };
    setLoadState(currentLoadState);
  }

  const currentSource = sources.find((source) => !currentLoadState.failedSources.includes(source));
  const isLoading = Boolean(currentSource && currentLoadState.loadedSource !== currentSource);

  if (!currentSource) {
    return (
      <div className="grid h-full w-full place-items-center text-white/24">
        <ImageIcon className="size-10" />
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/20 text-white/38">
          <LoaderCircle className="size-6 animate-spin" />
        </div>
      ) : null}
      <Image
        alt={alt}
        className="object-cover"
        fill
        onError={() =>
          setLoadState((current) => ({
            ...current,
            failedSources: [...current.failedSources, currentSource],
          }))
        }
        onLoad={() =>
          setLoadState((current) => ({
            ...current,
            loadedSource: currentSource,
          }))
        }
        sizes="(max-width: 1024px) 88vw, 32vw"
        src={currentSource}
        unoptimized={currentSource.startsWith("/api/")}
      />
    </>
  );
}
