import { ArchitectureFlow } from "./components/architecture-flow";

export default function ArchitecturePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">プロジェクトアーキテクチャ</h1>
        <p className="text-muted-foreground text-lg">
          このプロジェクトのmonorepo構造、パッケージ間の依存関係、データフローを視覚的に確認できます。
        </p>
      </div>

      <ArchitectureFlow className="rounded-lg" />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          この図はリアルタイムで更新され、プロジェクトの現在の状態を反映しています。
        </p>
      </div>
    </div>
  );
}
