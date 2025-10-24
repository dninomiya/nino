import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { SiDiscord } from "@icons-pack/react-simple-icons";

export function HelpBanner() {
  return (
    <Card className="not-prose">
      <CardHeader>
        <CardTitle>Discord で質問する</CardTitle>
        <CardDescription>
          何か気になったこと、分からないことがあれば気軽に質問してください！
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <a
            href="https://discord.com/channels/760351462239895574/1242376090454851594"
            target="_blank"
          >
            <SiDiscord />
            Discordで質問する
            <ArrowUpRight />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
