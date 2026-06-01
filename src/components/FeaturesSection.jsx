import { motion, useReducedMotion } from "framer-motion";
import Container from "./Container.jsx";

// 기능별 라인 아이콘
const ArchiveIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
    <path d="M10 12h4" />
  </svg>
);
const SlidersIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2.2" />
    <circle cx="8" cy="17" r="2.2" />
  </svg>
);
const SparkIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 12a8 8 0 0 1-11.3 7.3L4 21l1.7-5.7A8 8 0 1 1 21 12Z" />
    <path d="M12 8.5l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9.9-2Z" />
  </svg>
);

const features = [
  {
    no: "01",
    title: "디지털 자산 정리함",
    desc: "SNS·구독·가상자산·클라우드까지 흩어진 디지털 자산을 한 곳에 등록하고, 중요도와 상속·삭제 기준으로 관리합니다.",
    Icon: ArchiveIcon,
    large: true,
  },
  {
    no: "02",
    title: "사후 실행 설정",
    desc: "자산별로 보관·전달·삭제를 미리 지정하고 신뢰하는 실행자에게 위임해, 남겨진 사람의 부담을 미리 덜어줍니다.",
    Icon: SlidersIcon,
  },
  {
    no: "03",
    title: "AI 기억 에이전트",
    desc: "메시지와 기억 아카이브를 학습한 AI가 당신의 가치관과 말투를 담아, 남겨진 사람에게 따뜻하게 마음을 전합니다.",
    Icon: SparkIcon,
  },
];

/**
 * FeaturesSection — "Refined Bento" 디자인.
 * 밝은 paper 위에 비대칭 벤토 그리드(큰 타일 01 + 작은 타일 02·03).
 * gold-stroke 하이라인 테두리 + 따뜻한 honey 틴트 + 코너 글로우, 호버 시 살짝 떠오름(lift).
 * 인덱스 숫자는 TAN-PEARL 골드→앰버 그라데이션, 제목은 Pretendard.
 *  - 모든 색/타이포는 디자인 토큰만 사용. 스태거드 리빌 + prefers-reduced-motion 대응.
 */
export default function FeaturesSection() {
  const reduced = useReducedMotion();

  return (
    <section id="features" className="relative overflow-hidden bg-paper py-28 text-ink md:py-36">
      {/* 분위기 글로우 (토큰 색, 장식) */}
      <div aria-hidden className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-glow/10 blur-3xl" />

      <Container>
        {/* 라벨 */}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-section font-semibold uppercase text-rust"
        >
          Key function
        </motion.p>

        {/* 비대칭 벤토: 큰 타일(01) 1열 2행 + 작은 타일(02·03) */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 md:grid-rows-2 sm:mt-14">
          {features.map((f, i) => {
            const Icon = f.Icon;
            return (
              <motion.article
                key={f.no}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-gold-stroke bg-honey/10 p-8 transition duration-500 hover:-translate-y-1 hover:border-amber/40 hover:bg-honey/20 hover:shadow-xl sm:p-10 ${
                  f.large ? "md:row-span-2 md:p-12" : ""
                }`}
                initial={reduced ? false : { opacity: 0, y: 30 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              >
                {/* 코너 따뜻한 글로우 */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl transition-colors duration-500 group-hover:bg-gold/20"
                />

                {/* 상단: 인덱스 숫자 + 라인 아이콘(gold-stroke 링) */}
                <div className="flex items-start justify-between">
                  <span
                    className={`bg-gradient-to-br from-gold to-amber bg-clip-text font-tan leading-none text-transparent ${
                      f.large ? "text-h1" : "text-headline"
                    }`}
                  >
                    {f.no}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-stroke text-amber transition-colors duration-500 group-hover:bg-amber group-hover:text-paper">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>

                {/* 하단: 제목 + 설명 */}
                <div className={f.large ? "mt-16" : "mt-10"}>
                  <h3
                    className={`font-pretendard font-bold text-ink ${
                      f.large ? "text-display" : "text-headline"
                    }`}
                  >
                    {f.title}
                  </h3>
                  <p className="mt-3 max-w-md text-lead font-medium text-ink/70">
                    {f.desc}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
