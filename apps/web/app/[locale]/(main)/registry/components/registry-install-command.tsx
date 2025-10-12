import { generateCodeHtml } from "@/lib/code-to-html";
import { getBaseURL } from "@workspace/lib/get-base-url";
import { CodeBlock } from "@workspace/registry/blocks/code-block/code-block";

export async function RegistryInstallCommand({
  registryName,
}: {
  registryName: string;
}) {
  const codes = [
    {
      lang: "sh",
      code: `pnpx shadcn@latest add ${getBaseURL()}/r/${registryName}.json`,
      group: "pnpm",
    },
    {
      lang: "sh",
      code: `npx shadcn@latest add ${getBaseURL()}/r/${registryName}.json`,
      group: "npm",
    },
    {
      lang: "sh",
      code: `yarn shadcn@latest add ${getBaseURL()}/r/${registryName}.json`,
      group: "yarn",
    },
    {
      lang: "sh",
      code: `bunx --bun shadcn@latest add ${getBaseURL()}/r/${registryName}.json`,
      group: "bun",
    },
  ].map(async (code) => ({
    ...code,
    html: await generateCodeHtml(code.code, code.lang),
  }));

  return (
    <CodeBlock
      groups={["pnpm", "npm", "yarn", "bun"]}
      codes={await Promise.all(codes)}
    />
  );
}
