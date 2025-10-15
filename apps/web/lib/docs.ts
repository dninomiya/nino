import { readdirSync } from "fs";
import path from "path";

export const getDocMetas = async () => {
  const docsDir = path.join(process.cwd(), "docs");
  const files = readdirSync(docsDir).filter((file) => file.endsWith(".mdx"));

  const metas = await Promise.all(
    files.map(async (file) => {
      const id = file.replace(/\.mdx$/, "");
      const post = await import(`@/docs/${id}.mdx`);
      return {
        ...post.frontmatter,
        id,
      };
    })
  );

  // updatedAt で降順ソート（最新順）
  return metas.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });
};

export type DocMeta = Awaited<ReturnType<typeof getDocMetas>>[number];

export const getDocMeta = async (id: string) => {
  const post = await import(`@/docs/${id}.mdx`);
  return {
    ...post.frontmatter,
    id,
  };
};
