"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Moon, Sun, User } from "lucide-react";
import { motion } from "motion/react";
import { MII_DATA } from "@/components/portfolio/data";
import type { AppId, Project, ResourceLink } from "@/components/portfolio/types";

export function WaraWaraPlaza() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
      {MII_DATA.map((mii) => (
        <motion.div
          key={mii.id}
          className="absolute flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
          initial={{ left: "-10%", top: `${mii.y}%` }}
          animate={{
            left: "110%",
            top: [`${mii.y}%`, `${mii.y + 10}%`, `${mii.y - 10}%`, `${mii.y}%`],
          }}
          transition={{
            left: { repeat: Number.POSITIVE_INFINITY, duration: mii.duration, delay: mii.delay, ease: "linear" },
            top: { repeat: Number.POSITIVE_INFINITY, duration: mii.duration / 2, ease: "easeInOut" },
          }}
          style={{ transform: `scale(${mii.scale})` }}
        >
          <User className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </motion.div>
      ))}
    </div>
  );
}

export function ThemeToggle({
  isDark,
  mounted,
  onToggle,
}: {
  isDark: boolean;
  mounted: boolean;
  onToggle: () => void;
}) {
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={onToggle}
      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100 shadow-inner transition-colors dark:border-gray-600 dark:bg-gray-800 md:h-12 md:w-12"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-5 w-5 text-yellow-400 md:h-6 md:w-6" /> : <Moon className="h-5 w-5 text-gray-400 md:h-6 md:w-6" />}
    </button>
  );
}

export function ExternalAction({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black shadow-md transition-transform hover:-translate-y-0.5 ${className ?? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"}`}
    >
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div
        className="relative h-52 bg-cover bg-center sm:h-60"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.78), rgba(15,23,42,0.25)), url("${project.image}")`,
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <p className="mb-2 text-xs font-black tracking-[0.35em] uppercase text-white/70">{project.category}</p>
          <h3 className="text-3xl font-black leading-tight drop-shadow-sm">{project.title}</h3>
        </div>
      </div>

      <div className="space-y-5 p-6 sm:p-7">
        <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[1.05rem]">{project.description}</p>
        <div className="flex flex-wrap gap-3">
          {project.playHref ? (
            <Link
              href={project.playHref}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-md transition-transform hover:-translate-y-0.5"
            >
              Play In Browser
            </Link>
          ) : null}
          <ExternalAction
            href={project.href}
            label={project.actionLabel}
            className={project.playHref ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900" : "bg-gradient-to-r from-sky-500 to-blue-600 text-white"}
          />
        </div>
      </div>
    </div>
  );
}

function ResourcePrimaryAction({
  resource,
  onOpenApp,
  compact = false,
}: {
  resource: ResourceLink;
  onOpenApp?: (appId: AppId) => void;
  compact?: boolean;
}) {
  const content = (
    <>
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${resource.color} shadow-md`}>
        <resource.icon className="h-7 w-7 text-white" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="font-black text-gray-800 dark:text-gray-100">{resource.label}</div>
        <div className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{resource.note}</div>
      </div>
    </>
  );

  if (resource.appId && onOpenApp) {
    return (
      <button
        type="button"
        onClick={() => onOpenApp(resource.appId!)}
        className={`flex min-w-0 flex-1 items-start gap-4 ${compact ? "items-center" : ""}`}
      >
        {content}
      </button>
    );
  }

  return (
    <a href={resource.href} target="_blank" rel="noreferrer" className={`flex min-w-0 flex-1 items-start gap-4 ${compact ? "items-center" : ""}`}>
      {content}
    </a>
  );
}

function ResourceExternalButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Open external link in new tab"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600"
    >
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export function ResourceGrid({
  resources,
  onOpenApp,
}: {
  resources: ResourceLink[];
  onOpenApp?: (appId: AppId) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="group flex items-start gap-4 rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800 sm:p-6"
        >
          <ResourcePrimaryAction resource={resource} onOpenApp={onOpenApp} />
          <ResourceExternalButton href={resource.href} />
        </div>
      ))}
    </div>
  );
}

export function ResourceRows({
  resources,
  onOpenApp,
}: {
  resources: ResourceLink[];
  onOpenApp?: (appId: AppId) => void;
}) {
  return (
    <div className="space-y-3">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:bg-white dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-950"
        >
          <ResourcePrimaryAction resource={resource} onOpenApp={onOpenApp} compact />
          <ResourceExternalButton href={resource.href} />
        </div>
      ))}
    </div>
  );
}

export function ProfileAvatar({
  alt,
  image,
  size = 240,
}: {
  alt: string;
  image: string;
  size?: number;
}) {
  return <Image src={image} alt={alt} width={size} height={size} className="h-auto w-full object-cover" priority={size >= 200} />;
}
