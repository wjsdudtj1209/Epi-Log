/**
 * Hemisphere(곡선 배경 원): Background 섹션 뒤에 깔리는 '거대한 정원(Ellipse) 하나'.
 * Figma 원본(node 1380:13318)의 Ellipse를 그대로 재현합니다.
 *  - 크기: 정원(aspect-square). 부모에서 width로 크기를, left/top으로 위치를 지정. rounded-full로 원.
 *  - 채우기(fill): 섹션 배경과 100% 동일한 paper(#f6f6f6) → 토큰 bg-paper (경계선이 안 보이게)
 *  - 테두리(stroke): #FFA411 1px, 투명도 29% → 토큰 border-arch-stroke/29
 *  - 글로우(Drop shadow 2겹): box-shadow로 재현 (Figma Drop shadow ↔ CSS box-shadow 대응).
 *      ① 안쪽 선명한 빛: 0 4px 81.8px 11px  #FF990A 56%
 *      ② 바깥 넓은 빛  : 0 4px 113.5px 135px #D67D00 20%
 *  - 원이 부모(프레임)보다 커서 좌·하단으로 넘치고, '윗부분 아치'만 프레임 안에 보임.
 *    (넘치는 부분·바깥 글로우는 부모의 overflow-hidden이 잘라냄.)
 *
 * '선'이 아니라 '원의 테두리만' 보이는 구조라, 1px 테두리 + 위 box-shadow 글로우만 둡니다.
 * 위치(top/left)·크기(width)는 부모에서 className으로 지정합니다.
 */
// 글로우 색은 토큰을 color-mix로 투명도만 입혀 사용 (#FF990A 56% / #D67D00 20%).
const archGlow =
  "0 4px 81.8px 11px color-mix(in oklab, var(--color-arch-glow-inner) 56%, transparent), " +
  "0 4px 113.5px 135px color-mix(in oklab, var(--color-arch-glow-outer) 20%, transparent)";

export default function Hemisphere({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute aspect-square rounded-full border border-arch-stroke/29 bg-paper ${className}`}
      style={{ boxShadow: archGlow }}
    />
  );
}
