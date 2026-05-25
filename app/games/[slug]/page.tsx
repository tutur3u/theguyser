import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchTheGuyserDeliveryPayload } from "@/lib/theguyser-delivery";
import { getTheGuyserGamePlayer } from "@/lib/theguyser-webgl";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPlayer(slug: string) {
  try {
    const { apiBaseUrl, delivery } = await fetchTheGuyserDeliveryPayload();
    return getTheGuyserGamePlayer(delivery, { apiBaseUrl, slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayer(slug);

  if (!player) {
    return {
      title: "Game unavailable",
      description: "This CMS game is not available to play yet.",
    };
  }

  return {
    title: player.title,
    description: player.description || `Play ${player.title} in the browser.`,
  };
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const player = await getPlayer(slug);

  if (!player) {
    notFound();
  }

  return (
    <main className="relative h-svh overflow-hidden bg-black text-white">
      <iframe
        allow="autoplay; fullscreen; gamepad; xr-spatial-tracking"
        className="h-full w-full border-0"
        referrerPolicy="strict-origin-when-cross-origin"
        src={player.iframeSrc}
        title={player.title}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
          <div className="pointer-events-auto rounded-full border border-white/10 bg-black/45 px-4 py-2 backdrop-blur-md">
            <h1 className="text-lg font-black tracking-tight sm:text-xl">{player.title}</h1>
            {player.description ? (
              <p className="mt-0.5 max-w-xl text-xs font-medium text-white/70 sm:text-sm">
                {player.description}
              </p>
            ) : null}
          </div>

          <div className="pointer-events-auto flex flex-wrap gap-2">
            {player.externalHref ? (
              <Link
                href={player.externalHref}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/45 px-4 py-2.5 text-sm font-black text-white backdrop-blur-md transition-colors hover:bg-black/60"
                target="_blank"
              >
                External Page
              </Link>
            ) : null}
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/45 px-4 py-2.5 text-sm font-black text-white backdrop-blur-md transition-colors hover:bg-black/60"
            >
              Back To Portfolio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
