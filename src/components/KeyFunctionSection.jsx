/**
 * KeyFunctionSection: 피그마 'Key Function' (Design System 아래).
 * - 라이트 그레이 배경(#EFECEC) + 상단 라운드 30px.
 * - 라벨 'KEY FUNCTION' + 콘텐츠 행(좌: 카드 3개 ~620×188 / 우: 폰 목업 558×594).
 * - 카드 레이어: 배경이미지(맨 뒤) → 반투명 오버레이(이미지 위) → 텍스트(맨 위). 폰: 그라데이션 패널 위 목업.
 * - 좌측 카드 3개는 스크롤 진입 시 공유 컴포넌트 <Reveal>로 0.12초 간격 순차 등장(아래→위 페이드).
 */
import Reveal from "./Reveal.jsx";

// 좌측 카드 3종. overlayStyle = 인라인 반투명 오버레이(이미지가 비치도록). 제목/설명 색은 카드별.
const cards = [
  {
    title: "AI 기억 에이전트",
    desc: ["당신의 말과 감정을 학습해", "기억의 연결을 이어갑니다"],
    img: "/kf-card1.png",
    overlayStyle: { background: "rgba(42,37,37,0.4)" }, // 다크 40% → 배경 이미지 잘 비침
    titleClass: "text-cream-warm",
    descClass: "text-cream-warm",
  },
  {
    title: "사후 실행 설정",
    desc: ["원하는 순간, 원하는 방식으로", "마지막 의사를 전달합니다"],
    img: "/kf-card2.png",
    // 라이트 글래스 그라데이션(이미지 좌측 밝음→우측 어두움)
    overlayStyle: {
      background:
        "linear-gradient(162deg, rgba(228,224,225,0.5), rgba(234,226,220,0.42), rgba(247,230,208,0.26))",
    },
    titleClass: "text-ink",
    descClass: "text-cream-warm",
  },
  {
    title: "디지털 자산 정리함",
    desc: ["남겨질 계정과 기록을", "미리 정리하고 보호합니다"],
    img: "/kf-card3.png",
    overlayStyle: { background: "rgba(42,37,37,0.5)" }, // 다크 50% → 배경 이미지 잘 비침
    titleClass: "text-cream-warm",
    descClass: "text-cream-warm",
  },
];

function FeatureCard({ title, desc, img, overlayStyle, titleClass, descClass }) {
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-[30px] px-8 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:h-[188px] lg:px-[65px] lg:py-[44px]">
      {/* (맨 뒤) 배경 이미지 */}
      <img src={img} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      {/* (이미지 위) 반투명 오버레이 */}
      <div className="absolute inset-0" style={overlayStyle} />
      {/* (맨 위) 텍스트 — 제목 좌 / 설명 우 */}
      <h3 className={`relative font-pretendard text-[26px] font-semibold leading-tight sm:text-[32px] ${titleClass}`}>
        {title}
      </h3>
      <p className={`relative font-pretendard text-[18px] leading-[1.6] font-normal sm:text-right ${descClass}`}>
        {desc[0]}
        <br />
        {desc[1]}
      </p>
    </div>
  );
}

export default function KeyFunctionSection() {
  // 상단 라운드(30px 30px 0 0)를 '보이게' 하려면 위 다크 섹션(Design System)과 겹쳐야 함.
  // -mt-[30px]로 30px 끌어올려 둥근 모서리 안쪽에 다크가 비치게 하고(z-10로 위에),
  // 가려진 30px만큼 상단 패딩을 보태 콘텐츠 위치(Figma pt-100)는 그대로 유지.
  return (
    <section id="key-function" className="relative z-10 -mt-[30px] w-full rounded-t-[30px] bg-kf-bg">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[46px] px-6 pt-[110px] pb-28 sm:px-10 lg:px-[120px] lg:pt-[130px] lg:pb-[192px]">
        {/* 라벨 */}
        <p className="font-pretendard text-section font-semibold text-kf-label">KEY FUNCTION</p>

        {/* 콘텐츠 행 */}
        <div className="flex flex-col gap-[22px] lg:flex-row">
          {/* LEFT: 카드 3개 (각 ~188px) — 3×188 + 2×15 = 594.
              각 카드를 <Reveal>로 감싸 index×0.12초씩 늦춰 1→2→3 순서로 떠오르게 함. */}
          <div className="flex flex-col gap-[15px] lg:w-[620px]">
            {cards.map((c, i) => (
              // duration 1.2로 더 천천히 떠오르고, 순차 간격도 0.2초로 살짝 늘림.
              <Reveal key={c.title} delay={i * 0.2} duration={1.2}>
                <FeatureCard {...c} />
              </Reveal>
            ))}
          </div>

          {/* RIGHT: 그라데이션 패널(566×594) 위 폰 목업 — 패널을 꽉 채움(cover), 둥근 모서리에 크롭 */}
          <div
            className="relative h-[460px] w-full overflow-hidden rounded-[30px] lg:h-[594px] lg:w-[566px]"
            style={{ background: "linear-gradient(to bottom, var(--color-kf-phone-1), var(--color-kf-phone-2))" }}
          >
            <img
              src="/kf-phone.png"
              alt="Epi:Log 앱 화면 목업"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
