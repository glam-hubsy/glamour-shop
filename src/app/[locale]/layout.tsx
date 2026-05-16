import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Glamour Shop | متجر غلامور",
  description: "ميك اب | عطور | سكين كير",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className="bg-gray-50 min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
