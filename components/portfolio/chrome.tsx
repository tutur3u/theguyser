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
    <header className="relative sticky top-0 z-10 mx-2 mt-2 rounded-[2rem] border border-white/60 bg-white/82 px-4 py-3 shadow-[0_14px_35px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/84 md:mx-6 md:mt-4 md:px-8 md:py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100 shadow-inner dark:border-gray-600 dark:bg-gray-800 md:h-12 md:w-12">
            <Image src={PROFILE.image} alt="Bao Chua portrait" width={48} height={48} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <span className="block truncate text-base font-bold text-gray-700 dark:text-gray-200">{PROFILE.name}</span>
            <span className="block text-xs font-black tracking-[0.24em] text-sky-600 uppercase dark:text-sky-300 md:hidden">
              Portfolio Menu
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm font-bold text-gray-600 dark:text-gray-300 md:gap-6 md:text-base">
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle isDark={isDark} mounted={mounted} onToggle={onThemeToggle} />
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((item) => (
                <motion.div
                  key={item}
                  className="w-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                  animate={{ height: ["8px", "16px", "8px"] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: item * 0.1 }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-gray-100/90 px-3 py-2 dark:bg-gray-800/85">
            <Wifi className="h-4 w-4 text-gray-500 dark:text-gray-400 md:h-5 md:w-5" />
            <span className="w-14 text-right text-sm md:w-16">{time}</span>
            <BatteryFull className="h-5 w-5 text-green-500 dark:text-green-400 md:h-6 md:w-6" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 items-center justify-center md:flex">
        <span className="rounded-full border border-gray-200 bg-gray-100 px-8 py-1.5 text-sm font-black tracking-widest text-gray-500 uppercase shadow-inner dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          Portfolio Menu
        </span>
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
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/60 p-2 backdrop-blur-md sm:items-center sm:p-6"
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
            className="relative h-[calc(100dvh-1rem)] w-full max-w-[min(1500px,98vw)] overflow-hidden rounded-[2.35rem] bg-[linear-gradient(180deg,#374151_0%,#111827_42%,#0f172a_100%)] shadow-[0_35px_90px_rgba(0,0,0,0.65)] sm:h-[92vh] sm:max-w-[min(1500px,96vw)] sm:rounded-[3.25rem]"
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

            <div className="pointer-events-none absolute inset-x-1/2 bottom-3 z-10 hidden h-[4.5rem] w-44 -translate-x-1/2 rounded-full bg-black/20 shadow-[inset_0_1px_10px_rgba(255,255,255,0.04)] sm:block" />

            <div className="relative z-10 mx-2 mb-4 mt-2 flex h-[calc(100%-1.25rem)] min-h-0 flex-col overflow-hidden rounded-[2rem] bg-white shadow-[inset_0_0_30px_rgba(0,0,0,0.18)] ring-1 ring-black dark:bg-gray-900 sm:mx-3 sm:mb-24 sm:mt-3 sm:h-[calc(100%-6rem)] sm:rounded-[3rem]">
              <div className={`flex items-center justify-between gap-3 border-b border-gray-200 p-4 sm:px-6 ${activeApp.color}`}>
                <div className="flex items-center gap-3">
                  <activeApp.icon className="h-7 w-7 text-white drop-shadow-sm sm:h-8 sm:w-8" />
                  <h2 id="tablet-dialog-title" className="text-xl font-black tracking-wide text-white drop-shadow-sm sm:text-2xl">
                    {activeApp.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-black text-white backdrop-blur-sm transition-colors hover:bg-white/40"
                  aria-label="Close tablet"
                >
                  X
                </button>
              </div>

              <div className="border-b border-gray-200 bg-white/90 px-4 py-2 text-[0.68rem] font-bold tracking-[0.18em] text-gray-400 uppercase dark:border-gray-800 dark:bg-gray-950/80 dark:text-gray-500 sm:text-xs">
                {PROFILE.name} • {PROFILE.role}
              </div>

              <div className="wii-bg relative flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">{children}</div>
            </div>

            <button
              type="button"
              className="group absolute bottom-5 left-1/2 z-20 hidden h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-slate-600 bg-[radial-gradient(circle_at_30%_30%,#475569,#1e293b_70%)] shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.03] sm:flex"
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
