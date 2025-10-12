import registry from "@workspace/registry";

export const registries = registry.items;

export const getRegistry = (name: string) => {
  return registries.find((registry) => registry.name === name);
};
