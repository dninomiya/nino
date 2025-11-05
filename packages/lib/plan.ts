import { SiDiscord, SiGithub, SiYoutube } from "@icons-pack/react-simple-icons";
import { Headset } from "lucide-react";
import { Brain } from "lucide-react";
import { Code } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { BadgeCheck } from "lucide-react";
import { SiNotion } from "@icons-pack/react-simple-icons";

export const PLANS = [
  {
    id: "community",
    label: "コミュニティプラン",
    priceId: process.env.STRIPE_COMMUNITY_PRICE_ID!,
    annualDiscountPriceId:
      process.env.STRIPE_COMMUNITY_ANNUAL_DISCOUNT_PRICE_ID!,
    discordRoleId: "1214121365825785916",
  },
  {
    id: "mentor",
    label: "メンタープラン",
    priceId: process.env.STRIPE_MENTOR_PRICE_ID!,
    annualDiscountPriceId: process.env.STRIPE_MENTOR_ANNUAL_DISCOUNT_PRICE_ID!,
    discordRoleId: "1207869108679352370",
  },
] as const;

export const getPlanLabel = (planId: string) => {
  return PLANS.find((plan) => plan.id === planId)?.label;
};

export const planDetails: {
  planId: string;
  title: string;
  href: string;
  description: string;
  minPrice: number;
  meeting: boolean;
  features: {
    icon: React.ComponentType<{ className?: string; color?: string }>;
    iconColored?: boolean;
    hot?: boolean;
    label: string;
    description: string;
  }[];
  plans: {
    primary: {
      price: number;
      months: number;
    };
    monthly: {
      price: number;
    };
  };
}[] = [
  {
    planId: "community",
    title: "コミュニティプラン 🔰",
    href: "/community",
    description: "限定教材で勉強したり、勉強会やもくもく会に参加できます。",
    minPrice: 37800 / 12,
    meeting: false,
    features: [
      {
        icon: SiNotion,
        label: "ドキュメント",
        description:
          "メンバー限定の実務レベルの解説記事を閲覧できます。Notionドキュメントなので自分専用の学習セットを作成できます。",
      },
      {
        icon: SiYoutube,
        iconColored: true,
        label: "動画教材",
        description: "メンバー限定の実務的な動画教材を閲覧できます。",
      },
      {
        icon: SiGithub,
        label: "限定リソース",
        description:
          "メンバー限定のGitHubリポジトリにアクセスできます。実務で使えるコードやテンプレートが揃っています。",
      },
    ],
    plans: {
      primary: {
        price: 37800,
        months: 12,
      },
      monthly: {
        price: 3500,
      },
    },
  },
  {
    planId: "mentor",
    title: "メンタープラン 💬",
    href: "/mentor",
    description: "経験豊富なメンターに技術相談ができます。",
    minPrice: 189000 / 6,
    meeting: true,
    plans: {
      primary: {
        price: 189000,
        months: 6,
      },
      monthly: {
        price: 35000,
      },
    },
    features: [
      {
        icon: SiDiscord,
        iconColored: true,
        hot: true,
        label: "質問フリー",
        description:
          "チャットで24時間いつでも質問できます。開発に詰まったり、実装方針を相談したいときに気軽に聞けます。",
      },
      {
        icon: Headset,
        hot: true,
        label: "個別サポートあり",
        description:
          "ミーティング時間で解決しない場合や進捗が遅れている場合、補習として個別サポートを行います。",
      },
      {
        icon: Brain,
        label: "設計支援",
        description:
          "実際の開発に必要な設計やアーキテクチャの相談ができます。実務経験豊富なメンターがサポートします。",
      },
      {
        icon: Code,
        label: "コードレビュー",
        description:
          "定期的にコードをレビューし、改善点やベストプラクティスを提案します。",
      },
      {
        icon: ShieldCheck,
        label: "セキュリティチェック",
        description:
          "アプリケーションのセキュリティに関するチェックを行い、脆弱性を指摘します。",
      },
      {
        icon: BadgeCheck,
        label: "コミュニティプランの内容",
        description: "コミュニティプランの内容も含まれています。",
      },
    ],
  },
];

export type PlanId = (typeof PLANS)[number]["id"];

export const getCommunityPlanPrices = () => {
  const plan = planDetails.find((plan) => plan.planId === "community");
  return plan?.plans!;
};
