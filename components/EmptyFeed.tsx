import Link from "next/link";

export default function EmptyFeed() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-16">
      <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-accent" />
      </div>
      <div className="flex flex-col gap-1.5 items-center text-center">
        <div className="font-serif text-base font-semibold text-foreground">
          아직 기록이 없어요
        </div>
        <div className="text-[13.5px] text-muted">지금 첫 기록을 남겨보세요</div>
      </div>
      <Link
        href="/capture"
        className="mt-1 h-11 px-5 rounded-full bg-accent text-white flex items-center justify-center text-[13.5px] font-semibold"
      >
        촬영하러 가기
      </Link>
    </div>
  );
}
