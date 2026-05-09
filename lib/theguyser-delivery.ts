import { cache } from "react";
import type { PortfolioContent, ResourceLink } from "@/components/portfolio/types";
import { getTheGuyserApiBaseUrl, getTheGuyserWorkspaceId } from "@/lib/theguyser-config";
import {
  buildTheGuyserPortfolioData,
  type TheGuyserDeliveryPayload,
} from "@/lib/theguyser-content";

const DELIVERY_REVALIDATE_SECONDS = 60;

export type TheGuyserSerializablePortfolioData = Pick<
  PortfolioContent,
  "gameProjects" | "profile" | "researchProjects" | "showreelItems"
> & {
  resourceLinks: TheGuyserSerializableResourceLink[];
};

export type TheGuyserSerializableResourceLink = Omit<ResourceLink, "icon">;

function toSerializablePortfolioData(
  content: PortfolioContent,
): TheGuyserSerializablePortfolioData {
  return {
    gameProjects: content.gameProjects,
    profile: content.profile,
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
  };
}

async function fetchDeliveryPayload() {
  const workspaceId = getTheGuyserWorkspaceId();
  const apiBaseUrl = getTheGuyserApiBaseUrl();
  const response = await fetch(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(workspaceId)}/external-projects/delivery`,
    {
      cache: "force-cache",
      next: {
        revalidate: DELIVERY_REVALIDATE_SECONDS,
      },
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
    const { apiBaseUrl, delivery } = await fetchDeliveryPayload();
    return toSerializablePortfolioData(
      buildTheGuyserPortfolioData(delivery, {
        apiBaseUrl,
      }),
    );
  } catch {
    return null;
  }
});
