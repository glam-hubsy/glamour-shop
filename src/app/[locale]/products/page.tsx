"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/products/ProductCard";
import { Product, Category } from "@/types";

const categories = [
  { key: "all", label_ar: "الكل", label_en: "All" },
  { key: "makeup", label_ar: "ميك اب", label_en: "Makeup" },
  { key: "perfume", label_ar: "عطور", label_en: "Perfume" },
  { key: "skincare", label_ar: "سكين كير", label_en: "Skin Care" },
];

export default function ProductsPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*");
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      const { data } = await query.order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {locale === "ar" ? "المنتجات" : "Products"}
      </h1>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.key
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-600 hover:bg-rose-50 border"
            }`}
          >
            {locale === "ar" ? cat.label_ar : cat.label_en}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🛍️</div>
          <p>{locale === "ar" ? "لا توجد منتجات" : "No products found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
