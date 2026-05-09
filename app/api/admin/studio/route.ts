import { getTheGuyserAdminSession, getTheGuyserAdminStudio } from "@/lib/theguyser-admin-api";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminSession = await getTheGuyserAdminSession();

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studio = await getTheGuyserAdminStudio(adminSession.accessToken);
    return NextResponse.json(studio);
  } catch (error) {
    console.error("[theguyser:admin] Failed to load studio", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load studio" },
      { status: 500 },
    );
  }
}
