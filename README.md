# 탐험기록 — 산책 감성 기록 PWA

산책 중 마음에 드는 장면을 찍으면 AI가 감성 캡션·태그·무드를 자동으로 붙여주고, 촬영 위치가 지도 위에 핀으로 쌓이는 개인 탐험 기록 PWA입니다. (`산책기록_PWA_PRD.md` 기준 구현)

## 기술 스택

- Next.js 16 (App Router, webpack 빌드)
- Tailwind CSS 4
- Supabase (Auth, Postgres, Storage)
- Leaflet + OpenStreetMap (지도 · GPS 위치 선택)
- Google Gemini Vision API (캡션 · 태그 · 무드 생성)
- Serwist (PWA 서비스 워커)
- Recharts (대시보드 차트)

## 로컬 개발

```bash
npm install
npm run dev
```

`.env.local`에 아래 값이 필요합니다 (이미 채워져 있음 — `GEMINI_API_KEY`만 추가하면 됩니다):

```
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=https://plehrctagmdmhcrubwrx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

- `GEMINI_API_KEY`: https://aistudio.google.com/apikey 에서 발급
- Supabase 프로젝트: `walk` (Auth 이메일/비밀번호 로그인, `walk_records` 테이블, `walk-photos` 스토리지 버킷이 이미 마이그레이션되어 있습니다)

## Vercel 배포

1. 이 저장소를 GitHub에 push 후 Vercel에서 Import
2. Vercel 프로젝트 **Settings → Environment Variables**에 위 3개 값을 동일하게 등록
   - `GEMINI_API_KEY`는 `NEXT_PUBLIC_` 접두어 없이 등록해야 브라우저에 노출되지 않습니다
3. Build Command는 `package.json`의 `build` 스크립트(`next build --webpack`)를 그대로 사용하면 됩니다 — Serwist가 아직 Turbopack을 지원하지 않아 webpack으로 고정했습니다
4. 배포 후 실제 기기(특히 iOS Safari)에서 홈 화면에 추가해 카메라·GPS 권한 동작을 확인하세요

## 폴더 구조

- `app/` — 라우트 (스플래시 `/`, `/onboarding`, `/login`, `(main)` 그룹의 `/feed` `/map` `/dashboard` `/settings`, `/capture`, `/record/[id]`)
- `app/api/caption/route.ts` — Gemini Vision 프록시 (서버 전용, 키 비노출)
- `components/` — UI 컴포넌트 (지도, 카드, 차트, 공유 카드 등)
- `lib/supabase/` — 브라우저/서버/미들웨어용 Supabase 클라이언트
- `proxy.ts` — 인증 세션 검사 및 보호 라우트 리다이렉트 (Next 16 `proxy` 컨벤션)
- `scripts/generate-icons.mjs` — PWA 아이콘 생성 스크립트
