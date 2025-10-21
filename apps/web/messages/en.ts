import { MessagesSchema } from "@/types/message";

export default {
  Language: {
    ja: "Japanese",
    en: "English",
  },
  Common: {
    createdAt: "Created At",
    updatedAt: "Updated At",
    readingTime: "Reading Time",
    copyMarkdown: "Copy Markdown",
  },
  LocaleSwitcher: {
    locale: "Change Language",
  },
  ModeToggle: {
    label: "Toggle theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  InviteNino: {
    label: "採用",
  },
  FeedFilter: {
    typeLabel: "Content Type",
    sourceLabel: "Technology",
    tagsLabel: "Tags",
    releases: "Releases",
    news: "News",
    changelog: "Changelog",
    youtube: "Videos",
  },
  FeedTypes: {
    releases: "Releases",
    blog: "News",
    changelog: "Changelog",
    youtube: "YouTube",
  },
  Categories: {
    framework: "Framework",
    saas: "SaaS/BaaS",
    library: "Library",
    tool: "Tool",
    ai: "AI",
    mobile: "Mobile",
  },
  Tags: {
    feature: "Feature",
    event: "Event",
    bugfix: "Bug Fix",
    bigNews: "Big News",
    release: "Release",
    update: "Update",
    announcement: "Announcement",
    tutorial: "Tutorial",
    documentation: "Documentation",
    security: "Security",
    performance: "Performance",
    breakingChange: "Breaking Change",
  },
  GlobalSearch: {
    searchPlaceholder: "Search...",
    searchLabel: "Search",
    noResults: "No results found.",
    registry: "Registry",
    docs: "Documentation",
    theme: "Theme",
    language: "Language",
    current: "Current",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  DocsListPage: {
    title: "Documentation",
  },
  RegistryPage: {
    title: "Registry",
    blocks: "Blocks",
  },
  RegistrySidebar: {
    title: "Registry",
    gettingStarted: "Getting Started",
    blocks: "Blocks",
    libraries: "Libraries",
  },
  MainPage: {
    filterTitle: "Filter",
    feedTitle: "Feed",
    feedDescription: "Latest news from primary sources.",
    lastUpdated: "Last updated",
    noUpdates: "No updates available",
    noUpdatesDescription: "No feed items have been updated in the past 7 days.",
    noUpdatesDevNote:
      "In development environment, you can manually refresh the feed.",
  },
  MainNav: {
    docs: "Docs",
    registry: "Registry",
    tools: "Tools",
    membership: "Membership",
    archive: "Archive",
    toolhub: {
      label: "ToolHub",
      description: "Tool links collection",
    },
    reactGuide: {
      label: "React Guide",
      description: "React guide",
    },
    nextjsRenderingGuide: {
      label: "Next.js Rendering Guide",
      description: "Next.js rendering guide",
    },
    stripeGuide: {
      label: "Stripe Beginner's Guide",
      description: "Stripe beginner's guide",
    },
    nextjsRoutingGuide: {
      label: "Next.js Routing Guide",
      description: "Next.js special routing demo",
    },
    hub: {
      label: "Hub",
      description: "Web app implementation demo",
    },
    formGuide: {
      label: "Form Guide",
      description: "Form implementation best practices",
    },
    stopEnterSubmit: {
      label: "Stop Enter Submit",
      description: "Tool to prevent accidental submission with Enter key",
    },
    treeToImage: {
      label: "Tree to Image",
      description: "File tree image generation tool",
    },
    ninoPlusOld: {
      label: "nino+ 1.0",
      description: "Mentor platform",
    },
  },
  Footer: {
    linksTitle: "Links",
    feed: "Feed",
    status: "Status",
    docs: "Documentation",
    registry: "Registry",
    description: "Developer.",
    copyright: "All rights reserved.",
  },
} satisfies MessagesSchema;
