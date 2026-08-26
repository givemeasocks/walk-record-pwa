"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ONBOARDING_KEY = "walk_onboarding_done";

const SLIDES = [
  {
    title: "산책하다 마음에 드는 장면을 찍으세요",
    body: "골목, 하늘, 고양이... 눈에 들어오는 순간을 그대로 담아보세요.",
  },
  {
    title: "AI가 감성 캡션을 붙여줘요",
    body: "사진 속 분위기를 읽어 캡션과 태그, 무드를 자동으로 기록해요.",
  },
  {
    title: "지도에 나만의 탐험 기록이 쌓여요",
    body: "걸었던 길과 찍었던 장면이 한눈에 남아요.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);

  function finish() {
    localStorage.setItem(ONBOARDING_KEY, "1");
    router.replace("/login");
  }

  function next() {
    if (idx < SLIDES.length - 1) setIdx((i) => i + 1);
    else finish();
  }

  const slide = SLIDES[idx];

  return (
    <div className="flex-1 flex flex-col px-7 pt-[70px] pb-8 min-h-screen">
      <div className="flex justify-end">
        <button onClick={finish} className="text-sm text-muted">
          건너뛰기
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-[190px] h-[190px] rounded-3xl bg-accent-soft flex items-center justify-center flex-shrink-0" />
        <div className="flex flex-col gap-2.5 px-1.5">
          <div className="font-serif text-xl font-semibold text-foreground">
            {slide.title}
          </div>
          <div className="text-sm leading-relaxed text-muted">{slide.body}</div>
        </div>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === idx ? 22 : 7,
                background: i === idx ? "var(--accent)" : "var(--border)",
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full h-13 py-3.5 rounded-2xl bg-accent text-white font-semibold cursor-pointer"
        >
          {idx < SLIDES.length - 1 ? "다음" : "시작하기"}
        </button>
      </div>
    </div>
  );
}
