# PRD | 나만의 탐험 기록 (가칭)
### 산책 중 감성 사진을 AI가 캡션·태그로 기록해주는 지도형 PWA

버전 0.1 · 작성일 2026-08-26

---

## 1. 개요 및 문제 정의

### 1.1 한 줄 정의
산책이나 이동 중 마음에 드는 장면을 찍으면, AI가 감성 캡션과 태그·무드를 자동으로 붙여주고, 촬영 위치가 지도 위에 핀으로 쌓이는 개인 탐험 기록 PWA.

### 1.2 문제의식
- 산책 중 좋은 장면을 봐도 그냥 지나치고 금방 잊어버린다.
- 사진은 계속 쌓이는데 "어디서, 어떤 느낌으로" 찍었는지는 기록에 남지 않는다.
- 기존 사진앱·지도앱은 정리/보관 목적이라 "감성적 기록"의 용도로는 맞지 않는다.

### 1.3 목표
- 촬영이라는 행위 자체를 가볍고 감성적인 "기록 행위"로 만든다.
- 사진 + 위치 + 감정을 하나의 데이터로 묶어 나중에 돌아볼 수 있게 한다.
- Vercel에 배포해 링크만으로 누구나 설치·사용할 수 있는 PWA로 만든다.

---

## 2. 타깃 사용자 및 핵심 시나리오

### 2.1 타깃 사용자
- 1차: 제작자 본인 (헤비 유저 겸 기획자)
- 2차: 링크를 공유받아 사용하는 지인/일반 사용자 — 회원가입 후 자신의 기록을 쌓는 구조

### 2.2 핵심 사용 시나리오
- **동네 산책형**: 저녁에 동네를 산책하다 하늘, 골목, 고양이 등 마음에 드는 장면을 발견 → 바로 촬영 → AI가 캡션·태그·무드 자동 생성 → 지도에 핀 추가
- **여행 탐험형**: 낯선 도시를 걸으며 낯선 골목, 간판, 풍경을 기록 → 하루치 이동 경로와 촬영 지점이 지도에 함께 남음
- **회고형**: 며칠 뒤 대시보드에서 이번 달 자주 남긴 무드, 태그 워드클라우드, 요일별 기록 빈도를 훑어보며 "요즘 나"를 돌아봄

### 2.3 유저 스토리
- 사용자로서, 걷다가 마음에 드는 장면을 찍으면 별다른 입력 없이도 그 순간의 느낌이 글로 남았으면 한다.
- 사용자로서, 나중에 지도를 열었을 때 내가 걸었던 길과 찍었던 장면들이 한눈에 보였으면 한다.
- 사용자로서, 마음에 드는 기록 하나를 이미지 카드로 만들어 친구에게 공유하고 싶다.

---

## 3. 핵심 기능 정의 (MVP)

| 우선순위 | 기능 | 설명 |
|---|---|---|
| P0 | 로그인 | 이메일 또는 소셜 로그인. 계정별로 기록 저장/동기화 |
| P0 | 카메라 촬영 | PWA 내에서 카메라 바로 실행, 촬영 |
| P0 | 갤러리 업로드 | 이미 찍어둔 사진 선택 업로드 |
| P0 | GPS 위치 기록 | 촬영 시점의 좌표 자동 기록 |
| P0 | AI 감성 캡션 | 사진을 분석해 1~2문장의 감성적 캡션 자동 생성 |
| P0 | AI 태그 + 무드 | 사진에서 키워드 태그(3~5개) + 무드(예: 평온/설렘/쓸쓸함 등 카테고리) 자동 추출 |
| P0 | 저장 | 캡션/태그/무드/위치/사진을 계정에 저장 |
| P0 | 산책 기록 피드 | 시간순으로 쌓이는 기록 목록 (사진+캡션+태그) |
| P0 | 지도 (핀) | 내가 촬영한 모든 위치가 핀으로 표시된 지도 |
| P0 | PWA | 설치 가능, 스플래시 화면, 매니페스트/서비스워커 |
| P1 | 온보딩 | 최초 접속 시에만 2~3장 슬라이드로 앱 소개 |
| P1 | 이동 경로(선) 표시 | 핀 클릭 시 그 날 산책의 GPS 이동 경로가 지도에 선으로 표시 |
| P1 | 대시보드 | 태그 워드클라우드, 요일별 기록 수 그래프, 무드 분포 차트 |
| P1 | 공유 | 기록 1건을 이미지 카드로 내보내기 |
| P2 | 기록 검색/필터 | 태그·무드·날짜별 필터링 (추후) |
| P2 | 기록 수정/삭제 | 캡션·태그 편집, 기록 삭제 |

