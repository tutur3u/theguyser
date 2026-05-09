import { TheGuyserAdminClient } from "@/components/admin/TheGuyserAdminClient";
import {
  buildTheGuyserAdminLinks,
  getTheGuyserAdminLoginPath,
  getTheGuyserCmsBaseUrl,
  getTheGuyserWebAppUrl,
  getTheGuyserWorkspaceId,
  resolveTheGuyserAdminTargetKey,
} from "@/lib/theguyser-config";
import {
  getTheGuyserAdminSession,
  getTheGuyserAdminStudio,
} from "@/lib/theguyser-admin-api";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Guyser Admin",
  description: "Authenticated The Guyser content management backed by Tuturuuu CMS APIs.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ target?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const targetKey = resolveTheGuyserAdminTargetKey(resolvedSearchParams?.target);
  const adminSession = await getTheGuyserAdminSession();

  if (!adminSession) {
    redirect(getTheGuyserAdminLoginPath(targetKey));
  }

  const workspaceId = getTheGuyserWorkspaceId();
  const studio = await getTheGuyserAdminStudio(adminSession.accessToken);

  return (
    <TheGuyserAdminClient
      adminLinks={buildTheGuyserAdminLinks(workspaceId)}
      cmsBaseUrl={getTheGuyserCmsBaseUrl()}
      initialStudio={studio}
      initialTarget={targetKey}
      userEmail={adminSession.user.email ?? null}
      webAppUrl={getTheGuyserWebAppUrl()}
      workspaceId={workspaceId}
    />
  );
}
