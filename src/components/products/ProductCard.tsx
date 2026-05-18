"use client";

import { useTranslations, useLocale } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import Image from "next/image";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const t = useTranslations("product");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);

  const name = locale === "ar" ? product.name_ar : product.name_en;

  const handleAdd = () => {
    if (product.stock === 0) return;
    addItem(product);
    toast.success(locale === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative h-56 bg-pink-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-rose-200 text-6xl">
            ✨
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-2 start-2 bg-[#e91e8c] text-white text-xs px-2 py-1 rounded-full">
            {locale === "ar" ? "مميز" : "Featured"}
          </span>
        )}
      </div>

      <div className="p-4" dir={locale === "ar" ? "rtl" : "ltr"}>
        <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-[#e91e8c] font-bold mt-1">${product.price}</p>

        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${product.stock > 0 ? "text-green-500" : "text-red-400"}`}>
            {product.stock > 0 ? t("in_stock") : t("out_of_stock")}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex items-center gap-1 bg-[#e91e8c] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#c2177a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            {t("add_to_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
