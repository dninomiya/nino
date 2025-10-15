export const dynamic = "force-static";

import { getRegistryDocMetas } from "@/lib/registry";
import { getDocMetas } from "@/lib/docs";
import { baseUrl } from "@/registry/lib/base-url";

// get handler
export const GET = async () => {
  const allRegistryDocMetas = await getRegistryDocMetas();
  const allDocMetas = await getDocMetas();
  const origin = baseUrl();

  const doc = `
# nino

## Docs

${allDocMetas.map((meta) => `- [${meta.title}](${origin}/llms/docs/${meta.id}.md)`).join("\n")}

## Registries

${allRegistryDocMetas.map((meta) => `- [${meta.title}](${origin}/llms/registry/${meta.name}.md)`).join("\n")}
  `.trim();

  return new Response(doc, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
