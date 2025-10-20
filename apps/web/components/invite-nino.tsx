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
import { useMessage } from "./i18n-provider";

export async function InviteNino() {
  const t = useMessage("InviteNino");

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
