/**
 * Footer: 페이지 맨 아래 마무리 영역입니다.
 * 사이트 톤(어두운 #140F0B 배경 + 골드 포인트 + [Epi:Log] 브랜딩)에 맞춘 미니멀 푸터.
 *
 * 레이아웃: 데스크톱은 좌우로 벌어진 2단(space-between), 모바일은 세로로 쌓임.
 *  - LEFT : [Epi:Log] 로고(TAN-PEARL·골드) + 소개 문장(Pretendard)
 *  - RIGHT: 분야 / 제작자 2줄(우측 정렬, muted)
 * 콘텐츠 위에는 아주 옅은 골드 디바이더 라인으로 본문과 차분히 분리합니다.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-ink">
      {/* 가로 패딩은 다른 섹션과 동일(lg:120px) / 세로 64~80px. 상단에 옅은 골드 구분선. */}
      <div className="mx-auto w-full max-w-[1440px] border-t border-gold-pale/20 px-6 py-10 sm:px-10 md:py-12 lg:px-[120px]">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between md:gap-10">
          {/* ── LEFT: 로고 + 소개 ── */}
          <div className="flex flex-col gap-5">
            {/* 로고: TAN-PEARL, 골드, 40→48px. 다른 [Epi:Log] 표기와 동일한 자간(0.02em). */}
            <p className="font-tan text-[30px] leading-none font-normal tracking-[0.02em] text-gold sm:text-[36px]">
              [Epi:Log]
            </p>
            {/* 소개 문장: Pretendard, muted 베이지, 15→16px, 줄간격 1.6. '[에필:로그]'만 골드로 살짝 강조. */}
            <p className="max-w-[420px] font-pretendard text-[15px] leading-[1.6] font-normal text-muted sm:text-[16px]">
              부재가 아닌 존재로 기억될 수 있도록,{" "}
              <span className="text-gold">[에필:로그]</span>가 이어줍니다.
            </p>
          </div>

          {/* ── RIGHT: 분야 / 제작자 (우측 정렬, 작은 줄간격) ── */}
          <div className="flex flex-col items-start gap-2 md:items-end">
            <p className="font-pretendard text-[14px] leading-[1.6] font-normal text-muted text-left sm:text-[15px] md:text-right">
              디지털미디어디자인 · 디지털 콘텐츠 제작
            </p>
            <p className="font-pretendard text-[14px] leading-[1.6] font-medium text-cream-warm text-left sm:text-[15px] md:text-right">
              강민경 · 민명혜 · 전영서
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
