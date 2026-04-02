import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OG Export",
  description: "Preview and download the generated 1200x630 social image.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OgPage() {
  return (
    <main className="wii-bg min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/82 sm:p-8">
          <p className="text-sm font-black tracking-[0.28em] text-sky-600 uppercase dark:text-sky-300">Open Graph Export</p>
          <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">Preview the generated 1200x630 card</h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            This page previews the static JPG used by the app&apos;s Open Graph metadata. You can open it directly, download it, or use it as the site&apos;s social image.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/opengraph-image.jpg"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-md transition-transform hover:-translate-y-0.5"
            >
              Open JPG
            </a>
            <a
              href="/opengraph-image.jpg"
              download="bao-portfolio-og.jpg"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-black text-white shadow-md transition-transform hover:-translate-y-0.5 dark:bg-gray-100 dark:text-gray-900"
            >
              Download JPG
            </a>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.25rem] border border-slate-800 bg-slate-900 p-3 shadow-[0_28px_70px_rgba(15,23,42,0.32)] sm:p-4">
          <Image
            src="/opengraph-image.jpg"
            alt="Bao portfolio open graph preview"
            width={1200}
            height={630}
            priority
            unoptimized
            className="block h-auto w-full rounded-[1.5rem] bg-slate-950"
          />
        </section>
      </div>
    </main>
  );
}
