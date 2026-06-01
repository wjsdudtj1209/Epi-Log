import Reveal from "./Reveal.jsx";
import Container from "./Container.jsx";

/**
 * CtaSection: 페이지를 마무리하는 브랜드 메시지 영역입니다.
 * (이메일 구독 입력 폼은 현재 제거된 상태 — 다크 카드에 마무리 문구만 표시)
 */
export default function CtaSection() {
  return (
    <section id="cta" className="relative px-6 py-32 md:py-40">
      <Container>
        <Reveal className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-10 text-center text-cream shadow-2xl shadow-ink/20 sm:p-14">
            {/* 카드 안쪽 배경 빛 */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(254,185,81,0.4),transparent_60%)] blur-2xl" />
            <div className="pointer-events-none absolute right-0 -bottom-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(190,98,0,0.35),transparent_65%)] blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                부재가 아닌 존재로 기억될 수 있도록
              </h2>
              <p className="mx-auto mt-5 max-w-md leading-relaxed text-cream/65">
                흩어진 디지털 자산을 정리하고, 당신의 뜻과 마음을 남겨진 사람에게
                전합니다. <span className="text-gold">[Epi:Log]</span>가 그 마지막
                이야기를 이어줍니다.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
