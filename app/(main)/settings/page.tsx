import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const initial = email ? email[0].toUpperCase() : "?";

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 px-5 pt-[58px] pb-3.5">
        <div className="font-serif text-[25px] font-semibold text-foreground">설정</div>
      </div>
      <div className="flex-1 overflow-auto px-5 pb-8 flex flex-col gap-5">
        <div className="flex items-center gap-3 p-3.5 bg-surface border border-border rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center font-serif text-lg text-accent">
            {initial}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-[14.5px] font-semibold text-foreground">내 계정</div>
            <div className="font-mono text-[11px] text-muted">{email}</div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-3.5 border-b border-border">
            <div className="text-sm text-foreground">계정 정보</div>
            <div className="text-sm text-muted">›</div>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <div className="text-sm text-foreground">데이터 내보내기</div>
            <div className="font-mono text-[10px] text-muted bg-border px-1.5 py-0.5 rounded-full">
              추후 제공
            </div>
          </div>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}
