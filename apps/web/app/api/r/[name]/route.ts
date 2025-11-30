import { NextRequest, NextResponse } from "next/server";
import { verifyRegistryJWT } from "@workspace/registry/jwt";
import { getRegistryDocMeta } from "@/lib/registry";
import { isSponsor } from "@workspace/auth";
import { promises as fs } from "fs";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/r/[name]">
) {
  // Get token from Authorization header.
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const registryName = (await params).name;

  // Or from query parameters.
  const queryToken = request.nextUrl.searchParams.get("token");

  const metadata = await getRegistryDocMeta(registryName);

  if (metadata.sponsors && !(await verifyRegistryJWT(token || queryToken))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const file = await fs.readFile(
    process.cwd() + "/_generated/r/" + registryName + ".json",
    "utf8"
  );
  const data = JSON.parse(file);

  return NextResponse.json(data);
}
