export const THEGUYSER_APP_NAME = "theguyser";

export type TheGuyserAdminTargetKey =
  | "dashboard"
  | "library"
  | "preview"
  | "members"
  | "settings";

type TheGuyserAdminTarget = {
  actionLabel: string;
  description: string;
  key: TheGuyserAdminTargetKey;
  label: string;
  pathSuffix: string;
};

export const THEGUYSER_ADMIN_TARGETS: TheGuyserAdminTarget[] = [
  {
    actionLabel: "Open CMS Home",
    description: "Review workspace status and jump into the content studio.",
    key: "dashboard",
    label: "CMS Home",
    pathSuffix: "",
  },
  {
    actionLabel: "Manage Library",
    description: "Edit panels, games, research, assets, and publishing workflow.",
    key: "library",
    label: "Library",
    pathSuffix: "/library",
  },
  {
    actionLabel: "Preview Delivery",
    description: "Inspect the delivered portfolio payload before publishing.",
    key: "preview",
    label: "Preview",
    pathSuffix: "/preview",
  },
  {
    actionLabel: "Manage Members",
    description: "Open CMS workspace membership and collaborator access.",
    key: "members",
    label: "Members",
    pathSuffix: "/members",
  },
  {
    actionLabel: "Open Settings",
    description: "Tune the external project binding and workspace settings.",
    key: "settings",
    label: "Settings",
    pathSuffix: "/settings",
  },
];

function isEnabled(value: string | undefined) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getAdminDevMode() {
  return isEnabled(process.env.DEV_MODE ?? process.env.NEXT_PUBLIC_DEV_MODE);
}

function getConfiguredUrl({
  envName,
  localUrl,
  productionUrl,
}: {
  envName: string;
  localUrl: string;
  productionUrl: string;
}) {
  const configured = process.env[envName] ?? process.env[`NEXT_PUBLIC_${envName}`];

  if (configured?.trim()) {
    return trimTrailingSlash(configured.trim());
  }

  return getAdminDevMode() ? localUrl : productionUrl;
}

export function getTheGuyserApiBaseUrl() {
  return (
    process.env.TUTURUUU_API_BASE_URL ??
    process.env.NEXT_PUBLIC_TUTURUUU_API_BASE_URL ??
    "https://tuturuuu.com/api/v1"
  );
}

export function getTheGuyserWorkspaceId() {
  const workspaceId =
    process.env.TUTURUUU_THEGUYSER_WORKSPACE_ID ??
    process.env.NEXT_PUBLIC_TUTURUUU_THEGUYSER_WORKSPACE_ID;

  if (!workspaceId?.trim()) {
    throw new Error(
      "[theguyser] Missing TUTURUUU_THEGUYSER_WORKSPACE_ID. Point it at the EPM workspace that uses the theguyser adapter.",
    );
  }

  return workspaceId.trim();
}

export function getTheGuyserAppId() {
  return (process.env.THEGUYSER_APP_ID ?? THEGUYSER_APP_NAME).trim().toLowerCase();
}

export function getTheGuyserAppSecret() {
  const secret =
    process.env.THEGUYSER_APP_SECRET ?? process.env.TUTURUUU_THEGUYSER_APP_SECRET;

  if (!secret?.trim()) {
    throw new Error("[theguyser] Missing THEGUYSER_APP_SECRET.");
  }

  return secret.trim();
}

export function getTheGuyserCmsBaseUrl() {
  return getConfiguredUrl({
    envName: "TUTURUUU_CMS_APP_URL",
    localUrl: "http://localhost:7811",
    productionUrl: "https://cms.tuturuuu.com",
  });
}

export function getTheGuyserWebAppUrl() {
  return getConfiguredUrl({
    envName: "TUTURUUU_WEB_APP_URL",
    localUrl: "http://localhost:7803",
    productionUrl: "https://tuturuuu.com",
  });
}

