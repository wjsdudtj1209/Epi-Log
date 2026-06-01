import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * PhoneFrame: 아이폰 베젤(mk-iphone.png) 안에 '화면 이미지'를 넣어 보여주는 컴포넌트.
 * ▸ 데스크톱 1:1: 기준 프레임 329×677(px). `scale`로 베젤+화면을 '함께' 확대/축소(화면이 베젤 안에 유지됨).
 *   베젤·화면 이미지 모두 명시 크기 + object-contain → raw 픽셀로 안 커지고, 늘어남 없음.
 * ▸ 화면 영역: 베젤 안쪽 left:17 / top:15 / 301.5 × 655.5 (Figma 실측) × scale.
 * ▸ screens 여러 장이면 자동 크로스페이드(2.5s 간격, 0.8s 페이드, opacity만). reduce면 첫 장만.
 * ▸ 베젤은 화면 위에 얹혀 가장자리/노치/라운드를 만들고 클릭 통과.
 * ▸ transform 없음(회전/skew/3D 일절 없음). 그림자는 균일 drop-shadow(prop).
 */
const W = 329;
const H = 677;

export default function PhoneFrame({
  screens = [],
  className = "",
  shadow = "drop-shadow(0 20px 40px rgba(41,36,34,0.22))",
  scale = 1,
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || screens.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % screens.length), 2500);
    return () => clearInterval(id);
  }, [reduce, screens.length]);

  // 베젤·화면 모두 scale 배율로 함께 확대(비율·내부 정렬 유지)
  const screen = { left: 17 * scale, top: 15 * scale, width: 301.5 * scale, height: 655.5 * scale };

  return (
    <div className={`relative ${className}`} style={{ width: W * scale, height: H * scale, filter: shadow }}>
      {/* 화면 영역(베젤 안). 명시 크기 + object-contain(늘어남 없음), 모서리 라운드(베젤이 덮음). */}
      <div className="absolute overflow-hidden" style={{ ...screen, borderRadius: 40 * scale }}>
        {screens.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: (reduce ? i === 0 : i === active) ? 1 : 0,
              transition: "opacity 800ms ease-in-out",
            }}
          />
        ))}
      </div>

      {/* 베젤 오버레이(맨 위, 클릭 통과) — 명시 크기 + object-contain */}
      <img
        src="/mk-iphone.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}
