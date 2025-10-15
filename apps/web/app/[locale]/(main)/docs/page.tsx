import { getDocMetas } from "@/lib/docs";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default async function DocsListPage() {
  const docs = await getDocMetas();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">ドキュメント</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <Link key={doc.id} href={`/docs/${doc.id}`}>
            <Card className="h-full hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{doc.description}</p>
                <time className="text-sm text-muted-foreground">
                  更新日: {new Date(doc.updatedAt).toLocaleDateString("ja-JP")}
                </time>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
