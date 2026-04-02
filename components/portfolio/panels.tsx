"use client";

import { FileText, Globe, Mail, Moon, Music, Search, Settings, ShoppingBag, Sun } from "lucide-react";
import { motion } from "motion/react";
import {
  DEFAULT_LAUNCH_ANIMATION_DURATION,
  EQUALIZER_DURATIONS,
  FOCUS_AREAS,
  GAME_PROJECTS,
  LAUNCH_ANIMATION_SPEED_OPTIONS,
  PROFILE,
  RESEARCH_PROJECTS,
  RESOURCE_LINKS,
  RESUME_PREVIEW_URL,
  RESUME_VIEW_URL,
  SHOWREEL_ITEMS,
} from "@/components/portfolio/data";
import {
  ExternalAction,
  ProfileAvatar,
  ProjectCard,
  ResourceGrid,
  ResourceRows,
} from "@/components/portfolio/common";
import type { AppRenderOptions, ScreenId, ThemeMode } from "@/components/portfolio/types";

function StatCard({
  label,
  value,
  note,
  valueClassName,
}: {
  label: string;
  value: number | string;
  note: string;
  valueClassName: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="text-sm font-black tracking-[0.25em] text-gray-400 uppercase dark:text-gray-500">{label}</div>
      <div className={`mt-3 text-5xl font-black ${valueClassName}`}>{value}</div>
      <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">{note}</p>
    </div>
  );
}

function ThemeOptionButton({
  label,
  icon: Icon,
  isActive,
  value,
  onSelect,
}: {
  label: string;
  icon: typeof Sun;
  isActive: boolean;
  value: ThemeMode;
  onSelect: (value: ThemeMode) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-[1.25rem] border px-4 py-4 text-left shadow-sm transition-all ${
        isActive
          ? "border-sky-400 bg-sky-500 text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-sky-300 hover:bg-sky-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-sky-500 dark:hover:bg-sky-900/20"
      }`}
    >
      <Icon className="mb-3 h-5 w-5" />
      <div className="font-black">{label}</div>
    </button>
  );
}

function QuickLaunchCard({
  accent,
  description,
  label,
  title,
  onClick,
}: {
  accent: string;
  description: string;
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.5rem] border border-gray-100 bg-gradient-to-br p-5 text-left shadow-sm transition-transform hover:-translate-y-1 dark:border-gray-700 ${accent}`}
    >
      <div className="text-sm font-black tracking-[0.25em] uppercase">{label}</div>
      <div className="mt-2 text-xl font-black text-gray-800 dark:text-gray-100">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{description}</p>
    </button>
  );
}

