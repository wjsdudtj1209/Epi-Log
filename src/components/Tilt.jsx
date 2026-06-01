import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Tilt: 안에 든 내용을 마우스 위치에 따라 3D로 살짝 기울이는 래퍼입니다.
 * 마우스가 카드 위 어디 있는지(중앙=0,0)를 계산해 그 방향으로 기울여(rotateX/rotateY),
 * 손으로 만지는 듯한 입체감을 줍니다. 마우스가 벗어나면 제자리로 돌아옵니다.
 *
 * - max: 최대 기울기(도). 값이 클수록 더 많이 기울어집니다.
 * - className: 바깥 래퍼에 줄 Tailwind 클래스 (그리드에서 높이를 맞추려면 h-full).
 */
export default function Tilt({ children, max = 10, className = "" }) {
  const ref = useRef(null);

  // 마우스의 상대 위치(-0.5 ~ 0.5). (0,0)이 카드 중앙.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // 위치 값을 탄력 있게 따라가도록 부드럽게 만듭니다.
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });

  // 위치 → 회전각으로 변환. 세로 위치(sy)는 rotateX, 가로 위치(sx)는 rotateY.
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    px.set(0); // 마우스가 벗어나면 제자리(중앙)로
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }} // perspective로 입체감 부여
      className={className}
    >
      {children}
    </motion.div>
  );
}
