import { getMessage, setCurrentLocaleFromParams } from "@/lib/i18n/server";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/architecture">) => {
  await setCurrentLocaleFromParams(params);
  const t = await getMessage("ArchitecturePage");

  return {
    title: t.title,
    description: t.description,
  };
};

export default function ArchitecturePage() {
  return (
    <div className="h-[calc(100svh-(var(--spacing-header)))]">
      <iframe
        className="size-full block"
        src="https://embed.figma.com/board/UXSFjMS88G58iDataCPTkG/Architecture?node-id=0-1&embed-host=share"
      ></iframe>
    </div>
  );
}
