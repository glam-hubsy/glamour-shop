"use client";

import { useEffect, useState } from "react";
import Logo from "./layout/Logo";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("splash_shown");
    if (shown) { setVisible(false); return; }

    const fadeTimer = setTimeout(() => setFadeOut(true), 2400);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("splash_shown", "1");
    }, 3000);

    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0f0f1a] flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-700/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="animate-pulse">
          <Logo size={60} />
        </div>

        {/* Welcome text */}
        <div className="text-center">
          <p className="text-purple-300 text-lg font-light tracking-widest">أهلاً بك</p>
          <p className="text-gray-400 text-sm tracking-widest mt-1">WELCOME</p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-0.5 bg-gray-700 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-purple-500 rounded-full animate-[loading_2.4s_ease-in-out_forwards]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}
