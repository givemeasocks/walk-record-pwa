import Link from "next/link";
import Image from "next/image";
import type { WalkRecord } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function RecordCard({ record }: { record: WalkRecord }) {
  return (
    <Link
      href={`/record/${record.id}`}
      className="flex gap-3 p-3 mb-3 bg-surface border border-border rounded-2xl"
    >
      <div className="w-[78px] h-[78px] flex-shrink-0 rounded-xl overflow-hidden relative bg-accent-soft">
        <Image
          src={record.photo_url}
          alt={record.caption}
          fill
          sizes="78px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="font-serif text-[14.5px] leading-snug text-foreground line-clamp-2">
          {record.caption}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {record.tags.slice(0, 3).map((tag) => (
            <div
              key={tag}
              className="font-mono text-[10px] text-accent bg-accent-soft px-1.5 py-0.5 rounded-full"
            >
              {tag}
            </div>
          ))}
        </div>
        <div className="font-mono text-[10px] text-muted truncate">
          {record.mood} · {formatDate(record.created_at)} · {record.location_name ?? "위치 미상"}
        </div>
      </div>
    </Link>
  );
}
