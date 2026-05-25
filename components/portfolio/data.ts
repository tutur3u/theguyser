import {
  Award,
  BookOpen,
  Briefcase,
  FileText,
  Gamepad2,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Music,
  Settings,
  Star,
  User,
  Users,
} from "lucide-react";
import type {
  AppDefinition,
  FocusArea,
  MenuItem,
  PortfolioAppTile,
  PortfolioContent,
  PortfolioPanelContent,
  PortfolioQuickLaunchCard,
  PortfolioSiteConfig,
  Project,
  ResourceLink,
  ScreenId,
} from "@/components/portfolio/types";

export const RESUME_VIEW_URL = "https://drive.google.com/file/d/1OTN2-CsjFnjOplfzHjHq1yCXJcqRWDtc/view?usp=drive_link";
export const RESUME_PREVIEW_URL = "https://drive.google.com/file/d/1OTN2-CsjFnjOplfzHjHq1yCXJcqRWDtc/preview";
export const LAUNCH_ANIMATION_STORAGE_KEY = "portfolio-launch-animation-enabled";
export const PORTFOLIO_PREFERENCES_STORAGE_KEY = "portfolio-preferences";
export const DEFAULT_LAUNCH_ANIMATION_ENABLED = true;
export const DEFAULT_LAUNCH_ANIMATION_DURATION = 0.5;
export const LAUNCH_ANIMATION_SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5] as const;

export function formatLaunchAnimationDuration(duration: number) {
  return `${duration.toFixed(2).replace(/\.?0+$/, "")}s`;
}

export const PROFILE = {
  name: "Bao Chua",
  role: "Game Designer",
  intro: "I am an recent graduate from RMIT Vietnam's Game Design program.",
  summary: "I've included my portfolio below, highlighting some of my works.",
  email: "bchua753@gmail.com",
  image: "https://baochua.carrd.co/assets/images/image01.jpg?v=4f0e4032",
};