> **오늘 하루 안에 눈으로 확인 가능한 것을 기준으로 P0을 최우선 구현**하고, 시간이 남으면 P1(온보딩, 경로선, 대시보드, 공유)을 순서대로 붙이는 구조를 권장합니다.

---

## 4. 사용자 플로우 및 화면 구조

### 4.1 전체 플로우

```
[스플래시] → (최초 접속만) [온보딩 2~3장] → [로그인]
                                              │
                                              ▼
                                        [홈 = 피드]
                          ┌──────────────┬──────────────┬──────────────┐
                          ▼              ▼              ▼              ▼
                    [촬영/업로드]      [지도]       [대시보드]      [설정]
                          │
                          ▼
                 [AI 캡션·태그·무드 생성 중...]
                          │
                          ▼
                  [캡션/태그 결과 확인 화면] → 저장 → 피드/지도에 반영
```

### 4.2 화면별 상세

**① 스플래시 화면**
- 앱 아이콘 + 로고 노출, PWA 부팅 시 항상 표시 (1~2초)

**② 온보딩 (최초 1회)**
- 2~3장 슬라이드: "① 산책하다 마음에 드는 장면을 찍으세요 → ② AI가 감성 캡션을 붙여줘요 → ③ 지도에 나만의 탐험 기록이 쌓여요"
- 마지막 장에 "시작하기" → 로그인 화면 이동
- 로컬 스토리지에 온보딩 완료 플래그 저장, 이후 접속 시 스킵

**③ 로그인**
- Supabase Auth 기반 이메일/비밀번호 회원가입·로그인
- 로그인 후 홈(피드)으로 이동

**④ 홈 (피드) — 기본 진입 화면**
- 시간 역순으로 기록 카드 리스트: 썸네일 + 캡션 한 줄 + 태그 칩 + 무드 아이콘 + 날짜/위치명
- 우측 하단 플로팅 버튼(+): 촬영/업로드 진입
- 카드 탭 → 기록 상세 화면

**⑤ 촬영 / 업로드**
- 버튼 2개: [카메라로 촬영] / [갤러리에서 선택]
- 촬영 직후 **미리보기 확인 화면**(사진 표시 + [다시 찍기] / [사용하기] 버튼) 노출
- [사용하기] 선택 시 GPS 좌표 자동 캡처 → "AI가 분석 중..." 로딩 상태로 자동 전환

**⑥ AI 분석 결과 화면**
- 생성된 캡션, 태그(3~5개), 무드 표시
- 저장 버튼 → 피드에 새 카드 추가 + 지도에 핀 추가

**⑦ 지도**
- 전체 핀이 지도 위에 표시 (OpenStreetMap 기반)
- 핀 탭 → 해당 기록 미리보기(사진+캡션) 팝업 + "그날의 이동 경로" 선이 지도에 함께 표시
- 다시 핀 바깥을 탭하면 경로선 해제

**⑧ 대시보드**
- 태그 워드클라우드 (자주 쓰인 태그일수록 크게)
- 요일별 기록 수 막대 그래프 (월~일)
- 무드 분포 도넛/파이 차트

**⑨ 기록 상세**
- 사진 원본, 캡션 전문, 태그, 무드, 촬영 위치(미니맵), 날짜/시간
- 공유 버튼 → 이미지 카드로 내보내기 (스타일: 사진을 꽉 채운 배경 위에 캡션만 감성적으로 오버레이, 태그·위치명·날짜는 하단에 작게 표기하는 심플한 카드 — 인스타그램 스토리 등에 바로 올리기 좋은 세로형 비율 권장)

**⑩ 설정**
- 로그아웃, 계정 정보, (추후) 데이터 내보내기

### 4.3 내비게이션 구조
- 하단 탭바 4개: **피드 / 지도 / 대시보드 / 설정** + 중앙 플로팅 촬영 버튼

---

## 5. 데이터 모델 (간단)

