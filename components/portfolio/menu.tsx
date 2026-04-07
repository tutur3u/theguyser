"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { DISC_APP, MENU_ITEMS, PROFILE } from "@/components/portfolio/data";
import type { AppDefinition, MenuItem, MenuItemId } from "@/components/portfolio/types";

function getExternalLinkProps(href: string) {
  if (href.startsWith("mailto:")) {
    return {};
  }

  return {
    target: "_blank",
    rel: "noreferrer",
  } as const;
}

function getMenuItemId(item: MenuItem): MenuItemId {
  return item.kind === "panel" ? item.id : item.menuId;
}

function DiscChannel({
  buttonRef,
  isSelected,
  onClick,
}: {
  buttonRef?: (node: HTMLElement | null) => void;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPulse, setHoverPulse] = useState(0);

  return (
    <div className="relative col-span-2 row-span-2">
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setHoverPulse((current) => current + 1);
        }}
        onMouseLeave={() => setIsHovered(false)}
        className={`nintendo-channel channel-shine group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-gray-100 to-gray-300 outline-none transition-all dark:from-gray-800 dark:to-gray-900 ${
          isSelected
            ? "scale-[1.01] ring-4 ring-sky-300 ring-offset-4 ring-offset-transparent dark:ring-sky-500"
            : "focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent dark:focus-visible:ring-sky-500"
        }`}
        aria-label="Open Bao's Portfolio"
      >
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${
            isHovered || isSelected ? "scale-[1.04] opacity-55" : "opacity-40"
          }`}
          style={{ backgroundImage: `url("${PROFILE.image}")` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12),rgba(15,23,42,0.22)_44%,rgba(15,23,42,0.62))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_42%)]" />

        <motion.div
          key={`disc-title-${hoverPulse}-${isSelected ? "selected" : "idle"}`}
          initial={{ opacity: 0.82, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 py-6 text-center md:px-8 md:py-8"
        >
          <div className="rounded-[1.5rem] bg-black/38 px-5 py-4 backdrop-blur-md">
            <span className="block text-lg leading-tight font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)] md:text-[1.7rem]">
              Bao&apos;s Portfolio
            </span>
          </div>
        </motion.div>
      </button>
    </div>
  );
}

function AppIcon({
  item,
  buttonRef,
  isSelected,
  onAppClick,
  onSelect,
}: {
  item: MenuItem;
  buttonRef?: (node: HTMLElement | null) => void;
  isSelected: boolean;
  onAppClick: (app: AppDefinition) => void;
  onSelect: (id: MenuItemId) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPulse, setHoverPulse] = useState(0);
  const artwork = item.artwork ?? [];
  const hasArtwork = artwork.length > 0;
  const displayedArtwork = artwork.slice(0, 4);
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(() => {
    if (displayedArtwork.length === 0) {
      return 0;
    }

    return item.title.length % displayedArtwork.length;
  });

  useEffect(() => {
    if (displayedArtwork.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveArtworkIndex((currentIndex) => (currentIndex + 1) % displayedArtwork.length);
    }, 2400 + item.title.length * 140);

    return () => window.clearInterval(interval);
  }, [displayedArtwork.length, item.title.length]);

  const sharedClassName = `nintendo-channel channel-shine group relative h-full w-full cursor-pointer overflow-hidden rounded-[24px] outline-none transition-all ${item.color} ${
    isSelected
      ? "scale-[1.03] ring-4 ring-sky-300 ring-offset-4 ring-offset-transparent dark:ring-sky-500"
      : "focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent dark:focus-visible:ring-sky-500"
  }`;

  const content = (
    <>
      {hasArtwork ? (
        <>
          {displayedArtwork.map((image: string, index: number) => (
            <motion.div
              key={`${item.title}-${index}`}
              className="absolute inset-0 bg-cover bg-center"
              initial={false}
              animate={{
                opacity: index === activeArtworkIndex ? 1 : 0,
                scale: index === activeArtworkIndex ? 1.02 : 1,
              }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ backgroundImage: `url("${image}")` }}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.22),rgba(15,23,42,0.54)_56%,rgba(15,23,42,0.86))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_42%)]" />
        </>
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 ${
          hasArtwork
            ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]"
            : "bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8)_0%,transparent_60%)] opacity-50"
        }`}
      />

      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-3 px-4 py-5 text-center md:gap-4 md:px-5">
        <motion.div
          key={`${item.title}-${hoverPulse}-${isSelected ? "selected" : "idle"}`}
          initial={{ rotate: 0, scale: 1 }}
          animate={isHovered || isSelected ? { rotate: [0, -8, 8, -8, 0], scale: 1.08 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <item.icon className={`text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] ${hasArtwork ? "h-8 w-8 md:h-9 md:w-9" : "h-10 w-10 md:h-12 md:w-12"}`} />
        </motion.div>

        <span
          className={`max-w-[88%] text-center leading-tight font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)] ${
            hasArtwork ? "text-lg md:text-xl" : "text-sm md:text-base"
          }`}
        >
          {item.title}
        </span>
      </div>
    </>
  );

  const itemId = getMenuItemId(item);

  return (
    <div className={`relative ${item.size}`}>
      {item.kind === "panel" ? (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => onAppClick(item)}
          onFocus={() => onSelect(itemId)}
          onMouseEnter={() => {
            setIsHovered(true);
            setHoverPulse((current) => current + 1);
          }}
          onMouseLeave={() => setIsHovered(false)}
          className={sharedClassName}
          aria-label={`Open ${item.title}`}
        >
          {content}
        </button>
      ) : (
        <a
          ref={buttonRef}
          href={item.href}
          {...getExternalLinkProps(item.href)}
          onFocus={() => onSelect(itemId)}
          onMouseEnter={() => {
            setIsHovered(true);
            setHoverPulse((current) => current + 1);
          }}
          onMouseLeave={() => setIsHovered(false)}
          className={sharedClassName}
          aria-label={`Open ${item.title}`}
        >
          {content}
        </a>
      )}
    </div>
  );
}

export function DashboardMenu({
  onAppClick,
  selectedMenuId,
  setMenuButtonRef,
  setSelectedMenuId,
}: {
  onAppClick: (app: AppDefinition) => void;
  selectedMenuId: MenuItemId | null;
  setMenuButtonRef: (id: MenuItemId) => (node: HTMLElement | null) => void;
  setSelectedMenuId: (id: MenuItemId | null) => void;
}) {
  return (
    <div
      className="grid w-full max-w-6xl grid-cols-2 auto-rows-[9.25rem] gap-4 sm:auto-rows-[10.5rem] sm:gap-5 md:grid-cols-4 md:auto-rows-[8.5rem] md:gap-6"
      aria-label="Portfolio apps menu"
    >
      <DiscChannel
        buttonRef={setMenuButtonRef(DISC_APP.id)}
        isSelected={selectedMenuId === DISC_APP.id}
        onClick={() => onAppClick(DISC_APP)}
      />
      {MENU_ITEMS.filter((item) => item.kind !== "panel" || item.id !== DISC_APP.id).map((item) => (
        <AppIcon
          key={getMenuItemId(item)}
          item={item}
          buttonRef={setMenuButtonRef(getMenuItemId(item))}
          isSelected={selectedMenuId === getMenuItemId(item)}
          onAppClick={onAppClick}
          onSelect={setSelectedMenuId}
        />
      ))}
    </div>
  );
}
