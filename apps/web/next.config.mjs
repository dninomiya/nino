import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  cacheComponents: true
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-gfm',
      'remark-frontmatter',
      'remark-mdx-frontmatter',
      'remark-reading-time',
      'remark-reading-time/mdx',
      'remark-code-import',
      'remark-code-to-slot',
    ],
    rehypePlugins: [
      'rehype-slug',
    ],
  }
})

export default withMDX(nextConfig)