import { Footer } from "@/components/footer";
import { getMessage, setCurrentLocaleFromParams } from "@/lib/i18n/server";
import { ArrowUpRight } from "lucide-react";

const roles = [
  "テックリード",
  "PM",
  "プレイングマネージャー",
  "スクラムマスター",
  "ITコンサルティング",
  "技術顧問",
  "DX",
  "テクニカルマーケティング",
  "DevRel",
  "開発組織設計",
  "人材育成",
  "CTO",
];

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = await setCurrentLocaleFromParams(params);
  const t = await getMessage("MainPage");

  return (
    <>
      <div className="container">
        <div className="py-20 min-h-content flex justify-center flex-col">
          {locale === "ja" ? (
            <h1 className="text-lg md:text-6xl font-bold mb-8 leading-relaxed md:*:inline-block text-center">
              nino は &nbsp;
              <a
                href="https://nino-plus.notion.site/2b01fc40c97580c4be32d9d4ba9659e1?pvs=105"
                target="_blank"
                className="mx-2 text-muted-foreground/0 hover:text-muted-foreground transition duration-300 underline decoration-muted-foreground"
              >
                オファー
              </a>
              &nbsp; で働いています。
            </h1>
          ) : (
            <h1 className="text-lg md:text-6xl font-bold mb-8 leading-relaxed md:*:inline-block text-center">
              nino is working at
              <a
                href="https://nino-plus.notion.site/2b01fc40c97580c4be32d9d4ba9659e1?pvs=105"
                target="_blank"
                className="mx-[0.5em] text-muted-foreground/0 hover:text-muted-foreground transition duration-300 underline decoration-muted-foreground"
              >
                Offer
              </a>
              .
            </h1>
          )}
          {/* <div className="flex flex-wrap gap-4">
            {roles.map((role) => (
              <div key={role} className="text-2xl font-semibold">
                <span>{role}</span>
              </div>
            ))}
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
}
