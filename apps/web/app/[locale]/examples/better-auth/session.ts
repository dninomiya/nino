import "server-only";

import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};

export const currentSession = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/examples/better-auth/login");
  }

  return session;
};
