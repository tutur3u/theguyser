import {
  Award,
  BookOpen,
  Briefcase,
  FileText,
  Gamepad2,
  Globe,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Music,
  Settings,
  ShoppingBag,
  Star,
  User,
  Users,
} from "lucide-react";
import type { AppDefinition, FocusArea, Project, ResourceLink } from "@/components/portfolio/types";

export const RESUME_VIEW_URL = "https://drive.google.com/file/d/1OTN2-CsjFnjOplfzHjHq1yCXJcqRWDtc/view?usp=drive_link";
export const RESUME_PREVIEW_URL = "https://drive.google.com/file/d/1OTN2-CsjFnjOplfzHjHq1yCXJcqRWDtc/preview";
export const LAUNCH_ANIMATION_STORAGE_KEY = "portfolio-launch-animation-enabled";
export const PORTFOLIO_PREFERENCES_STORAGE_KEY = "portfolio-preferences";
export const DEFAULT_LAUNCH_ANIMATION_ENABLED = true;
export const DEFAULT_LAUNCH_ANIMATION_DURATION = 0.5;
export const LAUNCH_ANIMATION_SPEED_OPTIONS = [0.5, 1, 1.5, 2, 2.5] as const;

export const PROFILE = {
  name: "Bao Chua",
  role: "Game Designer",
  intro: "I am an recent graduate from RMIT Vietnam's Game Design program.",
  summary: "I've included my portfolio below, highlighting some of my works.",
  email: "bchua753@gmail.com",
  image: "https://baochua.carrd.co/assets/images/image01.jpg?v=4f0e4032",
  site: "https://baochua.carrd.co/",
};

export const GAME_PROJECTS: Project[] = [
  {
    id: "necrolist",
    category: "Visual Novel",
    title: "Necrolist",
    description:
      "A visual novel about Lucille and Yvaine’s relationship enabled through the use of the Necrolist app with simple to control mini games.",
    href: "https://exocorpse.itch.io/necrolist",
    actionLabel: "Play",
    image: "https://baochua.carrd.co/assets/images/container03.jpg?v=4f0e4032",
  },
  {
    id: "spaceship-fps",
    category: "First Person Shooter Game",
    title: "Spaceship FPS",
    description: "UE5 FPS Level with platforming, shooting and enemy ai",
    href: "https://theguyser.itch.io/spaceship-fps",
    actionLabel: "Play",
    image: "https://baochua.carrd.co/assets/images/container01.jpg?v=4f0e4032",
  },
  {
    id: "mine-blast",
    category: "Puzzle Game",
    title: "Mine Blast!",
    description: "Combine matching Ores and Detonate TNT to make space!",
    href: "https://theguyser.itch.io/mine-blast",
    actionLabel: "Play",
    image: "https://baochua.carrd.co/assets/images/container09.jpg?v=4f0e4032",
  },
  {
    id: "finding-time",
    category: "First Person Puzzle Game",
    title: "Finding Time",
    description:
      'A short game about finding the right "time" to leave the house to catch the "Blue Hour." Game made in 48 hours for RMIT Game Jam 2024.',
    href: "https://theguyser.itch.io/finding-time",
    actionLabel: "Play",
    image: "https://baochua.carrd.co/assets/images/container07.jpg?v=4f0e4032",
  },
];

export const RESEARCH_PROJECTS: Project[] = [
  {
    id: "console-culture",
    category: "Games Archives",
    title: "Unpacking Console Culture in Vietnam",
    description:
      "Researched Console Gaming Culture in Vietnam, specifically how game consoles made their way into Vietnam, and cataloged my retro console collection for future research.",
    href: "https://drive.google.com/drive/folders/1eRxbNkmM7ufMledZDtenHaI1gbs35o26?usp=sharing",
    actionLabel: "Check Out",
    image: "https://baochua.carrd.co/assets/images/container02.jpg?v=4f0e4032",
  },
  {
    id: "grotesque-zine",
    category: "Game Studies",
    title: "Research Zine: Grotesque in Games",
    description:
      `Researched the genre "Grotesque" to use as a lens of literary analysis for the game Don't Starve. Research used for a Research Zine's dialogue.`,
    href: "https://labeurre.itch.io/grotesque-in-games",
    actionLabel: "Check Out",
    image: "https://baochua.carrd.co/assets/images/container08.jpg?v=4f0e4032",
  },
  {
    id: "r4-video-essay",
    category: "Games Archives",
    title: "Critical Analysis of Discourses Around Games as Heritage: R4’s Impact on the Success of DS in Vietnam",
    description:
      "Researched and created a video essay about how the R4 flashcard allowed the Nintendo DS to have a wider reach in Vietnam through more affordable pricing.",
    href: "https://www.youtube.com/watch?v=lJ0s0M1ChS8",
    actionLabel: "Watch Video Essay",
    image: "https://baochua.carrd.co/assets/images/container05.jpg?v=4f0e4032",
  },
];

