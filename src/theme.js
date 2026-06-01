/**
 * Epi:Log 디자인 토큰 (Design Tokens)
 * --------------------------------------------------------------------------
 * Figma "디콘 와이어프레임 제작" 파일의 변수에서 추출했습니다.
 *   - fileKey : ZIJ570SgTkBv4YkAOD9mu2
 *   - frame   : node-id 1380-918
 *
 * 이 파일은 토큰의 'JS 원본'입니다 (자바스크립트에서 색/폰트 값을 직접 쓸 때 사용).
 * 같은 값이 CSS 쪽(src/theme.css)의 :root 변수와 1:1로 짝지어져 있어요.
 * → CSS는 헥스를 직접 쓰지 않고, 여기 값과 동일한 변수를 var(--...)로 '연결'합니다.
 */

// ──────────────────────────────────────────────────────────────────────────
// 1) 색상 토큰
//    각 항목: { var: 짝지어진 CSS 변수 이름, value: 원본 헥스, figma: 원래 변수명 }
// ──────────────────────────────────────────────────────────────────────────
export const colors = {
  fillBackground:  { var: "--figma-fill-background",   value: "#140F0B",   figma: "fill/background" }, // 다크 배경
  night:           { var: "--figma-night",             value: "#050504",   figma: "딥 나이트 베이스" }, // Hero 하단 페이드 / IntroQuote / VideoSection 배경(거의 블랙)
  textTitle:       { var: "--figma-text-title",        value: "#FFD99D",   figma: "text/Title" },      // 제목
  textSubtitle:    { var: "--figma-text-subtitle",     value: "#682E00",   figma: "text/subtitle" },   // 소제목(브라운)
  rust:            { var: "--figma-rust",              value: "#BD5400",   figma: "text/subtitle (Overview, node 1380:13317)" }, // Overview 제목 — text/subtitle 최신값(번트오렌지)
  notification:    { var: "--figma-notification",      value: "#ACA08A",   figma: "Notification (node 1380:13318)" }, // 알림 카드 배경 (보통 32% 투명도)
  glow:            { var: "--brand-glow",              value: "#D59A49",   figma: "Ellipse 294 이펙트색 (브랜드)" }, // 반구(아치) 장식 글로우
  box:             { var: "--figma-box",               value: "#352B1E",   figma: "box (node 1392:918)" }, // 다크 메시지 카드 배경 (Desk Research 맺음)
  textLight:       { var: "--figma-text-light",        value: "#FFBB5B",   figma: "text/light" },       // 밝은 강조
  textLogDefault:  { var: "--figma-text-log-default",  value: "#FBEDD5",   figma: "text/log default" }, // 로그 기본 텍스트
  textLogDefault2: { var: "--figma-text-log-default-2", value: "#FEB951",  figma: "text/log default2" },// 로그 강조(골드)
  textLogOpacity:  { var: "--figma-text-log-opacity",  value: "#F7D48C",   figma: "text/log opacity" }, // 로그 흐린 텍스트
  subtitle:        { var: "--figma-subtitle",          value: "#351A05",   figma: "subtitle" },         // 진한 브라운
  subOpacity:      { var: "--figma-sub-opacity",       value: "#FFC879",   figma: "sub opacity" },      // 서브 골드
  bottomText:      { var: "--figma-bottom-text",       value: "#FFD99D",   figma: "하단 글씨" },         // 하단 글씨
  logStroke:       { var: "--figma-log-stroke",        value: "#F7D48C85", figma: "log stroke" },       // 로그 외곽선(투명 골드, alpha ≈ 0.52)
  archFill:        { var: "--figma-arch-fill",         value: "#FBFBFB",   figma: "Background Ellipse fill" },   // 곡선 원 채우기(배경톤 흰색)
  archStroke:      { var: "--figma-arch-stroke",       value: "#FFA411",   figma: "Background Ellipse stroke" }, // 곡선 원 테두리(1px, 29% 투명도로 사용)
  archGlowInner:   { var: "--figma-arch-glow-inner",   value: "#FF990A",   figma: "Background Ellipse Drop shadow 1" }, // 곡선 글로우 안쪽(56%)
  archGlowOuter:   { var: "--figma-arch-glow-outer",   value: "#D67D00",   figma: "Background Ellipse Drop shadow 2" }, // 곡선 글로우 바깥(20%)
  dotGlowOuter:    { var: "--figma-dot-glow-outer",    value: "#FF9A16",   figma: "타임라인 빛점 Drop shadow 1" },        // 빛점 외부 글로우(100%)
  dotGlowInner:    { var: "--figma-dot-glow-inner",    value: "#FF8011",   figma: "타임라인 빛점 Drop shadow 2" },        // 빛점 내부 글로우(56%)
  accent:          { var: "--figma-arch-stroke",       value: "#FFA411",   figma: "강조 오렌지(arch-stroke 재사용)" },     // Design System accent
  dsMuted:         { var: "--figma-ds-muted",          value: "#DACDBC",   figma: "Design System muted" },               // 뮤트 베이지 텍스트
  dsTan:           { var: "--figma-ds-tan",            value: "#BCA26C",   figma: "Design System tan" },                 // 뮤트 골드브라운
  dsDot:           { var: "--figma-ds-dot",            value: "#FFAE2B",   figma: "Design System 점(Dot) 채움" },        // 점 글로우 원 채움색
  dsLine:          { var: "--figma-ds-line",           value: "#F58F0A",   figma: "Design System 선(Line) 상단" },       // 선 그라데이션 상단 오렌지
  kfBg:            { var: "--figma-kf-bg",              value: "#EFECEC",   figma: "Key Function 섹션 배경" },             // 라이트 그레이
  kfLabel:         { var: "--figma-kf-label",          value: "#A04B00",   figma: "KEY FUNCTION 라벨" },                  // 오렌지
  kfOverlay:       { var: "--figma-kf-overlay",        value: "#2A2525",   figma: "Key Function 다크 카드 오버레이" },     // 다크 톤
  kfPhone1:        { var: "--figma-kf-phone-1",        value: "#EFEFEF",   figma: "폰 목업 그라데이션 위" },               // 밝은 회색
  kfPhone2:        { var: "--figma-kf-phone-2",        value: "#B6B0B0",   figma: "폰 목업 그라데이션 아래" },             // 중간 회색
};

