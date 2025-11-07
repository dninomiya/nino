"use client";

import mermaid from "mermaid";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface ArchitectureFlowProps {
  className?: string;
}

const mermaidDiagram = `
flowchart TD
    %% External Services Group
    subgraph Services["Infrastructure & Services"]
        direction LR
        Vercel[Vercel<br/>ホスティング]
        GitHub[GitHub<br/>ソースコード管理]
        Sentry[Sentry<br/>エラー監視・パフォーマンス監視]
        Turso[(Turso<br/>データベース)]
        Stripe[Stripe<br/>決済]
        Resend[Resend<br/>メール送信]
        AIGateway[Vercel AI Gateway<br/>AI Gateway]
        CloudflareR2[Cloudflare R2<br/>ストレージ]
        Discord[Discord<br/>通知]
        Notion[Notion<br/>統合]
    end

    %% Application Group
    subgraph Application["Application"]
        WebApp[Web App<br/>Next.js 16 メインアプリケーション]
    end

    %% Packages Group
    subgraph Packages["Packages"]
        direction TB
        DBPackage[Database Package<br/>ORM・スキーマ管理・マイグレーション]
        AuthPackage[Auth Package<br/>Better Auth 認証システム]
        UIPackage[UI Package<br/>共有UIコンポーネント]
        LibPackage[Lib Package<br/>定数、ユーティリティ]
        DiscordPackage[Discord Package<br/>Discord通知システム]
        RegistryPackage[Registry Package<br/>レジストリシステム]
        StoragePackage[Storage Package<br/>Cloudflare R2ストレージ]
    end

    %% Package dependencies
    AuthPackage -->|authスキーマ生成| DBPackage
    AuthPackage --> LibPackage
    AuthPackage --> RegistryPackage
    UIPackage --> LibPackage
    RegistryPackage --> UIPackage

    %% Connections from packages to Web App
    DBPackage --> WebApp
    AuthPackage --> WebApp
    UIPackage --> WebApp
    LibPackage --> WebApp
    DiscordPackage --> WebApp
    RegistryPackage --> WebApp
    StoragePackage --> WebApp

    %% External service connections
    WebApp -->|直接使用| AIGateway
    WebApp -->|直接使用| Resend
    WebApp --> Sentry
    StoragePackage --> CloudflareR2
    DiscordPackage --> Discord
    AuthPackage -->|webhookイベント| Stripe
    AuthPackage -->|顧客の作成| Stripe
    AuthPackage -->|統合| Notion
    DBPackage <--> Turso
    GitHub -->|デプロイ| Vercel
    GitHub -->|マイグレーション| Turso

    %% CSS Classes
    class WebApp appClass
    class DBPackage,AuthPackage,UIPackage,LibPackage,DiscordPackage,RegistryPackage,StoragePackage packageClass
    class Vercel,GitHub,Sentry,Stripe,Resend,AIGateway,CloudflareR2,Discord,Notion baasClass
    class Turso databaseClass
`;

export function ArchitectureFlow({ className }: ArchitectureFlowProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!mermaidRef.current) return;

    const renderMermaid = async () => {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        securityLevel: "loose",
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
        },
      });

      const id = `mermaid-diagram-${Date.now()}`;
      mermaidRef.current!.innerHTML = "";

      mermaid.render(id, mermaidDiagram).then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      });
    };

    renderMermaid();
  }, [resolvedTheme]);

  return (
    <div className={`w-full mermaid ${className}`}>
      <div
        ref={mermaidRef}
        className="flex justify-center items-center min-h-[600px]"
      />
    </div>
  );
}