| 엔티티 | 주요 필드 |
|---|---|
| User | id, email/social_id, created_at |
| WalkRecord (기록 1건) | id, user_id, photo_url, caption, tags[], mood (자유 텍스트), lat, lng, location_name, created_at |
| RouteLog (이동 경로, 선택적) | id, user_id, date, points[](lat, lng, timestamp) — 같은 날짜의 기록들을 묶어 경로선으로 표시 |

> 이동 경로는 별도 트래킹 기능(백그라운드 GPS 로깅) 없이, **같은 날 촬영된 기록들의 좌표를 시간순으로 이어 선을 그리는 방식**으로 MVP를 단순화하는 것을 권장합니다. (실시간 경로 트래킹은 배터리·권한 이슈가 커서 P2로 미루는 것이 안전)

---

## 6. 기술 스택 제안 (오늘 하루 빌드 기준)

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js (PWA 플러그인) | Vercel 배포와 궁합, API Route로 AI 프록시 서버 겸용 가능 |
| 스타일 | Tailwind CSS | 빠른 UI 작업 |
| 지도 | Leaflet + OpenStreetMap | API 키/과금 이슈 없음, 카카오맵 한도 문제 회피 |
| 인증 + DB + 스토리지 | Supabase (이메일/비밀번호 인증) | Auth, Postgres, 이미지 스토리지를 한 번에 세팅 가능해 하루 빌드에 적합 |
| AI 캡션/태그/무드 | Google Gemini Vision API, Next.js API Route에서 프록시 호출 | 클라이언트에 API 키 노출 방지 |
| 배포 | Vercel | 링크 공유, 무료 배포 |
| 대시보드 차트 | recharts | React 컴포넌트 기반, Next.js와 궁합 좋고 커스터마이징 쉬움 |
| 태그 워드클라우드 | 별도 라이브러리 없이 태그 빈도수 → 폰트 크기 매핑하는 커스텀 CSS 컴포넌트 | 무거운 워드클라우드 라이브러리 없이 하루 빌드에 적합 |

---

## 7. AI 캡션·태그·무드 생성 상세