// ──────────────────────────────────────────────────────────────────────────
// 2) 폰트 패밀리
// ──────────────────────────────────────────────────────────────────────────
export const fontFamily = {
  tan:        '"TAN-PEARL", "Playfair Display", serif',
  pretendard: '"Pretendard Variable", Pretendard, system-ui, sans-serif',
  inter:      '"Inter", system-ui, sans-serif',
};

// ──────────────────────────────────────────────────────────────────────────
// 3) 타이포그래피 토큰 (Figma 텍스트 스타일 그대로)
//    fontSize 단위는 px, lineHeight는 배수(1.2 = 120%).
// ──────────────────────────────────────────────────────────────────────────
export const typography = {
  "t1-tanpearl": { fontFamily: fontFamily.tan,        fontSize: 35, lineHeight: 1.2, fontWeight: 400, letterSpacing: 0 },

  "h1-regular":  { fontFamily: fontFamily.pretendard, fontSize: 52, lineHeight: 1.2, fontWeight: 400, letterSpacing: 0 },
  "h1-medium":   { fontFamily: fontFamily.pretendard, fontSize: 52, lineHeight: 1.2, fontWeight: 500, letterSpacing: 0 },
  "h1-bold":     { fontFamily: fontFamily.pretendard, fontSize: 52, lineHeight: 1.2, fontWeight: 700, letterSpacing: 0 },

  "h2-regular":  { fontFamily: fontFamily.inter,      fontSize: 18, lineHeight: 1.2, fontWeight: 400, letterSpacing: 0 },
  "h2-bold":     { fontFamily: fontFamily.inter,      fontSize: 18, lineHeight: 1.2, fontWeight: 700, letterSpacing: 0 },

  "h3-regular":  { fontFamily: fontFamily.inter,      fontSize: 16, lineHeight: 1.2, fontWeight: 400, letterSpacing: 0 },
  "h3-bold":     { fontFamily: fontFamily.inter,      fontSize: 16, lineHeight: 1.2, fontWeight: 600, letterSpacing: 0 },

  "p1-medium":   { fontFamily: fontFamily.pretendard, fontSize: 16, lineHeight: 1.6, fontWeight: 500, letterSpacing: 0 },
  "p1-bold":     { fontFamily: fontFamily.pretendard, fontSize: 16, lineHeight: 1.6, fontWeight: 700, letterSpacing: 0 },

  "p2-regular":  { fontFamily: fontFamily.pretendard, fontSize: 14, lineHeight: 1.6, fontWeight: 400, letterSpacing: 0 },
  "p2-bold":     { fontFamily: fontFamily.pretendard, fontSize: 14, lineHeight: 1.6, fontWeight: 700, letterSpacing: 0 },

  "p3-regular":  { fontFamily: fontFamily.pretendard, fontSize: 12, lineHeight: 1.6, fontWeight: 400, letterSpacing: 0 },
  "p3-medium":   { fontFamily: fontFamily.pretendard, fontSize: 12, lineHeight: 1.6, fontWeight: 500, letterSpacing: 0 },
  "p3-bold":     { fontFamily: fontFamily.pretendard, fontSize: 12, lineHeight: 1.6, fontWeight: 700, letterSpacing: 0 },

  // Background 섹션(node 1380:13318) — 역할 기반 이름
  "section":     { fontFamily: fontFamily.pretendard, fontSize: 17, lineHeight: 1.5,  fontWeight: 600, letterSpacing: 0.34 }, // Head/Section-SemiBold (라벨). letterSpacing: px(Figma 2% ≈ 0.34px)
  "display":     { fontFamily: fontFamily.pretendard, fontSize: 36, lineHeight: 1.4,  fontWeight: 700, letterSpacing: 0 },   // Head/H2-Bold (큰 제목)
  "headline":    { fontFamily: fontFamily.pretendard, fontSize: 32, lineHeight: 1.4,  fontWeight: 600, letterSpacing: 0 },   // Head/H2-SemiBold (맺음 문구)
  "lead":        { fontFamily: fontFamily.pretendard, fontSize: 17, lineHeight: 1.4,  fontWeight: 500, letterSpacing: 0 },   // Head/Body/p1-SemiBold (설명문)
  "noti":        { fontFamily: fontFamily.pretendard, fontSize: 22, lineHeight: 1.45, fontWeight: 500, letterSpacing: 0 },   // Head/Notification-Medium (카드)
};

export default { colors, fontFamily, typography };
