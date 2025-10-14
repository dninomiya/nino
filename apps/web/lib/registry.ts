import registry from "@workspace/registry";

export const registryDocNames = [
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
      return post.frontmatter;
    })
  );
};

export const getRegistryDocMeta = async (name: string) => {
  const post = await import(`@/app/[locale]/(main)/registry/${name}/doc.mdx`);
  return post.frontmatter;
};
