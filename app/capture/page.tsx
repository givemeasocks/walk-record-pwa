"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImage, reverseGeocode } from "@/lib/file";
import { generateCaption, type CaptionResult } from "@/lib/generateCaption";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

type Step = "select" | "preview" | "picklocation" | "analyzing" | "result" | "saving";

export default function CapturePage() {
  const router = useRouter();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("select");
  const [compressed, setCompressed] = useState<{ blob: Blob; base64: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "locating" | "ok" | "denied">("idle");
  const [result, setResult] = useState<CaptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);

  async function pickFile(f: File) {
    setError(null);
    setPreparing(true);
    try {
      const c = await compressImage(f);
      setCompressed(c);
      setPreviewUrl(URL.createObjectURL(c.blob));
      setStep("preview");
      locate();
    } catch {
      setError("사진을 처리하지 못했습니다. 다른 사진으로 시도해주세요.");
    } finally {
      setPreparing(false);
    }
  }

  function locate() {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setGeoStatus("ok");
        const name = await reverseGeocode(lat, lng);
        setLocationName(name);
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function retake() {
    setCompressed(null);
    setPreviewUrl(null);
    setCoords(null);
    setLocationName(null);
    setGeoStatus("idle");
    setStep("select");
  }

  async function usePhoto() {
    if (!compressed || !coords) return;
    setStep("analyzing");
    setError(null);
    try {
      const res = await generateCaption(compressed.base64, "image/jpeg");
      setResult(res);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "캡션 생성에 실패했습니다.");
      setStep("preview");
    }
  }

  async function save() {
    if (!compressed || !coords || !result) return;
    setStep("saving");
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const path = `${user.id}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("walk-photos")
      .upload(path, compressed.blob, { contentType: "image/jpeg" });

    if (uploadError) {
      setError("사진 업로드에 실패했습니다: " + uploadError.message);
      setStep("result");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("walk-photos").getPublicUrl(path);

    const { error: insertError } = await supabase.from("walk_records").insert({
      user_id: user.id,
      photo_url: publicUrl,
      caption: result.caption,
      tags: result.tags,
      mood: result.mood,
      lat: coords.lat,
      lng: coords.lng,
      location_name: locationName,
    });

    if (insertError) {
      setError("저장에 실패했습니다: " + insertError.message);
      setStep("result");
      return;
    }

    router.replace("/feed");
    router.refresh();
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pickFile(f);
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pickFile(f);
        }}
      />

      {step === "select" && (
        <div className="flex-1 flex flex-col">
          <div className="pt-[58px] pb-3.5 px-5 flex items-center gap-3.5">
            <button onClick={() => router.push("/feed")} className="text-lg text-foreground">
              ‹
            </button>
            <div className="font-serif text-lg font-semibold text-foreground">기록하기</div>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-4 px-7">
            {error && <div className="text-sm text-red-600 text-center">{error}</div>}
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={preparing}
              className="h-[130px] rounded-2xl border-[1.5px] border-dashed border-border bg-surface flex flex-col items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {preparing ? (
                <div className="w-6 h-6 rounded-full border-[2.5px] border-border border-t-accent animate-spin" />
              ) : (
                <div className="w-[34px] h-[26px] border-[2.2px] border-accent rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full border-[2.2px] border-accent" />
                </div>
              )}
              <div className="text-[14.5px] font-semibold text-foreground">
                {preparing ? "사진 준비 중..." : "카메라로 촬영"}
              </div>
            </button>
            <button
              onClick={() => galleryInputRef.current?.click()}
              disabled={preparing}
              className="h-[130px] rounded-2xl border-[1.5px] border-dashed border-border bg-surface flex flex-col items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <div className="w-[34px] h-[26px] border-[2.2px] border-[oklch(0.60_0.09_230)] rounded-md" />
              <div className="text-[14.5px] font-semibold text-foreground">갤러리에서 선택</div>
            </button>
          </div>
        </div>
      )}

      {step === "preview" && previewUrl && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="pt-[58px] pb-3.5 px-5 flex items-center gap-3.5">
            <button onClick={retake} className="text-lg text-foreground">
              ‹
            </button>
            <div className="font-serif text-lg font-semibold text-foreground">미리보기</div>
          </div>
          <div className="flex-1 px-5 pb-6 flex flex-col gap-4 min-h-0">
            <div className="flex-1 rounded-2xl overflow-hidden bg-accent-soft relative min-h-0">
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            </div>

            {geoStatus === "ok" && (
              <div className="self-start font-mono text-[11px] text-[oklch(0.60_0.09_230)] bg-[oklch(0.93_0.02_230)] px-3 py-1.5 rounded-full">
                위치 확인됨 {locationName ? `· ${locationName}` : ""}
              </div>
            )}
            {geoStatus === "locating" && (
              <div className="self-start font-mono text-[11px] text-muted bg-border px-3 py-1.5 rounded-full">
                위치 확인 중...
              </div>
            )}
            {geoStatus === "denied" && (
              <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
                <span>위치를 가져올 수 없어요</span>
                <button
                  onClick={() => setStep("picklocation")}
                  className="text-accent font-semibold underline"
                >
                  지도에서 선택
                </button>
              </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex gap-3">
              <button
                onClick={retake}
                className="flex-1 h-[50px] rounded-2xl border-[1.4px] border-foreground text-foreground text-sm font-semibold"
              >
                다시 찍기
              </button>
              <button
                onClick={usePhoto}
                disabled={!coords}
                className="flex-1 h-[50px] rounded-2xl bg-accent text-white text-sm font-semibold disabled:opacity-50"
              >
                사용하기
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "picklocation" && (
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="pt-[58px] pb-3.5 px-5 flex items-center gap-3.5">
            <button onClick={() => setStep("preview")} className="text-lg text-foreground">
              ‹
            </button>
            <div className="font-serif text-lg font-semibold text-foreground">위치 선택</div>
          </div>
          <div className="flex-1 min-h-0 relative">
            <MapPicker
              value={coords}
              onPick={async (lat, lng) => {
                setCoords({ lat, lng });
                setGeoStatus("ok");
                const name = await reverseGeocode(lat, lng);
                setLocationName(name);
              }}
            />
          </div>
          <div className="px-5 py-4">
            <button
              onClick={() => setStep("preview")}
              disabled={!coords}
              className="w-full h-[50px] rounded-2xl bg-accent text-white text-sm font-semibold disabled:opacity-50"
            >
              이 위치 사용하기
            </button>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 min-h-screen">
          <div className="w-[52px] h-[52px] rounded-full border-[3px] border-border border-t-accent animate-spin" />
          <div className="font-serif text-[15px] text-foreground">AI가 감성을 읽는 중입니다</div>
          <div className="font-mono text-[11px] text-muted">잠시만 기다려주세요...</div>
        </div>
      )}

      {(step === "result" || step === "saving") && result && previewUrl && (
        <div className="flex-1 flex flex-col min-h-0 animate-fade-up">
          <div className="pt-[58px] pb-3.5 px-5 flex items-center justify-between">
            <div className="font-serif text-lg font-semibold text-foreground">기록 완성</div>
            <button onClick={() => router.push("/feed")} className="text-base text-muted">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-auto px-5 pb-6 flex flex-col gap-3.5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-accent-soft flex-shrink-0">
              <img src={previewUrl} alt="result" className="w-full h-full object-cover" />
            </div>
            <div className="font-serif text-[17px] leading-relaxed text-foreground">
              {result.caption}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {result.tags.map((tag) => (
                <div
                  key={tag}
                  className="font-mono text-[11px] text-accent bg-accent-soft px-2.5 py-1 rounded-full"
                >
                  {tag}
                </div>
              ))}
            </div>
            <div className="self-start font-mono text-[11px] text-[oklch(0.5_0.1_85)] bg-[oklch(0.94_0.05_85)] px-3 py-1.5 rounded-full">
              {result.mood}
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              onClick={save}
              disabled={step === "saving"}
              className="h-[50px] rounded-2xl bg-accent text-white text-[15px] font-semibold mt-1.5 disabled:opacity-60"
            >
              {step === "saving" ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
