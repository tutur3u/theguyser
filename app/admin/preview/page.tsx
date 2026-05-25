import { TheGuyserAdminDraftPreviewClient } from "@/components/admin/TheGuyserAdminDraftPreviewClient";
import { getTheGuyserAdminLoginPath } from "@/lib/theguyser-config";
import { getTheGuyserAdminSession } from "@/lib/theguyser-admin-api";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TheGuyser Draft Preview",
};

export default async function TheGuyserAdminPreviewPage() {
  const session = await getTheGuyserAdminSession();

  if (!session) {
    redirect(getTheGuyserAdminLoginPath("preview"));
  }

  return <TheGuyserAdminDraftPreviewClient />;
}
