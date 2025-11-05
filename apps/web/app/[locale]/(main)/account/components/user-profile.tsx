import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { currentSession } from "@workspace/auth";
import { getPlanLabel } from "@workspace/lib/plan";
import { PlanId } from "@workspace/lib/plan";

type User = Awaited<ReturnType<typeof currentSession>>["user"];

export default function UserProfile({
  user,
  plan,
}: {
  user: User;
  plan: PlanId | undefined;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {user.image && (
        <Avatar className="size-10 rounded-lg border">
          <AvatarImage src={user.image} />
        </Avatar>
      )}
      <div className="flex-1">
        <h1 className="text-lg leading-none mb-0.5 font-bold">{user.name}</h1>
        {plan ? (
          <p className="text-sm text-muted-foreground">{getPlanLabel(plan)}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            サブスクリプションなし
          </p>
        )}
      </div>
    </div>
  );
}
