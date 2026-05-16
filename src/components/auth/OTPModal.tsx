"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import { X, Mail, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

export default function OTPModal({ onClose }: Props) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("otp_sent"));
      setStep("otp");
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp) return;
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("welcome") + "!");
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">{t("login")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {step === "email" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <Mail size={20} />
              <span className="text-sm text-gray-600">{t("email")}</span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              onClick={sendOTP}
              disabled={loading || !email}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : t("send_otp")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <KeyRound size={20} />
              <span className="text-sm text-gray-600">{t("enter_otp")}</span>
            </div>
            <p className="text-sm text-gray-400">{t("otp_sent")}: {email}</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              onClick={verifyOTP}
              disabled={loading || otp.length < 6}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : t("verify")}
            </button>
            <button
              onClick={() => setStep("email")}
              className="w-full text-sm text-gray-400 hover:text-gray-600"
            >
              {locale === "ar" ? "تغيير البريد" : "Change email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
