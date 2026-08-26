"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { WalkRecord } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function ShareModal({
  record,
  onClose,
}: {
  record: WalkRecord;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function download() {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement("a");
      link.download = `탐험기록_${formatDate(record.created_at)}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // ignore export failures silently; user can retry
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs bg-white rounded-2xl p-4 flex flex-col gap-3"
      >
        <div
          ref={cardRef}
          className="aspect-[9/16] rounded-xl overflow-hidden relative flex items-end p-4"
        >
          <img
            src={record.photo_url}
            alt={record.caption}
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="relative z-10 flex flex-col gap-1.5">
            <div className="font-serif text-[15px] text-white drop-shadow">{record.caption}</div>
            <div className="font-mono text-[9.5px] text-white/85">
              {record.tags.join(" ")} · {record.location_name ?? ""} · {formatDate(record.created_at)}
            </div>
          </div>
        </div>
        <button
          onClick={download}
          disabled={busy}
          className="h-11 rounded-xl bg-accent text-white text-sm font-semibold disabled:opacity-60"
        >
          {busy ? "이미지 생성 중..." : "이미지로 저장"}
        </button>
        <button
          onClick={onClose}
          className="h-11 rounded-xl border-[1.4px] border-foreground text-foreground text-[13.5px] font-semibold"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
