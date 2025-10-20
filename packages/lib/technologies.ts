import {
  SiBetterauth,
  SiCloudflare,
  SiDrizzle,
  SiExpo,
  SiFirebase,
  SiNextdotjs,
  SiReacthookform,
  SiResend,
  SiStripe,
  SiSupabase,
  SiTurborepo,
  SiTurso,
  SiVercel,
  SiVitest,
} from "@icons-pack/react-simple-icons";
import { FlaskConical } from "lucide-react";

export const TECHNOLOGIES = {
  "Next.js": {
    icon: SiNextdotjs,
    title: "Next.js",
    description: "精通してます",
  },
  Drizzle: {
    icon: SiDrizzle,
    title: "Drizzle",
    description: "ORM",
  },
  Turso: {
    icon: SiTurso,
    title: "Turso",
    description: "DB",
  },
  BetterAuth: {
    icon: SiBetterauth,
    title: "BetterAuth",
    description: "認証ライブラリ",
  },
  Stripe: {
    icon: SiStripe,
    title: "Stripe",
    description: "決済ライブラリ",
  },
  ReactHookForm: {
    icon: SiReacthookform,
    title: "ReactHookForm",
    description: "Formライブラリ",
  },
  Resend: {
    icon: SiResend,
    title: "Resend",
    description: "メール送信BaaS",
  },
  Vercel: {
    icon: SiVercel,
    title: "Vercel",
    description: "ホスティング",
  },
  Supabase: {
    icon: SiSupabase,
    title: "Supabase",
    description: "BaaS",
  },
  Firebase: {
    icon: SiFirebase,
    title: "Firebase",
    description: "BaaS",
  },
  Turborepo: {
    icon: SiTurborepo,
    title: "Turborepo",
    description: "モノリポ",
  },
  Vitest: {
    icon: SiVitest,
    title: "Vitest",
    description: "テスト",
  },
  Playwright: {
    icon: FlaskConical,
    title: "Playwright",
    description: "E2Eテスト",
  },
  "Cloudflare R2": {
    icon: SiCloudflare,
    title: "Cloudflare R2",
    description: "ストレージ",
  },
  "React Native / Expo": {
    icon: SiExpo,
    title: "React Native / Expo",
    description: "モバイルアプリ開発",
  },
};
