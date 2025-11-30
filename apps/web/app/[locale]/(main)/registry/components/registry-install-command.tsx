import { baseUrl } from "@/registry/lib/base-url";
import { CodeBlock } from "@/components/code-block";

export function RegistryInstallCommand({
  registryName,
}: {
  registryName: string;
}) {
  const codes = [
    {
      lang: "sh",
      code: `pnpx shadcn@latest add ${baseUrl()}/r/${registryName}`,
      group: "pnpm",
    },
    {
      lang: "sh",
      code: `npx shadcn@latest add ${baseUrl()}/r/${registryName}`,
      group: "npm",
    },
    {
      lang: "sh",
      code: `yarn shadcn@latest add ${baseUrl()}/r/${registryName}`,
      group: "yarn",
    },
    {
      lang: "sh",
      code: `bunx --bun shadcn@latest add ${baseUrl()}/r/${registryName}`,
      group: "bun",
    },
  ];

  return <CodeBlock groups={["pnpm", "npm", "yarn", "bun"]} codes={codes} />;
}
