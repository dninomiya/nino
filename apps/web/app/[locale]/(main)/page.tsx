import { Footer } from "@/components/footer";
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

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="py-20 min-h-content flex justify-center flex-col">
          <h1 className="text-6xl font-bold mb-8 leading-none">
            nino は
            <a
              href="https://nino-plus.notion.site/2b01fc40c97580c4be32d9d4ba9659e1?pvs=105"
              target="_blank"
              className="border-b-4 duration-400 text-muted-foreground/0 hover:text-muted-foreground text-center px-4 group inline-flex gap-1 mx-3 align-bottom"
            >
              オファー
              <ArrowUpRight />
            </a>
            で働いています。
          </h1>
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
