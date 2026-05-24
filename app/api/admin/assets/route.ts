import {
  createTheGuyserAdminAsset,
  getTheGuyserAdminSession,
  revalidateTheGuyserContent,
} from "@/lib/theguyser-admin-api";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const adminSession = await getTheGuyserAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const asset = await createTheGuyserAdminAsset(adminSession.accessToken, body as never);

    revalidateTheGuyserContent();

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("[theguyser:admin] Failed to create asset", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create asset" },
      { status: 500 },
    );
  }
}
