import {
  getTheGuyserAdminSession,
  revalidateTheGuyserContent,
  updateTheGuyserAdminCollection,
} from "@/lib/theguyser-admin-api";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> },
) {
  try {
    const adminSession = await getTheGuyserAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collectionId } = await params;
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const collection = await updateTheGuyserAdminCollection(
      adminSession.accessToken,
      collectionId,
      body ?? {},
    );

    revalidateTheGuyserContent();

    return NextResponse.json(collection);
  } catch (error) {
    console.error("[theguyser:admin] Failed to update collection", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update collection" },
      { status: 500 },
    );
  }
}
