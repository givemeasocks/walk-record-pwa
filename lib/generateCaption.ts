export type CaptionResult = {
  caption: string;
  tags: string[];
  mood: string;
};

export async function generateCaption(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<CaptionResult> {
  const res = await fetch("/api/caption", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "캡션 생성에 실패했습니다.");
  }

  return res.json();
}

export type TagResult = {
  tags: string[];
  mood: string;
};

export async function generateTagsFromText(text: string): Promise<TagResult> {
  const res = await fetch("/api/retag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "태그·무드 재생성에 실패했습니다.");
  }

  return res.json();
}
