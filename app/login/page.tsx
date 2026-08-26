"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit() {
    if (!email || !pw) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.replace("/feed");
    } else {
      const { error } = await supabase.auth.signUp({ email, password: pw });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setNotice("가입 확인 메일을 보냈어요. 메일함을 확인해주세요.");
      setMode("signin");
    }
  }

  return (
    <div className="flex-1 flex flex-col px-7 pt-[76px] pb-10 gap-8 min-h-screen">
      <div className="flex flex-col items-center gap-2.5">
        <div className="w-12 h-12 rounded-full border-[1.6px] border-accent flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-accent-soft" />
        </div>
        <div className="font-serif text-xl font-semibold text-foreground">탐험기록</div>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="h-12 rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none"
        />
      </div>

      {error && <div className="text-sm text-red-600 -mt-4">{error}</div>}
      {notice && <div className="text-sm text-accent -mt-4">{notice}</div>}

      <div className="flex flex-col gap-3.5">
        <button
          onClick={submit}
          disabled={loading}
          className="h-[50px] rounded-2xl bg-accent text-white font-semibold text-[15px] disabled:opacity-60 cursor-pointer"
        >
          {loading ? "처리 중..." : mode === "signin" ? "로그인" : "회원가입"}
        </button>
      </div>

      <button
        onClick={() => {
          setMode((m) => (m === "signin" ? "signup" : "signin"));
          setError(null);
          setNotice(null);
        }}
        className="text-center text-sm text-muted"
      >
        {mode === "signin" ? (
          <>
            계정이 없으신가요? <span className="text-accent font-semibold">회원가입</span>
          </>
        ) : (
          <>
            이미 계정이 있나요? <span className="text-accent font-semibold">로그인</span>
          </>
        )}
      </button>
    </div>
  );
}
