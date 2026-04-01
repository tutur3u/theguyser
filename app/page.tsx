"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  BatteryFull,
  Briefcase,
  Code,
  Gamepad2,
  Globe,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Moon,
  Music,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Sun,
  User,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

type AppId =
  | "about"
  | "skills"
  | "browser"
  | "contact"
  | "experience"
  | "miiverse"
  | "awards"
  | "gallery"
  | "music"
  | "github"
  | "friends"
  | "eshop";

type ScreenId = AppId | "disc";

type AppDefinition = {
  id: ScreenId;
  title: string;
  icon: LucideIcon;
  color: string;
  size: string;
};

const APPS: AppDefinition[] = [
  {
    id: "about",
    title: "Mii Maker",
    icon: User,
    color: "bg-gradient-to-b from-[#4ade80] to-[#16a34a]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "skills",
    title: "Settings",
    icon: Settings,
    color: "bg-gradient-to-b from-[#9ca3af] to-[#4b5563]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "browser",
    title: "Internet",
    icon: Globe,
    color: "bg-gradient-to-b from-[#67e8f9] to-[#0891b2]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "contact",
    title: "Messages",
    icon: Mail,
    color: "bg-gradient-to-b from-[#fde047] to-[#ca8a04]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "experience",
    title: "Activity Log",
    icon: Briefcase,
    color: "bg-gradient-to-b from-[#a78bfa] to-[#7c3aed]",
    size: "col-span-2 row-span-1",
  },
  {
    id: "miiverse",
    title: "Miiverse",
    icon: MessageSquare,
    color: "bg-gradient-to-b from-[#86efac] to-[#22c55e]",
    size: "col-span-2 row-span-1",
  },
  {
    id: "awards",
    title: "Trophies",
    icon: Award,
    color: "bg-gradient-to-b from-[#fb923c] to-[#ea580c]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "gallery",
    title: "Photos",
    icon: ImageIcon,
    color: "bg-gradient-to-b from-[#f472b6] to-[#db2777]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "music",
    title: "Sound",
    icon: Music,
    color: "bg-gradient-to-b from-[#2dd4bf] to-[#0d9488]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "github",
    title: "GitHub",
    icon: Code,
    color: "bg-gradient-to-b from-[#374151] to-[#111827]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "friends",
    title: "Friends",
    icon: Users,
    color: "bg-gradient-to-b from-[#fdba74] to-[#ea580c]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "eshop",
    title: "eShop",
    icon: ShoppingBag,
    color: "bg-gradient-to-b from-[#fca5a5] to-[#dc2626]",
    size: "col-span-1 row-span-1",
  },
];

const DISC_APP: AppDefinition = {
  id: "disc",
  title: "Super Portfolio 3D",
  icon: Gamepad2,
  color: "bg-blue-500",
  size: "col-span-2 row-span-2",
};

const MII_DATA = [
  { id: 1, y: 10, delay: 0, duration: 20, scale: 0.8 },
  { id: 2, y: 30, delay: 5, duration: 25, scale: 0.6 },
  { id: 3, y: 60, delay: 2, duration: 18, scale: 0.9 },
  { id: 4, y: 80, delay: 8, duration: 22, scale: 0.7 },
  { id: 5, y: 20, delay: 12, duration: 28, scale: 0.5 },
  { id: 6, y: 50, delay: 15, duration: 19, scale: 1.0 },
  { id: 7, y: 70, delay: 3, duration: 24, scale: 0.85 },
  { id: 8, y: 90, delay: 10, duration: 21, scale: 0.65 },
];

const EQUALIZER_DURATIONS = [1.1, 1.4, 1.7, 1.25, 1.6, 1.2, 1.5, 1.35, 1.8, 1.45];

