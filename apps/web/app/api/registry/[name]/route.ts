import { NextRequest, NextResponse } from "next/server";
import { verifyRegistryJWT } from "@workspace/registry/jwt";
import { getRegistryDocMeta } from "@/lib/registry";
import { isSponsor } from "@workspace/auth";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/registry/[name]">
) {
  // Get token from Authorization header.
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const registryName = (await params).name;

  // Or from query parameters.
  const queryToken = request.nextUrl.searchParams.get("token");

  const metadata = await getRegistryDocMeta(registryName);

  if (metadata.sponsorOnly && !(await isSponsor())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if token is valid.
  if (!verifyRegistryJWT(token || queryToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const component = await import(`@/registry/out/r/${registryName}.json`);

  return NextResponse.json(component);
}
