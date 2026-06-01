/**
 * RoundedSection
 * ----------------------------------------------------------------------------
 * 위 섹션 위로 살짝 겹쳐 올라오며 '상단 모서리가 크게 둥근' 풀블리드(가로 100%) 섹션.
 * 색만 번갈아가며 여러 개를 쌓으면, 아래 섹션이 위 섹션으로 "솟아오르는" 듯한
 * 필/카드 모양의 이음새가 연쇄로 만들어집니다.
 *
 * ── 동작 원리 (겹침 + z-index) ──────────────────────────────────────────────
 * 1) marginTop 을 음수(-radius)로 줘서, 이 섹션을 위 섹션 위로 'radius'만큼 끌어올립니다.
 * 2) borderTopLeftRadius / borderTopRightRadius 를 크게 줘서 상단 모서리를 둥글게.
 * 3) position:relative + zIndex 로 이 섹션이 위 섹션 '위에' 그려지게 합니다.
 *    → 둥근 모서리 '바깥' 영역으로 뒤(위 섹션)의 색이 비쳐, 마치 흰 면에서
 *      모서리가 도려내져 파란색이 드러나는 것처럼 보입니다.
 * 4) 끌어올린 만큼 상단 padding 을 더해, 안의 콘텐츠가 잘리지 않게 합니다.
 *
 * 반경은 CSS 변수 `--seam-radius`(index.css, 모바일에서 자동 축소)를 기본으로 씁니다.
 *
 * ── 사용 예 ─────────────────────────────────────────────────────────────────
 *   <RoundedSection first color="#1E6FFF">   ← 맨 위(겹침/둥근모서리 없음)
 *     ...파란 섹션 콘텐츠...
 *   </RoundedSection>
 *   <RoundedSection color="#ffffff">          ← 흰 섹션이 파랑 위로 솟아오름
 *     ...흰 섹션 콘텐츠...
 *   </RoundedSection>
 *   <RoundedSection color="#1E6FFF">          ← 또 파랑이 흰색 위로... (연쇄)
 *     ...
 *   </RoundedSection>
 */
export default function RoundedSection({
  children,
  color = "#ffffff", // 섹션 배경색 (플레이스홀더 — 자유롭게 교체)
  radius = "var(--seam-radius)", // 모서리 반경 (CSS 변수 기본, px/rem 직접 지정도 가능)
  first = false, // 맨 위 섹션이면 true → 겹침/둥근 모서리 없음
  z = 1, // 위 섹션 위에 올라가도록 (연쇄 시 DOM 순서로도 위에 쌓이지만, 필요하면 증가)
  className = "",
  style = {},
}) {
  return (
    <section
      className={`relative w-full ${className}`}
      style={{
        backgroundColor: color,
        position: "relative",
        zIndex: z,
        // 첫 섹션이 아니면: 위로 끌어올려 겹치고(음수 마진) + 상단 모서리 둥글게 + 보정 패딩
        ...(first
          ? {}
          : {
              marginTop: `calc(-1 * ${radius})`,
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
              paddingTop: `calc(${radius} + 2rem)`,
            }),
        // 사용자가 넘긴 style 로 위 기본값을 덮어쓸 수 있음
        ...style,
      }}
    >
      {children}
    </section>
  );
}
