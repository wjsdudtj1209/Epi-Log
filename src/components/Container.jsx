/**
 * Container: 시안의 레이아웃 그리드 시스템을 담당하는 공통 래퍼입니다.
 *
 * 설계 규칙 (1920px 기준):
 * - 콘텐츠 최대 너비 1420px, 항상 가운데 정렬
 *   → 1920px 화면에서 (1920 - 1420) / 2 = 좌우 250px 여백이 자동으로 생깁니다.
 *   → 그보다 넓은 초광폭 화면에서도 1420px를 유지하며 가운데 고정됩니다.
 * - 1420px보다 좁은 화면에서는 폭이 줄고, 양옆에 안전 여백(px)을 둬 가장자리에 붙지 않게 합니다.
 *
 * 8컬럼 그리드(거터 0)가 필요할 때는 자식에서 `grid grid-cols-8 gap-0`을 사용하면
 * 이 컨테이너(최대 1420px) 안에서 8개의 컬럼이 빈틈없이 붙어 배치됩니다.
 */
export default function Container({ as: Tag = "div", className = "", children }) {
  return (
    <Tag className={`mx-auto w-full max-w-[1200px] px-6 sm:px-10 ${className}`}>
      {children}
    </Tag>
  );
}
