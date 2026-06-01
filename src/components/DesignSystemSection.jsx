/**
 * DesignSystemSection: 피그마 'Design System'.
 * 순서: 헤더 → 점·선·면 → Visual Motif → Naming → Typography → Icons → Color → Glass/Gradient.
 * 일반 블록 레이아웃(블록 간 208px 간격). 각 블록 = 구분선+타이틀 마커 + 콘텐츠.
 *
 * 스크롤 등장 애니메이션:
 * 위 섹션들(Overview·Background·Desk Research)과 '똑같은' 공유 컴포넌트 <Reveal>을 재사용합니다.
 * → 각 블록이 화면에 들어오면 1회만 '아래에서 위로 떠오르며 페이드인'(opacity 0→1, y 30→0,
 *    0.7s ease-out, 25% 보이면 실행). 라벨(0s) → 콘텐츠(0.1s) 순서로 소프트 캐스케이드.
 * 기존 내부 모션(아이콘 마퀴·빛나는 점·Glass 블러·그라데이션·점선면 커넥터·Naming 글로우)은
 * 블록 '내부'에 있어 바깥 Reveal 래핑의 영향을 받지 않고 그대로 유지됩니다.
 */
import Reveal from "./Reveal.jsx";

// 섹션 라벨(피그마 원본): Pretendard Regular 18px / lh1.6 / ls-0.02em / #FFD99D, 좌측 정렬. 구분선·번호 없음.
function SectionMarker({ name }) {
  return (
    <p className="font-pretendard text-[18px] leading-[1.6] font-normal tracking-[-0.02em] text-honey">{name}</p>
  );
}

const swatches = [
  { hex: "#140F0B", name: "Background",  bg: "bg-ink",          text: "text-tan", border: "border-[0.75px] border-cream/20" },
  { hex: "#FBEDD5", name: "Primary",     bg: "bg-cream-warm",   text: "text-ink", border: "" },
  { hex: "#FEB951", name: "Point color", bg: "bg-gold",         text: "text-ink", border: "" },
  { hex: "#FFD99D", name: "Sub color 1", bg: "bg-honey",        text: "text-ink", border: "" },
  { hex: "#F7D48C", name: "Sub color 2", bg: "bg-gold-pale/52", text: "text-ink", border: "" },
];

const gradients = [
  { label: "#140F0B - BE6200", css: "linear-gradient(to right, #140F0B 0%, #421F03 71.15%, #6C3102 85.1%, #BE6200 100%)" },
  { label: "#140F0B - 533200", css: "linear-gradient(to right, #140F0B 0%, rgba(83,50,0,0.7) 100%)" },
];

const ICONS = [
  { n: 1, maxW: 40, maxH: 44 },
  { n: 2, maxW: 62, maxH: 30 },
  { n: 3, maxW: 26, maxH: 26 },
  { n: 4, maxW: 42, maxH: 44 },
  { n: 5, maxW: 44, maxH: 44 },
  { n: 6, maxW: 50, maxH: 50 },
  { n: 7, maxW: 52, maxH: 44 },
  { n: 8, maxW: 54, maxH: 58 },
];

