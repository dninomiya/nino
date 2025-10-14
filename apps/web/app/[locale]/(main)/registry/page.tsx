import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { registries } from "@/lib/registry";

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

export default async function RegistryPage() {
  const items = await getRegistryItems("registry:block");

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Registry</h1>

      <section className="py-10 space-y-6">
        <h2 className="text-2xl font-bold">Blocks</h2>
        <div className="grid grid-cols-2 gap-8">
          {items.map((item) => (
            <Card key={item.name}>
              <CardContent>
                <div className="aspect-video border rounded-lg flex items-center justify-center p-8 bg-muted/20">
                  <item.preview />
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
