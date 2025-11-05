import { deleteAccount } from "@workspace/auth/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DeleteAccount() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">アカウントを削除</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>アカウントを削除</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          アカウントを削除すると、すべてのデータが削除され、残り契約に関わらずDiscordの権限やGitHubの閲覧権限もただちに削除されます。
        </DialogDescription>
        <form action={deleteAccount}>
          <Input
            placeholder="「削除」と入力"
            pattern="削除"
            className="mb-4"
            required
          />
          <Button variant="destructive">アカウントを削除</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
