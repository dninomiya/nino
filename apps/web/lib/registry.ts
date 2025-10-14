import registry from "@workspace/registry";

export const registryDocNames = [
  "what-is-registry",
  "mcp",
  ...registry.items.map((item) => item.name),
];

export const registries = registry.items;

export const getRegistryDocMetas = async () => {
  return Promise.all(
    registryDocNames.map(async (name) => {
      const post = await import(
        `@/app/[locale]/(main)/registry/${name}/doc.mdx`
      );
      return {
        ...post.frontmatter,
        name,
      };
    })
  );
};

export type RegistryDocMeta = Awaited<
  ReturnType<typeof getRegistryDocMetas>
>[number];

export const getRegistryDocMeta = async (name: string) => {
  const post = await import(`@/app/[locale]/(main)/registry/${name}/doc.mdx`);
  return post.frontmatter;
};
