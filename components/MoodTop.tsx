export default function MoodTop({
  moods,
}: {
  moods: { mood: string; count: number; pct: number }[];
}) {
  if (moods.length === 0) {
    return <div className="text-sm text-muted">아직 무드 기록이 없어요</div>;
  }
  return (
    <div className="flex flex-col gap-3">
      {moods.map((m) => (
        <div key={m.mood} className="flex items-center gap-2.5">
          <div className="w-[78px] flex-shrink-0 font-serif text-[13px] text-foreground truncate">
            {m.mood}
          </div>
          <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-[oklch(0.68_0.11_85)]"
              style={{ width: `${m.pct}%` }}
            />
          </div>
          <div className="w-4 text-right font-mono text-[10.5px] text-muted">{m.count}</div>
        </div>
      ))}
    </div>
  );
}
