import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `당신은 사용자가 산책 중 직접 쓴 감성 기록 글을 읽고 그 글의 분위기를 분석하는 도우미입니다.
아래 JSON 형식으로만 응답하세요. 다른 설명, 코드블록 표시(\`\`\`) 없이 순수 JSON 객체만 반환합니다.

{
  "tags": ["태그1", "태그2", "태그3"],
  "mood": "고정된 카테고리 없이, 글의 분위기를 표현하는 1~3단어짜리 자유로운 무드 표현 (예: '노곤한 저녁', '낯선 설렘')"
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

    const { text } = await req.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "text는 필수입니다." }, { status: 400 });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${SYSTEM_PROMPT}\n\n사용자가 쓴 글:\n${text.trim()}` }],
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

    let parsed: { tags: string[]; mood: string };
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
