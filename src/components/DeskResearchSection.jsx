import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal.jsx";
import Container from "./Container.jsx";

// insight-box 본문/강조문장 순차 등장(fade+상승) — 부모 stagger로 본문 → 강조문장 순서.
const INSIGHT_LINE = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Desk Research 5개 아이콘 — 컨테이너 박스 없이 투명 배경의 글리프만 사용 (Figma 그대로)
const icons = [
  { src: "/research/01-apple.png", alt: "Apple" },
  { src: "/research/03-facebook.png", alt: "Facebook" },
  { src: "/research/04-instagram.png", alt: "Instagram" },
  { src: "/research/06-kakaotalk.png", alt: "KakaoTalk", rounded: true },
  { src: "/research/05-google.png", alt: "Google" },
];

// 양끝을 투명하게 흐리게 만드는 그라데이션 마스크
const fadeMask =
  "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)";

/**
 * DeskResearchSection: "흩어진 플랫폼별 사후 처리 절차" 영역입니다.
 * 5개의 플랫폼 아이콘(투명 글리프)이 '지정된 바운딩 박스 안에서만'
 * 끊김 없이 무한히 흐르는 마키로 표현됩니다.
 *  - 트랙을 2배 복제 + CSS translateX(-50%) → 이음새 없는 무한 루프 (GPU 가속)
 *  - 박스 좌우는 그라데이션 마스크로 투명하게 페이드
 */
export default function DeskResearchSection() {
  const reduce = useReducedMotion(); // 접근성: 모션 줄이기면 순차 등장 없이 즉시 표시
  const loop = [...icons, ...icons]; // 5 → 10 (절반 이동 시 정확히 한 바퀴)

  // 하단 패딩을 넓혀 아래 Design System(다크 라운드 섹션)과의 간격 확보 (md 기준 160→288px)
  return (
    <section id="research" className="relative pt-32 pb-52 md:pt-40 md:pb-72">
      {/* 텍스트 블록: 좌측 정렬, 좌우 120, 요소간 40 (제목↔설명 20) */}
      <Reveal className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[40px] px-6 sm:px-10 lg:px-[120px]">
        <p className="text-section font-semibold text-rust">Desk Research</p>
        <div className="flex flex-col gap-[20px]">
          <h2 className="text-display font-bold text-ink">
            흩어진 플랫폼별 사후 처리 절차
          </h2>
          <p className="text-lead font-medium text-ink">
            디지털 자산은 하나의 삶에서 비롯되지만, 실제 사후 처리 방식은 플랫폼마다 다르게 작동합니다.
            <br />
            어떤 서비스는 추모 전환을 지원하고, 어떤 서비스는 직접 로그인이나 별도 요청 절차가 필요합니다.
          </p>
        </div>
      </Reveal>

      {/* 무한 마키 — 유지: 지정된 바운딩 박스(가운데 정렬) 안에서만 동작 + 양끝 페이드 */}
      <Container className="mt-[111px]">
        <div
          className="mx-auto max-w-3xl overflow-hidden py-8"
          style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}
        >
          <div className="flex w-max animate-marquee will-change-transform">
            {loop.map((icon, i) => (
              <img
                key={i}
                src={icon.src}
                alt={icon.alt}
                draggable={false}
                className={`mr-20 h-24 w-24 shrink-0 object-contain ${
                  icon.rounded ? "rounded-[22%]" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </Container>

      {/* 맺음 메시지 — 배경은 Figma 박스 텍스처(insight-box-bg.png: 원본 insight-box.png에서 글자를 지운 버전),
          글자는 또렷하게 HTML로 렌더(이미지에 박힌 글자가 스케일 시 깨지는 문제 방지).
          둥근 모서리·그림자는 CSS로 처리, 배경은 박스 높이에 맞춰 bg-cover로 채움. */}
      <div className="mx-auto mt-[86px] flex w-full max-w-[1440px] justify-center px-6 sm:px-10 lg:px-[120px]">
        <Reveal className="w-full max-w-[838px]">
          <div
            className="relative overflow-hidden rounded-[30px] bg-cover bg-center px-8 py-10 text-center shadow-[5.59px_5.59px_11.878px_rgba(101,79,48,0.17)] sm:px-[100px] sm:py-[40px]"
            style={{ backgroundImage: "url('/insight-box-bg.png')" }}
          >
            {/* 박스가 뜬 뒤 본문(앞 2줄) → 강조 문장 순서로 순차 등장(stagger). reduce면 즉시 표시.
                색은 text-cream-warm(=text/log default #FBEDD5). */}
            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, amount: 0.5 }}
              variants={{ show: { transition: { delayChildren: 0.25, staggerChildren: 0.3 } } }}
            >
              {/* Figma(node 1392:925): 앞 2줄 18px Medium */}
              <motion.p
                variants={INSIGHT_LINE}
                className="text-[18px] font-medium leading-[1.6] tracking-[-0.02em] text-cream-warm"
              >
                이처럼 사후 처리 방식이 플랫폼마다 달라질수록,
                <br />
                남겨진 사람에게는 더 큰 혼란과 부담이 생깁니다.
              </motion.p>
              {/* 마지막 강조 문장(20px SemiBold) — 한 박자 늦게 등장 */}
              <motion.p
                variants={INSIGHT_LINE}
                className="mt-[29px] text-[20px] font-semibold leading-[1.6] tracking-[-0.02em] text-cream-warm"
              >
                에필:로그는 흩어진 절차와 판단을 하나의 기준으로 정리할 수 있도록 돕습니다.
              </motion.p>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
