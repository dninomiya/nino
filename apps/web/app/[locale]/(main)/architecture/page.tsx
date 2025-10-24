import { ArchitectureFlow } from "./components/architecture-flow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function ArchitecturePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">プロジェクトアーキテクチャ</h1>
        <p className="text-muted-foreground text-lg">
          このプロジェクトのmonorepo構造、パッケージ間の依存関係、データフローを視覚的に確認できます。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📦 Monorepo構造</CardTitle>
            <CardDescription>
              このプロジェクトはpnpm
              workspaceを使用したmonorepo構造になっています。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• apps/web - メインのNext.jsアプリケーション</li>
              <li>• packages/* - 共有パッケージ群</li>
              <li>• Turboを使用したビルド最適化</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔄 データフロー</CardTitle>
            <CardDescription>
              RSSフィードからUI表示までのデータの流れを追跡できます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• RSS/外部API → Cron Jobs</li>
              <li>• Cron Jobs → Database</li>
              <li>• Database → API Routes</li>
              <li>• API Routes → UI Components</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🛠️ 技術スタック</CardTitle>
            <CardDescription>
              使用されている主要な技術とツールです。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Next.js 16 + React 19</li>
              <li>• Drizzle ORM + SQLite</li>
              <li>• Better Auth</li>
              <li>• Tailwind CSS + shadcn/ui</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">アーキテクチャ図</CardTitle>
          <CardDescription>
            ノードをクリックして詳細情報を確認できます。
            ズームやパン操作も可能です。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ArchitectureFlow className="rounded-lg" />
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          この図はリアルタイムで更新され、プロジェクトの現在の状態を反映しています。
        </p>
      </div>
    </div>
  );
}
