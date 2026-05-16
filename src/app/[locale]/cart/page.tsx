"use client";

import { useLocale } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const locale = useLocale();
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const isAr = locale === "ar";

  if (items.length === 0) {
    return (
      <div className="text-center py-24" dir={isAr ? "rtl" : "ltr"}>
        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
        <h2 className="text-xl text-gray-400">{isAr ? "سلتك فارغة" : "Your cart is empty"}</h2>
        <Link
          href={`/${locale}/products`}
          className="inline-block mt-6 bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600"
        >
          {isAr ? "تسوقي الآن" : "Shop Now"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={isAr ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isAr ? "سلة المشتريات" : "Shopping Cart"}
      </h1>

      <div className="space-y-3 mb-8">
        {items.map(({ product, quantity }) => {
          const name = isAr ? product.name_ar : product.name_en;
          return (
            <div key={product.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-16 h-16 bg-rose-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                ✨
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{name}</p>
                <p className="text-rose-500 font-bold">${product.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus size={12} />
                </button>
              </div>
              <p className="font-bold text-gray-800 w-16 text-center">
                ${(product.price * quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(product.id)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">{isAr ? "الإجمالي" : "Total"}</span>
          <span className="text-2xl font-bold text-rose-500">${total().toFixed(2)}</span>
        </div>
        <button className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 transition-colors">
          {isAr ? "إتمام الشراء" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
