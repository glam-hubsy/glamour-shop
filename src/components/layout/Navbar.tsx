"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ShoppingCart, User, Globe, Menu, X, Sparkles } from "lucide-react";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("nav");
  const tCat = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = useCartStore((s) => s.count());
  const isAr = locale === "ar";

  const otherLocale = isAr ? "en" : "ar";
  const switchLocale = () => {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    router.push(newPath);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = ["makeup", "skincare"] as const;

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#0f0f1a] text-[#f48cbf] text-xs py-2 text-center tracking-wide">
        <Sparkles size={12} className="inline mr-1 mb-0.5" />
        {isAr ? "شحن مجاني على الطلبات فوق 500 ل.س" : "Free shipping on orders over 500 SYP"}
        <Sparkles size={12} className="inline ml-1 mb-0.5" />
      </div>

      {/* Main Navbar */}
      <nav
        dir={isAr ? "rtl" : "ltr"}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center shrink-0">
              <Logo size={42} />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href={`/${locale}`}
                className="text-gray-700 hover:text-[#e91e8c] font-medium transition-colors text-sm tracking-wide"
              >
                {t("home")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/products?category=${cat}`}
                  className="text-gray-700 hover:text-[#e91e8c] font-medium transition-colors text-sm tracking-wide"
                >
                  {tCat(cat)}
                </Link>
              ))}
              <Link
                href={`/${locale}/products`}
                className="text-gray-700 hover:text-[#e91e8c] font-medium transition-colors text-sm tracking-wide"
              >
                {isAr ? "كل المنتجات" : "All Products"}
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <button
                onClick={switchLocale}
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#e91e8c] border border-gray-200 hover:border-[#f48cbf] px-3 py-1.5 rounded-full transition-all"
              >
                <Globe size={14} />
                {otherLocale === "ar" ? "العربية" : "English"}
              </button>

              {/* Cart */}
              <Link
                href={`/${locale}/cart`}
                className="relative p-2.5 rounded-full hover:bg-pink-50 transition-colors"
              >
                <ShoppingCart className="text-gray-700 hover:text-[#e91e8c]" size={22} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#e91e8c] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href={`/${locale}/account`}
                className="p-2.5 rounded-full hover:bg-pink-50 transition-colors"
              >
                <User className="text-gray-700 hover:text-[#e91e8c]" size={22} />
              </Link>

              {/* Shop Now button - desktop */}
              <Link
                href={`/${locale}/products`}
                className="hidden md:inline-block bg-[#e91e8c] hover:bg-[#c2177a] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-md shadow-pink-200"
              >
                {isAr ? "تسوقي" : "Shop"}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2.5 rounded-full hover:bg-gray-100"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4 shadow-lg">
            <Link
              href={`/${locale}`}
              className="text-gray-700 font-medium py-1"
              onClick={() => setMenuOpen(false)}
            >
              {t("home")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${locale}/products?category=${cat}`}
                className="text-gray-700 font-medium py-1"
                onClick={() => setMenuOpen(false)}
              >
                {tCat(cat)}
              </Link>
            ))}
            <Link
              href={`/${locale}/products`}
              className="text-gray-700 font-medium py-1"
              onClick={() => setMenuOpen(false)}
            >
              {isAr ? "كل المنتجات" : "All Products"}
            </Link>
            <button
              onClick={() => { switchLocale(); setMenuOpen(false); }}
              className="flex items-center gap-2 text-sm text-gray-600 py-1"
            >
              <Globe size={16} />
              {otherLocale === "ar" ? "العربية" : "English"}
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
