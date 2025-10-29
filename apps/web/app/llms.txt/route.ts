import { getRegistryDocMetas } from "@/lib/registry";
import { getDocMetas } from "@/lib/docs";
import { baseUrl } from "@/registry/lib/base-url";
import { cacheLife } from "next/cache";

export const GET = async () => {
  const doc = await generateLLMSText();

  return new Response(doc, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

async function generateLLMSText() {
  "use cache";
  cacheLife("max");

  const allRegistryDocMetas = await getRegistryDocMetas();
  const allDocMetas = await getDocMetas();
  const origin = baseUrl();

  return `
  # nino

  ## Docs

  ${allDocMetas.map((meta) => `- [${meta.title}](${origin}/llms/docs/${meta.id}.md)`).join("\n")}

  ## Registries

  ${allRegistryDocMetas.map((meta) => `- [${meta.title}](${origin}/llms/registry/${meta.name}.md)`).join("\n")}
    `.trim();
}
