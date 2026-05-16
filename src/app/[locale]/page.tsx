import { useTranslations } from "next-intl";
import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Hero */}
      <HeroSection locale={locale} />

      {/* Categories */}
      <CategoriesSection locale={locale} />
    </div>
  );
}

function HeroSection({ locale }: { locale: string }) {
  return (
    <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-24 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-center select-none pointer-events-none">
        ✨💄🌸
      </div>
      <div className="relative max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {locale === "ar" ? "جمالك، أسلوبك" : "Your Beauty, Your Style"}
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          {locale === "ar"
            ? "اكتشفي أفضل منتجات الميك اب والعطور والعناية بالبشرة"
            : "Discover the best makeup, perfume and skincare products"}
        </p>
        <Link
          href={`/${locale}/products`}
          className="inline-block bg-rose-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-rose-600 transition-colors shadow-lg"
        >
          {locale === "ar" ? "تسوقي الآن" : "Shop Now"}
        </Link>
      </div>
    </section>
  );
}

function CategoriesSection({ locale }: { locale: string }) {
  const categories = [
    {
      key: "makeup",
      icon: "💄",
      label_ar: "ميك اب",
      label_en: "Makeup",
      color: "from-rose-100 to-pink-100",
    },
    {
      key: "skincare",
      icon: "✨",
      label_ar: "سكين كير",
      label_en: "Skin Care",
      color: "from-emerald-100 to-teal-100",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        {locale === "ar" ? "تسوقي حسب الفئة" : "Shop by Category"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`/${locale}/products?category=${cat.key}`}
            className={`bg-gradient-to-br ${cat.color} rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-sm`}
          >
            <div className="text-5xl mb-4">{cat.icon}</div>
            <h3 className="text-xl font-bold text-gray-700">
              {locale === "ar" ? cat.label_ar : cat.label_en}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
