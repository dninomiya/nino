import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RegistryPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Registry</h1>

      <section className="py-10 space-y-6">
        <h2 className="text-2xl font-bold">Blocks</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Block 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Block 1 description</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Block 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Block 1 description</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Block 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Block 1 description</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
