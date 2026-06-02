import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal: 스크롤해서 화면에 보이기 시작하면
 * 아래에서 위로 부드럽게 나타나는 애니메이션 래퍼입니다.
 * 어느 섹션이든 <Reveal> ...내용... </Reveal> 로 감싸면 됩니다.
 *
 * - delay: 나타나는 시작 시간을 늦춰서 순차적으로 등장시킬 때 사용
 * - duration: 나타나는 동작의 길이(초). 기본 0.7, 키우면 더 천천히 등장
 * - className: Tailwind 클래스를 그대로 전달할 수 있음
 *
 * 접근성: 사용자가 '동작 줄이기(prefers-reduced-motion)'를 켜면
 * 페이드/상승 없이 즉시 표시(정적)되어 어지러움을 막습니다.
 */
export default function Reveal({ children, delay = 0, duration = 0.7, className = "" }) {
  const reduceMotion = useReducedMotion(); // OS '동작 줄이기' 설정 감지

  return (
    <motion.div
      className={className}
      // 동작 줄이기면 애니메이션 없이 바로 보임(initial=false → 시작 상태 건너뜀)
      initial={reduceMotion ? false : { opacity: 0, y: 30 }} // 처음엔 투명하고 30px 아래에
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} // 화면에 보이면 제자리로
      viewport={{ once: true, amount: 0.25 }} // 한 번만, 25% 보이면 실행
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
