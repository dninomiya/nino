export const metadata = {
  title: "スポンサー",
  description: "発信や活動を支えてくれるスポンサーを募集しています。",
};

import { Footer } from "@/components/footer";
import Content from "./content.mdx";

export default function SponsorsPage() {
  return (
    <>
      <div className="prose py-10 prose-neutral container dark:prose-invert">
        <Content />
      </div>
      <Footer />
    </>
  );
}
