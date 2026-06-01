import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero: 단순화된 히어로 (Figma Rectangle 26 + Frame 2147237901).
 * ▸ 전체 폭 섹션, 디자인 폭 1440 / 높이 ~863px(min-height).
 * ▸ 배경: /hero-bg.png 한 장 + 그 위에 다크 오버레이(아래로 갈수록 블랙으로 페이드).
 *   - Figma rotate(180deg) = "아래쪽이 블랙으로 페이드"라는 의미라, 이미지/텍스트는 회전하지 않고
 *     그라데이션 방향(180deg)으로 그 룩만 직접 구현.
 * ▸ 콘텐츠: 하단부에 헤드라인 '[Epi:Log]'(TAN-PEARL) 하나만. 로고/캔버스 애니메이션/카드 없음.
 * ▸ 진입 시 헤드라인이 왼쪽에서 부드럽게 미끄러져 들어옴(1회). 동작 줄이기 설정 시 즉시 최종 상태.
 */

// 배경 레이어: (위) 하단 블랙 페이드 → (중간) 균일 20% 딤 → (아래) 실제 이미지.
// #050504 는 토큰(--color-night)으로 연결. 검정 딤은 단순 scrim이라 rgba 그대로.
const HERO_BACKGROUND = [
  "linear-gradient(180deg, rgba(0,0,0,0) 58.91%, var(--color-night) 100%)",
  "linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2))",
  "url('/hero-bg.png')",
].join(", ");

export default function Hero() {
  const reduceMotion = useReducedMotion(); // OS '동작 줄이기' 감지
  const [revealed, setRevealed] = useState(false);

  // 프리로더가 히어로를 가리고 있어서, '프리로더가 사라지는 시점'에 슬라이드인을 시작해야
  // 사용자가 실제로 보게 됩니다. Preloader가 끝날 때 쏘는 'preloader:done' 이벤트로 트리거.
  // (프리로더가 없거나 신호를 놓친 경우를 대비해 폴백 타이머도 둠.)
  useEffect(() => {
    if (reduceMotion) {
      setRevealed(true); // 동작 줄이기: 즉시 최종 상태
      return;
    }
    const reveal = () => setRevealed(true);
    window.addEventListener("preloader:done", reveal);
    const fallback = setTimeout(reveal, 3200);
    return () => {
      window.removeEventListener("preloader:done", reveal);
      clearTimeout(fallback);
    };
  }, [reduceMotion]);

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden min-h-[863px]"
      style={{
        background: HERO_BACKGROUND,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 헤드라인: 섹션 높이의 약 60.8% 지점(Figma top 525px / 높이 863.25px = 60.8% 반영), 좌측 정렬.
          좌우 패딩은 데스크톱 120px → 작은 화면에서는 축소(가독성 유지). */}
      <div className="absolute inset-x-0" style={{ top: "60.8%" }}>
        <div className="px-6 sm:px-12 lg:px-[120px]">
          <motion.h1
            className="font-tan text-honey"
            style={{
              // 데스크톱 77px(=5.35vw@1440), 작은 화면에서 비례 축소(최소 2.5rem).
              fontSize: "clamp(2.5rem, 5.35vw, 77px)",
              lineHeight: 1.5,
              letterSpacing: "0.3em",
              fontWeight: 400,
            }}
            // 왼쪽에서 더 멀리(-130px)·더 천천히(1.8s) 미끄러져 등장 → 움직임이 확실히 보임.
            // 이징은 앞쪽 쏠림이 적은 ease-out(easeOutQuad)이라 이동이 구간 내내 보이고, 오버슈트/바운스 없음.
            initial={reduceMotion ? false : { opacity: 0, x: -130 }}
            animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -130 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
            }
          >
            [Epi:Log]
          </motion.h1>
        </div>
      </div>

      {/* 스크롤 안내 — 우측 하단(헤드라인 좌측 패딩 120px과 대칭). 화면 하단으로 내림(bottom-10 = 40px).
          'Scroll' 라벨 + 가는 선을 타고 빛 점이 아래로 흘러 '아래로 스크롤'을 암시.
          헤드라인 등장 뒤 부드럽게 페이드인. 동작 줄이기면 점 흐름 없이 정적. */}
      <motion.div
        className="pointer-events-none absolute bottom-10 right-6 flex flex-col items-center gap-3 sm:right-12 lg:right-[120px]"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 1.2 }}
      >
        <span className="font-pretendard text-[11px] uppercase tracking-[0.3em] text-cream/60">
          Scroll
        </span>
        <div className="relative h-16 w-px overflow-hidden bg-gradient-to-b from-gold/55 to-transparent">
          {!reduceMotion && (
            <motion.span
              className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gold"
              style={{ boxShadow: "0 0 12px 3px rgba(254,185,81,0.6)" }}
              animate={{ top: ["-12%", "112%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeIn" }}
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
