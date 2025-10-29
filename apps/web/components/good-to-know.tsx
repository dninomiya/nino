import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function GoodToKnow({ children }: { children: React.ReactNode }) {
  return (
    <Card className="text-sm py-0 gap-0">
      <CardHeader className="not-prose border-b gap-0 p-4!">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-4" />
          知っておくと良いこと
        </CardTitle>
      </CardHeader>
      <CardContent className="*:my-0 p-4">{children}</CardContent>
    </Card>
  );
}
