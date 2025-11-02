import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  cacheComponents: true,
  cacheLife: {
    infinite: {
      stale: Number.MAX_VALUE,
      revalidate: Number.MAX_VALUE,
      expires: Number.MAX_VALUE,
    },
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
      "remark-reading-time",
      "remark-reading-time/mdx",
      "remark-code-import",
      "remark-code-to-slot",
    ],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
