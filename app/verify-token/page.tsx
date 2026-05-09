import { VerifyTokenClient } from "@/components/VerifyTokenClient";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

function VerifyTokenFallback() {
  return (
    <>
      <div className="flex size-12 items-center justify-center rounded-[1.25rem] border border-sky-300/30 bg-sky-400/12 text-sky-100">
        <LoaderCircle className="size-5 animate-spin" />
      </div>
      <h1 className="mt-5 text-3xl font-black text-white">Connecting The Guyser</h1>
      <p className="mt-3 text-sm leading-6 text-white/64">
        Finishing centralized Tuturuuu authentication.
      </p>
    </>
  );
}

export default function VerifyTokenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/12 bg-white/[0.04] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)]">
        <Suspense fallback={<VerifyTokenFallback />}>
          <VerifyTokenClient />
        </Suspense>
      </section>
    </main>
  );
}
