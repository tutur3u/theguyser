import { getTheGuyserPortfolioPayload } from "@/lib/theguyser-delivery";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    content: await getTheGuyserPortfolioPayload(),
  });
}
