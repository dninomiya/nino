import { NextRequest, NextResponse } from "next/server";

/**
 * Cronエンドポイントの認証を検証します。
 * 本番環境ではCRON_SECRETによるBearer認証をチェックし、
 * 開発環境では常に認証をパスします。
 *
 * @param request - NextRequestオブジェクト
 * @returns 認証に失敗した場合はNextResponse、成功した場合はnull
 */
export function verifyCronAuth(
  request: NextRequest
): NextResponse | null {
  // 開発環境では認証をスキップ
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
