import { baseUrl } from "@/registry/lib/base-url";
import { APP_NAME } from "@workspace/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  metadataBase: new URL(baseUrl()),
  description: "Web Developer",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
