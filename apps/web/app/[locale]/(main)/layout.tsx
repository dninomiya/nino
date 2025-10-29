import { Header } from "@/components/header";
import { setCurrentLocaleFromParams } from "@/lib/i18n/server";

export default async function MainLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  await setCurrentLocaleFromParams(params);

  return (
    <div>
      <Header />
      <div className="pt-header">{children}</div>
    </div>
  );
}
