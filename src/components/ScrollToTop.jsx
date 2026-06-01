import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ScrollToTop: 우측 하단에 떠 있는 '맨 위로' 버튼.
 * - 페이지 상단(히어로, scrollY < 400)에서는 완전히 숨김
 * - 그 아래로 스크롤하면 페이드+스케일로 부드럽게 등장
 * - 클릭 시 부드러운 스크롤로 맨 위로 이동
 * - 스크롤 리스너는 rAF로 스로틀 + 언마운트 시 정리 (60fps 유지, 메모리 누수 방지)
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 400);
        ticking = false;
      });
    };
    onScroll(); // 초기 상태 동기화
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="맨 위로 이동"
          className="liquid-glass-strong fixed right-8 bottom-8 z-[9999] flex h-12 w-12 items-center justify-center rounded-full text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          // position:fixed 를 인라인으로 강제 — .liquid-glass-strong 의 position:relative 가
          // Tailwind 의 `fixed` 를 덮어쓰는 문제를 확실히 방지
          style={{ position: "fixed", willChange: "transform, opacity" }}
        >
          {/* Lucide 스타일 ArrowUp (strokeWidth 2) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