export const GAME_PROJECTS: Project[] = [
  {
    id: "necrolist",
    category: "Visual Novel",
    title: "Necrolist",
    description:
      "A visual novel about Lucille and Yvaine’s relationship enabled through the use of the Necrolist app with simple to control mini games.",
    href: "https://exocorpse.itch.io/necrolist",
    actionLabel: "Open Itch.io",
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
    id: "email",
    label: "Email",
    note: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: Mail,
    color: "from-amber-300 to-orange-500",
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
    id: "resume",
    label: "Resume",
    note: "Open resume viewer",
    href: RESUME_VIEW_URL,
    icon: FileText,
    color: "from-sky-400 to-blue-600",
    appId: "resume",
  },
  {
    id: "itch",
    label: "Itch.io",
    note: "Playable builds and portfolio hub",
    href: "https://theguyser.itch.io/",
    icon: Gamepad2,
    color: "from-fuchsia-400 to-pink-600",
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

export const DEFAULT_SITE_CONFIG: PortfolioSiteConfig = {
  defaultTheme: "system",
  discTitle: "Bao's Portfolio",
  launchAnimationDuration: DEFAULT_LAUNCH_ANIMATION_DURATION,
  launchAnimationEnabled: DEFAULT_LAUNCH_ANIMATION_ENABLED,
  rememberPreferences: true,
  startLabel: "START",
};

export const DEFAULT_APP_TILES: PortfolioAppTile[] = [
  {
    color: "bg-blue-500",
    iconKey: "gamepad",
    id: "disc",
    size: "col-span-2 row-span-2",
    sortOrder: 0,
    title: "Bao's Portfolio",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#4ade80] to-[#16a34a]",
    iconKey: "user",
    id: "about",
    size: "col-span-2 row-span-1",
    sortOrder: 10,
    title: "Profile",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#9ca3af] to-[#4b5563]",
    iconKey: "settings",
    id: "skills",
    size: "col-span-1 row-span-1",
    sortOrder: 20,
    title: "Settings",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#fde047] to-[#ca8a04]",
    iconKey: "mail",
    id: "contact",
    size: "col-span-1 row-span-1",
    sortOrder: 30,
    title: "Connect",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#374151] to-[#111827]",
    iconKey: "file-text",
    id: "resume",
    size: "col-span-1 row-span-1",
    sortOrder: 40,
    title: "Resume",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#a78bfa] to-[#7c3aed]",
    iconKey: "briefcase",
    id: "experience",
    size: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    sortOrder: 50,
    title: "Games",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#2dd4bf] to-[#0d9488]",
    iconKey: "music",
    id: "music",
    size: "col-span-1 row-span-1",
    sortOrder: 60,
    title: "Showreel",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#86efac] to-[#22c55e]",
    iconKey: "message-square",
    id: "miiverse",
    size: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    sortOrder: 70,
    title: "Research",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#fb923c] to-[#ea580c]",
    iconKey: "award",
    id: "awards",
    size: "col-span-1 row-span-1",
    sortOrder: 80,
    title: "Focus",
    visible: true,
  },
  {
    color: "bg-gradient-to-b from-[#f472b6] to-[#db2777]",
    iconKey: "image",
    id: "gallery",
    size: "col-span-1 row-span-1",
    sortOrder: 90,
    title: "Showcase",
    visible: true,
  },
];

export const DEFAULT_PANEL_CONTENT: Partial<Record<ScreenId, PortfolioPanelContent>> = {
  about: {
    body: "RMIT Vietnam|Game Design Program graduate",
    description: "Profile, background, and shortcuts into Bao's portfolio sections.",
    eyebrow: "Profile",
    title: PROFILE.name,
  },
  awards: {
    description: "Design strengths and research themes represented across the portfolio.",
    title: "Focus Areas",
  },
  contact: {
    description: "Resume access and the fastest ways to reach or follow Bao.",
    title: "Connect",
  },
  disc: {
    description: PROFILE.intro + " " + PROFILE.summary,
    title: "Bao's Portfolio",
  },
  experience: {
    description: "Playable and portfolio-ready game projects.",
    title: "Games",
  },
  gallery: {
    description: "A visual pass across games and research projects.",
    title: "Showcase",
  },
  miiverse: {
    description: "Archives, games studies, and video essay work.",
    title: "Research",
  },
  music: {
    description: "A rotating queue of the projects featured in the portfolio source.",
    title: "Now Playing: Bao Chua Showreel",
  },
  resume: {
    description: "In-app Google Drive preview. If it fails to load, use the external open button.",
    title: "Bao Chua CV",
  },
  skills: {
    description: "Appearance controls live here, and motion settings can optionally be remembered in this browser.",
    title: "Site Settings",
  },
};

export const DEFAULT_QUICK_LAUNCH_CARDS: PortfolioQuickLaunchCard[] = [
  {
    accent: "from-green-50 to-green-100 text-green-500 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300",
    appId: "experience",
    description: "Visual novel, FPS, puzzle, and first-person puzzle projects.",
    label: "Games",
    section: "about",
    sortOrder: 10,
    title: "Playable Works",
  },
  {
    accent: "from-blue-50 to-blue-100 text-blue-500 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300",
    appId: "miiverse",
    description: "Console culture, grotesque studies, and the R4 video essay.",
    label: "Research",
    section: "about",
    sortOrder: 20,
    title: "Archives And Studies",
  },
  {
    accent: "from-amber-50 to-amber-100 text-amber-600 dark:from-amber-900/20 dark:to-amber-800/20 dark:text-amber-300",
    appId: "contact",
    description: "Email, LinkedIn, resume access, and Itch.io in one place.",
    label: "Connect",
    section: "about",
    sortOrder: 30,
    title: "Resume And Links",
  },
  {
    accent: "from-blue-50 to-blue-100 text-blue-500 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300",
    appId: "experience",
    description: "Visual novel, FPS, puzzle, and first-person puzzle work.",
    label: "Games",
    section: "skills",
    sortOrder: 10,
    title: "Playable Works",
  },
  {
    accent: "from-green-50 to-green-100 text-green-500 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300",
    appId: "miiverse",
    description: "Console culture, grotesque studies, and a video essay on R4 and DS access.",
    label: "Research",
    section: "skills",
    sortOrder: 20,
    title: "Archives And Studies",
  },
  {
    accent: "from-amber-50 to-amber-100 text-amber-600 dark:from-amber-900/20 dark:to-amber-800/20 dark:text-amber-300",
    appId: "contact",
    description: "Open the central hub for email, LinkedIn, resume, and Itch.io.",
    label: "Connect",
    section: "skills",
    sortOrder: 30,
    title: "Resume And Links",
  },
];

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  appTiles: DEFAULT_APP_TILES,
  focusAreas: FOCUS_AREAS,
  gameProjects: GAME_PROJECTS,
  panelContent: DEFAULT_PANEL_CONTENT,
  profile: PROFILE,
  quickLaunchCards: DEFAULT_QUICK_LAUNCH_CARDS,
  researchProjects: RESEARCH_PROJECTS,
  resourceLinks: RESOURCE_LINKS,
  showreelItems: SHOWREEL_ITEMS,
  siteConfig: DEFAULT_SITE_CONFIG,
};

const APP_ICON_REGISTRY = {
  award: Award,
  book: BookOpen,
  briefcase: Briefcase,
  "file-text": FileText,
  gamepad: Gamepad2,
  image: ImageIcon,
  mail: Mail,
  "message-square": MessageSquare,
  music: Music,
  settings: Settings,
  star: Star,
  user: User,
  users: Users,
} satisfies Record<string, typeof User>;

function getAppIcon(iconKey: string) {
  return APP_ICON_REGISTRY[iconKey as keyof typeof APP_ICON_REGISTRY] ?? Star;
}

function getTileById(content: PortfolioContent, id: ScreenId) {
  return content.appTiles.find((tile) => tile.id === id) ?? DEFAULT_APP_TILES.find((tile) => tile.id === id);
}

function getArtworkForApp(content: PortfolioContent, id: ScreenId) {
  if (id === "experience") {
    return content.gameProjects.map((project) => project.image);
  }

  if (id === "miiverse") {
    return content.researchProjects.map((project) => project.image);
  }

  if (id === "gallery") {
    return [...content.gameProjects, ...content.researchProjects].map((project) => project.image);
  }

  return undefined;
}

function toAppDefinition(content: PortfolioContent, tile: PortfolioAppTile): AppDefinition {
  return {
    artwork: getArtworkForApp(content, tile.id),
    color: tile.color,
    icon: getAppIcon(tile.iconKey),
    id: tile.id,
    kind: "panel",
    size: tile.size,
    title: tile.title,
  };
}

export function getPortfolioApps(content: PortfolioContent): AppDefinition[] {
  return DEFAULT_APP_TILES.filter((tile) => tile.id !== "disc")
    .map((defaultTile) => ({ ...defaultTile, ...getTileById(content, defaultTile.id) }))
    .filter((tile) => tile.visible)
    .map((tile) => toAppDefinition(content, tile));
}

export function getPortfolioDiscApp(content: PortfolioContent): AppDefinition {
  const firstName = content.profile.name.trim().split(/\s+/)[0] || "Bao";
  const tile = getTileById(content, "disc") ?? DEFAULT_APP_TILES[0];

  return toAppDefinition(content, {
    ...tile,
    title: content.siteConfig.discTitle || firstName + "'s Portfolio",
  });
}

export function getPortfolioMenuItems(content: PortfolioContent): MenuItem[] {
  const apps = getPortfolioApps(content);
  const appById = new Map<ScreenId, AppDefinition>([
    ["disc", getPortfolioDiscApp(content)],
    ...apps.map((app) => [app.id, app] as const),
  ]);

  const items: MenuItem[] = [];

  for (const tile of DEFAULT_APP_TILES.map((defaultTile) => ({
    ...defaultTile,
    ...getTileById(content, defaultTile.id),
  }))
    .filter((tile) => tile.visible)
    .sort((left, right) => left.sortOrder - right.sortOrder)) {
    const app = appById.get(tile.id);

    if (app) {
      items.push(app);
    }
  }

  return items;
}

export const APPS: AppDefinition[] = getPortfolioApps(DEFAULT_PORTFOLIO_CONTENT);

export const DISC_APP: AppDefinition = getPortfolioDiscApp(DEFAULT_PORTFOLIO_CONTENT);

export const MENU_ITEMS: MenuItem[] = getPortfolioMenuItems(DEFAULT_PORTFOLIO_CONTENT);

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
