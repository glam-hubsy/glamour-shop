"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ShoppingCart, User, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("nav");
  const tCat = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartStore((s) => s.count());

  const otherLocale = locale === "ar" ? "en" : "ar";
  const switchLocale = () => {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    router.push(newPath);
  };

  const categories = ["makeup", "perfume", "skincare"] as const;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl font-bold text-rose-500">
            Glamour
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}`} className="text-gray-600 hover:text-rose-500 transition-colors">
              {t("home")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${locale}/products?category=${cat}`}
                className="text-gray-600 hover:text-rose-500 transition-colors"
              >
                {tCat(cat)}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={switchLocale}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-rose-500 transition-colors"
            >
              <Globe size={16} />
              {otherLocale === "ar" ? "العربية" : "English"}
            </button>

            <Link href={`/${locale}/cart`} className="relative p-2">
              <ShoppingCart className="text-gray-600 hover:text-rose-500 transition-colors" size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <Link href={`/${locale}/account`} className="p-2">
              <User className="text-gray-600 hover:text-rose-500 transition-colors" size={22} />
            </Link>

            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t flex flex-col gap-3">
            <Link href={`/${locale}`} className="text-gray-600" onClick={() => setMenuOpen(false)}>
              {t("home")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${locale}/products?category=${cat}`}
                className="text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                {tCat(cat)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
