import {
  getTheGuyserAdminSession,
  revalidateTheGuyserContent,
  updateTheGuyserAdminEntry,
} from "@/lib/theguyser-admin-api";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
  try {
    const adminSession = await getTheGuyserAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entryId } = await params;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const entry = await updateTheGuyserAdminEntry(adminSession.accessToken, entryId, body ?? {});

    revalidateTheGuyserContent();

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[theguyser:admin] Failed to update entry", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update entry" },
      { status: 500 },
    );
  }
}
