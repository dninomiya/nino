import { NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/r/[name]">
) {
  const registryName = (await params).name;

  const file = await fs.readFile(
    process.cwd() + "/_generated/r/" + registryName + ".json",
    "utf8"
  );
  const data = JSON.parse(file);

  return NextResponse.json(data);
}
