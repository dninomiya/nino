import { NextRequest, NextResponse } from "next/server";

import { fetchAndSaveNewFeedItems } from "@/lib/feed-server";

import { initializeCronRequest } from "../utils";

export async function GET(request: NextRequest) {
  const initResponse = await initializeCronRequest(request);
  if (initResponse) {
    return initResponse;
  }

  try {
    await fetchAndSaveNewFeedItems();

    return NextResponse.json({
      message: "Feed cron executed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Feed cron failed:", error);
    return NextResponse.json(
      {
        error: "Feed cron execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

