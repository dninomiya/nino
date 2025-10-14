export const dynamic = "force-static";

import { getRegistryDocMetas } from "@/lib/registry";
import { baseUrl } from "@/registry/lib/base-url";

// get handler
export const GET = async () => {
  const allRegistryDocMetas = await getRegistryDocMetas();
  const origin = baseUrl();

  const doc = `
# nino

## Registries

${allRegistryDocMetas.map((meta) => `- [${meta.title}](${origin}/llms/registry/${meta.name}.md)`).join("\n")}
  `.trim();

  return new Response(doc, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
