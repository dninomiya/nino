import { NextRequest, NextResponse } from "next/server";

import { runStatusCron } from "@/lib/status-server";

import { initializeCronRequest } from "../utils";

export async function GET(request: NextRequest) {
  const initResponse = await initializeCronRequest(request);
  if (initResponse) {
    return initResponse;
  }

  try {
    await runStatusCron();

    return NextResponse.json({
      message: "Status cron executed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Status cron failed:", error);
    return NextResponse.json(
      {
        error: "Status cron execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

