import { NextRequest, NextResponse } from "next/server";

// 프롬프트는 서버 코드 안에 고정 — 클라이언트가 신경 쓸 필요 없음
const SYSTEM_PROMPT = `당신은 산책 중 찍은 사진을 보고 감성적인 기록을 남겨주는 도우미입니다.
사진을 보고 아래 JSON 형식으로만 응답하세요. 다른 설명, 코드블록 표시(\`\`\`) 없이 순수 JSON 객체만 반환합니다.

{
  "caption": "사진 속 장면을 바탕으로 한 1~2문장의 감성적인 일기체 캡션 (한국어)",
  "tags": ["태그1", "태그2", "태그3"],
  "mood": "쉼표나 나열 없이, 사진 분위기를 표현하는 1~3단어짜리 하나의 짧은 무드 표현 (예: '노곤한 저녁', '낯선 설렘')"
}`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요." },
        { status: 500 }
      );
    }

    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64는 필수입니다." }, { status: 400 });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                {
                  inline_data: {
                    mime_type: mimeType || "image/jpeg",
                    data: imageBase64, // data:image/... 접두어를 뗀 순수 base64 문자열
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.9,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json(
        { error: "Gemini API 호출 실패", detail: errText },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const rawText: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        { error: "Gemini 응답이 비어있습니다.", raw: data },
        { status: 502 }
      );
    }

    let parsed: { caption: string; tags: string[]; mood: string };
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "Gemini 응답 JSON 파싱 실패", raw: rawText },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}