export function getTheGuyserAppBaseUrl(requestOrigin?: string) {
  const configured =
    process.env.THEGUYSER_APP_URL ??
    process.env.NEXT_PUBLIC_THEGUYSER_APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL;

  if (configured?.trim()) {
    return trimTrailingSlash(configured.trim());
  }

  if (requestOrigin?.trim()) {
    return trimTrailingSlash(requestOrigin.trim());
  }

  if (process.env.VERCEL_URL?.trim()) {
    return `https://${trimTrailingSlash(process.env.VERCEL_URL.trim())}`;
  }

  return "http://localhost:3000";
}

export function sanitizeTheGuyserNextPath(
  rawValue: string | null | undefined,
  requestOrigin = "http://localhost",
  fallbackPath = "/admin",
) {
  if (!rawValue?.trim() || rawValue.startsWith("//")) {
    return fallbackPath;
  }

  try {
    const parsed = new URL(rawValue, requestOrigin);

    if (parsed.origin !== requestOrigin) {
      return fallbackPath;
    }

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallbackPath;
  }
}

export function getTheGuyserLoginPath(nextUrl = "/admin") {
  const loginUrl = new URL("/login", "http://theguyser.local");
  loginUrl.searchParams.set("nextUrl", nextUrl);
  return `${loginUrl.pathname}${loginUrl.search}`;
}

export function resolveTheGuyserAdminTargetKey(
  value: string | null | undefined,
): TheGuyserAdminTargetKey {
  return THEGUYSER_ADMIN_TARGETS.some((target) => target.key === value)
    ? (value as TheGuyserAdminTargetKey)
    : "library";
}

export function getTheGuyserAdminTarget(key: TheGuyserAdminTargetKey) {
  return (
    THEGUYSER_ADMIN_TARGETS.find((target) => target.key === key) ??
    THEGUYSER_ADMIN_TARGETS[1]
  );
}

export function getTheGuyserCmsWorkspacePath(
  targetKey: TheGuyserAdminTargetKey,
  workspaceId = getTheGuyserWorkspaceId(),
) {
  const target = getTheGuyserAdminTarget(targetKey);
  return `/${encodeURIComponent(workspaceId)}${target.pathSuffix}`;
}

export function buildTheGuyserCmsUrl({
  cmsBaseUrl = getTheGuyserCmsBaseUrl(),
  targetKey,
  workspaceId = getTheGuyserWorkspaceId(),
}: {
  cmsBaseUrl?: string;
  targetKey: TheGuyserAdminTargetKey;
  workspaceId?: string;
}) {
  return new URL(getTheGuyserCmsWorkspacePath(targetKey, workspaceId), cmsBaseUrl).toString();
}

export function buildTheGuyserCentralizedLoginUrl({
  appBaseUrl = getTheGuyserAppBaseUrl(),
  nextUrl = "/admin",
  webAppUrl = getTheGuyserWebAppUrl(),
}: {
  appBaseUrl?: string;
  nextUrl?: string;
  webAppUrl?: string;
}) {
  const appOrigin = new URL(appBaseUrl).origin;
  const verifyUrl = new URL("/verify-token", appOrigin);
  verifyUrl.searchParams.set("nextUrl", sanitizeTheGuyserNextPath(nextUrl, appOrigin));

  const loginUrl = new URL("/login", webAppUrl);
  loginUrl.searchParams.set("returnUrl", verifyUrl.toString());
  return loginUrl.toString();
}

export function getTheGuyserAdminLoginPath(targetKey: TheGuyserAdminTargetKey) {
  return `/admin/login?next=${encodeURIComponent(targetKey)}`;
}

export function buildTheGuyserAdminLinks(workspaceId = getTheGuyserWorkspaceId()) {
  const cmsBaseUrl = getTheGuyserCmsBaseUrl();

  return THEGUYSER_ADMIN_TARGETS.map((target) => ({
    ...target,
    cmsHref: buildTheGuyserCmsUrl({
      cmsBaseUrl,
      targetKey: target.key,
      workspaceId,
    }),
    loginHref: getTheGuyserAdminLoginPath(target.key),
  }));
}
