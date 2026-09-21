export const sectionIds = [
  "intro",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const navigation = sectionIds.map((id) => ({
  id,
  label: id === "intro" ? "Home" : id[0].toUpperCase() + id.slice(1),
}));

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "JavaScript",
  "Node.js",
  "Express",
  "Prisma",
  "MySQL",
  "MongoDB",
  "Three.js",
  "GSAP",
];

export const projects = [
  {
    name: "3D Soda Can",
    type: "Immersive product experience",
    description:
      "An interactive product story that combines a motion-led interface with a responsive 3D can.",
    stack: ["Next.js", "TypeScript", "Three.js", "GSAP", "Prismic"],
    href: "http://3d-soda-can-gilt.vercel.app/",
    image: "/assets/images/soda-can.gif",
    accent: "cyan",
  },
  {
    name: "Event Management Platform",
    type: "Full-stack event platform",
    description:
      "A streamlined place to publish, discover, and manage events with authentication and media uploads.",
    stack: ["Next.js", "TypeScript", "Clerk", "MongoDB"],
    href: "https://event-management-platform-jcwdol013-01.vercel.app",
    image: "/assets/images/minpro.gif",
    accent: "magenta",
  },
  {
    name: "E-Groceries",
    type: "Commerce and operations",
    description:
      "A full grocery commerce journey spanning catalog, delivery, payments, dashboards, and inventory workflows.",
    stack: ["Next.js", "Express", "Prisma", "MySQL", "Xendit"],
    href: "https://jcwdol130201.purwadhikabootcamp.com",
    image: "/assets/images/e-commerce.gif",
    accent: "amber",
  },
  {
    name: "Company Profile",
    type: "Editorial web presence",
    description:
      "A clear, responsive company profile built around discoverable services and concise visual storytelling.",
    stack: ["Next.js", "TypeScript", "Chakra UI", "Axios"],
    href: "https://company-profile-pi.vercel.app",
    image: "/assets/images/compro.gif",
    accent: "cyan",
  },
  {
    name: "Invoeasy",
    type: "Invoice management",
    description:
      "A practical invoicing workspace for creating, tracking, and managing business documents and users.",
    stack: ["Next.js", "Express", "Prisma", "MySQL", "JWT"],
    href: "https://github.com/frzwarman/invoeasy",
    image: "/assets/images/invoeasy.gif",
    accent: "magenta",
  },
  {
    name: "Pokédex",
    type: "Pokémon discovery experience",
    description:
      "A responsive Pokédex for searching, filtering, sorting, and comparing Pokémon, with detailed stats and evolution data.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Apollo Client", "GraphQL"],
    href: "https://pensieve-test-two.vercel.app/",
    repository: "https://github.com/frzwarman/pensieve-test",
    image: "/assets/images/pokedex.gif",
    accent: "amber",
  },
  {
    name: "ORBIT AI",
    type: "AI-powered discovery platform (WIP)",
    description:
      "An on-going project to create an intelligent platform for discovering and interacting with 3D assistant, powered by AI-driven recommendations.",
    stack: ["Vite", "TypeScript", "Tailwind CSS", "Puter.js", "socket.io", "Zustand", "three.js", "gsap"],
    href: "https://orbit-ai-virid-three.vercel.app/",
    repository: "https://github.com/frzwarman/orbit-AI",
    image: "/assets/images/orbit-ai.gif",
    accent: "cyan",
  },
  {
    name: "Arus",
    type: "Private household finance",
    description:
      "An invite-only finance workspace for tracking cash, bank, and e-wallet accounts, budgets, and reports, where Postgres row-level security is the entire backend.",
    stack: ["React", "TypeScript", "TanStack Router", "TanStack Query", "Supabase", "Recharts", "Cloudflare Workers"],
    href: "https://github.com/frzwarman/arus-finance",
    repository: "https://github.com/frzwarman/arus-finance",
    image: "/assets/images/arus-finance.png",
    accent: "magenta",
  },
  {
    name: "Meja",
    type: "Offline-first restaurant POS",
    description:
      "A local-first point-of-sale PWA for a single Indonesian restaurant, running shift, order, kitchen, payment, and receipt from one device and syncing to Postgres through a transactional outbox when the connection returns.",
    stack: ["React", "TypeScript", "TanStack Router", "Dexie", "Supabase", "Workbox", "Cloudflare Pages"],
    href: "https://meja-pos.pages.dev",
    repository: "https://github.com/frzwarman/possum",
    image: "/assets/images/possum.png",
    accent: "amber",
  },
  {
    name: "SiteOS",
    type: "Headless CMS and visual site builder",
    description:
      "A website operating system for small businesses: owners compose pages from structured sections in a live Astro preview and publish immutable versions to a fast static site, editing intent instead of CSS.",
    stack: ["React", "Astro", "TypeScript", "Zod", "Supabase", "Cloudflare", "Turborepo"],
    href: "https://github.com/frzwarman/busyness-cms",
    repository: "https://github.com/frzwarman/busyness-cms",
    image: "/assets/images/busyness-cms.png",
    accent: "cyan",
  },
  {
    name: "Pixy",
    type: "In-browser photo editor",
    description:
      "A free, private, offline-capable photo editor with a GPU pipeline on PixiJS and WebGL2: non-destructive edits, film looks, and tiled full-resolution export, with photos never leaving the device.",
    stack: ["React", "TypeScript", "PixiJS", "WebGL2", "GLSL", "Dexie", "PWA"],
    href: "https://github.com/frzwarman/pixy",
    repository: "https://github.com/frzwarman/pixy",
    image: "/assets/images/pixy.png",
    accent: "magenta",
  },
] as const;

export const experience = [
  {
    company: "Pensieve",
    role: "Front End Engineer",
    period: "Mar 2026 — Present",
    place: "South Jakarta",
  },
  {
    company: "K3MART",
    role: "Frontend Developer",
    period: "Nov 2024 — Mar 2026",
    place: "Tangerang",
  },
  {
    company: "DMS",
    role: "Intern Fullstack Developer",
    period: "Oct 2024",
    place: "Jakarta",
  },
] as const;

export const contacts = [
  { label: "Email Fariz", value: "Email", href: "mailto:farizwarman@gmail.com" },
  { label: "GitHub", value: "GitHub", href: "https://github.com/frzwarman" },
  {
    label: "LinkedIn",
    value: "LinkedIn",
    href: "https://www.linkedin.com/in/frzwarman/",
  },
  {
    label: "WhatsApp",
    value: "WhatsApp",
    href: "https://wa.me/+6281298606155?text=Hello%20Fariz,%20I%20am%20interested%20in%20your%20services",
  },
] as const;
