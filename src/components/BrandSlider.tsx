"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
  {
    name: "Love Generation",
    name_ar: "لوف جينراشين",
    tagline_en: "Love is everywhere ✨",
    tagline_ar: "الحب في كل مكان ✨",
    color: "from-pink-900/80 to-rose-900/60",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&q=85",
    textColor: "text-pink-200",
    accentColor: "bg-pink-500",
  },
  {
    name: "Beauty Bomb",
    name_ar: "بيوتي بامب",
    tagline_en: "No rules, just beauty 💣",
    tagline_ar: "لا حدود للجمال 💣",
    color: "from-orange-900/80 to-yellow-900/60",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1400&q=85",
    textColor: "text-orange-200",
    accentColor: "bg-orange-500",
  },
  {
    name: "Stellary",
    name_ar: "ستيلاري",
    tagline_en: "Luxury redefined 🌟",
    tagline_ar: "الفخامة بأسلوب جديد 🌟",
    color: "from-purple-900/80 to-indigo-900/60",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&q=85",
    textColor: "text-purple-200",
    accentColor: "bg-purple-500",
  },
];

export default function BrandSlider({ isAr, locale }: { isAr: boolean; locale: string }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 500);
  };

  const prev = () => goTo((current - 1 + brands.length) % brands.length);
  const next = () => goTo((current + 1) % brands.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const brand = brands[current];

  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* Background image */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${animating ? "opacity-0" : "opacity-100"}`}>
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${brand.color}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`relative h-full flex flex-col justify-center px-12 md:px-20 transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        dir={isAr ? "rtl" : "ltr"}
      >
        <span className={`text-xs font-bold uppercase tracking-widest ${brand.textColor} mb-3`}>
          {isAr ? "ماركة مميزة" : "Featured Brand"}
        </span>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-2">
          {isAr ? brand.name_ar : brand.name}
        </h2>
        <p className={`text-xl ${brand.textColor} mb-8`}>
          {isAr ? brand.tagline_ar : brand.tagline_en}
        </p>
        <Link
          href={`/${locale}/products`}
          className={`inline-block ${brand.accentColor} hover:opacity-90 text-white px-7 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 w-fit`}
        >
          {isAr ? "تسوقي الماركة" : "Shop Brand"}
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={isAr ? next : prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white p-3 rounded-full transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={isAr ? prev : next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white p-3 rounded-full transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {brands.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
