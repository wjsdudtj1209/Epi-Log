import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";

const PARTICLE_COUNT = 56;
const DURATION = 2300; // 0% → 100%에 걸리는 시간(ms)

// 고정 안내 문구 (한 줄)
const LOADING_TEXT = "흩어진 디지털 흔적들을 한 곳에 안전하게 모으고 있습니다.";

/**
 * 입자 설정을 한 번만 생성. (phase는 매 프레임 직접 갱신할 가변 값)
 * - 중앙(0,0) 기준 vmax 거리에서 시작 → 화면 가장자리
 * - 2차 베지어(중간점에 수직 오프셋)로 살짝 휘어진 궤적
 * - threshold: 이 진행도를 넘어야 활성(밀도가 진행도에 따라 증가)
 */
function generateConfigs() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 32; // 30~62 vmax
    const sx = Math.cos(angle) * distance;
    const sy = Math.sin(angle) * distance;
    const curve = (Math.random() - 0.5) * 22;
    const mx = sx * 0.5 + Math.cos(angle + Math.PI / 2) * curve;
    const my = sy * 0.5 + Math.sin(angle + Math.PI / 2) * curve;
    return {
      id: i,
      sx,
      sy,
      mx,
      my,
      size: 1 + Math.random() * 2.5,
      opacity: 0.35 + Math.random() * 0.5,
      baseRate: 0.22 + Math.random() * 0.18, // 초당 사이클 수(speed 1 기준)
      phase: Math.random(), // 시작 위상 분산 → 즉시 풍성하게
      threshold: Math.random() * 0.55, // 밀도 활성 임계
    };
  });
}

/**
 * Preloader: 프리미엄 로딩 화면.
 * - 중앙 호박색 오브(호흡) + 입자가 사방에서 중앙으로 모임
 * - 입자 속도·밀도는 진행도 0→100%에 따라 유기적으로 가속/증가
 * - 아래에 고정 안내 문구 한 줄
 * - 100% 도달 후 0.4초 멈췄다가 opacity 0 + blur(10px)로 페이드아웃 & 언마운트
 */
export default function Preloader() {
  const [show, setShow] = useState(true);

  const configsRef = useRef(null);
  if (!configsRef.current) configsRef.current = generateConfigs();
  const particlesRef = useRef([]); // 입자 DOM 노드
  const startRef = useRef(null);
  const completedRef = useRef(false);

  // 매 프레임: 진행도 계산 + 입자 직접 렌더 (React 리렌더와 분리 → 끊김 없음)
  useAnimationFrame((time, delta) => {
    if (startRef.current === null) startRef.current = time;
    const t = Math.min(1, (time - startRef.current) / DURATION);
    const pct = Math.round(t * t * 100); // ease-in → 후반 가속

    if (pct >= 100 && !completedRef.current) {
      completedRef.current = true;
      // 완성 상태를 잠깐 인지시킨 뒤 페이드아웃
      window.setTimeout(() => setShow(false), 400);
    }

    // ── 입자 업데이트 (속도·밀도 진행도 연동) ──
    const cfgs = configsRef.current;
    const nodes = particlesRef.current;
    const prog = pct / 100;
    const speedFactor = 0.55 + prog * 0.95; // 0.55 → 1.5 가속
    const vmax = Math.max(window.innerWidth, window.innerHeight) / 100;

    for (let i = 0; i < cfgs.length; i++) {
      const node = nodes[i];
      if (!node) continue;
      const c = cfgs[i];
      c.phase += (delta / 1000) * c.baseRate * speedFactor;
      if (c.phase >= 1) c.phase -= 1;

      const p = c.phase;
      const om = 1 - p;
      // 2차 베지어: S→M→중앙(0,0)
      const bx = (om * om * c.sx + 2 * om * p * c.mx) * vmax;
      const by = (om * om * c.sy + 2 * om * p * c.my) * vmax;

      let op = c.opacity;
      if (p < 0.12) op *= p / 0.12; // 등장 페이드인
      else if (p > 0.85) op *= 1 - (p - 0.85) / 0.15; // 흡수 페이드아웃
      // 밀도: 진행도가 임계를 넘으면 부드럽게 활성
      op *= Math.max(0, Math.min(1, (prog - c.threshold) / 0.12));

      node.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
      node.style.opacity = op.toFixed(3);
    }
  });

  // 안전장치: rAF 완료가 어떤 이유로든 실패해도 최대 시간이 지나면 강제로 닫아
  // body 스크롤 잠금이 영구화(=페이지 멈춤/요소 안 보임)되는 것을 방지
  useEffect(() => {
    const safety = setTimeout(() => setShow(false), DURATION + 1800);
    return () => clearTimeout(safety);
  }, []);

  // 진입 즉시: 브라우저 스크롤 복원 끄고 맨 위(히어로)로 고정
  useEffect(() => {
    const hist = window.history;
    const prevRestoration =
      "scrollRestoration" in hist ? hist.scrollRestoration : "auto";
    if ("scrollRestoration" in hist) hist.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      if ("scrollRestoration" in hist) hist.scrollRestoration = prevRestoration;
      document.body.style.overflow = "";
    };
  }, []);

  // 프리로더가 떠 있는 동안 스크롤 잠금 → 사라질 때 풀고 무조건 히어로(맨 위)로
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      // 히어로 헤드라인 슬라이드인 트리거: 프리로더가 사라지기 시작할 때 알림.
      window.dispatchEvent(new Event("preloader:done"));
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* 외곽의 흐릿한 글로우 (작게) */}
          <motion.div
            aria-hidden="true"
            className="absolute h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(254,185,81,0.55),rgba(254,185,81,0.15)_45%,transparent_70%)] blur-3xl"
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform, opacity" }}
          />
          {/* 중앙의 따뜻한 코어 (작게) */}
          <motion.div
            aria-hidden="true"
            className="absolute h-14 w-14 rounded-full bg-[radial-gradient(circle,rgba(255,222,160,0.95),rgba(254,185,81,0.55)_55%,transparent_75%)] blur-md"
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          />

          {/* 입자 — useAnimationFrame에서 transform/opacity 직접 제어 */}
          {configsRef.current.map((c, i) => (
            <span
              key={c.id}
              ref={(el) => (particlesRef.current[i] = el)}
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 rounded-full bg-gold"
              style={{
                width: c.size,
                height: c.size,
                marginLeft: -c.size / 2,
                marginTop: -c.size / 2,
                opacity: 0,
                boxShadow: "0 0 4px rgba(254,185,81,0.85)",
                willChange: "transform, opacity",
              }}
            />
          ))}

          {/* 중앙 아래: 고정 안내 문구 (한 줄, 잘리지 않게) */}
          <div className="absolute bottom-[26%] left-1/2 z-10 -translate-x-1/2 px-6">
            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
              className="text-center text-sm break-keep text-cream/70 sm:text-base"
              style={{ willChange: "transform, filter, opacity" }}
            >
              {LOADING_TEXT}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
