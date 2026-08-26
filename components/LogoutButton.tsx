"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="h-12 rounded-2xl border-[1.4px] border-[oklch(0.55_0.08_35)] text-[oklch(0.5_0.1_35)] text-sm font-semibold"
    >
      로그아웃
    </button>
  );
}
