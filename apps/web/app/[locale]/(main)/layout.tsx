import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { setCurrentLocale } from "@/lib/i18n/server";

export default async function MainLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const locale = (await params).locale;
  setCurrentLocale(locale);

  return (
    <div>
      <Header />
      <div className="pt-header">{children}</div>
      <Footer />
    </div>
  );
}
