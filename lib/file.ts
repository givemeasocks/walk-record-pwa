export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Vercel serverless functions reject request bodies over ~4.5MB, and phone
// camera photos easily exceed that once base64-encoded — downscale + re-encode
// as JPEG client-side before it ever leaves the browser.
export async function compressImage(
  file: File,
  maxDim = 1600,
  quality = 0.85
): Promise<{ blob: Blob; base64: string }> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("이미지를 읽을 수 없습니다."));
      el.src = objectUrl;
    });

    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("이미지를 처리할 수 없습니다.");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("이미지 압축에 실패했습니다."))),
        "image/jpeg",
        quality
      );
    });

    const base64 = await fileToBase64(blob);
    return { blob, base64 };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address ?? {};
    const parts = [
      addr.neighbourhood || addr.suburb || addr.village,
      addr.road,
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(" ");
    return data.display_name?.split(",").slice(0, 2).join(",") ?? null;
  } catch {
    return null;
  }
}
