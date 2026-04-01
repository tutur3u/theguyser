"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { APPS, DISC_APP, PROFILE } from "@/components/portfolio/data";
import type { AppDefinition, ScreenId } from "@/components/portfolio/types";

function DiscChannel({
  buttonRef,
  isSelected,
  onClick,
}: {
  buttonRef?: (node: HTMLButtonElement | null) => void;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative col-span-2 row-span-2">
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`nintendo-channel channel-shine group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-gray-100 to-gray-300 outline-none transition-all dark:from-gray-800 dark:to-gray-900 ${
          isSelected
            ? "scale-[1.01] ring-4 ring-sky-300 ring-offset-4 ring-offset-transparent dark:ring-sky-500"
            : "focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent dark:focus-visible:ring-sky-500"
        }`}
        aria-label="Open Bao Chua Portfolio disc channel"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity group-hover:opacity-50"
          style={{ backgroundImage: `url("${PROFILE.image}")` }}
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "linear" }}
          className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-8 border-gray-800 bg-gradient-to-tr from-blue-400 via-cyan-400 to-sky-500 shadow-2xl transition-transform duration-300 md:h-40 md:w-40 ${
            isHovered || isSelected ? "scale-110" : ""
          }`}
        >
          <div className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 bg-gradient-to-tr from-transparent via-white/40 to-transparent" />
          <div className="z-10 h-8 w-8 rounded-full border-4 border-gray-800 bg-gray-200 shadow-inner dark:bg-gray-700" />
        </motion.div>

        <div className="absolute right-0 bottom-3 left-0 text-center">
          <span className="rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-sm font-black text-white backdrop-blur-md">
            Open Portfolio
          </span>
        </div>
      </button>
    </div>
  );
}

function AppIcon({
  app,
  buttonRef,
  isSelected,
  onClick,
}: {
  app: AppDefinition;
  buttonRef?: (node: HTMLButtonElement | null) => void;
  isSelected: boolean;
  onClick: (app: AppDefinition) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative ${app.size}`}>
      <button
        ref={buttonRef}
        onClick={() => onClick(app)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`nintendo-channel channel-shine group relative h-full w-full cursor-pointer overflow-hidden rounded-[24px] outline-none transition-all ${app.color} ${
          isSelected
            ? "scale-[1.03] ring-4 ring-sky-300 ring-offset-4 ring-offset-transparent dark:ring-sky-500"
            : "focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent dark:focus-visible:ring-sky-500"
        }`}
        aria-label={`Open ${app.title}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8)_0%,transparent_60%)] opacity-50" />

        <div className="relative z-20 flex h-full w-full flex-col items-center justify-center p-2">
          <motion.div
            animate={isHovered || isSelected ? { rotate: [0, -10, 10, -10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <app.icon className="mb-2 h-12 w-12 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] md:h-16 md:w-16" />
          </motion.div>
          <span className="text-center text-sm leading-tight font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] md:text-base">
            {app.title}
          </span>
        </div>
      </button>
    </div>
  );
}

export function DashboardMenu({
  onAppClick,
  selectedMenuId,
  setMenuButtonRef,
}: {
  onAppClick: (app: AppDefinition) => void;
  selectedMenuId: ScreenId | null;
  setMenuButtonRef: (id: ScreenId) => (node: HTMLButtonElement | null) => void;
}) {
  return (
    <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-6 md:gap-6" aria-label="Portfolio apps menu">
      <DiscChannel
        buttonRef={setMenuButtonRef(DISC_APP.id)}
        isSelected={selectedMenuId === DISC_APP.id}
        onClick={() => onAppClick(DISC_APP)}
      />
      {APPS.map((app) => (
        <AppIcon
          key={app.id}
          app={app}
          buttonRef={setMenuButtonRef(app.id)}
          isSelected={selectedMenuId === app.id}
          onClick={onAppClick}
        />
      ))}
    </div>
  );
}
