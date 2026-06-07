/**
 * Hero: 단순화된 히어로 — bg-night 단색 위에 큰 [Epi:Log] 타이틀(화면 정중앙) + 하단 스크롤 인디케이터.
 * ▸ 높이: 정확히 화면 높이(h-screen = 100vh) → 섹션 중앙 = 뷰포트 중앙.
 *   (min-height를 두면 작은 노트북 화면에서 섹션이 화면보다 길어져, 타이틀이 중앙보다 아래로 내려가고
 *    하단 스크롤 인디케이터가 화면 밖으로 밀려 안 보였음 → 제거.)
 *   Preloader 오버레이도 같은 기준(fixed inset-0 = 뷰포트 전체)의 정중앙으로 그리기 때문에
 *   오버레이가 사라질 때 픽셀 단위로 겹쳐 자연스럽게 이어집니다(심리스 핸드오프).
 * ▸ 배경색은 아래 질문(IntroQuote) 섹션과 동일한 bg-night(#050504 토큰)
 *   → 프리로더 오버레이와도 같은 색이라 셋이 하나의 어두운 면으로 이어집니다.
 * ▸ 스크롤 인디케이터(마우스 윤곽 + 흐르는 점)는 상시 노출되어 히어로의 스크롤 힌트로 남습니다.
 *   애니메이션 클래스(.scroll-cue-dot)는 index.css에 있고, 동작 줄이기에선 자동으로 멈춥니다.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-night"
    >
      <h1
        className="font-tan text-honey"
        style={{
          // 데스크톱 77px(=5.35vw@1440), 작은 화면에서 비례 축소(최소 2.5rem).
          // (Preloader의 중앙 타이틀과 동일 수치 — 바꾸면 두 곳을 함께 바꿔야 함)
          fontSize: "clamp(2.5rem, 5.35vw, 77px)",
          lineHeight: 1.5,
          letterSpacing: "0.3em",
          fontWeight: 400,
        }}
      >
        [Epi:Log]
      </h1>

      {/* 스크롤 유도 인디케이터 (하단 중앙) — Preloader 엔딩의 것과 동일 위치·디자인. */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="relative block h-9 w-[22px] rounded-full border border-gold/45">
          <span className="scroll-cue-dot absolute left-1/2 top-[7px] h-[7px] w-[3px] rounded-full bg-gold/85" />
        </span>
        <span className="font-pretendard text-[10px] tracking-[0.3em] text-cream/45">
          SCROLL
        </span>
      </div>
    </section>
  );
}
