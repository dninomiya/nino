import { createAuthClient } from "better-auth/react";
import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { baseUrl } from "@workspace/lib/base-url";
import { auth } from ".";

export const authClient = createAuthClient({
  baseURL: baseUrl(),
  plugins: [inferAdditionalFields<typeof auth>(), anonymousClient()],
});
