import { useEffect, useRef, useState } from "react";

// 스피커 아이콘(음소거 / 소리)
function MutedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

/**
 * VideoSection: 질문(IntroQuote)과 Overview(BackgroundSection) 사이의 자동재생 인트로 영상.
 * - 자동재생 조건(브라우저): muted + playsInline. loop + preload.
 * - 우하단 음소거 토글로 소리 on/off.
 * - prefers-reduced-motion: 자동재생 안 함, 네이티브 컨트롤(재생 버튼) 노출.
 * - 배경 #000000(위 질문 섹션과 동일) → 아래 BackgroundSection의 둥근 이음새가 자연스럽게 이어짐.
 */
export default function VideoSection() {
  const videoRef = useRef(null);
  // 렌더 시점에 reduced-motion 판정(첫 렌더부터 autoPlay 여부 결정)
  const [reduce] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [muted, setMuted] = useState(true);

  // muted 속성은 React에서 누락될 수 있어 ref로 확실히 설정(자동재생 보장).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (!reduce) {
      const p = v.play?.();
      if (p && p.catch) p.catch(() => {}); // 자동재생 거부 무시
    }
  }, [reduce]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      const p = v.play?.();
      if (p && p.catch) p.catch(() => {});
    }
  };

  return (
    <section id="intro" className="relative bg-[#000000] px-6 py-16 sm:px-10 md:py-20">
      {/* 폭을 min(100%, 1440px, 70vh를 16:9로 환산한 폭)으로 제한 →
          아래 16:9 박스의 높이가 70vh를 넘지 않아 패딩 포함 한 화면에 들어옴(셋 중 가장 작은 제약이 적용). */}
      <div className="mx-auto" style={{ width: "min(100%, 1440px, calc(70vh * 16 / 9))" }}>
        <div className="relative aspect-video w-full overflow-hidden rounded-[24px]">
          <video
            ref={videoRef}
            src="/intro.mp4"
            autoPlay={!reduce}
            muted
            loop
            playsInline
            preload="auto"
            controls={reduce}
            className="absolute inset-0 size-full object-cover"
          />

          {/* 음소거 토글 (reduced-motion이면 네이티브 컨트롤이 있으므로 숨김) */}
          {!reduce && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "소리 켜기" : "소리 끄기"}
              className="absolute right-4 bottom-4 grid size-11 place-items-center rounded-full border border-white/20 bg-black/40 text-cream backdrop-blur-md transition-colors duration-300 hover:bg-black/60"
            >
              {muted ? <MutedIcon /> : <SoundIcon />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
