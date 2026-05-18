"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OTPModal from "./OTPModal";

export default function AutoShowModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = async () => {
      const skipped = localStorage.getItem("glamhub_modal_skipped");
      if (skipped) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) return;

      setTimeout(() => setShow(true), 1000);
    };
    check();
  }, []);

  const handleClose = () => {
    localStorage.setItem("glamhub_modal_skipped", "1");
    setShow(false);
  };

  if (!show) return null;
  return <OTPModal onClose={handleClose} />;
}
