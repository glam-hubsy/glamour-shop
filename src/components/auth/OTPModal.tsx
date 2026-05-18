"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import { X, Phone, KeyRound, User, MapPin, Loader2, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

type Step = "register" | "otp";

const countryCodes = [
  { code: "+963", flag: "🇸🇾", name: "Syria" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "KSA" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
];

const syrianCities = [
  { ar: "دمشق", en: "Damascus" },
  { ar: "ريف دمشق", en: "Damascus Countryside" },
  { ar: "حلب", en: "Aleppo" },
  { ar: "حمص", en: "Homs" },
  { ar: "حماة", en: "Hama" },
  { ar: "اللاذقية", en: "Latakia" },
  { ar: "طرطوس", en: "Tartus" },
  { ar: "إدلب", en: "Idlib" },
  { ar: "دير الزور", en: "Deir ez-Zor" },
  { ar: "الرقة", en: "Raqqa" },
  { ar: "الحسكة", en: "Hasakah" },
  { ar: "درعا", en: "Daraa" },
  { ar: "السويداء", en: "As-Suwayda" },
  { ar: "القنيطرة", en: "Quneitra" },
];

export default function OTPModal({ onClose }: { onClose: () => void }) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [step, setStep] = useState<Step>("register");
  const [countryCode, setCountryCode] = useState("+963");
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    address: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  const fullPhone = countryCode + form.phone.replace(/^0/, "");

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setDetectingLocation(false);
        toast.success(isAr ? "تم تحديد موقعك" : "Location detected");
      },
      () => {
        setDetectingLocation(false);
        toast.error(isAr ? "تعذر تحديد الموقع" : "Could not detect location");
      }
    );
  };

  const sendOTP = async () => {
    if (!form.first_name || !form.last_name || !form.phone || !form.city) {
      toast.error(isAr ? "الرجاء تعبئة الحقول المطلوبة *" : "Please fill required fields *");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: fullPhone }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(isAr ? "خطأ في إرسال الكود" : "Error sending code");
    } else {
      toast.success(isAr ? "تم إرسال كود التحقق" : "Verification code sent");
      setStep("otp");
    }
  };

  const verifyOTP = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: fullPhone, code: otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      toast.error(isAr ? "الكود غلط أو منتهي" : "Invalid or expired code");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      token_hash: data.token_hash,
      type: "email",
    });

    if (error) {
      setLoading(false);
      toast.error(isAr ? "خطأ في تسجيل الدخول" : "Login error");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user!.id)
      .single();

    if (!existing) {
      await supabase.from("profiles").insert({
        id: user!.id,
        phone: fullPhone,
        first_name: form.first_name,
        last_name: form.last_name,
        city: form.city,
        address: form.address || null,
        lat: form.lat,
        lng: form.lng,
      });
    }

    setLoading(false);
    toast.success(isAr ? "أهلاً بك في GlamHub!" : "Welcome to GlamHub!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl my-4" dir={isAr ? "rtl" : "ltr"}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {step === "register"
                ? isAr ? "إنشاء حساب" : "Create Account"
                : isAr ? "تأكيد الهاتف" : "Verify Phone"}
            </h2>
            <div className="flex gap-1 mt-1">
              {(["register", "otp"] as Step[]).map((s, i) => (
                <div key={s} className={`h-1 w-8 rounded-full transition-colors ${step === s || (step === "otp" && i === 0) ? "bg-rose-500" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex flex-col items-center gap-0.5">
            <X size={20} />
            <span className="text-xs">{isAr ? "تخطي" : "Skip"}</span>
          </button>
        </div>

        {/* Step 1: Register Form */}
        {step === "register" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">{isAr ? "* الحقول المطلوبة" : "* Required fields"}</p>

            {/* Name */}
            <div className="grid grid-cols-2 gap-2">
              <input
                className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder={isAr ? "الاسم الأول *" : "First name *"}
                value={form.first_name}
                onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
              />
              <input
                className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder={isAr ? "الاسم الأخير *" : "Last name *"}
                value={form.last_name}
                onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
              />
            </div>

            {/* Phone */}
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border rounded-xl px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))}
                placeholder={isAr ? "رقم الهاتف *" : "Phone number *"}
                className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            {/* City */}
            <div className="relative">
              <select
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 appearance-none"
              >
                <option value="">{isAr ? "المحافظة *" : "Province *"}</option>
                {syrianCities.map((c) => (
                  <option key={c.en} value={isAr ? c.ar : c.en}>
                    {isAr ? c.ar : c.en}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Address */}
            <input
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder={isAr ? "عنوان السكن (حي، شارع...)" : "Home address (neighborhood, street...)"}
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            />

            {/* Location */}
            <button
              onClick={detectLocation}
              disabled={detectingLocation}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-colors ${form.lat ? "bg-green-50 text-green-600 border-green-200" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {detectingLocation ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
              {form.lat
                ? isAr ? "✓ تم تحديد موقعك" : "✓ Location detected"
                : isAr ? "تحديد موقعي تلقائيًا" : "Detect my location"}
            </button>

            {/* Submit */}
            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Phone size={18} />}
              {isAr ? "إرسال كود التحقق" : "Send Verification Code"}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              {isAr ? `تم إرسال كود التحقق إلى ${fullPhone}` : `Verification code sent to ${fullPhone}`}
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <KeyRound size={18} className="text-rose-400" />
              <span className="text-sm">{isAr ? "أدخل الكود المكون من 6 أرقام" : "Enter the 6-digit code"}</span>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && verifyOTP()}
              placeholder="000000"
              maxLength={6}
              className="w-full border rounded-xl px-4 py-3 text-center text-3xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              onClick={verifyOTP}
              disabled={loading || otp.length < 6}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isAr ? "تفعيل الحساب" : "Activate Account"}
            </button>
            <button
              onClick={() => { setStep("register"); setOtp(""); }}
              className="w-full text-sm text-gray-400 hover:text-gray-600 py-1"
            >
              {isAr ? "← تعديل البيانات" : "← Edit info"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
