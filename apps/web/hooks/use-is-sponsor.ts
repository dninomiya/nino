import { authClient } from "@workspace/auth/client";
import useSWR from "swr";

export function useIsSponsor() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const { data: isSponsor, isLoading } = useSWR(
    `${userId}-is-sponsor`,
    async () => {
      if (!userId) return false;

      const subscriptions = await authClient.subscription.list();
      return (
        subscriptions.data?.some(
          (subscription) => subscription.status === "active"
        ) ?? false
      );
    }
  );

  return { isLoading: isLoading || isPending, isSponsor: isSponsor };
}
