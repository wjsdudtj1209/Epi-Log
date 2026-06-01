import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * PhoneFrame: 아이폰 베젤(mk-iphone.png) 안에 '화면 이미지'를 넣어 보여주는 재사용 컴포넌트.
 *
 * - 1x 표시 크기 329 × 676 (베젤 PNG와 동일). `scale` 프롭으로 확대/축소,
 *   max-w-full 덕에 좁은 화면(모바일)에선 부모 폭에 맞춰 자동 축소(비율 유지).
 * - 화면 영역: 베젤 안쪽 left:17 / top:15 / 301.5 × 655.5 (Figma 실측).
 *   → 컨테이너 대비 %로 환산해, 컨테이너가 커지든 작아지든 네 값이 함께 스케일됩니다.
 * - screens 개수에 따라 두 가지 모드:
 *    · 1장  → 정적 표시
 *    · 여러 장 → 자동 크로스페이드(2.5s 간격, 0.8s 페이드, 무한, opacity만/슬라이드 없음)
 *      동작 줄이기(prefers-reduced-motion)면 첫 장만 정적으로 표시(순환 안 함).
 * - 베젤은 화면 '위'에 얹혀 가장자리·노치·둥근 모서리를 만들고 클릭은 통과(pointer-events-none).
 * - 그림자는 베젤 알파(폰 모양)를 따르도록 filter: drop-shadow 사용. `shadow` 프롭으로 클러스터별 지정.
 */
const W = 329;
const H = 676;
// 베젤 안 화면 영역(329×676 기준 → 퍼센트로 환산). left17 / top15 / 301.5 × 655.5.
const SCREEN = {
  left: `${(17 / W) * 100}%`,
  top: `${(15 / H) * 100}%`,
  width: `${(301.5 / W) * 100}%`,
  height: `${(655.5 / H) * 100}%`,
};

export default function PhoneFrame({
  screens = [],
  scale = 1,
  className = "",
  shadow = "drop-shadow(0 22px 45px rgba(0,0,0,0.45))",
}) {
  const reduce = useReducedMotion(); // 접근성: 동작 줄이기면 순환 정지
  const [active, setActive] = useState(0);

  useEffect(() => {
    // 화면이 1장이거나 동작 줄이기면 타이머 없음
    if (reduce || screens.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % screens.length), 2500);
    return () => clearInterval(id);
  }, [reduce, screens.length]);

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width: W * scale,
        maxWidth: "100%",
        aspectRatio: `${W} / ${H}`,
        filter: shadow,
      }}
    >
      {/* 화면 영역(베젤 안). overflow-hidden + 라운드로 화면 모서리를 둥글게(어차피 베젤이 덮음). */}
      <div className="absolute overflow-hidden" style={{ ...SCREEN, borderRadius: 40 }}>
        {screens.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: (reduce ? i === 0 : i === active) ? 1 : 0,
              transition: "opacity 800ms ease-in-out",
            }}
          />
        ))}
      </div>

      {/* 베젤 오버레이(맨 위, 클릭 통과) — 가장자리/노치/라운드를 그림 */}
      <img
        src="/mk-iphone.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
