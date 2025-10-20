import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Send } from "lucide-react";
import Link from "next/link";
import { useDictionary } from "./i18n-provider";

export async function InviteNino() {
  const t = useDictionary("InviteNino");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Send />
          {t.label}
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
