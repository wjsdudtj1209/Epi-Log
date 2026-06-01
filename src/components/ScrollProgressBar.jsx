import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgressBar: 화면 맨 위에 고정된 얇은 진행 바입니다.
 * 페이지를 얼마나 스크롤했는지(0~100%)를 좌→우로 채워 보여줍니다.
 *
 * - useScroll: 전체 페이지의 스크롤 진행도(scrollYProgress: 0~1)를 제공합니다.
 * - useSpring: 그 값을 살짝 탄력 있게 따라가도록 부드럽게 만듭니다.
 * - scaleX + origin-left: 가로로 0%→100%까지 늘어나는 방식이라 매우 가볍게 동작합니다.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-amber via-gold to-gold-soft"
    />
  );
}
