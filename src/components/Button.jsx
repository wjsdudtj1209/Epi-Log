import { motion } from "framer-motion";

/**
 * Button — Epi:Log 디자인 시스템의 재사용 버튼 컴포넌트.
 * (Figma "Components" 프레임의 Button을 기반으로, 우리 토큰에 맞춰 구성)
 *
 * 사용 예)
 *   <Button>시작하기</Button>
 *   <Button variant="secondary" size="lg">더 알아보기</Button>
 *   <Button icon={<SomeIcon />}>아이콘 버튼</Button>
 *   <Button icon={<SomeIcon />} iconPosition="right">다음</Button>
 *   <Button disabled>비활성</Button>
 *
 * Props
 *  - children / label : 버튼 안에 들어갈 텍스트 (label은 children이 없을 때 쓰는 보조 prop)
 *  - variant          : 색상 베리언트 — "primary" | "secondary" | "ghost"
 *  - size             : 크기 베리언트 — "sm" | "md" | "lg"
 *  - icon             : 아이콘(ReactNode). 넘기면 표시, 안 넘기면 텍스트만 (아이콘 유무)
 *  - iconPosition     : 아이콘 위치 — "left"(기본) | "right"
 *  - disabled         : 비활성화 상태
 *  - className        : 추가로 덧붙일 Tailwind 클래스
 *  - ...rest          : onClick, type 등 표준 <button> 속성 그대로 전달
 */

// ── 색상 베리언트: 색은 모두 우리 토큰(--color-*)으로 연결됨 ──────────────────
const VARIANTS = {
  // 골드 채움 + 잉크 글씨 (메인 CTA)
  primary:
    "bg-gold text-ink shadow-sm hover:bg-honey focus-visible:ring-gold/60",
  // 골드 외곽선 (보조)
  secondary:
    "border border-gold/50 text-gold hover:bg-gold/10 focus-visible:ring-gold/50",
  // 배경 없는 텍스트형 (가벼운 동작)
  ghost:
    "text-gold hover:bg-gold/10 focus-visible:ring-gold/40",
};

// ── 크기 베리언트: 글자 크기는 타이포 토큰(text-p1~p3) 사용 ────────────────────
const SIZES = {
  sm: "gap-1.5 px-4 py-2 text-p3",
  md: "gap-2 px-6 py-3 text-p2",
  lg: "gap-2.5 px-8 py-4 text-p1",
};

export default function Button({
  children,
  label,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  disabled = false,
  className = "",
  ...rest
}) {
  // 공통 스타일 + 선택된 베리언트/크기 + 비활성 스타일을 합칩니다.
  const classes = [
    // 공통: 가운데 정렬·둥근 모양·폰트·부드러운 전환·접근성 포커스 링
    "inline-flex items-center justify-center rounded-full font-pretendard font-semibold whitespace-nowrap",
    "transition-colors duration-300 outline-none focus-visible:ring-2",
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    // 비활성: 흐리게 + 클릭 불가
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    className,
  ].join(" ");

  return (
    <motion.button
      type="button"
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
      // 비활성일 땐 hover/tap 애니메이션도 멈춥니다.
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      {...rest}
    >
      {/* 아이콘이 있으면 왼쪽에 표시 */}
      {icon && iconPosition === "left" && (
        <span className="inline-flex shrink-0">{icon}</span>
      )}

      {/* 버튼 텍스트: children 우선, 없으면 label */}
      {children ?? label}

      {/* 아이콘이 있고 위치가 오른쪽이면 오른쪽에 표시 */}
      {icon && iconPosition === "right" && (
        <span className="inline-flex shrink-0">{icon}</span>
      )}
    </motion.button>
  );
}