// 커넥터 1 (점↔선): 화살촉 없는 단순 가로선 180px·1px·gold-pale/52. 그래픽 줄 중앙 정렬, md+만.
function ConnectorLine() {
  return (
    <div className="hidden shrink-0 items-center self-start text-gold-pale/52 md:mt-[110px] md:flex" aria-hidden="true">
      <span className="block h-px w-[120px] bg-current lg:w-[180px]" />
    </div>
  );
}
// 커넥터 2 (선↔면): 본체선 160px + V자 화살촉(±45°, ~37px). 하나의 SVG path로 완전한 일직선.
function ConnectorArrow() {
  return (
    <div className="hidden shrink-0 items-center self-start text-gold-pale/52 md:mt-[88px] md:flex lg:mt-[83px]" aria-hidden="true">
      <svg viewBox="0 0 186 54" fill="none" className="h-auto w-[150px] lg:w-[186px]">
        <path
          d="M0 27L186 27M160 1L186 27L160 53"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default function DesignSystemSection() {
  return (
    <section id="design" className="relative w-full rounded-t-[30px] bg-ink">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-20 px-6 py-24 sm:px-12 lg:gap-[208px] lg:px-[120px] lg:py-[148px]">
        {/* ── 헤더 ── (가운데 정렬 인트로) — 라벨 → 문단 0.1s 캐스케이드 */}
        <header className="flex w-full flex-col items-center gap-10 text-center">
          <Reveal>
            <p className="font-pretendard text-section font-semibold text-honey">DESIGN SYSTEM</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-pretendard text-lead font-medium leading-[1.6] tracking-[-0.02em] text-cream-warm">
              미니멀한 구조와 절제된 포인트 컬러를 통해
              <br />
              사용자가 자신의 마지막 의사와 기억에 온전히 집중하고,
              <br />
              이후에도 감정적 연결이 자연스럽게 이어지도록 돕습니다.
            </p>
          </Reveal>
        </header>

        {/* ── 점·선·면 ── (피그마 원본: 상단 섹션 라벨 없음) — 커넥터가 컬럼을 이어 블록 전체를 함께 등장 */}
        <Reveal className="flex w-full flex-col gap-10">
          <div className="flex w-full flex-col items-center gap-12 py-6 md:flex-row md:items-start md:justify-center md:gap-6 lg:gap-10">
            {/* 점 */}
            <div className="flex flex-col items-center">
              <div className="flex h-[220px] items-center justify-center">
                <span
                  className="size-[39px] rounded-full bg-ds-dot"
                  style={{
                    boxShadow:
                      "0 0 14.4px 2px color-mix(in oklab, var(--color-dot-glow-inner) 67%, transparent), 0 0 33.4px 10px var(--color-dot-glow-outer)",
                    filter: "blur(1.15px)",
                  }}
                />
              </div>
              <div className="mt-6 flex flex-col items-center gap-[15px] text-center">
                <p className="font-pretendard text-headline font-semibold text-gold">점</p>
                <p className="font-pretendard text-[21px] leading-[1.6] font-normal text-muted">흩어진 디지털 흔적</p>
              </div>
            </div>

            <ConnectorLine />

            {/* 선 */}
            <div className="flex flex-col items-center">
              <div className="flex h-[220px] items-center justify-center">
                <span
                  className="block h-[194px] w-[5px]"
                  style={{ background: "linear-gradient(to top, var(--color-ds-line) 24%, rgba(31,20,10,0) 95%)" }}
                />
              </div>
              <div className="mt-6 flex flex-col items-center gap-[15px] text-center">
                <p className="font-pretendard text-headline font-semibold text-gold">선</p>
                <p className="font-pretendard text-[21px] leading-[1.6] font-normal text-muted">의미와 실행의 연결</p>
              </div>
            </div>

            <ConnectorArrow />

            {/* 면 */}
            <div className="flex flex-col items-center">
              <div className="flex h-[220px] items-center justify-center">
                <img src="/plane.png" alt="" aria-hidden="true" className="h-[220px] w-[214px] object-contain" />
              </div>
              <div className="mt-6 flex flex-col items-center gap-[15px] text-center">
                <p className="font-pretendard text-headline font-semibold text-gold">면</p>
                <p className="font-pretendard text-[21px] leading-[1.6] font-normal text-gold">하나의 완성된 에필로그</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Visual Motif ── (Figma 1455:1058 반영: 라벨#FFD99D + 본문#FBEDD5 을 20px 간격으로 묶은
            텍스트 그룹 + 우측 로고. 라벨/본문 모두 Pretendard 18px·lh1.6·자간-0.02em.) */}
        <Reveal className="relative flex w-full flex-col items-start gap-10 md:flex-row md:items-center md:justify-between md:gap-8">
          {/* 텍스트 그룹: Visual Motif 라벨(honey) → 본문(cream-warm), 사이 간격 20px(Figma gap) */}
          <div className="flex max-w-md flex-col gap-5">
            <SectionMarker name="Visual Motif" />
            <p className="font-pretendard text-[18px] leading-[1.6] font-normal tracking-[-0.02em] text-cream-warm">
              기록과 기억이 연결되고 축적되는 과정을
              <br />
              유기적인 곡선과 빛의 흐름으로 표현했습니다.
            </p>
          </div>
          <img
            src="/logo.png"
            alt="Epi:Log 비주얼 모티프 — 기록과 기억이 곡선과 빛으로 이어지는 형상"
            className="pointer-events-none w-[min(520px,100%)] shrink-0 md:-mt-10 md:w-[clamp(380px,44vw,560px)]"
          />
        </Reveal>

        {/* ── Naming ── (Figma 1423:1031 반영: 라벨↔[Epi:Log] 행 간격 60.75px, 컨테이너 상하 패딩 40px,
            우측 텍스트 컬럼 간격 25.5px. 글로우(Ellipse299)는 상단-우측에 은은히.) */}
        <Reveal className="relative w-full py-10">
          {/* 글로우(Figma Ellipse299): 193px · gold(#FEB951) · opacity 0.3 · blur 104, 상단-우측.
              overflow-hidden 없이 → 둥글고 부드럽게 페이드. z-0(콘텐츠는 z-10으로 위에). */}
          <div className="pointer-events-none absolute top-0 right-6 z-0 size-[193px] rounded-full bg-gold opacity-30 blur-[104px]" />
          {/* 라벨 + [Epi:Log] 행을 한 컬럼으로 묶어 60.75px 간격(Figma container gap). z-10으로 글로우 위에. */}
          <div className="relative z-10 flex flex-col items-start gap-[60.75px]">
            <SectionMarker name="Naming" />
            <div className="flex w-full flex-col gap-10 md:flex-row md:items-center md:gap-[112px]">
              <p className="font-tan text-[56px] leading-[1.2] font-normal tracking-[0.02em] whitespace-nowrap text-gold sm:text-[80px] md:text-[102px] md:leading-[140px]">
                [Epi:Log]
              </p>
              <div className="flex flex-col gap-[25.5px]">
                <p className="font-pretendard text-headline font-semibold text-honey">Epilogue + Log(기록)</p>
                <p className="max-w-[360px] font-pretendard text-[18px] leading-[1.6] font-normal tracking-[-0.02em] text-cream-warm">
                  본 이야기가 끝난 뒤 남겨진 데이터(Log)가
                  <br />
                  고인의 목소리를 대변한다는 의미로 제작하였습니다.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Typography ── 라벨 → 콘텐츠 0.1s 캐스케이드 */}
        <div className="flex w-full flex-col gap-10">
          <Reveal><SectionMarker name="Typography" /></Reveal>
          <Reveal delay={0.1} className="w-full rounded-[22.5px] bg-honey px-8 py-8 text-ink sm:px-[62px] sm:py-[40.5px]">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-12">
                <span className="font-tan text-[40px] leading-[1.5] font-normal sm:text-[62px]">Tan-Pearl</span>
                <span className="font-pretendard text-[44px] leading-[1.5] font-normal sm:text-[71px]">Pretendard</span>
              </div>
              <div className="flex gap-12 font-pretendard text-[18px] leading-[1.5] sm:text-[21px]">
                <div className="flex flex-col items-start gap-[5px]">
                  <span className="font-normal">Regular</span>
                  <span className="font-medium">Medium</span>
                </div>
                <div className="flex flex-col items-end gap-[5px]">
                  <span className="font-semibold">SemiBold</span>
                  <span className="font-bold">Bold</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Icons ── 라벨 → 콘텐츠 0.1s 캐스케이드 (마퀴는 콘텐츠 내부라 그대로 유지)
            음수 위쪽 마진: 컨테이너 균일 간격(모바일 80px·lg 208px)에서 Typography↔Icons 사이만 좁힘. */}
        <div className="-mt-12 flex w-full flex-col gap-10 lg:-mt-[150px]">
          <Reveal><SectionMarker name="Icons" /></Reveal>
          <Reveal delay={0.1} className="w-full overflow-hidden rounded-[22.5px] border-[0.75px] border-gold px-8 py-10 sm:px-[50px] sm:py-[51px]">
            <div className="flex w-max items-center animate-marquee-slow will-change-transform hover:[animation-play-state:paused]">
              {[...ICONS, ...ICONS].map((ic, i) => (
                <div key={i} className="mr-10 flex size-[72px] shrink-0 items-center justify-center sm:mr-14">
                  <img
                    src={`/icon${ic.n}.svg`}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="object-contain"
                    style={{ maxWidth: `${ic.maxW}px`, maxHeight: `${ic.maxH}px` }}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── Color ── 라벨 → 콘텐츠 0.1s 캐스케이드 */}
        <div className="flex w-full flex-col gap-10">
          <Reveal><SectionMarker name="Color" /></Reveal>
          <Reveal delay={0.1} className="flex w-full flex-col gap-6">
            <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-5">
              {swatches.map((s) => (
                <div
                  key={s.name}
                  className={`flex h-[254px] flex-col gap-[10px] rounded-[15px] p-6 ${s.bg} ${s.text} ${s.border}`}
                >
                  <span className="font-pretendard text-[15px] leading-tight font-normal">{s.hex}</span>
                  <span className="font-pretendard text-[12.75px] leading-tight font-normal">{s.name}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-[19.5px] sm:grid-cols-2">
              {gradients.map((g) => (
                <div
                  key={g.label}
                  className="flex h-[172px] items-start overflow-hidden rounded-[15px] px-8 pt-7"
                  style={{
                    background: g.css,
                    boxShadow: "inset 0 0 0 0.75px color-mix(in oklab, var(--color-cream) 20%, transparent)",
                  }}
                >
                  <span className="font-pretendard text-[15.75px] font-normal text-tan">{g.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── Glass Morphism / Gradient Circle ── (상단 합친 라벨 없이, 그룹별 라벨만)
            두 컬럼을 각각 Reveal(0s·0.1s)로 캐스케이드. Glass 블러·Gradient는 컬럼 내부라 유지. */}
        <div className="flex w-full flex-col gap-10">
          <div className="flex w-full flex-col gap-16 md:flex-row md:items-start md:justify-between md:gap-16">
            <Reveal className="flex flex-col items-start gap-10 md:gap-20">
              <p className="font-pretendard text-[18px] leading-[1.6] font-normal tracking-[-0.02em] text-honey">Glass Morphism</p>
              <div className="relative h-[330px] w-[372px] max-w-full">
                <div className="absolute top-0 left-0 size-[272px] rounded-full bg-gold" />
                <div
                  className="absolute top-[50px] left-[100px] size-[272px] rounded-full border bg-gold-soft/[0.07]"
                  style={{
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderColor: "rgba(255,255,255,0.25)",
                    boxShadow: "inset 1px 1px 1px rgba(255,255,255,0.45), 0 8px 30px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col items-start gap-10 md:mr-20 md:gap-20">
              <p className="font-pretendard text-[18px] leading-[1.6] font-normal tracking-[-0.02em] text-honey">Gradient Circle</p>
              <img
                src="/gradient-circle.png"
                alt=""
                aria-hidden="true"
                // 음수 위쪽 마진: 글로우가 Glass Morphism 원보다 아래로 처져 보여 위로 끌어올림.
                className="-mt-8 h-[320px] w-auto object-contain opacity-80 sm:-mt-[60px] sm:h-[440px]"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
