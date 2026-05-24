import {
  getTheGuyserApiBaseUrl,
  getTheGuyserWorkspaceId,
} from "@/lib/theguyser-config";
import {
  deleteTheGuyserAdminAsset,
  getTheGuyserAdminSession,
  revalidateTheGuyserContent,
  updateTheGuyserAdminAsset,
} from "@/lib/theguyser-admin-api";
import { type NextRequest, NextResponse } from "next/server";

const TRANSFORM_QUERY_PARAMS = ["width", "height", "resize", "quality", "format"] as const;

export const dynamic = "force-dynamic";

function normalizeApiBaseUrl() {
  return getTheGuyserApiBaseUrl().replace(/\/+$/, "");
}

function buildAssetUrl(request: Request, workspaceId: string, assetId: string) {
  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(
    `${normalizeApiBaseUrl()}/workspaces/${encodeURIComponent(
      workspaceId,
    )}/external-projects/assets/${encodeURIComponent(assetId)}`,
  );

  for (const key of TRANSFORM_QUERY_PARAMS) {
    const value = requestUrl.searchParams.get(key);

    if (value) {
      upstreamUrl.searchParams.set(key, value);
    }
  }

  return upstreamUrl;
}

function copyImageHeaders(upstream: Response) {
  const headers = new Headers();

  for (const key of ["content-type", "content-length", "etag", "last-modified"]) {
    const value = upstream.headers.get(key);

    if (value) {
      headers.set(key, value);
    }
  }

  headers.set("Cache-Control", "private, max-age=60");
  return headers;
}

async function readUpstreamError(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json().catch(() => null)) as {
      error?: unknown;
      message?: unknown;
    } | null;
    const message = payload?.error ?? payload?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  const text = await response.text().catch(() => "");

  if (/NoSuchKey|NoSuchBucket|Object not found|specified key does not exist/i.test(text)) {
    return "Asset unavailable in the active storage provider.";
  }

  if (text.trim().startsWith("<?xml") || contentType.includes("xml")) {
    return "Asset unavailable.";
  }

  return text || "Asset unavailable";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const session = await getTheGuyserAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { assetId } = await params;
  const workspaceId = getTheGuyserWorkspaceId();
  const upstream = await fetch(buildAssetUrl(request, workspaceId, assetId), {
    cache: "no-store",
    headers: {
      Authorization: `${session.tokenType} ${session.accessToken}`,
    },
    redirect: "follow",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: await readUpstreamError(upstream) },
      { status: upstream.status || 502 },
    );
  }

  return new Response(upstream.body, {
    headers: copyImageHeaders(upstream),
    status: 200,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> },
) {
  try {
    const session = await getTheGuyserAdminSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assetId } = await params;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const asset = await updateTheGuyserAdminAsset(session.accessToken, assetId, body ?? {});

    revalidateTheGuyserContent();

    return NextResponse.json(asset);
  } catch (error) {
    console.error("[theguyser:admin] Failed to update asset", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update asset" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> },
) {
  try {
    const session = await getTheGuyserAdminSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assetId } = await params;
    const result = await deleteTheGuyserAdminAsset(session.accessToken, assetId);

    revalidateTheGuyserContent();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[theguyser:admin] Failed to delete asset", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete asset" },
      { status: 500 },
    );
  }
}
