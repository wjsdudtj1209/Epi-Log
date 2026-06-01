import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LogoAssembly from "./LogoAssembly.jsx";

const EASE = [0.25, 1, 0.3, 1]; // 묵직하고 우아한 감속 (deliberate & unhurried)
const REVEAL = 3.6; // 절차적 로고가 완성된 직후 이름이 그 위로 등장하는 시점(초)

/**
 * Hero: 점 → 선 → 면 순서로 로고가 합성된 뒤 [Epi:Log] 텍스트(TAN-PEARL)가 등장하는
 * 몰입형 히어로입니다. 진입 시 '한 번만' 재생됩니다(커서 인터랙션 없음).
 * 배경은 투명 — 상위 Atmospheric Canvas(딥 차콜 #050505)가 그대로 비쳐 다음 섹션과 이어집니다.
 */
export default function Hero() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), REVEAL * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden text-cream"
    >
      {/* 중앙의 따뜻한 빛 (천천히 숨쉼) — 로고에 시선 집중. DOM 순서상 콘텐츠 뒤에 깔림 */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(190,98,0,0.28),transparent_60%)] blur-3xl"
        animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.07, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 중앙: 로고 합성 + 텍스트 (그리드로 겹쳐 배치) */}
      <div className="relative grid place-items-center">
        <div className="col-start-1 row-start-1">
          <LogoAssembly revealed={revealed} />
        </div>

        {/* [Epi:Log] 텍스트 로고 (TAN-PEARL) */}
        <motion.h1
          className="col-start-1 row-start-1 z-10 text-center font-tan text-6xl tracking-tight whitespace-nowrap text-cream sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(8px)" }}
          animate={{
            opacity: revealed ? 1 : 0,
            y: revealed ? 0 : 18,
            scale: revealed ? 1 : 0.96,
            filter: revealed ? "blur(0px)" : "blur(8px)",
          }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <span className="text-gold/70">[</span>Epi
          <span className="mx-1 text-gold">:</span>Log
          <span className="text-gold/70">]</span>
        </motion.h1>
      </div>

      {/* 스크롤 안내 — Background 섹션의 라인 애니메이션을 그대로 옮겨옴
          (선을 타고 빛 한 점이 위에서 아래로 흐름) */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: REVEAL + 1 }}
      >
        <div className="relative mx-auto flex h-28 w-px justify-center bg-gradient-to-b from-amber/40 to-transparent">
          <motion.span
            className="absolute h-2.5 w-2.5 rounded-full bg-gold"
            style={{ boxShadow: "0 0 16px 4px rgba(254,185,81,0.7)" }}
            animate={{ top: ["0%", "100%"], opacity: [1, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeIn" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
