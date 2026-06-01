# Epi:Log 랜딩 페이지 — 작업 규칙 & 프로젝트 가이드

> 이 파일은 Claude Code가 매 세션 자동으로 읽습니다.
> (기존 `CLAUDE.md.txt`는 보존용이며 자동 로드되지 않습니다. 최신 기준은 이 문서입니다.)

---

# Part 1. 작업 원칙

## 작업원칙
- **확장성/유연성 검토**: 현재 요구사항을 해결하되, 향후 확장이 막히지 않는 구조 확인
- **기존 코드 재사용**: 새로 만들기 전에 `components/`, `theme.js` 등 기존 리소스를 먼저 탐색
- **커뮤니케이션**: 항상 **개요(왜, 무엇을)** → **상세 구현 계획** 순서로 설명

## 작업 프로세스 (필수!)

> ⚠️ **추측을 사실처럼 말하지 말 것!** 모든 가설은 반드시 검증 후 결론.
> ⛔ **코드 작성 전 반드시 4단계까지 완료하고 사용자 승인을 받을 것.**

### 1단계: 문제/요청 이해
- 문제 현상을 명확히 기술
- 불분명한 부분이 있으면 사용자에게 질문
- "~일 것 같습니다"가 아니라 실제 코드를 확인

### 2단계: 원인 분석 (문제 해결의 경우)
- 가설 수립 → 가설 검증 → 원인 확정
- ❌ "이게 원인입니다" (검증 없이)
- ✅ "가설: ~일 수 있습니다. 검증해보겠습니다." → "확인 결과, ~가 원인입니다"

### 3단계: 해결책 탐색
- 해결 방안 2-3개 제시, 각 방안의 영향 범위 분석
- 사전 검증 가능하면 검증

### 4단계: 작업 계획 보고 (코드 작성 전 필수!)

> ⛔ 사용자가 "그냥 빨리 해줘"라고 해도, 이 보고를 먼저 하세요.

```
📋 작업 계획 보고

🔍 문제 상황 (What's wrong?)
어떤 상황에서 어떤 증상이 발생하는지, 왜 이 작업이 필요한지.

🎯 목표 (What we want to achieve)
이 작업이 완료되면 어떤 상태가 되어야 하는지.

🔬 원인 분석 (Why it happens) - 문제 해결의 경우
검증된 원인만 기술. 추측은 "가설"이라고 명시.

📁 변경 예정 파일
| 파일 경로 | 변경 내용 | 비고 |
|-----------|----------|------|

⚡ Before → After
[Before] 현재 상태
[After] 작업 후 기대 상태

🎨 디자인 토큰 사용 계획
- 사용할 CSS 변수: --color-*, --text-* 등
- 재사용할 컴포넌트: Button(primary) 등
- 새로 필요한 토큰: 있으면 명시 (없으면 "없음")

이대로 진행해도 될까요?
```

### 5단계: 작업 실행
- 승인받은 계획대로 진행
- 예상치 못한 상황 → 중단 후 보고

### 6단계: 결과 검증

| # | 확인 항목 | 필수 | 구체적 검증 방법 |
|---|-----------|------|-----------------|
| 1 | 빌드 에러 없음 | ✅ | `npm run build` 통과 |
| 2 | 헥스 코드 미사용 | ✅ | 새로 작성한 코드에 `#` + 6자리 패턴 없는지 확인 |
| 3 | Tailwind 기본값 미사용 | ✅ | `bg-red-`, `text-gray-`, `text-sm` 등 기본 클래스 없는지 확인 |
| 4 | 토큰 외 spacing 미사용 | ✅ | `8px`, `15px`, `24px` 등 토큰에 없는 값 없는지 확인 |
| 5 | 기존 컴포넌트 재사용 | ✅ | Button 등 기존 컴포넌트로 대체 가능한 부분 없는지 확인 |
| 6 | 토큰 추가 시 파일 동기화 | ✅ | **이 프로젝트는 Tailwind v4라 `tailwind.config.js`가 없음.** 토큰 추가 시 ① `src/theme.css`(primitive 원본) ② `src/index.css`의 `@theme`(Tailwind 토큰 연결) ③ `src/theme.js`(JS 토큰) **3곳을 동기화**했는지 확인 |
| 7 | 기존 기능 정상 동작 | ✅ | 기존 컴포넌트/페이지 깨지지 않았는지 확인 |

### 7단계: 작업 완료
- 6단계 검증 **전부 통과** 후에만 "완료" 선언
- 변경 사항 요약 보고

## 금지 사항

| 금지 | 이유 | 올바른 대안 |
|------|------|-------------|
| 허락 없이 새 파일/컴포넌트 생성 | 프로젝트 구조 임의 변경 방지 | 사용자에게 먼저 제안 후 승인 |
| 기존 아키텍처 임의 변경 | 설계 의도 훼손 방지 | 변경 필요 시 이유와 함께 제안 |
| 요청 범위 밖 리팩토링 | 스코프 크립 방지 | "이 부분도 개선하면 좋겠는데, 할까요?" |
| 문제 발견 시 바로 수정 | 사용자가 다른 해결책을 원할 수 있음 | 문제 보고 → 해결책 2-3개 제시 → 승인 후 수정 |
| 디자인 토큰 없이 스타일링 | 디자인 시스템 일관성 파괴 | 항상 `var(--*)` 또는 Tailwind 커스텀 토큰 사용 |

## 이전 세션 작업 이어받을 때
1. "완료됐다"는 요약을 그대로 믿지 말 것
2. 실제 코드 상태를 직접 확인 (`Read`, `Grep`으로 검증)
3. 동작 테스트로 검증 후 진행

---

# Part 2. 프로젝트 컨텍스트

