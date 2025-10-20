import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCurrentLocale, getMessage } from "@/lib/i18n/server";
import { registries } from "@/lib/registry";
import Link from "next/link";

const getRegistryItems = (type: string) => {
  return Promise.all(
    registries
      .filter((registry) => registry.type === type)
      .map(async (registry) => ({
        title: registry.title,
        name: registry.name,
        preview: (
          await import(
            `@/app/[locale]/(main)/registry/${registry.name}/preview.tsx`
          )
        ).default,
      }))
  );
};

export default async function RegistryPage({
  params,
}: PageProps<"/[locale]/registry">) {
  const t = await getMessage("RegistryPage");
  const items = await getRegistryItems("registry:block");
  const locale = getCurrentLocale();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p>{locale}</p>

      <section className="py-10 space-y-6">
        <h2 className="text-2xl font-bold">{t.blocks}</h2>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.name} className="relative">
              <CardContent>
                <div
                  className="aspect-video border rounded-lg flex items-center justify-center p-8 bg-muted/20"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px),
                      linear-gradient(to bottom, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "5px 5px",
                  }}
                >
                  <item.preview />
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>
                  <Link href={`/registry/${item.name}`}>
                    {item.title}
                    <span className="absolute inset-0" />
                  </Link>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
