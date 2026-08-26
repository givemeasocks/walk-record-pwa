import { createClient } from "@/lib/supabase/server";
import type { WalkRecord } from "@/lib/types";
import { weekdayKo } from "@/lib/format";
import WordCloud from "@/components/WordCloud";
import WeekdayChart from "@/components/WeekdayChart";
import MoodTop from "@/components/MoodTop";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("walk_records").select("*");
  const records = (data ?? []) as WalkRecord[];

  const tagFreq = new Map<string, number>();
  records.forEach((r) => r.tags.forEach((t) => tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1)));
  const wordCloud = [...tagFreq.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  const wdOrder = ["월", "화", "수", "목", "금", "토", "일"];
  const wdCount = new Map(wdOrder.map((d) => [d, 0]));
  records.forEach((r) => {
    const d = weekdayKo(r.created_at);
    wdCount.set(d, (wdCount.get(d) ?? 0) + 1);
  });
  const weekdayBars = wdOrder.map((label) => ({ label, count: wdCount.get(label) ?? 0 }));

  const moodFreq = new Map<string, number>();
  records.forEach((r) => moodFreq.set(r.mood, (moodFreq.get(r.mood) ?? 0) + 1));
  const maxMood = Math.max(1, ...moodFreq.values());
  const moodTop = [...moodFreq.entries()]
    .map(([mood, count]) => ({ mood, count, pct: Math.round((count / maxMood) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 px-5 pt-[58px] pb-3.5">
        <div className="font-serif text-[25px] font-semibold text-foreground">대시보드</div>
      </div>
      <div className="flex-1 overflow-auto px-5 pb-8 flex flex-col gap-[22px]">
        <section className="flex flex-col gap-2.5">
          <div className="font-mono text-[10.5px] text-muted tracking-widest uppercase">
            태그 워드클라우드
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4">
            <WordCloud words={wordCloud} />
          </div>
        </section>

        <section className="flex flex-col gap-2.5">
          <div className="font-mono text-[10.5px] text-muted tracking-widest uppercase">
            요일별 기록
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4">
            <WeekdayChart data={weekdayBars} />
          </div>
        </section>

        <section className="flex flex-col gap-2.5">
          <div className="font-mono text-[10.5px] text-muted tracking-widest uppercase">
            무드 Top
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4">
            <MoodTop moods={moodTop} />
          </div>
        </section>
      </div>
    </div>
  );
}
