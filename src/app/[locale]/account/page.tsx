"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import OTPModal from "@/components/auth/OTPModal";
import { MapPin, LogOut, User, Phone, Calendar, Home } from "lucide-react";
import toast from "react-hot-toast";

interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
}

export default function AccountPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);
      }
      setLoading(false);
    };
    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    toast.success(isAr ? "تم تسجيل الخروج" : "Logged out");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8" dir={isAr ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{isAr ? "حسابي" : "My Account"}</h1>

      {!user ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-rose-400" size={32} />
          </div>
          <p className="text-gray-500 mb-6">
            {isAr ? "سجل دخول للوصول لحسابك" : "Login to access your account"}
          </p>
          <button
            onClick={() => setShowOTP(true)}
            className="bg-rose-500 text-white px-8 py-3 rounded-full font-medium hover:bg-rose-600 transition-colors"
          >
            {isAr ? "تسجيل الدخول / إنشاء حساب" : "Login / Create Account"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-rose-500">
                  {profile?.first_name?.[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profile ? `${profile.first_name} ${profile.last_name}` : (isAr ? "مستخدم" : "User")}
                </h2>
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                  {isAr ? "عضو نشط" : "Active Member"}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              {profile?.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-rose-400" />
                  <span dir="ltr">{profile.phone}</span>
                </div>
              )}
              {profile?.date_of_birth && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar size={16} className="text-rose-400" />
                  <span>{new Date(profile.date_of_birth).toLocaleDateString(isAr ? "ar-AE" : "en-US")}</span>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Home size={16} className="text-rose-400" />
                  <span>{profile.address}</span>
                </div>
              )}
              {profile?.lat && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-rose-400" />
                  <span>{isAr ? "تم تحديد الموقع ✓" : "Location saved ✓"}</span>
                </div>
              )}
            </div>
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
