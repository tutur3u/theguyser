import {
  getTheGuyserApiBaseUrl,
  getTheGuyserWorkspaceId,
} from "@/lib/theguyser-config";
import { getTheGuyserAdminSession, revalidateTheGuyserContent } from "@/lib/theguyser-admin-api";
import { syncPublicFolderAssets } from "@/lib/tuturuuu-public-folder-sync";
import { getTheGuyserCmsCoverageReport } from "@/lib/theguyser-cms-coverage";
import { fetchTheGuyserDeliveryPayload } from "@/lib/theguyser-delivery";
import { theGuyserExternalProjectManifest } from "@/lib/theguyser-external-project-manifest";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function readCoverage() {
  try {
    const { delivery } = await fetchTheGuyserDeliveryPayload({ cacheMode: "no-store" });
    return getTheGuyserCmsCoverageReport(delivery);
  } catch {
    return getTheGuyserCmsCoverageReport(null);
  }
}

async function readApiError(response: Response) {
  const fallback = `Tuturuuu sync apply failed with status ${response.status}`;
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" && data.error.trim() ? data.error : fallback;
}

export async function POST(request: Request) {
  const session = await getTheGuyserAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { force?: unknown } | null;
  const workspaceId = getTheGuyserWorkspaceId();
  const apiBaseUrl = getTheGuyserApiBaseUrl();
  const setupResponse = await fetch(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
      workspaceId,
    )}/external-projects/setup`,
    {
      body: JSON.stringify({ manifest: theGuyserExternalProjectManifest }),
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `${session.tokenType} ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!setupResponse.ok) {
    return NextResponse.json(
      { error: await readApiError(setupResponse) },
      { status: setupResponse.status },
    );
  }

  const publicAssetSync = await syncPublicFolderAssets({
    accessToken: session.accessToken,
    apiBaseUrl,
    manifest: theGuyserExternalProjectManifest,
    tokenType: session.tokenType,
    workspaceId,
  });

  if (publicAssetSync.skipped.length > 0) {
    return NextResponse.json(
      {
        error: "Missing local public assets. Upload aborted before applying the manifest.",
        coverage: await readCoverage(),
        publicAssetSync: {
          skipped: publicAssetSync.skipped,
          uploaded: publicAssetSync.uploaded,
        },
      },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
      workspaceId,
    )}/external-projects/sync/apply`,
    {
      body: JSON.stringify({
        force: body?.force === true,
        manifest: publicAssetSync.manifest,
      }),
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `${session.tokenType} ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    return NextResponse.json({ error: await readApiError(response) }, { status: response.status });
  }

  revalidateTheGuyserContent();
  return NextResponse.json({
    ...(await response.json()),
    coverage: await readCoverage(),
    publicAssetSync: {
      skipped: publicAssetSync.skipped,
      uploaded: publicAssetSync.uploaded,
    },
  });
}
