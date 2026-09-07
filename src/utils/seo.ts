type PageSEO = {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  type?: "website" | "article" | "profile";
};

const defaultImage = "/logo.png";

const seoByPath: Record<string, PageSEO> = {
  "/": {
    title: "Monishwaran K | Software Developer | React.js & Next.js",
    description:
      "Aspiring Software Developer focused on building optimized, responsive websites. Advancing in React, Next.js, TypeScript, Tailwind CSS.",
    keywords: [
      "Software Developer",
      "React Developer",
      "Next.js Developer",
      "TypeScript Expert",
      "Web Performance Optimization",
      "Responsive Web Design",
      "Tailwind CSS Specialist",
      "UI/UX Development",
      "Core Web Vitals",
      "High-Performance Websites",
      "SEO-Friendly Development",
    ],
    image: defaultImage,
  },
  "/about": {
    title: "About Monishwaran K | Software Developer & React.js Specialist",
    description:
      "React.js & Next.js developer Monishwaran K specializes in TypeScript, Tailwind CSS, UI/UX, and high-performance responsive web applications.",
    keywords: [
      "Monishwaran K",
      "about Monishwaran K",
      "React developer bio",
      "Next.js specialist",
      "TypeScript developer",
      "software developer India",
      "UI/UX developer",
      "Tailwind CSS expert",
      "web developer portfolio",
      "hackathon winner",
      "frontend engineer",
      "JavaScript developer",
      "responsive web developer",
      "React specialist",
      "modern web development",
      "frontend skills",
      "tech stack expertise",
      "full stack developer",
      "web performance expert",
    ],
    image: defaultImage,
  },
  "/projects": {
    title: "Projects | Monishwaran K - Software Developer",
    description:
      "Browse projects spanning React, Next.js, AI tools, image generation, resume analyzers, and IoT dashboards built with modern web stacks.",
    keywords: [
      "React projects",
      "Next.js portfolio",
      "AI tools",
      "web apps",
      "full stack developer",
      "Tailwind projects",
    ],
    image: defaultImage,
  },
  "/certifications": {
    title: "Certifications & Achievements | Monishwaran K - Software Developer",
    description:
      "Verified certifications, workshops, internships, and hackathon achievements covering Flutter, React, AI, RAG, and cloud skills.",
    keywords: [
      "certifications",
      "hackathon awards",
      "internships",
      "Flutter certificate",
      "MongoDB course",
    ],
    image: defaultImage,
  },
  "/events": {
    title: "Events & Hackathons | Monishwaran K - Software Developer",
    description:
      "Participation across hackathons, workshops, and competitions with AI, web, and UI/UX projects, including winning entries and team roles.",
    keywords: [
      "hackathons",
      "tech events",
      "workshops",
      "competitions",
      "event portfolio",
    ],
    image: defaultImage,
  },
  "/contact": {
    title: "Contact | Monishwaran K - Software Developer",
    description:
      "Reach out to Monishwaran K for collaboration, inquiries, or web project discussions. Let's connect and build something great together",
    keywords: [
      "contact Monishwaran K",
      "hire React developer",
      "collaboration",
      "portfolio contact",
    ],
    image: defaultImage,
  },
  "/stats": {
    title: "GitHub Stats | Monishwaran K - Live Developer Statistics",
    description:
      "Real-time GitHub statistics and developer analytics for Monishwaran K. Track coding activity, repository insights, and open-source contributions live.",
    keywords: [
      "GitHub statistics",
      "developer analytics",
      "GitHub profile",
      "coding activity",
      "repository analytics",
      "open source contributions",
      "programming languages",
      "GitHub stars",
      "developer stats",
      "live GitHub data",
    ],
    image: defaultImage,
  },
};

const normalizePath = (pathname: string): string => {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
};

const ensureMetaTag = (
  name: string,
  content: string,
  attr: "name" | "property" = "name",
) => {
  if (!content) return;
  const selector = `${attr}="${name}"`;
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${selector}]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const ensureCanonical = (url: string) => {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
};

export const applyPageSEO = (pathname: string) => {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const normalizedPath = normalizePath(pathname);
  const meta = seoByPath[normalizedPath] || seoByPath["/"];
  const pageUrl = `${window.location.origin}${normalizedPath}`;
  const image = meta.image || defaultImage;
  const type = meta.type || "website";

  document.title = meta.title;

  ensureMetaTag("description", meta.description);
  ensureMetaTag("keywords", meta.keywords.join(", "));
  ensureMetaTag("robots", "index, follow");

  ensureMetaTag("og:title", meta.title, "property");
  ensureMetaTag("og:description", meta.description, "property");
  ensureMetaTag("og:type", type, "property");
  ensureMetaTag("og:url", pageUrl, "property");
  ensureMetaTag("og:image", image, "property");

  ensureMetaTag("twitter:card", "summary_large_image");
  ensureMetaTag("twitter:title", meta.title);
  ensureMetaTag("twitter:description", meta.description);
  ensureMetaTag("twitter:image", image);

  ensureCanonical(pageUrl);
};

export type { PageSEO };
