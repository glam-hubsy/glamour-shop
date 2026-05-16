"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import { Product, Category } from "@/types";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import toast from "react-hot-toast";

const emptyForm = {
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  price: "",
  stock: "",
  category: "makeup" as Category,
  image_url: "",
  is_featured: false,
};

export default function AdminPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const save = async () => {
    setLoading(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };
    if (editId) {
      await supabase.from("products").update(payload).eq("id", editId);
      toast.success(isAr ? "تم التحديث" : "Updated");
    } else {
      await supabase.from("products").insert(payload);
      toast.success(isAr ? "تمت الإضافة" : "Added");
    }
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    fetchProducts();
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm(isAr ? "هل تريد الحذف؟" : "Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast.success(isAr ? "تم الحذف" : "Deleted");
    fetchProducts();
  };

  const edit = (p: Product) => {
    setForm({
      name_ar: p.name_ar,
      name_en: p.name_en,
      description_ar: p.description_ar,
      description_en: p.description_en,
      price: String(p.price),
      stock: String(p.stock),
      category: p.category,
      image_url: p.image_url,
      is_featured: p.is_featured,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const categories: Category[] = ["makeup", "perfume", "skincare"];
  const categoryLabels = { makeup: isAr ? "ميك اب" : "Makeup", perfume: isAr ? "عطور" : "Perfume", skincare: isAr ? "سكين كير" : "Skin Care" };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-rose-500" />
          {isAr ? "إدارة المنتجات" : "Product Management"}
        </h1>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600"
        >
          <Plus size={16} />
          {isAr ? "إضافة منتج" : "Add Product"}
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-start text-sm text-gray-500">{isAr ? "الاسم" : "Name"}</th>
              <th className="px-4 py-3 text-start text-sm text-gray-500">{isAr ? "الفئة" : "Category"}</th>
              <th className="px-4 py-3 text-start text-sm text-gray-500">{isAr ? "السعر" : "Price"}</th>
              <th className="px-4 py-3 text-start text-sm text-gray-500">{isAr ? "المخزون" : "Stock"}</th>
              <th className="px-4 py-3 text-start text-sm text-gray-500">{isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{isAr ? p.name_ar : p.name_en}</td>
                <td className="px-4 py-3 text-gray-500">{categoryLabels[p.category]}</td>
                <td className="px-4 py-3 text-rose-500 font-bold">${p.price}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-400"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => edit(p)} className="p-1.5 text-blue-400 hover:text-blue-600">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => del(p.id)} className="p-1.5 text-red-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-12 text-gray-400">{isAr ? "لا توجد منتجات" : "No products yet"}</p>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg my-4">
            <h2 className="text-xl font-bold mb-4">{editId ? (isAr ? "تعديل منتج" : "Edit Product") : (isAr ? "إضافة منتج" : "Add Product")}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input className="border rounded-xl px-3 py-2 text-sm" placeholder={isAr ? "الاسم بالعربي" : "Name in Arabic"} value={form.name_ar} onChange={e => setForm(f => ({...f, name_ar: e.target.value}))} />
                <input className="border rounded-xl px-3 py-2 text-sm" placeholder="Name in English" value={form.name_en} onChange={e => setForm(f => ({...f, name_en: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <textarea className="border rounded-xl px-3 py-2 text-sm" placeholder={isAr ? "الوصف بالعربي" : "Description AR"} rows={2} value={form.description_ar} onChange={e => setForm(f => ({...f, description_ar: e.target.value}))} />
                <textarea className="border rounded-xl px-3 py-2 text-sm" placeholder="Description EN" rows={2} value={form.description_en} onChange={e => setForm(f => ({...f, description_en: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" className="border rounded-xl px-3 py-2 text-sm" placeholder={isAr ? "السعر" : "Price"} value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} />
                <input type="number" className="border rounded-xl px-3 py-2 text-sm" placeholder={isAr ? "المخزون" : "Stock"} value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} />
              </div>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as Category}))}>
                {categories.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
              </select>
              <input className="border rounded-xl px-3 py-2 text-sm w-full" placeholder="Image URL" value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({...f, is_featured: e.target.checked}))} />
                {isAr ? "منتج مميز" : "Featured Product"}
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={save} disabled={loading} className="flex-1 bg-rose-500 text-white py-2 rounded-xl hover:bg-rose-600 disabled:opacity-50">
                {loading ? "..." : (isAr ? "حفظ" : "Save")}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 border py-2 rounded-xl text-gray-600 hover:bg-gray-50">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
