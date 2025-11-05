import { db, subscriptions } from "@workspace/db";
import { eq } from "drizzle-orm";
import { cacheLife } from "next/cache";

export const getSubscriptionCount = async () => {
  const res = await db.query.subscriptions.findMany({
    where: eq(subscriptions.status, "active"),
  });

  return res.length;
};
