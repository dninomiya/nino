import { createAuthClient } from "better-auth/react";
import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { getBaseURL } from "@workspace/lib/get-base-url";
import { auth } from ".";

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [inferAdditionalFields<typeof auth>(), anonymousClient()],
});
