import {
  deleteTheGuyserAdminBlock,
  getTheGuyserAdminSession,
  revalidateTheGuyserContent,
  updateTheGuyserAdminBlock,
} from "@/lib/theguyser-admin-api";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ blockId: string }> },
) {
  try {
    const adminSession = await getTheGuyserAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blockId } = await params;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const block = await updateTheGuyserAdminBlock(
      adminSession.accessToken,
      blockId,
      body ?? {},
    );

    revalidateTheGuyserContent();

    return NextResponse.json(block);
  } catch (error) {
    console.error("[theguyser:admin] Failed to update block", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update block" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ blockId: string }> },
) {
  try {
    const adminSession = await getTheGuyserAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blockId } = await params;
    const result = await deleteTheGuyserAdminBlock(adminSession.accessToken, blockId);

    revalidateTheGuyserContent();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[theguyser:admin] Failed to delete block", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete block" },
      { status: 500 },
    );
  }
}
