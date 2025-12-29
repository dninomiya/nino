import { createAuthClient } from "better-auth/react";
import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { auth } from ".";
import { baseUrl } from "@workspace/registry/lib/base-url";

export const authClient = createAuthClient({
  baseURL: baseUrl(),
  plugins: [
    inferAdditionalFields<typeof auth>(),
    anonymousClient(),
  ],
});
