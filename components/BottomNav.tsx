"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const inactive = "oklch(0.68 0.015 60)";
const active = "oklch(0.60 0.13 40)";

function color(path: string, current: string) {
  return current.startsWith(path) ? active : inactive;
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="flex-shrink-0 sticky bottom-0 relative flex items-center justify-around px-2.5 pt-2.5 pb-6 border-t border-border bg-surface z-20">
      <Link href="/feed" className="flex flex-col items-center gap-1">
        <svg width="20" height="14" viewBox="0 0 20 14">
          <rect y="0" width="20" height="2.4" rx="1.2" fill={color("/feed", pathname)} />
          <rect y="5.8" width="20" height="2.4" rx="1.2" fill={color("/feed", pathname)} />
          <rect y="11.6" width="14" height="2.4" rx="1.2" fill={color("/feed", pathname)} />
        </svg>
        <div className="text-[10px]" style={{ color: color("/feed", pathname) }}>
          피드
        </div>
      </Link>

      <Link href="/map" className="flex flex-col items-center gap-1">
        <div
          className="w-3.5 h-3.5"
          style={{
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
            background: color("/map", pathname),
          }}
        />
        <div className="text-[10px]" style={{ color: color("/map", pathname) }}>
          지도
        </div>
      </Link>

      <Link
        href="/capture"
        className="w-14 h-14 rounded-full bg-accent flex items-center justify-center -mt-8 shadow-lg"
      >
        <div className="w-6 h-[19px] border-2 border-white rounded-md flex items-center justify-center">
          <div className="w-[9px] h-[9px] rounded-full border-2 border-white" />
        </div>
      </Link>

      <Link href="/dashboard" className="flex flex-col items-center gap-1">
        <svg width="18" height="14" viewBox="0 0 18 14">
          <rect x="0" y="6" width="4" height="8" rx="1" fill={color("/dashboard", pathname)} />
          <rect x="7" y="2" width="4" height="12" rx="1" fill={color("/dashboard", pathname)} />
          <rect x="14" y="8" width="4" height="6" rx="1" fill={color("/dashboard", pathname)} />
        </svg>
        <div className="text-[10px]" style={{ color: color("/dashboard", pathname) }}>
          대시보드
        </div>
      </Link>

      <Link href="/settings" className="flex flex-col items-center gap-1">
        <div
          className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: color("/settings", pathname) }}
        >
          <div className="w-[5px] h-[5px] rounded-full" style={{ background: color("/settings", pathname) }} />
        </div>
        <div className="text-[10px]" style={{ color: color("/settings", pathname) }}>
          설정
        </div>
      </Link>
    </div>
  );
}
