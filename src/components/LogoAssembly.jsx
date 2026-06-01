import { motion } from "framer-motion";

// 프리미엄 시네마틱 감속 곡선
const EASE = [0.25, 1, 0.3, 1];
const CX = 220;
const CY = 220;

// 구체를 이루는 '실'(중첩 타원). 뒤(가는·어두운)에서 앞(밝은)으로, 하나씩 그려짐.
const THREADS = Array.from({ length: 16 }, (_, i) => ({
  rx: 14 + i * 5.2, // 14 → 92
  opacity: 0.16 + (i / 15) * 0.46, // 0.16 → 0.62
  delay: 1.2 + i * 0.035,
}));

/**
 * LogoAssembly: reference_logo의 구도(금빛 실 구체 + 가로 관통선 + 스파이어 + 빛점)를
 * 정적 이미지 없이 '인라인 SVG로 실시간 드로잉'하여 만듭니다.
 *  - Phase 1: 중앙 앰버 점이 맥동(인큐베이션)
 *  - Phase 2: 점에서 선들이 stroke-dashoffset으로 그려짐(구체 실 + 가로축 + 스파이어)
 *  - Phase 3: 실 사이 음의 공간이 반투명 그라데이션(면)으로 채워지고 밝은 링이 안착
 *  - Phase 4(상위 Hero): 완성된 로고 위로 [Epi:Log] 이름이 등장
 * revealed=true가 되면 로고가 차분히 물러나 이름에 자리를 내줍니다.
 */
export default function LogoAssembly({ revealed }) {
  return (
    <motion.svg
      viewBox="0 0 440 440"
      role="img"
      aria-label="[Epi:Log] 로고"
      className="h-[360px] w-[360px] sm:h-[440px] sm:w-[440px]"
      style={{ willChange: "transform, opacity" }}
      animate={{ opacity: revealed ? 0.5 : 1, scale: revealed ? 0.94 : 1 }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <defs>
        <radialGradient id="lf-plane" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFC879" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#BE6200" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lf-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF0D4" />
          <stop offset="50%" stopColor="#FEB951" />
          <stop offset="100%" stopColor="#BE6200" />
        </linearGradient>
        <filter id="lf-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── 구체 그룹(−22° 기울임): 면 채움 + 실 + 밝은 링 ── */}
      <g transform={`rotate(-22 ${CX} ${CY})`}>
        {/* Phase 3 — 면(Plane): 반투명 그라데이션이 음의 공간을 채움 */}
        <motion.ellipse
          cx={CX}
          cy={CY}
          rx={90}
          ry={96}
          fill="url(#lf-plane)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.4, ease: EASE }}
        />

        {/* Phase 2 — 선(Line): 실들이 stroke-dashoffset으로 하나씩 그려짐 */}
        {THREADS.map((t, i) => (
          <motion.ellipse
            key={i}
            cx={CX}
            cy={CY}
            rx={t.rx}
            ry={96}
            fill="none"
            stroke="#FEB951"
            strokeWidth="0.9"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: t.opacity }}
            transition={{
              pathLength: { duration: 1.1, delay: t.delay, ease: EASE },
              opacity: { duration: 0.5, delay: t.delay },
            }}
          />
        ))}

        {/* Phase 3 — 밝게 빛나는 앞쪽 링 */}
        <motion.ellipse
          cx={CX}
          cy={CY}
          rx={52}
          ry={96}
          fill="none"
          stroke="url(#lf-ring)"
          strokeWidth="2.4"
          filter="url(#lf-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 1.3, delay: 2.2, ease: EASE },
            opacity: { duration: 0.5, delay: 2.2 },
          }}
        />
      </g>

      {/* Phase 2 — 가로 관통선(중심을 가로질러 오른쪽으로 뻗음) */}
      <motion.line
        x1={70}
        y1={CY}
        x2={392}
        y2={CY}
        stroke="#FEB951"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{
          pathLength: { duration: 1.2, delay: 1.0, ease: EASE },
          opacity: { duration: 0.4, delay: 1.0 },
        }}
      />

      {/* Phase 2 — 스파이어(우측 상단의 가느다란 곡선) */}
      <motion.path
        d={`M 312 96 Q 318 158 312 ${CY}`}
        fill="none"
        stroke="#FEB951"
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{
          pathLength: { duration: 1.0, delay: 1.4, ease: EASE },
          opacity: { duration: 0.4, delay: 1.4 },
        }}
      />

      {/* Phase 1 — 중앙 시작점(인큐베이션): 맥동 후 선으로 갈라지며 사라짐 */}
      <motion.circle
        cx={CX}
        cy={CY}
        r={5.5}
        fill="#FFE7C2"
        filter="url(#lf-glow)"
        style={{ willChange: "transform, opacity", transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1, 1], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.0, times: [0, 0.25, 0.6, 1], ease: EASE }}
      />

      {/* Phase 3 — 가로선 오른쪽 끝의 빛나는 점 */}
      <motion.circle
        cx={392}
        cy={CY}
        r={7}
        fill="#FEB951"
        filter="url(#lf-glow)"
        style={{ willChange: "transform, opacity", transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.0, ease: EASE }}
      />
    </motion.svg>
  );
}
