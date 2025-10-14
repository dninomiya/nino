import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    "apps/web/app/**/registry/**/*",
    "apps/web/app/**/docs/**/*",
    "**/*/eslint.config.js",
    "**/.eslintrc.js",
    "**/*/global.ts",
    "**/*/i18n/request.ts",
    "apps/web/i18n/navigation.tsx",
  ],
  ignoreDependencies: [
    "rehype-slug",
    "remark-code-import",
    "remark-frontmatter",
    "remark-gfm",
    "remark-mdx-frontmatter",
    "remark-reading-time",
    "@tailwindcss/postcss",
    "next",
    "postcss",
    "@eslint/js",
    "postcss-load-config",
    "@workspace/eslint-config",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint",
    "eslint-config-next",
    "tailwindcss",
    "@tailwindcss/typography",
    "@turbo/gen",
  ],
  ignoreBinaries: ["migrate", "turso", "eslint"],
};

export default config;
