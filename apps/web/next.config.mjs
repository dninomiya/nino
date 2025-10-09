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
    ],
    rehypePlugins: [
      ['@shikijs/rehype', {
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        }
      }],
      'rehype-slug',
    ],
  }
})

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withMDX(nextConfig));
