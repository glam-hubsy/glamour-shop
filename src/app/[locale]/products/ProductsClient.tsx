"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { SlidersHorizontal } from "lucide-react";

const categories = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "makeup", ar: "ميك اب", en: "Makeup" },
  { key: "skincare", ar: "سكين كير", en: "Skin Care" },
];

const usageAreas = [
  { key: "all", ar: "كل المناطق", en: "All Areas" },
  { key: "face", ar: "وجه", en: "Face" },
  { key: "eye", ar: "عين", en: "Eye" },
  { key: "eyebrow", ar: "حواجب", en: "Eyebrow" },
  { key: "lips", ar: "تم", en: "Lips" },
];

export default function ProductsClient() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [usage, setUsage] = useState("all");
  const [brand, setBrand] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"category" | "usage" | "brand">("category");

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase.from("products").select("brand");
      if (data) {
        const unique = [...new Set(data.map((d) => d.brand).filter(Boolean))];
        setBrands(unique);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*");
      if (filterMode === "category" && category !== "all") query = query.eq("category", category);
      if (filterMode === "usage" && usage !== "all") query = query.eq("usage_area", usage);
      if (filterMode === "brand" && brand !== "all") query = query.eq("brand", brand);
      const { data } = await query.order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [category, usage, brand, filterMode]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir={isAr ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{isAr ? "المنتجات" : "Products"}</h1>

      {/* Filter Mode Tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <SlidersHorizontal size={18} className="text-rose-400" />
        {[
          { key: "category", ar: "حسب الفئة", en: "By Category" },
          { key: "usage", ar: "حسب الاستخدام", en: "By Usage" },
          { key: "brand", ar: "حسب الماركة", en: "By Brand" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterMode(tab.key as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterMode === tab.key ? "bg-rose-500 text-white" : "bg-white text-gray-500 border hover:bg-rose-50"
            }`}
          >
            {isAr ? tab.ar : tab.en}
          </button>
        ))}
      </div>

      {/* Filter Options */}
      <div className="flex gap-2 flex-wrap mb-8">
        {filterMode === "category" && categories.map((cat) => (
          <button key={cat.key} onClick={() => setCategory(cat.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.key ? "bg-rose-500 text-white" : "bg-white text-gray-600 hover:bg-rose-50 border"}`}>
            {isAr ? cat.ar : cat.en}
          </button>
        ))}
        {filterMode === "usage" && usageAreas.map((area) => (
          <button key={area.key} onClick={() => setUsage(area.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${usage === area.key ? "bg-rose-500 text-white" : "bg-white text-gray-600 hover:bg-rose-50 border"}`}>
            {isAr ? area.ar : area.en}
          </button>
        ))}
        {filterMode === "brand" && (
          <>
            <button onClick={() => setBrand("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${brand === "all" ? "bg-rose-500 text-white" : "bg-white text-gray-600 hover:bg-rose-50 border"}`}>
              {isAr ? "كل الماركات" : "All Brands"}
            </button>
            {brands.map((b) => (
              <button key={b} onClick={() => setBrand(b)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${brand === b ? "bg-rose-500 text-white" : "bg-white text-gray-600 hover:bg-rose-50 border"}`}>
                {b}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🛍️</div>
          <p>{isAr ? "لا توجد منتجات" : "No products found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
