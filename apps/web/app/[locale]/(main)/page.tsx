import { Footer } from "@/components/footer";
import { getMessage, setCurrentLocaleFromParams } from "@/lib/i18n/server";
import { OFFER_URL } from "@workspace/lib/constants";
import Link from "next/link";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = await setCurrentLocaleFromParams(params);
  const t = await getMessage("MainPage");

  return (
    <>
      <div>
        <section className="py-20 min-h-content flex justify-center flex-col">
          {locale === "ja" ? (
            <h1 className="text-lg md:text-6xl font-bold leading-relaxed text-center">
              <Link href="/resume" className="text-muted-foreground underline">
                nino
              </Link>{" "}
              は
              <a
                href={OFFER_URL}
                target="_blank"
                className="mx-[0.2em] text-muted-foreground/0 hover:text-muted-foreground transition duration-300 underline decoration-foreground"
              >
                あなたの会社
              </a>
              で働いています。
            </h1>
          ) : (
            <h1 className="text-lg md:text-6xl font-bold leading-relaxed text-center">
              <Link href="/resume" className="text-muted-foreground underline">
                nino
              </Link>{" "}
              work for
              <a
                href={OFFER_URL}
                target="_blank"
                className="mx-[0.2em] text-muted-foreground/0 hover:text-muted-foreground transition duration-300 underline decoration-foreground underline-offset-10"
              >
                Your Company
              </a>
              .
            </h1>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
