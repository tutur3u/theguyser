import Link from "next/link";

export default function GameNotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-black px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-black tracking-[0.3em] text-white/45 uppercase">Game unavailable</p>
        <h1 className="mt-3 text-3xl font-black">No playable CMS package found</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          This game is unpublished, missing a WebGL package, or has invalid package metadata.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-white/90"
        >
          Back To Portfolio
        </Link>
      </div>
    </main>
  );
}
