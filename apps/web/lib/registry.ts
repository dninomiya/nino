import registry from "@workspace/registry";

// Getting Started セクションのアイテム定義
export const gettingStartedItems = [
  {
    name: "what-is-registry",
    title: "レジストリとは？",
  },
  {
    name: "mcp",
    title: "MCP",
  },
] as const;

const registryDocNames = [
  ...gettingStartedItems.map((item) => item.name),
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
