import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * IntroQuote: 시안의 인트로 화면을 옮긴 '다크 인터루드' 섹션입니다.
 * 밝은 페이지 흐름 속에서 잠깐 어두워지며, 핵심 질문을 묵직하게 던집니다.
 * 질문이 한 줄씩 떠오른 뒤 본문이 이어집니다.
 *
 * Figma 원본 사양 반영:
 *  - 섹션: 배경 #050504, 가로 max 1440, 높이 985px, position relative.
 *  - 콘텐츠 프레임: 위에서 347px 지점, 가로 중앙, 좌우 120·상하 40px.
 *  - 텍스트 블록: 폭 1200px, 세로 배치, 카피↔본문 gap 59px, 가운데 정렬.
 *  - 배경 빛: Figma 원본 PNG(public/intro-glow.png)를 자가호스팅해 사용.
 *    (Figma는 blur 효과가 걸린 도형을 이미지로 내보냄 → 원본과 동일하게 가려고 PNG 채택)
 *  ※ 고정 px는 데스크톱(lg) 기준, 모바일은 축소 패딩으로 대응. 빛 위치/크기는 % 기준=반응형.
 */
export default function IntroQuote() {
  const reduce = useReducedMotion();
  const contentRef = useRef(null);
  // 질문/본문을 '스크롤 위치'에 직접 연동(scroll-scrubbed) → 스크롤하는 만큼 순차로 떠오름.
  // offset: 콘텐츠 상단이 뷰포트 85% 지점에 오면 0(시작) → 30% 지점에 오면 1(완료).
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start 0.85", "start 0.3"],
  });
  // 스프링으로 완만하게 → 스크롤마다 끊기지 않고 매끄럽게.
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.0005 });
  // 질문 2줄은 같은 구간으로 '함께' 등장(fade + 상승), 본문은 그 뒤에 등장.
  const l1o = useTransform(p, [0.2, 0.55], [0, 1]);
  const l1y = useTransform(p, [0.2, 0.55], [24, 0]);
  const l2o = l1o; // 2번째 줄도 1번째와 동일 타이밍 → 두 줄 함께 등장
  const l2y = l1y;
  const bodyO = useTransform(p, [0.82, 1.0], [0, 1]);
  const bodyY = useTransform(p, [0.82, 1.0], [18, 0]);

  return (
    <section
      // 검은 베이스 — Figma 원본 #050504(= --color-night 토큰). 그 위에 빛 이미지를 얹음.
      className="relative w-full overflow-hidden bg-night text-cream"
    >
      {/* 섹션 내부 기준: 가로 max 1440 중앙, 높이 985px, relative(빛·콘텐츠 absolute 기준점) */}
      <div className="relative mx-auto min-h-[985px] w-full max-w-[1440px]">
        {/* 배경 빛(자가호스팅 PNG): 세로로 긴 타원, 오른쪽 위.
            원본 위치를 % 환산 → 중심 가로 61%·세로 37%, 폭 41%.
            ⚠️ 높이는 퍼센트(h-%) 금지 — 부모가 min-height만 가져서 퍼센트 높이가 0으로 계산돼 안 보였음.
               → 이미지 원본 비율(aspect-[1171/1544])로 높이를 잡아 부모 높이와 무관하게 항상 렌더.
            opacity-80: 원본 18%는 너무 옅어 안 보이므로 보이게 올린 값(숫자만 조정 가능). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[61%] top-[37%] z-0 w-[41%] -translate-x-1/2 -translate-y-1/2 aspect-[1171/1544] bg-contain bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/intro-glow.png')" }}
        />

        {/* 콘텐츠 프레임: 위에서 347px(lg) 지점, 가로 중앙, 좌우 120·상하 40px.
            모바일은 absolute 대신 상단 패딩으로 자연스럽게 흐르도록 대응. z-10으로 빛 위에. */}
        <div ref={contentRef} className="relative z-10 px-6 pt-40 pb-32 sm:px-10 lg:absolute lg:inset-x-0 lg:top-[347px] lg:px-[120px] lg:py-[40px]">
          {/* 텍스트 블록: 폭 1200, 세로 배치, gap 59, 가운데 정렬 */}
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[59px] text-center">
            {/* 큰 카피: Pretendard Bold 36px / line-height 140% / honey(#FFD99D) */}
            <h2 className="w-full text-2xl leading-[1.4] font-bold tracking-[-0.01em] text-honey sm:text-4xl">
              {/* 스크롤 진행도에 맞춰 1번째 줄 → 2번째 줄 순서로 떠오르며 등장 */}
              <motion.span className="block" style={reduce ? undefined : { opacity: l1o, y: l1y }}>
                당신이 내일 갑자기 세상을 떠난다면,
              </motion.span>
              <motion.span className="block" style={reduce ? undefined : { opacity: l2o, y: l2y }}>
                당신이 남기고 간 것들은 어떻게 될까요?
              </motion.span>
            </h2>

            {/* 본문: Pretendard Medium 16px / line-height 160% / cream-warm(#FBEDD5) */}
            <motion.p
              className="w-full text-sm leading-[1.6] text-cream-warm sm:text-base"
              style={reduce ? undefined : { opacity: bodyO, y: bodyY }}
            >
              우리는 수많은 기록을 남기며 살아가지만,
              <br />
              갑작스러운 부재 이후 그 기록과 감정, 마지막 의사는 제대로 정리되지 못한 채 남겨지는 경우가 많습니다.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
