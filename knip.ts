import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    "apps/web/app/**/registry/**/*.mdx",
    "apps/web/app/**/registry/**/*.tsx",
    "**/*/eslint.config.js",
    "**/*/.eslintrc.js",
    "**/*/global.ts",
    "**/*/i18n/request.ts",
    "apps/web/i18n/navigation.tsx",
  ],
};

export default config;
