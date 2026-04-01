"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import { BatteryFull, Wifi } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { PROFILE } from "@/components/portfolio/data";
import { ThemeToggle } from "@/components/portfolio/common";
import type { AppDefinition } from "@/components/portfolio/types";

export function PortfolioHeader({
  isDark,
  mounted,
  onThemeToggle,
  time,
}: {
  isDark: boolean;
  mounted: boolean;
  onThemeToggle: () => void;
  time: string;
}) {
  return (
    <header className="sticky top-0 z-10 mx-2 flex items-center justify-between rounded-b-[2rem] border-b border-gray-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80 md:mx-6 md:px-8 md:py-3">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100 shadow-inner dark:border-gray-600 dark:bg-gray-800 md:h-12 md:w-12">
          <Image src={PROFILE.image} alt="Bao Chua portrait" width={48} height={48} className="h-full w-full object-cover" />
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 md:text-base">{PROFILE.name}</span>
      </div>

      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center md:flex">
        <span className="rounded-full border border-gray-200 bg-gray-100 px-8 py-1.5 text-sm font-black tracking-widest text-gray-500 uppercase shadow-inner dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          Portfolio Menu
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-300 md:gap-6 md:text-base">
        <ThemeToggle isDark={isDark} mounted={mounted} onToggle={onThemeToggle} />
        <div className="mr-2 flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className="w-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
              animate={{ height: ["8px", "16px", "8px"] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: item * 0.1 }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="w-16 text-right">{time}</span>
        </div>
        <div className="flex items-center gap-1">
          <BatteryFull className="h-6 w-6 text-green-500 dark:text-green-400" />
        </div>
      </div>
    </header>
  );
}

export function PortfolioFooter() {
  return (
    <footer className="fixed right-4 bottom-4 left-4 z-10 hidden items-center justify-between rounded-full border border-gray-200 bg-white/80 px-8 py-3 shadow-md backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80 md:flex">
      <div className="flex gap-8">
        <button type="button" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-xs font-black text-gray-500 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Y
          </div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Resources</span>
        </button>
        <button type="button" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-xs font-black text-gray-500 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
            -
          </div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Details</span>
        </button>
      </div>

      <div className="flex gap-3">
        <div className="h-3.5 w-3.5 rounded-full bg-blue-500 shadow-inner ring-2 ring-blue-200 dark:ring-blue-900" />
        <div className="h-3.5 w-3.5 rounded-full bg-gray-300 shadow-inner dark:bg-gray-600" />
        <div className="h-3.5 w-3.5 rounded-full bg-gray-300 shadow-inner dark:bg-gray-600" />
      </div>

      <div className="flex gap-8">
        <button type="button" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-xs font-black text-gray-500 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
            A
          </div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Select</span>
        </button>
        <button type="button" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-xs font-black text-gray-500 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
            +
          </div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Menu</span>
        </button>
      </div>
    </footer>
  );
}

export function LaunchOverlay({ launchingApp }: { launchingApp: AppDefinition | null }) {
  return (
    <AnimatePresence>
      {launchingApp ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-white dark:bg-gray-900"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className={`flex h-48 w-48 items-center justify-center rounded-[40px] shadow-2xl ${launchingApp.color}`}
          >
            <launchingApp.icon className="h-24 w-24 text-white drop-shadow-lg" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-10 flex gap-2">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="h-4 w-4 animate-bounce rounded-full bg-gray-300 dark:bg-gray-600"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function TabletDialog({
  activeApp,
  children,
  onClose,
}: {
  activeApp: AppDefinition | null;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!activeApp) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeApp, onClose]);

  return (
    <AnimatePresence>
      {activeApp ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tablet-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative h-[88vh] w-full max-w-[min(1500px,96vw)] overflow-hidden rounded-[3.25rem] bg-[linear-gradient(180deg,#374151_0%,#111827_42%,#0f172a_100%)] shadow-[0_35px_90px_rgba(0,0,0,0.65)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="absolute top-3 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-black/35 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]" />
            <div className="absolute top-5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-slate-950 ring-2 ring-slate-700/80" />
            <div className="absolute top-1/2 left-3 hidden h-36 w-3 -translate-y-1/2 rounded-full bg-black/30 shadow-[inset_0_1px_3px_rgba(255,255,255,0.12)] lg:block" />
            <div className="absolute top-1/2 right-3 hidden h-36 w-3 -translate-y-1/2 rounded-full bg-black/30 shadow-[inset_0_1px_3px_rgba(255,255,255,0.12)] lg:block" />
            <div className="absolute top-5 right-5 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold tracking-[0.18em] text-white/70 uppercase backdrop-blur md:flex">
              <span>Esc</span>
              <span className="text-white/40">or</span>
              <span>Tap Outside</span>
            </div>

            <div className="pointer-events-none absolute inset-x-1/2 bottom-3 z-10 h-[4.5rem] w-44 -translate-x-1/2 rounded-full bg-black/20 shadow-[inset_0_1px_10px_rgba(255,255,255,0.04)]" />

            <div className="relative z-10 mx-2 mb-20 mt-2 flex h-[calc(100%-5rem)] min-h-0 flex-col overflow-hidden rounded-[3rem] bg-white shadow-[inset_0_0_30px_rgba(0,0,0,0.18)] ring-1 ring-black dark:bg-gray-900 md:mx-3 md:mb-24 md:mt-3 md:h-[calc(100%-6rem)]">
              <div className={`flex items-center justify-between border-b border-gray-200 p-4 md:px-6 ${activeApp.color}`}>
                <div className="flex items-center gap-3">
                  <activeApp.icon className="h-8 w-8 text-white drop-shadow-sm" />
                  <h2 id="tablet-dialog-title" className="text-2xl font-black tracking-wide text-white drop-shadow-sm">
                    {activeApp.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-black text-white backdrop-blur-sm transition-colors hover:bg-white/40 md:mr-2"
                  aria-label="Close tablet"
                >
                  X
                </button>
              </div>

              <div className="border-b border-gray-200 bg-white/90 px-4 py-2 text-xs font-bold tracking-[0.18em] text-gray-400 uppercase dark:border-gray-800 dark:bg-gray-950/80 dark:text-gray-500">
                {PROFILE.name} • {PROFILE.role}
              </div>

              <div className="wii-bg relative flex-1 overflow-y-auto p-5 md:p-8">{children}</div>
            </div>

            <button
              type="button"
              className="group absolute bottom-5 left-1/2 z-20 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-slate-600 bg-[radial-gradient(circle_at_30%_30%,#475569,#1e293b_70%)] shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.03]"
              onClick={onClose}
              aria-label="Close tablet"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-500/60 bg-slate-800/80 shadow-inner transition-colors group-hover:bg-sky-500/80">
                <div className="h-[18px] w-[18px] rounded-[0.4rem] border-2 border-slate-950" />
              </div>
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
