import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function InviteNino() {
  const t = await getTranslations("InviteNino");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Send />
          {t("label")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Nino</DialogTitle>
        </DialogHeader>

        <Link href="/profile">
          <Button>プロフィール</Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
