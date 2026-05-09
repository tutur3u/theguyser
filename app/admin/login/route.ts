import {
  buildTheGuyserCentralizedLoginUrl,
  resolveTheGuyserAdminTargetKey,
} from "@/lib/theguyser-config";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const targetKey = resolveTheGuyserAdminTargetKey(request.nextUrl.searchParams.get("next"));
  const nextUrl = targetKey === "dashboard" ? "/admin" : `/admin?target=${targetKey}`;

  return NextResponse.redirect(
    buildTheGuyserCentralizedLoginUrl({
      appBaseUrl: request.nextUrl.origin,
      nextUrl,
    }),
  );
}
