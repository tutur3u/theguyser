import {
  duplicateTheGuyserAdminEntry,
  getTheGuyserAdminSession,
  revalidateTheGuyserContent,
} from "@/lib/theguyser-admin-api";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ entryId: string }> },
) {
  try {
    const adminSession = await getTheGuyserAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entryId } = await params;
    const entry = await duplicateTheGuyserAdminEntry(adminSession.accessToken, entryId);

    revalidateTheGuyserContent();

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("[theguyser:admin] Failed to duplicate entry", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to duplicate entry" },
      { status: 500 },
    );
  }
}
