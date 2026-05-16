import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-rose-400">جاري التحميل...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
