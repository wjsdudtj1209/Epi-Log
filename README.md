# [Epi:Log] 랜딩 페이지

디지털 유산 정리 서비스 **[Epi:Log]**(에필로그)를 소개하는 랜딩 페이지입니다.
기획서(`docs/app_plan.pdf`)의 컨셉·디자인 가이드를 그대로 반영했습니다.

## 🧰 사용 기술 (스택)

| 기술 | 역할 |
|------|------|
| **Vite** | 빠른 개발 서버 & 빌드 도구 |
| **React** | 화면을 조각(컴포넌트)으로 나눠 만드는 라이브러리 |
| **Tailwind CSS v4** | 클래스 이름만으로 디자인하는 CSS 도구 |
| **Framer Motion** | 부드러운 등장/움직임 애니메이션 |
| **Pretendard** | 기획서 지정 한글 폰트 (CDN으로 불러옴) |

## ▶️ 실행 방법

```bash
# 1) (최초 1회) 필요한 패키지 설치
npm install

# 2) 개발 서버 켜기  → 브라우저에서 http://localhost:5173 접속
npm run dev

# 3) 실제 배포용 파일 만들기 (선택)
npm run build
```

> 개발 서버를 끄려면 터미널에서 `Ctrl + C` 를 누르세요.

## 📁 폴더 구조 (역할별로 분리)

```
my-app-landing/
├─ index.html              # 페이지의 가장 바깥 껍데기
├─ src/
│  ├─ main.jsx             # 앱의 시작점
│  ├─ index.css            # 전역 색상/폰트/Tailwind 설정
│  ├─ App.jsx              # 섹션들을 순서대로 조립
│  └─ components/          # 화면 조각들(역할별 1파일)
│     ├─ Navbar.jsx        #   상단 고정 메뉴
│     ├─ Hero.jsx          #   첫 화면 (핵심 문구 + 빛나는 구체)
│     ├─ GlowOrb.jsx       #   브랜드 상징 "빛나는 금빛 구체"
│     ├─ ProblemSection.jsx#   문제 제기 (왜 필요한가)
│     ├─ FeaturesSection.jsx#  핵심 3대 기능
│     ├─ FlowSection.jsx   #   3단계 시작 흐름
│     ├─ CtaSection.jsx    #   사전 신청 폼
│     ├─ Footer.jsx        #   맨 아래 영역
│     └─ Reveal.jsx        #   스크롤 시 부드럽게 등장시키는 도우미
└─ docs/app_plan.pdf       # 원본 기획서
```

## 🎨 디자인 시스템 (기획서 스타일 가이드)

색상과 폰트는 `src/index.css` 의 `@theme` 안에 정리되어 있어,
`bg-ink`, `text-gold` 처럼 클래스로 어디서든 바로 사용할 수 있습니다.

- 배경 `#140F0B` · 크림 `#FEF1DA` · 골드 `#FEB951`
- 서브 골드 `#FFC879` / `#F7D48C`
- 그라데이션 `#BE6200` / `#533200`
