import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMessage, setCurrentLocaleFromParams } from "@/lib/i18n/server";
import { registries } from "@/lib/registry";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  const t = await getMessage("RegistryPage");
  return {
    title: t.title,
  };
}

const getRegistryItems = (type: string) => {
  return Promise.all(
    registries
      .filter((registry) => registry.type === type)
      .map(async (registry) => ({
        title: registry.title,
        name: registry.name,
        meta: registry.meta,
      }))
  );
};

export default async function RegistryPage({ params }: PageProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);
  const items = await getRegistryItems("registry:block");
  const t = await getMessage("RegistryPage");

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">{t.title}</h1>

      <section className="py-6 space-y-6">
        <h2 className="text-3xl font-bold">{t.blocks}</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.name} className="relative">
              <CardContent>
                <Suspense
                  fallback={
                    <Skeleton className="aspect-video border rounded-lg" />
                  }
                >
                  <Preview name={item.name} fill={item.meta?.fill} />
                </Suspense>
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

async function Preview({ name, fill }: { name: string; fill?: boolean }) {
  const Content = (
    await import(`@/app/[locale]/(main)/registry/${name}/preview.tsx`)
  ).default;

  return (
    <div
      className={cn(
        "aspect-video border rounded-lg flex items-center justify-center bg-muted/20 relative",
        !fill && "p-8"
      )}
      style={{
        backgroundImage: `
    linear-gradient(to right, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px)
  `,
        backgroundSize: "20px 20px",
        backgroundPosition: "5px 5px",
      }}
    >
      <Content />
    </div>
  );
}
