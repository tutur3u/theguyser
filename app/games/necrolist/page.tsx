import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Necrolist",
	description: "Play Necrolist in the browser.",
};

export default function NecrolistPage() {
	return (
		<main className="relative h-svh overflow-hidden bg-black text-white">
			<div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
				<div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
					<div className="pointer-events-auto rounded-full border border-white/10 bg-black/45 px-4 py-2 backdrop-blur-md">
						<h1 className="text-lg font-black tracking-tight sm:text-xl">
							Necrolist
						</h1>
					</div>

					<div className="fixed inset-0 text-2xl font-semibold opacity-80 h-screen w-screen text-center flex items-center justify-center">
						Coming soon
					</div>

					<div className="pointer-events-auto flex flex-wrap gap-2">
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
