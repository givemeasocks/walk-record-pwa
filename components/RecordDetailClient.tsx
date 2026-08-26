"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { WalkRecord } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/format";
import DetailMiniMap from "@/components/DetailMiniMapClient";
import ShareModal from "@/components/ShareModal";

export default function RecordDetailClient({ record }: { record: WalkRecord }) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-h-screen relative">
      <div className="pt-[58px] pb-3.5 px-5 flex items-center justify-between">
        <button onClick={() => router.push("/feed")} className="text-lg text-foreground">
          ‹
        </button>
        <div className="font-serif text-lg font-semibold text-foreground">기록</div>
        <button
          onClick={() => setShareOpen(true)}
          className="text-[13px] font-semibold text-accent"
        >
          공유
        </button>
      </div>

      <div className="flex-1 overflow-auto px-5 pb-8 flex flex-col gap-3.5">
        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-accent-soft flex-shrink-0 relative">
          <Image
            src={record.photo_url}
            alt={record.caption}
            fill
            sizes="(max-width: 480px) 100vw, 420px"
            className="object-cover"
          />
        </div>
        <div className="font-serif text-lg leading-relaxed text-foreground">{record.caption}</div>
        <div className="flex gap-1.5 flex-wrap">
          {record.tags.map((tag) => (
            <div
              key={tag}
              className="font-mono text-[11px] text-accent bg-accent-soft px-2.5 py-1 rounded-full"
            >
              {tag}
            </div>
          ))}
        </div>
        <div className="self-start font-mono text-[11px] text-[oklch(0.5_0.1_85)] bg-[oklch(0.94_0.05_85)] px-3 py-1.5 rounded-full">
          {record.mood}
        </div>
        <div className="font-mono text-[11px] text-muted">
          {formatDate(record.created_at)} · {formatTime(record.created_at)} ·{" "}
          {record.location_name ?? "위치 미상"}
        </div>
        <div className="h-[90px] rounded-xl overflow-hidden">
          <DetailMiniMap lat={record.lat} lng={record.lng} />
        </div>
      </div>

      {shareOpen && <ShareModal record={record} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
