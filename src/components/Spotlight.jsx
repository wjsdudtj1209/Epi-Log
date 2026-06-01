import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";

/**
 * useSpotlight: 어두운 영역에서 '마우스를 따라다니는 빛'을 만드는 재사용 훅입니다.
 * 마우스의 (x, y) 위치를 추적해, 그 자리에 골드빛 원형 그라데이션을 그립니다.
 * 마우스가 영역을 벗어나면 빛이 서서히(opacity) 사라집니다.
 *
 * 사용법:
 *   const spot = useSpotlight();
 *   <section ref={spot.ref} {...spot.handlers} className="relative isolate ...">
 *     <motion.div className="pointer-events-none absolute inset-0 -z-10" style={spot.style} />
 *     ...내용...
 *   </section>
 *
 * - color: 빛 색상(rgba). 기본은 은은한 골드.
 * - size: 빛의 반경(px). 클수록 넓게 퍼집니다.
 */
export function useSpotlight({ color = "rgba(254,185,81,0.16)", size = 480 } = {}) {
  const ref = useRef(null);
  // 마우스 위치. 처음엔 화면 밖(-1000)에 둬서 빛이 보이지 않게 합니다.
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  // 빛의 투명도를 부드럽게(스프링) 켜고 끕니다.
  const opacity = useSpring(0, { stiffness: 150, damping: 25 });

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left); // 영역 기준 상대 좌표로 변환
    y.set(e.clientY - rect.top);
    opacity.set(1);
  };
  const onMouseLeave = () => opacity.set(0);

  // x, y가 바뀔 때마다 그라데이션 위치가 따라오도록 CSS 문자열을 자동 합성합니다.
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`;

  return {
    ref,
    handlers: { onMouseMove, onMouseLeave },
    style: { background, opacity },
  };
}

/**
 * Spotlight: 위 훅을 감싼 간편 래퍼입니다.
 * 자신의 배경색(예: 검정) 위에 마우스 추적 빛을 깔고, 그 위에 children을 얹습니다.
 * 빛은 내용 '뒤'(-z-10)에 깔리므로 글자를 가리거나 흐리게 하지 않습니다.
 *
 * - className: 보통 배경색(bg-...)과 위치 클래스를 넘깁니다.
 * - color / size: 훅과 동일한 옵션.
 */
export default function Spotlight({ children, className = "", color, size }) {
  const spot = useSpotlight({ color, size });
  return (
    <div ref={spot.ref} {...spot.handlers} className={`relative isolate ${className}`}>
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        style={spot.style}
      />
      {children}
    </div>
  );
}
