import { cache } from "react";
import type { FocusArea, PortfolioContent, ResourceLink } from "@/components/portfolio/types";
import { getTheGuyserApiBaseUrl, getTheGuyserWorkspaceId } from "@/lib/theguyser-config";
import {
  buildTheGuyserPortfolioData,
  type TheGuyserDeliveryPayload,
} from "@/lib/theguyser-content";

const DELIVERY_REVALIDATE_SECONDS = 60;

export type TheGuyserSerializablePortfolioData = Pick<
  PortfolioContent,
  | "appTiles"
  | "gameProjects"
  | "panelContent"
  | "profile"
  | "quickLaunchCards"
  | "researchProjects"
  | "showreelItems"
  | "siteConfig"
> & {
  focusAreas: TheGuyserSerializableFocusArea[];
  resourceLinks: TheGuyserSerializableResourceLink[];
};

export type TheGuyserSerializableFocusArea = Omit<FocusArea, "icon">;
export type TheGuyserSerializableResourceLink = Omit<ResourceLink, "icon">;

function toSerializablePortfolioData(
  content: PortfolioContent,
): TheGuyserSerializablePortfolioData {
  return {
    appTiles: content.appTiles,
    focusAreas: content.focusAreas.map((area) => ({
      bg: area.bg,
      color: area.color,
      description: area.description,
      title: area.title,
    })),
    gameProjects: content.gameProjects,
    panelContent: content.panelContent,
    profile: content.profile,
    quickLaunchCards: content.quickLaunchCards,
    researchProjects: content.researchProjects,
    resourceLinks: content.resourceLinks.map((resource) => ({
      appId: resource.appId,
      color: resource.color,
      href: resource.href,
      id: resource.id,
      label: resource.label,
      note: resource.note,
    })),
    showreelItems: content.showreelItems,
    siteConfig: content.siteConfig,
  };
}

export async function fetchTheGuyserDeliveryPayload({
  cacheMode = "force-cache",
}: {
  cacheMode?: RequestCache;
} = {}) {
  const workspaceId = getTheGuyserWorkspaceId();
  const apiBaseUrl = getTheGuyserApiBaseUrl();
  const response = await fetch(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(workspaceId)}/external-projects/delivery`,
    {
      cache: cacheMode,
      ...(cacheMode === "no-store"
        ? {}
        : {
            next: {
              revalidate: DELIVERY_REVALIDATE_SECONDS,
            },
          }),
    },
  );

  if (!response.ok) {
    throw new Error(`Tuturuuu delivery failed with status ${response.status}`);
  }

  return {
    apiBaseUrl,
    delivery: (await response.json()) as TheGuyserDeliveryPayload,
  };
}

export const getTheGuyserPortfolioPayload = cache(async () => {
  try {
    const { apiBaseUrl, delivery } = await fetchTheGuyserDeliveryPayload();
    return toSerializablePortfolioData(
      buildTheGuyserPortfolioData(delivery, {
        apiBaseUrl,
      }),
    );
  } catch {
    return null;
  }
});
