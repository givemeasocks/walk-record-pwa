const PALETTE = ["oklch(0.60 0.13 40)", "oklch(0.60 0.09 230)", "oklch(0.60 0.09 150)"];

export default function WordCloud({
  words,
}: {
  words: { tag: string; count: number }[];
}) {
  if (words.length === 0) {
    return <div className="text-sm text-muted">아직 태그가 없어요</div>;
  }
  const max = Math.max(...words.map((w) => w.count));
  return (
    <div className="flex flex-wrap gap-2.5 items-baseline">
      {words.map((w, i) => {
        const size = 13 + Math.round((w.count / max) * 20);
        const weight = w.count >= 3 ? 700 : w.count >= 2 ? 600 : 500;
        return (
          <span
            key={w.tag}
            className="font-serif"
            style={{ fontSize: size, fontWeight: weight, color: PALETTE[i % PALETTE.length] }}
          >
            {w.tag}
          </span>
        );
      })}
    </div>
  );
}
