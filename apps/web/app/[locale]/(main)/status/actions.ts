"use server";

import { runStatusCron } from "@/lib/status-server";

export async function debugRunStatusCron() {
  const result = await runStatusCron();
  return result;
}
