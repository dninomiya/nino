import { connection } from "next/server";
import { NextRequest, NextResponse } from "next/server";

import { verifyCronAuth } from "@/lib/cron";

/**
 * Cron エンドポイント用の共通初期化処理。
 * - DB 接続の初期化（`connection()`）
 * - 認証ヘッダーの検証
 *
 * 認証に失敗した場合は `NextResponse` を返すので、
 * 呼び出し側ではそのまま return する。
 */
export async function initializeCronRequest(
  request: NextRequest
): Promise<NextResponse | null> {
  await connection();

  const authError = verifyCronAuth(request);
  if (authError) {
    return authError;
  }

  return null;
}