function WaraWaraPlaza() {
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

function DiscChannel({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative col-span-2 row-span-2">
      <button
        onClick={onClick}
        className="nintendo-channel channel-shine group relative flex h-full w-full items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/disc/400/400')] bg-cover bg-center opacity-20 transition-opacity group-hover:opacity-40" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "linear" }}
          className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-8 border-gray-800 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 shadow-2xl md:h-40 md:w-40"
        >
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/galaxy/400/400')] bg-cover opacity-50 mix-blend-overlay" />
          <div className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 bg-gradient-to-tr from-transparent via-white/40 to-transparent" />
          <div className="z-10 h-8 w-8 rounded-full border-4 border-gray-800 bg-gray-200 shadow-inner dark:bg-gray-700" />
        </motion.div>

        <div className="absolute right-0 bottom-3 left-0 text-center">
          <span className="rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-sm font-black text-white backdrop-blur-md">
            Play Portfolio
          </span>
        </div>
      </button>
    </div>
  );
}

function AppIcon({
  app,
  onClick,
}: {
  app: AppDefinition;
  onClick: (app: AppDefinition) => void;
}) {
  return (
    <div className={`relative ${app.size}`}>
      <button
        onClick={() => onClick(app)}
        className={`nintendo-channel channel-shine group relative h-full w-full overflow-hidden rounded-[24px] ${app.color}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8)_0%,transparent_60%)] opacity-50" />

        <div className="relative z-20 flex h-full w-full flex-col items-center justify-center p-2">
          <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }} transition={{ duration: 0.5 }}>
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

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100 shadow-inner transition-colors dark:border-gray-600 dark:bg-gray-800 md:h-12 md:w-12"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400 md:h-6 md:w-6" />
      ) : (
        <Moon className="h-5 w-5 text-gray-400 md:h-6 md:w-6" />
      )}
    </button>
  );
}

function renderAppContent(id: ScreenId, onLaunchApp: (appId: AppId) => void) {
  switch (id) {
    case "disc":
      return (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" }}
            className="relative mb-8 flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-[12px] border-gray-800 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 shadow-2xl dark:border-gray-900"
          >
            <div className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 bg-gradient-to-tr from-transparent via-white/40 to-transparent" />
            <div className="z-10 h-12 w-12 rounded-full border-4 border-gray-800 bg-white shadow-inner dark:border-gray-900 dark:bg-gray-200" />
          </motion.div>
          <h2 className="mb-4 text-4xl font-black text-gray-800 dark:text-gray-100">Super Portfolio 3D</h2>
          <p className="mb-8 max-w-lg text-xl text-gray-600 dark:text-gray-300">
            Press START to explore featured projects, experiments, and playful interface ideas.
          </p>
          <button
            onClick={() => onLaunchApp("experience")}
            className="animate-pulse rounded-full bg-blue-500 px-16 py-4 text-3xl font-black text-white shadow-[0_8px_0_#1d4ed8] transition-all hover:translate-y-1 hover:shadow-[0_6px_0_#1d4ed8] active:translate-y-2 active:shadow-none"
          >
            START
          </button>
        </div>
      );
    case "eshop":
      return (
        <div className="mx-auto max-w-2xl rounded-3xl border-4 border-orange-100 bg-white p-8 text-center shadow-lg dark:border-orange-900 dark:bg-gray-800">
          <ShoppingBag className="mx-auto mb-4 h-20 w-20 text-orange-500" />
          <h2 className="mb-2 text-4xl font-black text-gray-800 dark:text-gray-100">Hire Me!</h2>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">Add this developer to your team&apos;s library.</p>
          <div className="mb-8 rounded-2xl bg-orange-50 p-6 dark:bg-orange-900/30">
            <div className="mb-4 flex items-center justify-between border-b border-orange-200 pb-4 dark:border-orange-800">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">Frontend Skills</span>
              <span className="font-black text-orange-600 dark:text-orange-400">Included</span>
            </div>
            <div className="mb-4 flex items-center justify-between border-b border-orange-200 pb-4 dark:border-orange-800">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">UI/UX Design</span>
              <span className="font-black text-orange-600 dark:text-orange-400">Included</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">Passion &amp; Creativity</span>
              <span className="font-black text-orange-600 dark:text-orange-400">Included</span>
            </div>
          </div>
          <button
            onClick={(event) => {
              const button = event.currentTarget;
              button.textContent = "Downloading...";
              button.classList.add("animate-pulse");
              window.setTimeout(() => {
                button.textContent = "Downloaded!";
                button.classList.remove("animate-pulse");
                button.classList.replace("from-orange-400", "from-green-400");
                button.classList.replace("to-orange-500", "to-green-500");
                button.classList.replace("shadow-[0_6px_0_#c2410c]", "shadow-[0_6px_0_#15803d]");
              }, 2000);
            }}
            className="rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-12 py-4 text-2xl font-black text-white shadow-[0_6px_0_#c2410c] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_#c2410c] active:translate-y-2 active:shadow-none"
          >
            Download Now (Free)
          </button>
        </div>
      );
    case "music":
      return (
        <div className="flex h-full flex-col items-center justify-center space-y-8">
          <div className="flex h-32 items-end gap-2">
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
          <h3 className="text-2xl font-black text-teal-700 dark:text-teal-300">Now Playing: Portfolio Theme</h3>
          <div className="mt-8 flex items-center gap-6">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(event) => {
                const button = event.currentTarget;
                button.classList.toggle("playing");
                if (button.classList.contains("playing")) {
                  button.innerHTML =
                    '<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                } else {
                  button.innerHTML =
                    '<svg class="ml-1 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                }
              }}
              className="playing flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition-colors hover:bg-teal-600"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      );
    case "about":
      return (
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg dark:border-gray-800 dark:bg-gray-700">
            <User className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">Hello, I&apos;m a Developer</h3>
            <p className="mx-auto max-w-md text-gray-600 dark:text-gray-300">
              I build playful, interactive web experiences with a strong eye for motion, layout, and memorable UI.
            </p>
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Level</div>
              <div className="text-2xl font-black text-green-500 dark:text-green-400">99</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Class</div>
              <div className="text-2xl font-black text-blue-500 dark:text-blue-400">Developer</div>
            </div>
          </div>
        </div>
      );
    case "skills":
      return (
        <div className="mx-auto max-w-2xl space-y-6">
          {[
            { name: "React / Next.js", level: 90, color: "bg-blue-500" },
            { name: "TypeScript", level: 85, color: "bg-blue-600" },
            { name: "Tailwind CSS", level: 95, color: "bg-teal-500" },
            { name: "Node.js", level: 75, color: "bg-green-500" },
            { name: "UI/UX Design", level: 80, color: "bg-purple-500" },
          ].map((skill) => (
            <div key={skill.name} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-2 flex justify-between font-bold text-gray-700 dark:text-gray-200">
                <span>{skill.name}</span>
                <span>Lv. {Math.floor(skill.level / 10)}</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-gray-100 shadow-inner dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full rounded-full ${skill.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      );
    case "experience":
      return (
        <div className="relative mx-auto max-w-3xl py-8">
          <div className="absolute top-0 bottom-0 left-8 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          {[
            { year: "2023 - Present", title: "Senior Frontend Engineer", company: "Tech Corp", desc: "Building playful, high-polish interfaces." },
            { year: "2020 - 2023", title: "Web Developer", company: "Digital Agency", desc: "Delivered responsive marketing sites and product launches." },
            { year: "2018 - 2020", title: "Junior Developer", company: "Startup Inc", desc: "Built features fast and learned the fundamentals." },
          ].map((job) => (
            <div key={job.year} className="group relative mb-12 pl-20">
              <div className="absolute top-1 left-5 z-10 h-8 w-8 rounded-full border-4 border-purple-500 bg-white shadow-md transition-transform group-hover:scale-125 dark:border-purple-400 dark:bg-gray-800" />
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors group-hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:group-hover:border-purple-500">
                <span className="mb-2 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {job.year}
                </span>
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{job.title}</h4>
                <h5 className="mb-3 text-lg font-semibold text-gray-500 dark:text-gray-400">{job.company}</h5>
                <p className="text-gray-600 dark:text-gray-300">{job.desc}</p>
              </div>
            </div>
          ))}
        </div>
      );
    case "contact":
      return (
        <div className="mx-auto max-w-xl rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-8 text-center">
            <Mail className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Send a Message</h3>
            <p className="text-gray-500 dark:text-gray-400">Like adding a friend on the Wii Network.</p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const button = event.currentTarget.querySelector<HTMLButtonElement>("button");
              if (!button) {
                return;
              }

              button.textContent = "Sending...";
              button.classList.add("animate-pulse");

              window.setTimeout(() => {
                button.textContent = "Message Sent!";
                button.classList.remove("animate-pulse");
                button.classList.replace("bg-yellow-400", "bg-green-400");
                button.classList.replace("hover:bg-yellow-500", "hover:bg-green-500");
                button.classList.replace("text-yellow-900", "text-green-900");
              }, 1500);
            }}
          >
            <div>
              <label className="mb-1 block pl-2 text-sm font-bold text-gray-700 dark:text-gray-300">Your Name (Mii Name)</label>
              <input
                type="text"
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-medium transition-colors focus:border-yellow-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-yellow-500 dark:focus:bg-gray-800"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="mb-1 block pl-2 text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-medium transition-colors focus:border-yellow-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-yellow-500 dark:focus:bg-gray-800"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="mb-1 block pl-2 text-sm font-bold text-gray-700 dark:text-gray-300">Message</label>
              <textarea
                rows={4}
                className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-medium transition-colors focus:border-yellow-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-yellow-500 dark:focus:bg-gray-800"
                placeholder="Write your message here..."
              />
            </div>
            <button className="w-full rounded-xl bg-yellow-400 py-4 text-lg font-bold text-yellow-900 shadow-md transition-all hover:bg-yellow-500 hover:shadow-lg active:scale-95">
              Send Message
            </button>
          </form>
        </div>
      );
    case "miiverse":
      return (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
                <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">Recruiter</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">2 hours ago</div>
              </div>
            </div>
            <div className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6 text-lg font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <div className="absolute top-[-0.75rem] left-8 h-6 w-6 rotate-45 border-t border-l border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900" />
              &quot;This portfolio is incredibly creative. We should definitely schedule an interview.&quot;
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-700">
              <button
                onClick={(event) => {
                  const likes = event.currentTarget.querySelector("span:last-child");
                  if (!likes?.textContent) {
                    return;
                  }

                  const current = Number.parseInt(likes.textContent.replace(/,/g, ""), 10);
                  likes.textContent = (current + 1).toLocaleString();
                  event.currentTarget.classList.add("scale-110");
                  window.setTimeout(() => event.currentTarget.classList.remove("scale-110"), 200);
                }}
                className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 font-bold text-green-500 transition-all hover:text-green-600 dark:bg-green-900/30"
              >
                <span className="text-xl">Yeah!</span>
                <span className="rounded-full bg-green-500 px-2 py-0.5 text-sm text-white">9,001</span>
              </button>
              <button className="flex items-center gap-2 font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <MessageSquare className="h-5 w-5" />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      );
    case "browser":
      return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4 border-b border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white font-bold text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                &lt;
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white font-bold text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                &gt;
              </button>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-1.5 dark:border-gray-600 dark:bg-gray-800">
              <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                defaultValue="https://github.com/yourusername"
                className="w-full bg-transparent text-sm font-medium text-gray-600 outline-none dark:text-gray-300"
              />
            </div>
            <button className="rounded-full bg-cyan-500 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-cyan-600">
              Search
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center bg-gray-50 p-8 text-center dark:bg-gray-800/50">
            <div>
              <Search className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
              <h3 className="mb-2 text-xl font-bold text-gray-700 dark:text-gray-200">Internet Browser</h3>
              <p className="max-w-md text-gray-500 dark:text-gray-400">
                Check out the GitHub profile behind this portfolio to see more UI experiments and code.
              </p>
              <a
                href="#"
                className="mt-6 inline-block rounded-full bg-gray-800 px-8 py-3 font-bold text-white shadow-md transition-colors hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Open GitHub
              </a>
            </div>
          </div>
        </div>
      );
    case "awards":
      return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {[
            { title: "First Commit", desc: "Started the coding journey.", icon: Star, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
            { title: "Bug Squasher", desc: "Fixed 100+ bugs.", icon: Award, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
            { title: "Speed Demon", desc: "Optimized load times by 50%.", icon: BatteryFull, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
            { title: "Pixel Perfect", desc: "Nailed the CSS styling.", icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
          ].map((award) => (
            <div
              key={award.title}
              className="group flex cursor-pointer flex-col items-center rounded-[2rem] border border-gray-100 bg-white p-6 text-center shadow-sm transition-transform hover:scale-105 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-transform group-hover:rotate-12 ${award.bg}`}>
                <award.icon className={`h-10 w-10 ${award.color}`} />
              </div>
              <h4 className="mb-1 font-bold text-gray-800 dark:text-gray-100">{award.title}</h4>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{award.desc}</p>
            </div>
          ))}
        </div>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-4 border-white shadow-md dark:border-gray-800"
            >
              <Image
                src={`https://picsum.photos/seed/gallery${item}/400/400`}
                alt={`Gallery image ${item}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </div>
          ))}
        </div>
      );
    case "github":
      return (
        <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center">
          <div className="w-full rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
              <Code className="h-12 w-12 text-gray-800 dark:text-gray-200" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">Developer Profile</h3>
            <p className="mb-6 text-gray-500 dark:text-gray-400">Level 99 Coder</p>

            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                <div className="text-xl font-black text-gray-800 dark:text-gray-100">42</div>
                <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Repos</div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                <div className="text-xl font-black text-gray-800 dark:text-gray-100">1k</div>
                <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Stars</div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                <div className="text-xl font-black text-gray-800 dark:text-gray-100">300</div>
                <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Followers</div>
              </div>
            </div>

            <a
              href="#"
              className="block w-full rounded-xl bg-gray-900 py-4 font-bold text-white shadow-md transition-colors hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              View on GitHub
            </a>
          </div>
        </div>
      );
    case "friends":
      return (
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between bg-orange-500 p-4 text-lg font-bold text-white">
            <span>Friend List</span>
            <div className="flex items-center gap-4">
              <button
                onClick={(event) => {
                  const button = event.currentTarget;
                  button.textContent = "Added!";
                  button.classList.add("bg-green-500");
                  button.classList.remove("bg-orange-600", "hover:bg-orange-700");
                  window.setTimeout(() => {
                    button.textContent = "Add Friend";
                    button.classList.remove("bg-green-500");
                    button.classList.add("bg-orange-600", "hover:bg-orange-700");
                  }, 2000);
                }}
                className="rounded-full bg-orange-600 px-3 py-1 text-sm transition-colors hover:bg-orange-700"
              >
                Add Friend
              </button>
              <span className="rounded-full bg-orange-600 px-3 py-1 text-sm">3 Online</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[
              { name: "Mario", status: "Playing Super Mario Maker", online: true, color: "bg-red-500" },
              { name: "Link", status: "Exploring Hyrule", online: true, color: "bg-green-500" },
              { name: "Samus", status: "Online", online: true, color: "bg-orange-500" },
              { name: "Kirby", status: "Offline", online: false, color: "bg-pink-400" },
              { name: "Fox", status: "Offline", online: false, color: "bg-blue-500" },
            ].map((friend) => (
              <div key={friend.name} className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="relative">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white shadow-sm dark:border-gray-800 ${friend.color}`}>
                    <User className="h-6 w-6 text-white" />
                  </div>
                  {friend.online ? (
                    <div className="absolute right-[-0.25rem] bottom-[-0.25rem] h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 dark:text-gray-100">{friend.name}</div>
                  <div className={`text-sm font-medium ${friend.online ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
                    {friend.status}
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
              </div>
            ))}
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

export default function PortfolioPage() {
  const [activeApp, setActiveApp] = useState<AppDefinition | null>(null);
  const [launchingApp, setLaunchingApp] = useState<AppDefinition | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleAppClick = (app: AppDefinition) => {
    setLaunchingApp(app);
    window.setTimeout(() => {
      setActiveApp(app);
      setLaunchingApp(null);
    }, 1500);
  };

  return (
    <main className="wii-bg relative flex min-h-screen flex-col overflow-hidden">
      <WaraWaraPlaza />

      <header className="sticky top-0 z-10 mx-2 flex items-center justify-between rounded-b-[2rem] border-b border-gray-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80 md:mx-6 md:px-8 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100 shadow-inner dark:border-gray-600 dark:bg-gray-800 md:h-12 md:w-12">
            <User className="h-6 w-6 text-gray-400 dark:text-gray-500 md:h-8 md:w-8" />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200 md:text-base">Guest</span>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center md:flex">
          <span className="rounded-full border border-gray-200 bg-gray-100 px-8 py-1.5 text-sm font-black tracking-widest text-gray-500 uppercase shadow-inner dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Wii U Menu
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-300 md:gap-6 md:text-base">
          <ThemeToggle />
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

      <div className="z-10 flex flex-1 items-center justify-center p-4 pb-24 md:p-8">
        <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-6 md:gap-6">
          <DiscChannel onClick={() => handleAppClick(DISC_APP)} />
          {APPS.map((app) => (
            <AppIcon key={app.id} app={app} onClick={handleAppClick} />
          ))}
        </div>
      </div>

      <footer className="fixed right-4 bottom-4 left-4 z-10 hidden items-center justify-between rounded-full border border-gray-200 bg-white/80 px-8 py-3 shadow-md backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80 md:flex">
        <div className="flex gap-8">
          <div className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-xs font-black text-gray-500 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
              Y
            </div>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Edit</span>
          </div>
          <div className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-xs font-black text-gray-500 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
              -
            </div>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Details</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-3.5 w-3.5 rounded-full bg-blue-500 shadow-inner ring-2 ring-blue-200 dark:ring-blue-900" />
          <div className="h-3.5 w-3.5 rounded-full bg-gray-300 shadow-inner dark:bg-gray-600" />
          <div className="h-3.5 w-3.5 rounded-full bg-gray-300 shadow-inner dark:bg-gray-600" />
        </div>

        <div className="flex gap-8">
          <div className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-xs font-black text-gray-500 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
              A
            </div>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Select</span>
          </div>
          <div className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-xs font-black text-gray-500 shadow-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-400">
              +
            </div>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Menu</span>
          </div>
        </div>
      </footer>

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 flex gap-2"
            >
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

      <AnimatePresence>
        {activeApp ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="relative flex h-[85vh] w-full max-w-5xl items-center justify-center rounded-[3rem] border-4 border-gray-800 bg-gray-900 p-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] md:p-8"
            >
              <div className="absolute top-1/2 left-6 hidden h-32 w-12 -translate-y-1/2 rounded-full border border-gray-700 bg-gray-800 shadow-inner md:block" />
              <div className="absolute top-1/2 right-6 hidden h-32 w-12 -translate-y-1/2 rounded-full border border-gray-700 bg-gray-800 shadow-inner md:block" />

              <div
                className="group absolute bottom-2 left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-4 border-gray-700 transition-colors hover:bg-gray-800"
                onClick={() => setActiveApp(null)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 shadow-inner transition-colors group-hover:bg-blue-500">
                  <div className="h-4 w-4 rounded-sm border-2 border-gray-900" />
                </div>
              </div>

              <div className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-xl border-[12px] border-black bg-white shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] dark:bg-gray-900">
                <div className={`flex items-center justify-between border-b border-gray-200 p-4 ${activeApp.color}`}>
                  <div className="flex items-center gap-3">
                    <activeApp.icon className="h-8 w-8 text-white drop-shadow-sm" />
                    <h2 className="text-2xl font-black tracking-wide text-white drop-shadow-sm">{activeApp.title}</h2>
                  </div>
                  <button
                    onClick={() => setActiveApp(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-black text-white backdrop-blur-sm transition-colors hover:bg-white/40 md:hidden"
                  >
                    X
                  </button>
                </div>

                <div className="wii-bg relative flex-1 overflow-y-auto p-6 md:p-8">
                  {renderAppContent(activeApp.id, (appId) => {
                    const nextApp = APPS.find((app) => app.id === appId);
                    if (nextApp) {
                      handleAppClick(nextApp);
                    }
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
