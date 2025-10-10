import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-gfm',
      'remark-frontmatter',
      'remark-mdx-frontmatter',
      'remark-reading-time',
      'remark-reading-time/mdx',
      '@workspace/remark-code-meta/remark-code-group',
    ],
    rehypePlugins: [
      'rehype-slug',
    ],
  }
})

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withMDX(nextConfig));