## 1. 프로젝트 목적
- 신규 디지털 유산 서비스 **Epi:Log**를 소개하고 사용자를 모으기 위한 **랜딩 페이지** 웹사이트.

## 2. 기술 스택 (실제 구성)
- **빌드**: Vite 8
- **UI**: React 19
- **스타일**: **Tailwind CSS v4** (`@tailwindcss/vite` 플러그인) — ⚠️ `tailwind.config.js` 없음. 테마는 CSS의 `@theme`로 정의.
- **애니메이션**: Framer Motion (인터랙션에 적극 사용)
- **폰트**: Pretendard(본문) / TAN-PEARL·Playfair(디스플레이) / Inter(Figma H2·H3)
- 개발 서버: `npm run dev` (기본 포트 5173)

## 3. 개발 방식 규칙
- 모든 코드는 **초보자가 이해하기 쉽게** 파일별 역할을 나누고, 한국어 주석을 충분히 단다.
- **반응형**(모바일·PC 모두) 디자인.

## 4. 디자인 토큰 시스템 (★ 스타일링의 핵심)

**원칙: 헥스(`#...`)는 오직 한 곳(primitive)에만. 나머지는 전부 `var()`로 연결.**

토큰은 3개 파일이 **1:1로 동기화**되어 흐릅니다:

```
src/theme.css            src/index.css (@theme)              컴포넌트
 (primitive 원본 = 헥스)   (Tailwind 토큰 = var 연결)          (토큰 클래스)
 --figma-* / --brand-*  →  --color-* : var(--figma-*)      →  bg-ink, text-gold ...
                           --text-*  (타이포 스케일)         →  text-h1, text-p2 ...
                           --font-*  (폰트 패밀리)           →  font-pretendard ...

src/theme.js  ← 위 값들의 'JS 원본' (자바스크립트에서 색/폰트 값이 필요할 때)
```

- **`src/theme.css`** — primitive 레이어. Figma 변수 색(`--figma-*`) + 브랜드 색(`--brand-*`). **헥스는 여기에만.**
- **`src/index.css`의 `@theme`** — Tailwind 토큰(`--color-*`, `--text-*`, `--font-*`). 전부 primitive를 `var()`로 참조.
- **`src/theme.js`** — `colors` / `fontFamily` / `typography` 를 export. (Figma "디콘 와이어프레임 제작" / node 1380-918 에서 추출)
- 토큰 출처: Figma Dev Mode MCP로 추출. 새 토큰이 필요하면 **위 3파일을 함께** 갱신.

### 주요 색상 토큰 (Tailwind 클래스명)
`paper` `ink` `cream` `cream-warm` `gold` `gold-bright` `gold-soft` `gold-pale` `gold-stroke` `honey` `amber` `brown` `brown-deep` `rust` `notification` `glow`
→ 사용 예: `bg-ink` `text-gold` `text-rust` `bg-notification/32` `border-gold-stroke`

### 타이포 스케일 (글자 크기 + 줄간격)
- 기본 스케일: `text-t1`(35) `text-h1`(52) `text-h2`(18) `text-h3`(16) `text-p1`(20) `text-p2`(14) `text-p3`(12)
- Background 섹션용: `text-section`(20·ls0.4) `text-display`(40) `text-headline`(32) `text-lead`(20) `text-noti`(22)
- 폰트: `font-pretendard` `font-inter` `font-tan` `font-sans`
- ⚠️ Figma "Head/H2"는 40/32px이지만 기존 `text-h2`는 18px(다른 값) — 새 크기는 `text-display`/`text-headline` 사용.

## 5. 재사용 컴포넌트
- **`src/components/Button.jsx`** — `variant`(primary·secondary·ghost), `size`(sm·md·lg), `icon`/`iconPosition`, `disabled`, `label`/`children` props. 색·타이포는 토큰으로 연결됨. 새 버튼이 필요하면 먼저 이걸 재사용/확장.
- 기타: `Spotlight`(마우스 글로우 훅+래퍼), `RoundedSection`(섹션 이음새), 각 섹션 컴포넌트(`Hero`, `IntroQuote`, `FeaturesSection`, `DesignSystemSection`, `CtaSection` 등).

## 6. 진행 순서 (초기 구축 기준)
1. `docs/` 폴더의 기획서를 먼저 읽고 서비스 컨셉 파악.
2. 색상(테마)·폰트 제안 후 프로젝트 뼈대 생성. (완료됨 → 토큰 시스템 참조)
3. 기획서에 맞춰 섹션별로 순서대로 구현.

## 7. Figma 디자인 반영 규칙
- Figma 링크/node-id를 받으면 **`get_design_context`**(필요 시 `get_variable_defs`)로 읽고 코드에 반영한다.
- 새 색상값·폰트크기를 **직접 박지 말고**, 위 **4번의 등록된 디자인 토큰**을 쓴다. (토큰에 없으면 → 3파일 동기화로 추가 후 사용)
- 반영 전에 기존 코드에서 **해당 섹션 위치를 먼저 찾고, 바뀐 부분만** 수정한다.
- 이미지로 빠져나오는 **그라데이션·연결선 등 장식은 가능하면 CSS로 구현**한다.
  (예: `Hemisphere` = 내부 `radial-gradient`, 타임라인 선 = CSS `linear-gradient`)

### 섹션별 node-id (Figma 파일 `ZIJ570SgTkBv4YkAOD9mu2` — "디콘 와이어프레임 제작")
| 섹션 | node-id | 구현 위치 |
|---|---|---|
| Overview | `1380:13317` | `src/components/BackgroundSection.jsx` (상단 블록) |
| Background | `1380:13318` | `src/components/BackgroundSection.jsx` (하단 블록) |
