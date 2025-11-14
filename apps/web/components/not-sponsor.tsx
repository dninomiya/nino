import { isSponsor } from "@workspace/auth";

export async function NotSponsor({ children }: { children: React.ReactNode }) {
  const sponsor = await isSponsor();

  if (sponsor) {
    return null;
  }

  return children;
}