- **입력**: 촬영된 사진 (base64), 선택적으로 촬영 시간대(아침/오후/저녁/밤) 컨텍스트
- **출력 (JSON 구조화)**:
  - `caption`: 1~2문장의 감성적인 문장 (일기 톤)
  - `tags`: 3~5개 키워드 (예: #골목길, #노을, #고양이)
  - `mood`: 고정 카테고리 없이 AI가 사진 분위기에 맞는 무드 단어를 자유롭게 생성 (예: "노곤한 저녁", "낯선 설렘" 등 1~3단어)
- **처리 방식**: 사진 업로드 즉시 서버(API Route)로 전송 → Gemini Vision 호출 → 구조화된 JSON 응답 파싱 → 결과 확인 화면에 표시 후 저장
- **구현 상태**: `app/api/caption/route.ts`에 Vercel 서버리스 함수로 이미 구현됨. 프롬프트는 서버 코드 내부에 고정 포함되어 있어 `GEMINI_API_KEY`만 연결하면 별도 설정 없이 바로 동작함. 클라이언트는 `lib/generateCaption.ts`의 `generateCaption()`만 호출
- **키 관리**: `.env.local`에 `GEMINI_API_KEY` 저장 (NEXT_PUBLIC_ 접두어 없음 → 브라우저에 절대 노출 안 됨). Vercel 배포 시에는 프로젝트 Settings → Environment Variables에 동일한 키를 등록해야 프로덕션에서도 동작함

---

## 8. 대시보드 상세

- **태그 워드클라우드**: 사용자의 전체 기록에서 태그 빈도 집계 → 빈도 높을수록 크게 표시
- **요일별 기록 수 그래프**: 월~일 7개 막대, 각 요일에 남긴 기록 수
- **무드 분포 차트**: 무드가 AI 자유 생성 방식이라 카테고리가 고정되어 있지 않으므로, 파이차트 대신 **무드 워드클라우드** 또는 **가장 많이 등장한 무드 단어 Top 5~7 막대 그래프**로 표시하는 것을 권장 (완전 자유 텍스트를 파이차트로 나누면 조각이 지나치게 많아짐)

---

## 9. 비목표 (MVP 범위 제외)

- 팔로우/댓글 등 SNS형 소셜 기능
- 실시간 GPS 백그라운드 트래킹 (배터리 소모 이슈)
- 오프라인 완전 지원 (사진 캐싱, 오프라인 지도 타일 등은 추후)
- 사진 다중 업로드/편집 기능
- 기록 검색/필터, 수정/삭제 (P2로 이후 추가)

---

## 10. 오늘(Day 1) MVP 빌드 순서 제안

1. 프로젝트 셋업 (Next.js + Tailwind + Supabase 연결) + Vercel 배포 파이프라인 확인
2. 로그인 (Supabase Auth, 소셜 로그인 1종)
3. 촬영/업로드 → GPS 좌표 캡처 → Supabase Storage 업로드
4. AI 캡션·태그·무드 API Route 구현 및 연결
5. 결과 확인 화면 → 저장 → 피드에 반영
6. 지도(핀) 화면
7. (시간이 남으면) 핀 클릭 시 경로선 표시
8. (시간이 남으면) 대시보드 3종 차트
9. (시간이 남으면) 온보딩, 공유 기능
10. PWA 매니페스트/서비스워커/스플래시 마무리

---

## 11. 성공 지표 (간단)

- 산책 1회당 평균 기록 생성 수
- 재방문(며칠 뒤 다시 접속해 피드/지도/대시보드를 확인하는 비율)
- AI 캡션에 대한 주관적 만족도 (재촬영/재생성 요청 빈도로 간접 측정 가능)

---

## 12. 리스크 및 고려사항

- **API 키 노출**: AI 호출은 반드시 서버(API Route)를 거쳐야 하며 클라이언트에 키를 두면 안 됨
- **iOS PWA 제약**: iOS Safari는 PWA에서 카메라 접근·설치 배너 동작이 Android보다 제한적 → 실기기 테스트 필요
- **GPS 권한**: 브라우저 위치 권한 거부 시, [사용하기] 이후 자동 좌표 캡처 대신 **지도에서 위치를 직접 탭해 수동 선택**하는 화면으로 전환 (위치 없이 저장은 불가, 반드시 위치 1건은 선택하도록 유도)
- **다중 사용자 배포 전환**: 최초 설계는 "로컬 저장만"이었으나 링크 공유 배포로 방향이 바뀌며 계정 기반 서버 저장(Supabase)으로 변경됨 — 추후 기기 간 동기화 시 이 구조가 유리

---

## 13. 부록: Gemini Vision 연동 구현 코드

Vercel 배포 시 아래 API Route는 자동으로 서버리스 함수로 동작합니다. `GEMINI_API_KEY`만 `.env.local`에 넣으면 프롬프트 작성 없이 바로 캡션·태그·무드 생성이 동작합니다.

### 13.1 `app/api/caption/route.ts` (서버, Vercel 서버리스 함수)

```ts
import { NextRequest, NextResponse } from "next/server";

// 프롬프트는 서버 코드 안에 고정 — 클라이언트가 신경 쓸 필요 없음
const SYSTEM_PROMPT = `당신은 산책 중 찍은 사진을 보고 감성적인 기록을 남겨주는 도우미입니다.
사진을 보고 아래 JSON 형식으로만 응답하세요. 다른 설명, 코드블록 표시(\`\`\`) 없이 순수 JSON 객체만 반환합니다.

{
  "caption": "사진 속 장면을 바탕으로 한 1~2문장의 감성적인 일기체 캡션 (한국어)",
  "tags": ["태그1", "태그2", "태그3"],
  "mood": "고정된 카테고리 없이, 사진 분위기를 표현하는 1~3단어짜리 자유로운 무드 표현 (예: '노곤한 저녁', '낯선 설렘')"
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
```

### 13.2 `lib/generateCaption.ts` (클라이언트에서 호출하는 헬퍼)

```ts
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

// 사용 예시 (촬영/업로드 화면에서):
// const base64 = await fileToBase64(file); // data: 접두어 제거 필요
// const result = await generateCaption(base64, file.type);
// -> result.caption, result.tags, result.mood 를 확인 화면에 표시
```

### 13.3 `.env.local` (커밋 금지, Vercel에도 동일하게 등록 필요)

```
# 서버(app/api/caption/route.ts)에서만 사용 — NEXT_PUBLIC_ 접두어 없어야 브라우저에 노출되지 않음
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **주의**: `.env.local`은 로컬 개발용입니다. Vercel에 실제 배포할 때는 프로젝트 **Settings → Environment Variables**에 `GEMINI_API_KEY`를 동일하게 등록해야 배포된 사이트에서도 캡션 생성이 동작합니다.
