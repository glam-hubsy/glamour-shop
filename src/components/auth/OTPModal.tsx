"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import { X, Phone, KeyRound, User, MapPin, MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Step = "phone" | "otp" | "profile";
type Channel = "sms" | "whatsapp";

const countryCodes = [
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "KSA" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
];

export default function OTPModal({ onClose }: { onClose: () => void }) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [step, setStep] = useState<Step>("phone");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [countryCode, setCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    address: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  const fullPhone = countryCode + phoneNumber.replace(/^0/, "");

  const sendOTP = async () => {
    if (!phoneNumber) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
      options: { channel },
    });
    setLoading(false);
    if (error) {
      toast.error(isAr ? "خطأ في إرسال الكود: " + error.message : "Error: " + error.message);
    } else {
      toast.success(
        channel === "whatsapp"
          ? isAr ? "تم إرسال الكود عبر واتساب" : "Code sent via WhatsApp"
          : isAr ? "تم إرسال الكود عبر SMS" : "Code sent via SMS"
      );
      setStep("otp");
    }
  };

  const verifyOTP = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: "sms",
    });
    if (error) {
      setLoading(false);
      toast.error(isAr ? "الكود غلط أو منتهي" : "Invalid or expired code");
      return;
    }
    // Check if profile already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user!.id)
      .single();
    setLoading(false);
    if (existing) {
      toast.success(isAr ? "أهلاً بك!" : "Welcome back!");
      onClose();
    } else {
      setStep("profile");
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfile((p) => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setDetectingLocation(false);
        toast.success(isAr ? "تم تحديد موقعك" : "Location detected");
      },
      () => {
        setDetectingLocation(false);
        toast.error(isAr ? "تعذر تحديد الموقع" : "Could not detect location");
      }
    );
  };

  const saveProfile = async () => {
    if (!profile.first_name || !profile.last_name) {
      toast.error(isAr ? "أدخل الاسم الأول والأخير" : "Enter first and last name");
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").insert({
      id: user!.id,
      phone: fullPhone,
      first_name: profile.first_name,
      last_name: profile.last_name,
      date_of_birth: profile.date_of_birth || null,
      address: profile.address || null,
      lat: profile.lat,
      lng: profile.lng,
    });
    setLoading(false);
    if (error) {
      toast.error(isAr ? "خطأ في حفظ البيانات" : "Error saving profile");
    } else {
      toast.success(isAr ? "تم إنشاء حسابك!" : "Account created!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl my-4" dir={isAr ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {step === "phone" && (isAr ? "تسجيل الدخول" : "Login")}
              {step === "otp" && (isAr ? "أدخل الكود" : "Enter Code")}
              {step === "profile" && (isAr ? "أكمل ملفك الشخصي" : "Complete Profile")}
            </h2>
            {/* Steps indicator */}
            <div className="flex gap-1 mt-1">
              {(["phone", "otp", "profile"] as Step[]).map((s, i) => (
                <div key={s} className={`h-1 w-6 rounded-full transition-colors ${step === s || (step === "otp" && i === 0) || (step === "profile" && i <= 1) ? "bg-rose-500" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Step 1: Phone */}
        {step === "phone" && (
          <div className="space-y-4">
            {/* Channel selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setChannel("whatsapp")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${channel === "whatsapp" ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <MessageCircle size={16} />
                WhatsApp
              </button>
              <button
                onClick={() => setChannel("sms")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${channel === "sms" ? "bg-rose-500 text-white border-rose-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <Phone size={16} />
                SMS
              </button>
            </div>

            {/* Country code + phone */}
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border rounded-xl px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                placeholder={isAr ? "5xxxxxxxx" : "5xxxxxxxx"}
                className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <button
              onClick={sendOTP}
              disabled={loading || !phoneNumber}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isAr ? "إرسال الكود" : "Send Code"}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              {channel === "whatsapp"
                ? isAr ? `تم إرسال كود واتساب لـ ${fullPhone}` : `WhatsApp code sent to ${fullPhone}`
                : isAr ? `تم إرسال SMS لـ ${fullPhone}` : `SMS sent to ${fullPhone}`}
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
              <KeyRound size={18} className="text-rose-400" />
              <span className="text-sm">{isAr ? "الكود المكون من 6 أرقام" : "6-digit code"}</span>
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
              {isAr ? "تحقق" : "Verify"}
            </button>
            <button onClick={() => { setStep("phone"); setOtp(""); }} className="w-full text-sm text-gray-400 hover:text-gray-600 py-1">
              {isAr ? "تغيير الرقم" : "Change number"}
            </button>
          </div>
        )}

        {/* Step 3: Profile */}
        {step === "profile" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-2">
              {isAr ? "أكمل بياناتك لتفعيل حسابك" : "Complete your info to activate your account"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder={isAr ? "الاسم الأول *" : "First name *"}
                value={profile.first_name}
                onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
              />
              <input
                className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder={isAr ? "الاسم الأخير *" : "Last name *"}
                value={profile.last_name}
                onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{isAr ? "تاريخ الميلاد" : "Date of birth"}</label>
              <input
                type="date"
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                value={profile.date_of_birth}
                onChange={(e) => setProfile((p) => ({ ...p, date_of_birth: e.target.value }))}
              />
            </div>
            <input
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder={isAr ? "العنوان (مدينة، شارع...)" : "Address (city, street...)"}
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
            />
            <button
              onClick={detectLocation}
              disabled={detectingLocation}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-colors ${profile.lat ? "bg-green-50 text-green-600 border-green-200" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {detectingLocation ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
              {profile.lat
                ? isAr ? "✓ تم تحديد موقعك" : "✓ Location detected"
                : isAr ? "تحديد موقعي تلقائيًا" : "Detect my location"}
            </button>
            <button
              onClick={saveProfile}
              disabled={loading || !profile.first_name || !profile.last_name}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <User size={18} />}
              {isAr ? "إنشاء الحساب" : "Create Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