export function PortfolioPanels({
  id,
  options: {
    launchAnimationDuration,
    launchAnimationEnabled,
    onLaunchApp,
    rememberPreferences,
    setLaunchAnimationEnabled,
    setLaunchAnimationDuration,
    setRememberPreferences,
    setThemeMode,
    themeMode,
    themeReady,
  },
}: {
  id: ScreenId;
  options: AppRenderOptions;
}) {
  switch (id) {
    case "disc":
      return (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-8 w-full max-w-[17rem] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] dark:border-gray-900 dark:bg-gray-800"
          >
            <ProfileAvatar alt="Bao Chua portrait" image={PROFILE.image} size={320} />
          </motion.div>
          <h2 className="mb-4 text-4xl font-black text-gray-800 dark:text-gray-100">Bao&apos;s Portfolio</h2>
          <p className="mb-3 text-lg font-bold text-sky-600 dark:text-sky-300">{PROFILE.role}</p>
          <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {PROFILE.intro} {PROFILE.summary}
          </p>
          <button
            type="button"
            onClick={() => onLaunchApp("about")}
            className="animate-pulse rounded-full bg-blue-500 px-16 py-4 text-3xl font-black text-white shadow-[0_8px_0_#1d4ed8] transition-all hover:translate-y-1 hover:shadow-[0_6px_0_#1d4ed8] active:translate-y-2 active:shadow-none"
          >
            START
          </button>
        </div>
      );
    case "about":
      return (
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-7">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-7">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-7">
              <div className="overflow-hidden rounded-[1.5rem] border-4 border-white shadow-lg dark:border-gray-900">
                <ProfileAvatar alt="Bao Chua portrait" image={PROFILE.image} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
              <p className="mb-2 text-sm font-black tracking-[0.35em] text-green-500 uppercase dark:text-green-300">Profile</p>
              <h3 className="mb-2 text-3xl font-black text-gray-800 dark:text-gray-100">{PROFILE.name}</h3>
              <p className="mb-5 text-xl font-bold text-gray-500 dark:text-gray-400">{PROFILE.role}</p>
              <p className="mb-3 text-lg leading-relaxed text-gray-600 dark:text-gray-300">{PROFILE.intro}</p>
              <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">{PROFILE.summary}</p>

              <div className="mb-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  RMIT Vietnam
                </span>
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                  Game Design Program
                </span>
                <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-black text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  Portfolio Source: Carrd
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onLaunchApp("experience")}
                  className="rounded-full bg-green-500 px-5 py-3 text-sm font-black text-white shadow-md transition-transform hover:-translate-y-0.5"
                >
                  Open Games
                </button>
                <button
                  type="button"
                  onClick={() => onLaunchApp("miiverse")}
                  className="rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-md transition-transform hover:-translate-y-0.5"
                >
                  Open Research
                </button>
                <button
                  type="button"
                  onClick={() => onLaunchApp("contact")}
                  className="rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-yellow-900 shadow-md transition-transform hover:-translate-y-0.5"
                >
                  Contact Info
                </button>
              </div>
            </div>
          </div>

          <ResourceGrid resources={RESOURCE_LINKS} onOpenApp={onLaunchApp} />
        </div>
      );
    case "skills":
      return (
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-7">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Games"
              value={GAME_PROJECTS.length}
              note="Playable projects"
              valueClassName="text-blue-500 dark:text-blue-300"
            />
            <StatCard
              label="Research"
              value={RESEARCH_PROJECTS.length}
              note="Research projects"
              valueClassName="text-green-500 dark:text-green-300"
            />
            <StatCard
              label="Animation"
              value={launchAnimationEnabled ? `${launchAnimationDuration.toFixed(1)}s` : "Off"}
              note={launchAnimationEnabled ? "Launch animation speed" : "Launch screen disabled"}
              valueClassName="text-orange-500 dark:text-orange-300"
            />
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
                <Settings className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">Site Settings</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Appearance controls live here, and motion settings can optionally be remembered in this browser.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-black tracking-[0.25em] text-gray-400 uppercase dark:text-gray-500">Theme</div>
                    <div className="mt-1 text-xl font-black text-gray-800 dark:text-gray-100">Website Theme</div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Choose how the site should look by default.
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-black tracking-[0.18em] text-gray-500 uppercase shadow-sm dark:bg-gray-800 dark:text-gray-400">
                    {themeReady ? themeMode : "Loading"}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <ThemeOptionButton
                    label="Light"
                    icon={Sun}
                    isActive={themeReady && themeMode === "light"}
                    value="light"
                    onSelect={setThemeMode}
                  />
                  <ThemeOptionButton
                    label="Dark"
                    icon={Moon}
                    isActive={themeReady && themeMode === "dark"}
                    value="dark"
                    onSelect={setThemeMode}
                  />
                  <ThemeOptionButton
                    label="System"
                    icon={Settings}
                    isActive={themeReady && themeMode === "system"}
                    value="system"
                    onSelect={setThemeMode}
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-black tracking-[0.25em] text-gray-400 uppercase dark:text-gray-500">Motion</div>
                    <div className="mt-1 text-xl font-black text-gray-800 dark:text-gray-100">Launch Animation</div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enabled by default. Apps open with the splash/loading animation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLaunchAnimationEnabled(!launchAnimationEnabled)}
                    className={`relative inline-flex h-12 w-24 items-center rounded-full px-2 transition-colors ${
                      launchAnimationEnabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    aria-pressed={launchAnimationEnabled}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-[0.65rem] font-black uppercase text-gray-500 shadow-md transition-transform ${
                        launchAnimationEnabled ? "translate-x-12" : "translate-x-0"
                      }`}
                    >
                      {launchAnimationEnabled ? "On" : "Off"}
                    </span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-black tracking-[0.25em] text-gray-400 uppercase dark:text-gray-500">Speed</div>
                      <div className="mt-1 text-lg font-black text-gray-800 dark:text-gray-100">Animation Duration</div>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-black tracking-[0.18em] text-gray-500 uppercase shadow-sm dark:bg-gray-800 dark:text-gray-400">
                      {launchAnimationDuration.toFixed(1)}s
                    </div>
                  </div>

                  <div>
                    <input
                      type="range"
                      min={LAUNCH_ANIMATION_SPEED_OPTIONS[0]}
                      max={LAUNCH_ANIMATION_SPEED_OPTIONS[LAUNCH_ANIMATION_SPEED_OPTIONS.length - 1]}
                      step={0.5}
                      value={launchAnimationDuration}
                      onChange={(event) => setLaunchAnimationDuration(Number(event.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-sky-500 dark:bg-gray-700"
                      aria-label="Launch animation speed"
                    />
                    <div className="mt-3 flex justify-between text-xs font-black tracking-[0.16em] text-gray-400 uppercase dark:text-gray-500">
                      {LAUNCH_ANIMATION_SPEED_OPTIONS.map((speed) => (
                        <span key={speed}>{speed.toFixed(1)}s</span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setLaunchAnimationDuration(DEFAULT_LAUNCH_ANIMATION_DURATION)}
                      className="mt-3 text-sm font-black text-sky-600 transition-opacity hover:opacity-75 dark:text-sky-300"
                    >
                      Reset to 0.5s
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-black tracking-[0.25em] text-gray-400 uppercase dark:text-gray-500">Storage</div>
                    <div className="mt-1 text-xl font-black text-gray-800 dark:text-gray-100">Remember Preferences</div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Save your animation settings in this browser. Turn it off to keep changes for the current visit only.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRememberPreferences(!rememberPreferences)}
                    className={`relative inline-flex h-12 w-24 items-center rounded-full px-2 transition-colors ${
                      rememberPreferences ? "bg-sky-500" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    aria-pressed={rememberPreferences}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-[0.65rem] font-black uppercase text-gray-500 shadow-md transition-transform ${
                        rememberPreferences ? "translate-x-12" : "translate-x-0"
                      }`}
                    >
                      {rememberPreferences ? "On" : "Off"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <QuickLaunchCard
                  accent="from-blue-50 to-blue-100 text-blue-500 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300"
                  label="Games"
                  title="Playable Works"
                  description="Visual novel, FPS, puzzle, and first-person puzzle work."
                  onClick={() => onLaunchApp("experience")}
                />
                <QuickLaunchCard
                  accent="from-green-50 to-green-100 text-green-500 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300"
                  label="Research"
                  title="Archives And Studies"
                  description="Console culture, grotesque studies, and a video essay on R4 and DS access."
                  onClick={() => onLaunchApp("miiverse")}
                />
                <QuickLaunchCard
                  accent="from-orange-50 to-orange-100 text-orange-500 dark:from-orange-900/20 dark:to-orange-800/20 dark:text-orange-300"
                  label="Resume"
                  title="Open CV Viewer"
                  description="Read the CV directly inside the tablet frame."
                  onClick={() => onLaunchApp("github")}
                />
              </div>
            </div>
          </div>
        </div>
      );
    case "browser":
      return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900 sm:flex-nowrap sm:gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white font-bold text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                &lt;
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white font-bold text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                &gt;
              </button>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-1.5 dark:border-gray-600 dark:bg-gray-800">
              <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                readOnly
                value={PROFILE.site}
                className="w-full bg-transparent text-sm font-medium text-gray-600 outline-none dark:text-gray-300"
              />
            </div>
            <a
              href={PROFILE.site}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-cyan-500 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-cyan-600"
            >
              Open
            </a>
          </div>

          <div className="grid flex-1 gap-6 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800/50 sm:p-6 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-3">
                <Search className="h-6 w-6 text-cyan-500 dark:text-cyan-300" />
                <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">Portfolio Bookmarks</h3>
              </div>
              <ResourceRows resources={RESOURCE_LINKS} onOpenApp={onLaunchApp} />
            </div>

            <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-3">
                <Globe className="h-6 w-6 text-blue-500 dark:text-blue-300" />
                <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">Browse Inside The Console</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Open Games", note: `${GAME_PROJECTS.length} playable projects`, appId: "experience" as const },
                  { label: "Open Research", note: `${RESEARCH_PROJECTS.length} research projects`, appId: "miiverse" as const },
                  { label: "Open Showcase", note: "Project art and cover images", appId: "gallery" as const },
                  { label: "Open Contact", note: "Email, LinkedIn, resume, Itch.io", appId: "contact" as const },
                  { label: "Open CV Viewer", note: "Read the CV in the tablet frame", appId: "github" as const },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onLaunchApp(item.appId)}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-white dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-950"
                  >
                    <div>
                      <div className="font-black text-gray-800 dark:text-gray-100">{item.label}</div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.note}</div>
                    </div>
                    <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-black text-white">Open</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    case "contact":
      return (
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-7">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <Mail className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
            <h3 className="text-3xl font-black text-gray-800 dark:text-gray-100">Contact Information</h3>
            <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
              Email, resume, LinkedIn, Itch.io, and the original Carrd portfolio.
            </p>
          </div>

          <ResourceGrid resources={RESOURCE_LINKS} onOpenApp={onLaunchApp} />
        </div>
      );
    case "experience":
      return (
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-7">
          {GAME_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      );
    case "miiverse":
      return (
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-7">
          {RESEARCH_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      );
    case "awards":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.title}
              className="group flex flex-col rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-transform hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800"
            >
              <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-transform group-hover:rotate-12 ${area.bg}`}>
                <area.icon className={`h-10 w-10 ${area.color}`} />
              </div>
              <h4 className="mb-2 font-black text-gray-800 dark:text-gray-100">{area.title}</h4>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{area.description}</p>
            </div>
          ))}
        </div>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[...GAME_PROJECTS, ...RESEARCH_PROJECTS].map((project) => (
            <a
              key={project.id}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl border-4 border-white shadow-md dark:border-gray-800"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.72)), url("${project.image}")`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="text-[0.7rem] font-black tracking-[0.3em] uppercase text-white/70">{project.category}</div>
                <div className="mt-1 text-lg font-black leading-tight">{project.title}</div>
              </div>
            </a>
          ))}
        </div>
      );
    case "music":
      return (
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <div className="flex h-32 items-end justify-center gap-2">
              {EQUALIZER_DURATIONS.map((duration, index) => (
                <motion.div
                  key={duration}
                  className="w-4 rounded-t-full bg-teal-500 dark:bg-teal-400"
                  animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration,
                    delay: index * 0.05,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <h3 className="text-2xl font-black text-teal-700 dark:text-teal-300">Now Playing: Bao Chua Showreel</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                A rotating queue of the projects featured in the portfolio source.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {SHOWREEL_ITEMS.map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-[1.5rem] border border-gray-100 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-black text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="font-black text-gray-800 dark:text-gray-100">{item}</div>
                </div>
                <Music className="h-5 w-5 text-teal-400 dark:text-teal-500" />
              </div>
            ))}
          </div>
        </div>
      );
    case "github":
      return (
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-[320px_1fr]">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
                <FileText className="h-12 w-12 text-gray-800 dark:text-gray-200" />
              </div>
              <h3 className="mb-2 text-center text-2xl font-black text-gray-800 dark:text-gray-100">CV Viewer</h3>
              <p className="mb-6 text-center text-gray-500 dark:text-gray-400">{PROFILE.name}</p>

              <div className="mb-8 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-900">
                  <div className="text-xl font-black text-gray-800 dark:text-gray-100">{GAME_PROJECTS.length}</div>
                  <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Games</div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-900">
                  <div className="text-xl font-black text-gray-800 dark:text-gray-100">{RESEARCH_PROJECTS.length}</div>
                  <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Research</div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-900">
                  <div className="text-xl font-black text-gray-800 dark:text-gray-100">{RESOURCE_LINKS.length}</div>
                  <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Links</div>
                </div>
              </div>

              <div className="space-y-3">
                <ExternalAction
                  href={RESUME_VIEW_URL}
                  label="Open In New Tab"
                  className="w-full bg-gray-900 py-4 text-white dark:bg-gray-100 dark:text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => onLaunchApp("contact")}
                  className="w-full rounded-xl bg-sky-500 py-4 text-sm font-black text-white shadow-md transition-colors hover:bg-sky-600"
                >
                  Contact And Links
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div className="text-sm font-black tracking-[0.25em] text-gray-400 uppercase dark:text-gray-500">Embedded PDF</div>
                <div className="mt-1 text-2xl font-black text-gray-800 dark:text-gray-100">Bao Chua CV</div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  In-browser Google Drive preview. If it fails to load, use the external open button.
                </p>
              </div>
              <iframe
                src={RESUME_PREVIEW_URL}
                title="Bao Chua CV preview"
                className="h-[60vh] w-full bg-gray-100 dark:bg-gray-900 sm:h-[70vh]"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      );
    case "friends":
      return (
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between bg-orange-500 p-4 text-lg font-bold text-white">
            <span>Network</span>
            <span className="rounded-full bg-orange-600 px-3 py-1 text-sm">{RESOURCE_LINKS.length} Channels</span>
          </div>
          <div className="p-4">
            <ResourceRows resources={RESOURCE_LINKS} onOpenApp={onLaunchApp} />
          </div>
        </div>
      );
    case "eshop":
      return (
        <div className="mx-auto max-w-2xl rounded-3xl border-4 border-orange-100 bg-white p-8 text-center shadow-lg dark:border-orange-900 dark:bg-gray-800">
          <ShoppingBag className="mx-auto mb-4 h-20 w-20 text-orange-500" />
          <h2 className="mb-2 text-4xl font-black text-gray-800 dark:text-gray-100">Portfolio Kit</h2>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Everything linked from Bao Chua&apos;s Carrd portfolio, packaged inside the current Wii U interface.
          </p>
          <div className="mb-8 rounded-2xl bg-orange-50 p-6 dark:bg-orange-900/30">
            <div className="mb-4 flex items-center justify-between border-b border-orange-200 pb-4 dark:border-orange-800">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">Playable Games</span>
              <span className="font-black text-orange-600 dark:text-orange-400">{GAME_PROJECTS.length}</span>
            </div>
            <div className="mb-4 flex items-center justify-between border-b border-orange-200 pb-4 dark:border-orange-800">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">Research Projects</span>
              <span className="font-black text-orange-600 dark:text-orange-400">{RESEARCH_PROJECTS.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">External Resources</span>
              <span className="font-black text-orange-600 dark:text-orange-400">{RESOURCE_LINKS.length}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => onLaunchApp("github")}
              className="rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-12 py-4 text-2xl font-black text-white shadow-[0_6px_0_#c2410c] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_#c2410c] active:translate-y-2 active:shadow-none"
            >
              Open Resume
            </button>
            <ExternalAction href={RESUME_VIEW_URL} label="Open In New Tab" className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900" />
          </div>
        </div>
      );
    default:
      return (
        <div className="flex h-full flex-col items-center justify-center text-lg font-bold text-gray-500">
          <Settings className="animate-spin-slow mb-4 h-16 w-16 opacity-50" />
          <p>Under Construction</p>
        </div>
      );
  }
}
