// Absolute base for Open Graph, sitemap, and JSON-LD; set NEXT_PUBLIC_SITE_URL on the host.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-3d-pi-wine.vercel.app").replace(/\/$/, "");

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
    href: "https://3d-soda-can-gilt.vercel.app/",
    image: "/assets/images/soda-can.png",
    accent: "cyan",
  },
  {
    name: "Pokédex",
    type: "Pokémon discovery experience",
    description:
      "A responsive Pokédex for searching, filtering, sorting, and comparing Pokémon, with detailed stats and evolution data.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Apollo Client", "GraphQL"],
    href: "https://pensieve-test-two.vercel.app/",
    repository: "https://github.com/frzwarman/pensieve-test",
    image: "/assets/images/pokedex.png",
    accent: "amber",
  },
  {
    name: "Arus",
    type: "Private household finance",
    description:
      "An invite-only finance workspace for tracking cash, bank, and e-wallet accounts, budgets, and reports, where Postgres row-level security is the entire backend.",
    stack: ["React", "TypeScript", "TanStack Router", "TanStack Query", "Supabase", "Recharts", "Cloudflare Workers"],
    href: "https://arus-finance.farizz-a.workers.dev/",
    repository: "https://github.com/frzwarman/arus-finance",
    image: "/assets/images/arus-finance.png",
    accent: "magenta",
  },
  {
    name: "Meja",
    type: "Offline-first restaurant POS",
    description:
      "A local-first point-of-sale PWA for a single Indonesian restaurant, running shift, order, kitchen, payment, and receipt from one device and syncing to Postgres through a transactional outbox when the connection returns.",
    stack: ["React", "TypeScript", "TanStack Router", "Dexie", "Supabase", "Workbox", "Cloudflare Workers"],
    href: "https://possum.farizz-a.workers.dev/",
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
    href: "https://siteos-studio.farizz-a.workers.dev/",
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
    href: "https://pixys.farizz-a.workers.dev/",
    repository: "https://github.com/frzwarman/pixy",
    image: "/assets/images/pixy.png",
    accent: "magenta",
  },
] as const;

export const experience = [
  {
    company: "Pensieve",
    role: "Front End Engineer",
    period: "Mar 2026 - Present",
    place: "South Jakarta",
  },
  {
    company: "K3MART",
    role: "Frontend Developer",
    period: "Nov 2024 - Mar 2026",
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
