import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { setLocale } from "@/i18n/set-locale";

export default async function MainLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  await setLocale(params);

  return (
    <div>
      <Header />
      <div className="pt-header">{children}</div>
      <Footer />
    </div>
  );
}
