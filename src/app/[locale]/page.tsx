import Link from "next/link";
import Image from "next/image";
import { getLocale } from "next-intl/server";

export default async function HomePage() {
  const locale = await getLocale();
  const isAr = locale === "ar";

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <HeroSection isAr={isAr} locale={locale} />
      <CategoriesSection isAr={isAr} locale={locale} />
      <FeaturesSection isAr={isAr} />
      <BannerSection isAr={isAr} locale={locale} />
    </div>
  );
}

function HeroSection({ isAr, locale }: { isAr: boolean; locale: string }) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0f0f1a]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80"
          alt="hero"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/80 to-transparent" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="max-w-xl">
          <span className="inline-block bg-purple-600/20 text-purple-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-purple-500/30">
            {isAr ? "✨ وصل الجديد" : "✨ New Arrivals"}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            {isAr ? (
              <>جمالك<br /><span className="text-purple-400">أسلوبك</span></>
            ) : (
              <>Your Beauty,<br /><span className="text-purple-400">Your Style</span></>
            )}
          </h1>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            {isAr
              ? "اكتشفي أفضل منتجات الميك اب والعناية بالبشرة والعطور المختارة بعناية"
              : "Discover premium makeup, skincare & fragrances curated just for you"}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/products`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-purple-900/40 hover:scale-105"
            >
              {isAr ? "تسوقي الآن" : "Shop Now"}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="border border-purple-400/40 text-purple-300 hover:bg-purple-900/30 px-8 py-3.5 rounded-full font-semibold transition-all"
            >
              {isAr ? "اكتشفي المجموعة" : "Explore Collection"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection({ isAr, locale }: { isAr: boolean; locale: string }) {
  const categories = [
    {
      key: "makeup",
      label_ar: "ميك اب",
      label_en: "Makeup",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
      desc_ar: "أحمر شفاه، ظلال، كونتور",
      desc_en: "Lipstick, Eyeshadow, Contour",
    },
    {
      key: "skincare",
      label_ar: "سكين كير",
      label_en: "Skin Care",
      image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&q=80",
      desc_ar: "سيروم، مرطب، واقي شمس",
      desc_en: "Serum, Moisturizer, SPF",
    },
    {
      key: "perfume",
      label_ar: "عطور",
      label_en: "Perfumes",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
      desc_ar: "عطور فاخرة ومميزة",
      desc_en: "Luxury & Signature Scents",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {isAr ? "تسوقي حسب الفئة" : "Shop by Category"}
        </h2>
        <p className="text-gray-500">{isAr ? "اختاري ما يناسبك" : "Find what suits you best"}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`/${locale}/products?category=${cat.key}`}
            className="group relative overflow-hidden rounded-2xl h-72 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Image
              src={cat.image}
              alt={cat.label_en}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">{isAr ? cat.label_ar : cat.label_en}</h3>
              <p className="text-gray-300 text-sm">{isAr ? cat.desc_ar : cat.desc_en}</p>
            </div>
            <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {isAr ? "تسوقي" : "Shop"}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection({ isAr }: { isAr: boolean }) {
  const features = [
    { icon: "🚚", title_ar: "توصيل سريع", title_en: "Fast Delivery", desc_ar: "توصيل لجميع المحافظات", desc_en: "Delivery across all provinces" },
    { icon: "💎", title_ar: "منتجات أصلية", title_en: "Authentic Products", desc_ar: "100% أصلية ومضمونة", desc_en: "100% genuine & guaranteed" },
    { icon: "↩️", title_ar: "إرجاع سهل", title_en: "Easy Returns", desc_ar: "إرجاع خلال 7 أيام", desc_en: "Returns within 7 days" },
    { icon: "💬", title_ar: "دعم متواصل", title_en: "24/7 Support", desc_ar: "نحن هنا دائماً", desc_en: "We're always here for you" },
  ];

  return (
    <section className="bg-[#0f0f1a] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="text-center p-6">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h4 className="text-white font-semibold mb-1">{isAr ? f.title_ar : f.title_en}</h4>
              <p className="text-gray-400 text-sm">{isAr ? f.desc_ar : f.desc_en}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BannerSection({ isAr, locale }: { isAr: boolean; locale: string }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 to-[#0f0f1a] p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80"
            alt="banner"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative flex-1">
          <span className="text-purple-300 text-sm font-medium mb-3 block">
            {isAr ? "عروض خاصة" : "Special Offers"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isAr ? "خصم 20% على أول طلب" : "20% Off Your First Order"}
          </h2>
          <p className="text-gray-300 mb-6">
            {isAr ? "استخدمي كود GLAMHUB عند الدفع" : "Use code GLAMHUB at checkout"}
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
          >
            {isAr ? "احصلي على الخصم" : "Get Discount"}
          </Link>
        </div>
        <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
            alt="promo"
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