export const RESOURCE_LINKS: ResourceLink[] = [
  {
    id: "resume",
    label: "Resume",
    note: "Open CV viewer",
    href: RESUME_VIEW_URL,
    appId: "github",
    icon: FileText,
    color: "from-sky-400 to-blue-600",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    note: "Professional profile",
    href: "https://www.linkedin.com/in/bao-chua/",
    icon: Users,
    color: "from-blue-500 to-indigo-700",
  },
  {
    id: "itch",
    label: "Itch.io",
    note: "Playable builds and portfolio hub",
    href: "https://theguyser.itch.io/",
    icon: Gamepad2,
    color: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "email",
    label: "Email",
    note: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: Mail,
    color: "from-amber-300 to-orange-500",
  },
  {
    id: "carrd",
    label: "Original Carrd",
    note: "Source portfolio reference",
    href: PROFILE.site,
    icon: Globe,
    color: "from-cyan-300 to-sky-600",
  },
];

export const FOCUS_AREAS: FocusArea[] = [
  {
    title: "Visual Novel",
    description: "Narrative-led work anchored by Necrolist.",
    icon: BookOpen,
    color: "text-emerald-500 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    title: "Shooter Spaces",
    description: "UE5 level design with shooting, platforming, and enemy AI.",
    icon: Briefcase,
    color: "text-cyan-500 dark:text-cyan-300",
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
  },
  {
    title: "Puzzle Design",
    description: "From Mine Blast! to the time-based structure of Finding Time.",
    icon: Star,
    color: "text-amber-500 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    title: "Games Archives",
    description: "Console history in Vietnam, retro collections, and preservation research.",
    icon: Award,
    color: "text-orange-500 dark:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    title: "Game Studies",
    description: "Critical and literary analysis, including grotesque studies in games.",
    icon: MessageSquare,
    color: "text-violet-500 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    title: "Video Essay",
    description: "Research translated into a watchable project on R4 and DS culture in Vietnam.",
    icon: Music,
    color: "text-rose-500 dark:text-rose-300",
    bg: "bg-rose-100 dark:bg-rose-900/30",
  },
];

export const SHOWREEL_ITEMS = [
  "Necrolist",
  "Spaceship FPS",
  "Mine Blast!",
  "Finding Time",
  "Unpacking Console Culture in Vietnam",
  "Research Zine: Grotesque in Games",
];

export const APPS: AppDefinition[] = [
  {
    id: "about",
    title: "Profile",
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
    title: "Links",
    icon: Globe,
    color: "bg-gradient-to-b from-[#67e8f9] to-[#0891b2]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "contact",
    title: "Contact",
    icon: Mail,
    color: "bg-gradient-to-b from-[#fde047] to-[#ca8a04]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "experience",
    title: "Games",
    icon: Briefcase,
    color: "bg-gradient-to-b from-[#a78bfa] to-[#7c3aed]",
    size: "col-span-2 row-span-1",
    artwork: GAME_PROJECTS.map((project) => project.image),
  },
  {
    id: "miiverse",
    title: "Research",
    icon: MessageSquare,
    color: "bg-gradient-to-b from-[#86efac] to-[#22c55e]",
    size: "col-span-2 row-span-1",
    artwork: RESEARCH_PROJECTS.map((project) => project.image),
  },
  {
    id: "awards",
    title: "Focus",
    icon: Award,
    color: "bg-gradient-to-b from-[#fb923c] to-[#ea580c]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "gallery",
    title: "Showcase",
    icon: ImageIcon,
    color: "bg-gradient-to-b from-[#f472b6] to-[#db2777]",
    size: "col-span-1 row-span-1",
    artwork: [...GAME_PROJECTS, ...RESEARCH_PROJECTS].map((project) => project.image),
  },
  {
    id: "music",
    title: "Showreel",
    icon: Music,
    color: "bg-gradient-to-b from-[#2dd4bf] to-[#0d9488]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "github",
    title: "Resume",
    icon: FileText,
    color: "bg-gradient-to-b from-[#374151] to-[#111827]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "friends",
    title: "Network",
    icon: Users,
    color: "bg-gradient-to-b from-[#fdba74] to-[#ea580c]",
    size: "col-span-1 row-span-1",
  },
  {
    id: "eshop",
    title: "Portfolio Kit",
    icon: ShoppingBag,
    color: "bg-gradient-to-b from-[#fca5a5] to-[#dc2626]",
    size: "col-span-1 row-span-1",
  },
];

export const DISC_APP: AppDefinition = {
  id: "disc",
  title: "Bao's Portfolio",
  icon: Gamepad2,
  color: "bg-blue-500",
  size: "col-span-2 row-span-2",
};

export const MENU_ITEMS: AppDefinition[] = [DISC_APP, ...APPS];

export const MII_DATA = [
  { id: 1, y: 10, delay: 0, duration: 20, scale: 0.8 },
  { id: 2, y: 30, delay: 5, duration: 25, scale: 0.6 },
  { id: 3, y: 60, delay: 2, duration: 18, scale: 0.9 },
  { id: 4, y: 80, delay: 8, duration: 22, scale: 0.7 },
  { id: 5, y: 20, delay: 12, duration: 28, scale: 0.5 },
  { id: 6, y: 50, delay: 15, duration: 19, scale: 1.0 },
  { id: 7, y: 70, delay: 3, duration: 24, scale: 0.85 },
  { id: 8, y: 90, delay: 10, duration: 21, scale: 0.65 },
];

export const EQUALIZER_DURATIONS = [1.1, 1.4, 1.7, 1.25, 1.6, 1.2, 1.5, 1.35, 1.8, 1.45];
