import { motion } from "framer-motion";

/**
 * PhoneMockup: 앱 화면 스크린샷(폰 목업)을 부드럽게 띄워 보여줍니다.
 * Figma에서 받은 이미지에 이미 폰 베젤(테두리)이 포함되어 있어,
 * 여기서는 살짝 떠다니는 움직임과 그림자/빛만 더해줍니다.
 *
 * - float: true면 위아래로 천천히 떠다니는 애니메이션
 * - glow: true면 뒤쪽에 골드 빛 번짐 추가
 */
export default function PhoneMockup({ src, alt, float = true, glow = true, className = "" }) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={float ? { y: [0, -14, 0] } : undefined}
      transition={
        float ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" } : undefined
      }
    >
      {glow && (
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(circle,rgba(254,185,81,0.22),transparent_70%)] blur-2xl" />
      )}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full max-w-[270px] select-none drop-shadow-2xl"
      />
    </motion.div>
  );
}
