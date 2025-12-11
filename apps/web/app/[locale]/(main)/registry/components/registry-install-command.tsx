import { baseUrl } from "@/registry/lib/base-url";
import { CodeBlock } from "@/components/code-block";
import { getRegistryDocMeta } from "@/lib/registry";
import { isSponsor } from "@workspace/auth";
import { issueRegistryJWT } from "@workspace/registry/jwt";
import { Lock } from "lucide-react";

export async function RegistryInstallCommand({
  registryName,
}: {
  registryName: string;
}) {
  const meta = await getRegistryDocMeta(registryName);
  const sponsors = meta.sponsors;
  const sponsor = await isSponsor();

  if (sponsors && !sponsor) {
    return (
      <p className="border flex items-center gap-2 rounded-lg not-prose p-4 bg-muted text-muted-foreground text-sm">
        <Lock className="size-4" />
        このレジストリアイテムはスポンサー限定です
      </p>
    );
  }

  const token = sponsors ? `?token=${await issueRegistryJWT()}` : "";
  const codes = [
    {
      lang: "sh",
      code: `pnpx shadcn@latest add "${baseUrl()}/api/r/${registryName}${token}"`,
      group: "pnpm",
    },
    {
      lang: "sh",
      code: `npx shadcn@latest add "${baseUrl()}/api/r/${registryName}${token}"`,
      group: "npm",
    },
    {
      lang: "sh",
      code: `yarn shadcn@latest add "${baseUrl()}/api/r/${registryName}${token}"`,
      group: "yarn",
    },
    {
      lang: "sh",
      code: `bunx --bun shadcn@latest add "${baseUrl()}/api/r/${registryName}${token}"`,
      group: "bun",
    },
  ];

  return <CodeBlock groups={["pnpm", "npm", "yarn", "bun"]} codes={codes} />;
}
