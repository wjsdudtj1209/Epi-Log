/**
 * Footer: 새 Figma 디자인. 라이트 #FBFBFB 배경, 가운데 정렬, 데스크톱 1440.
 * 큰 장식용 목업 그룹(PNG) 때문에 세로로 긴 푸터입니다. 위 → 아래 순서:
 *  1) GLOW   : honey radial 장식(콘텐츠 뒤, z-0)
 *  2) MESSAGE: 중앙 문구 + [Epi:Log] 워드마크(TAN-PEARL, gold-brown #A04B00)
 *  3) MOCKUP : footer-mockups.png — 가로로 넘쳐 클립되는 장식 backdrop(pointer-events none)
 *  4) BAR    : 로고 / 크레딧 3열 + 구분선 + 카피라이트 (max 1200, 가운데)
 * 색은 토큰 사용: bg-mockup-bg(#FBFBFB) · text-ink(#140F0B) · text-kf-label(#A04B00) · honey(#FFD99D).
 */

// 크레딧 3열 데이터
const CREDITS = [
  { role: "PLANNER", name: "전영서" },
  { role: "PLANNER", name: "민명혜" },
  { role: "DESIGNER", name: "강민경" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-mockup-bg text-ink">
      {/* 1440 캔버스(가운데 정렬) */}
      <div className="relative mx-auto w-full max-w-[1440px]">
        {/* 1) GLOW — honey radial, 상단 중앙 뒤(z-0) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[160px] z-0 -translate-x-1/2"
          style={{
            width: 343,
            height: 343,
            background:
              "radial-gradient(circle, var(--color-honey) 0%, var(--color-honey) 30%, transparent 72%)",
            opacity: 1,
            filter: "blur(95px)",
          }}
        />

        {/* 2) CENTER MESSAGE — 가운데, 좌우 패딩 120, 줄 간격 36 */}
        <div className="relative z-10 flex flex-col items-center gap-9 px-6 pt-40 text-center sm:px-10 lg:px-[120px] lg:pt-[220px]">
          <p className="font-pretendard text-[20px] font-medium leading-[24px] tracking-[-0.01em] text-ink">
            부재가 아닌 존재로 기억될 수 있도록,
          </p>
          {/* 워드마크: TAN-PEARL, gold-brown(#A04B00) — 히어로의 #FFD99D와 다름 */}
          <p
            className="font-tan font-normal text-kf-label"
            style={{ fontSize: "clamp(2.5rem, 5.07vw, 73px)", lineHeight: 1.5, letterSpacing: "0.3em" }}
          >
            [Epi:Log]
          </p>
        </div>

        {/* 3) DECORATIVE MOCKUP GROUP — 메시지와 하단 바 사이 backdrop.
            뷰포트 전체 폭으로 풀블리드(가운데 1440 컨테이너를 벗어나 화면 좌우 끝까지) → 좌우 흰 여백 제거.
            width:100vw + marginLeft:calc(50% - 50vw)로 컨테이너 밖 화면 끝까지 확장하고,
            넘치는 부분은 footer의 overflow-hidden이 잘라냄. 장식이라 pointer-events none + aria-hidden. */}
        <div className="relative z-0 mt-40 md:mt-56">
          <img
            src="/footer-mockups.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none block max-w-none select-none"
            style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
          />
        </div>

        {/* 4) BOTTOM FOOTER BAR — max 1200, 가운데(1440 기준 좌우 120 여백) */}
        <div className="relative z-10 mx-auto mt-16 w-full max-w-[1200px] px-6 pb-16 sm:px-10 lg:px-0 lg:pb-20">
          {/* 행: (좌) 로고 / (우) 크레딧 3열. 모바일은 세로 스택. */}
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">
            <img
              src="/footer-logo.png"
              alt="Epi:Log"
              width={100}
              height={100}
              className="size-[100px] shrink-0 rounded-[15px]"
            />
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 md:flex-nowrap md:gap-[80px]">
              {CREDITS.map(({ role, name }, i) => (
                <div key={i} className="flex flex-col items-center gap-2 md:items-start">
                  <span className="font-pretendard text-[20px] text-kf-label">{role}</span>
                  <span className="font-pretendard text-[20px] text-ink">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 구분선 (Line 37): 1px #140F0B, 폭 1200(바 전체) */}
          <div className="mt-10 h-px w-full bg-ink" />

          {/* 카피라이트: Pretendard Light 16/19, #140F0B */}
          <p className="mt-6 font-pretendard text-[16px] font-light leading-[19px] text-ink text-center md:text-left">
            © 2026. [Epi:Log] All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
