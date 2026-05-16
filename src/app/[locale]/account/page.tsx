"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import OTPModal from "@/components/auth/OTPModal";
import { MapPin, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AccountPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [user, setUser] = useState<any>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error(isAr ? "المتصفح لا يدعم الموقع" : "Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success(isAr ? "تم تحديد موقعك" : "Location detected!");
      },
      () => toast.error(isAr ? "تعذر تحديد الموقع" : "Could not detect location")
    );
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success(isAr ? "تم تسجيل الخروج" : "Logged out");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8" dir={isAr ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isAr ? "حسابي" : "My Account"}
      </h1>

      {!user ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <User className="mx-auto text-rose-300 mb-4" size={48} />
          <p className="text-gray-500 mb-6">
            {isAr ? "سجل دخول للوصول لحسابك" : "Login to access your account"}
          </p>
          <button
            onClick={() => setShowOTP(true)}
            className="bg-rose-500 text-white px-8 py-3 rounded-full font-medium hover:bg-rose-600 transition-colors"
          >
            {isAr ? "تسجيل الدخول" : "Login"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* User Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <User className="text-rose-500" size={22} />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.email}</p>
                <p className="text-sm text-gray-400">
                  {isAr ? "عضو" : "Member"}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="text-rose-500" size={18} />
              {isAr ? "موقعي" : "My Location"}
            </h3>
            {location ? (
              <p className="text-sm text-gray-500">
                {isAr ? "خط العرض" : "Lat"}: {location.lat.toFixed(4)},{" "}
                {isAr ? "خط الطول" : "Lng"}: {location.lng.toFixed(4)}
              </p>
            ) : (
              <button
                onClick={detectLocation}
                className="flex items-center gap-2 text-rose-500 text-sm hover:text-rose-600"
              >
                <MapPin size={16} />
                {isAr ? "تحديد موقعي" : "Detect My Location"}
              </button>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-400 py-3 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            {isAr ? "تسجيل الخروج" : "Logout"}
          </button>
        </div>
      )}

      {showOTP && <OTPModal onClose={() => setShowOTP(false)} />}
    </div>
  );
}
