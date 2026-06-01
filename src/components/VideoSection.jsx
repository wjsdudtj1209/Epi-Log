import { useEffect, useRef, useState } from "react";

// ── 아이콘 (currentColor 상속) ──
function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
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

// 원형 컨트롤 버튼(공통 스타일)
function CircleButton({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-black/40 text-cream backdrop-blur-md transition-colors duration-300 hover:bg-black/60"
    >
      {children}
    </button>
  );
}

// 초 → "m:ss" 포맷 (메타데이터 로드 전/비정상 값은 0:00)
const fmt = (s) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

// 배속 단계 (버튼 클릭 시 순환)
const SPEEDS = [0.5, 1, 1.5, 2];

/**
 * VideoSection: 질문(IntroQuote)과 Overview(BackgroundSection) 사이의 인트로 영상.
 * - 재생 시작: 스크롤해서 영상이 화면에 들어올 때 '최초 1회' 자동재생(muted + playsInline, loop + preload).
 * - 하단 컨트롤 바: 탐색바 · 재생/정지 · 음소거 · 볼륨 · 시간 · 배속. 실제 video 이벤트와 상태 동기화.
 * - prefers-reduced-motion: 자동재생하지 않음(컨트롤은 동일 제공 → 직접 재생 가능).
 * - 배경 #050504(= bg-night, 위 질문 섹션과 동일) → 위로 살짝 겹쳐도 이음새가 안 보이고,
 *   아래 BackgroundSection의 둥근 이음새로 자연스럽게 이어짐.
 */
export default function VideoSection() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const startedRef = useRef(false); // 스크롤 진입 시 '최초 1회'만 자동재생하기 위한 플래그
  // 렌더 시점에 reduced-motion 판정
  const [reduce] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [playing, setPlaying] = useState(false); // 스크롤로 보일 때 재생 → 초기엔 정지
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1); // 0~1 (음소거 해제 시 적용될 볼륨)
  const [currentTime, setCurrentTime] = useState(0); // 현재 재생 위치(초)
  const [duration, setDuration] = useState(0); // 전체 길이(초)
  const [rate, setRate] = useState(1); // 재생 배속

  // 초기 상태: 음소거(자동재생 정책 충족) + 초기 볼륨. 재생은 스크롤 진입 시 시작.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.volume = volume;
    // 초기값만 반영(최초 1회) — volume은 의존성에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스크롤해서 영상이 화면에 들어올 때 '최초 1회' 자동재생(reduced-motion이면 생략).
  // muted 상태라 사용자 제스처 없이도 재생 허용됨. 이후엔 사용자의 정지/재생을 존중(다시 강제재생 X).
  useEffect(() => {
    if (reduce) return;
    const v = videoRef.current;
    const el = containerRef.current;
    if (!v || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const p = v.play?.();
            if (p && p.catch) p.catch(() => {}); // 자동재생 거부 무시
          }
        }
      },
      { threshold: 0.35 }, // 영상이 35%쯤 보이면 시작
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // 실제 video의 play/pause 이벤트로 버튼 상태를 동기화(루프·외부 조작에도 정확).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  // 현재 재생 시간 / 전체 길이 동기화.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration || 0);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    if (v.readyState >= 1) onMeta(); // 이미 메타데이터 로드됐으면 즉시 반영
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play?.();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    // 음소거 해제했는데 볼륨이 0이면 들리도록 기본값 부여
    if (!next && v.volume === 0) {
      v.volume = 0.5;
      setVolume(0.5);
    }
    setMuted(next);
  };

  const onVolume = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.volume = val;
    setVolume(val);
    // 볼륨 0이면 음소거, 0보다 크면 해제
    const m = val === 0;
    v.muted = m;
    setMuted(m);
  };

  // 배속 순환: 0.5 → 1 → 1.5 → 2 → 0.5 ...
  const cycleRate = () => {
    const v = videoRef.current;
    if (!v) return;
    const i = SPEEDS.indexOf(rate);
    const next = SPEEDS[(i + 1) % SPEEDS.length];
    v.playbackRate = next;
    setRate(next);
  };

  // 탐색(seek): 슬라이더로 현재 재생 위치를 이동.
  const onSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.currentTime = val;
    setCurrentTime(val);
  };

  // 컨트롤 바: 기본 숨김 → 마우스 호버/포커스 시 노출(부드러운 페이드).
  // 단, reduced-motion이면 자동재생을 안 하므로 재생 버튼이 늘 보이도록 항상 노출.
  const controlsCls = reduce
    ? "opacity-100"
    : "opacity-0 pointer-events-none transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100";

  return (
    <section
      id="intro"
      className="relative z-10 -mt-8 bg-night px-4 pt-0 pb-10 sm:px-6 md:-mt-20 md:pb-14"
    >
      {/* 거의 풀폭으로 키우고(좌우 패딩 최소), 위 질문 섹션의 빈 하단 공간으로 끌어올려(-mt) 꽉 차 보이게.
          두 섹션 배경이 같은 #050504(bg-night)라 겹쳐도 이음새가 보이지 않음.
          폭 = min(100%, 1760px, 94vh를 16:9로 환산) — 16:9 높이가 94vh를 넘지 않게 제한. */}
      <div className="mx-auto" style={{ width: "min(100%, 1760px, calc(94vh * 16 / 9))" }}>
        <div ref={containerRef} className="group relative aspect-video w-full overflow-hidden rounded-[24px]">
          <video
            ref={videoRef}
            src="/intro.mp4"
            muted
            loop
            playsInline
            preload="auto"
            onClick={togglePlay}
            className="absolute inset-0 size-full cursor-pointer object-cover"
          />

          {/* 하단 컨트롤 바: (위) 탐색바 / (아래) 재생·음소거·볼륨·시간·배속. 호버/포커스 시 노출 */}
          <div
            className={`absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-5 pt-14 pb-5 ${controlsCls}`}
          >
            {/* 탐색(seek) 바 — 현재 위치 표시 + 드래그로 이동 */}
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={onSeek}
              aria-label="재생 위치 조절"
              className="h-1 w-full cursor-pointer accent-gold"
            />

            <div className="flex items-center gap-4">
              <CircleButton onClick={togglePlay} label={playing ? "정지" : "재생"}>
                {playing ? <PauseIcon /> : <PlayIcon />}
              </CircleButton>

              <div className="flex items-center gap-3">
                <CircleButton onClick={toggleMute} label={muted ? "소리 켜기" : "소리 끄기"}>
                  {muted ? <MutedIcon /> : <SoundIcon />}
                </CircleButton>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={onVolume}
                  aria-label="볼륨 조절"
                  className="h-1 w-28 cursor-pointer accent-gold"
                />
              </div>

              {/* 우측: 현재 시간 / 전체 길이 + 배속 */}
              <div className="ml-auto flex items-center gap-4">
                <span className="font-pretendard text-xs tabular-nums text-cream/80">
                  {fmt(currentTime)} / {fmt(duration)}
                </span>
                <button
                  type="button"
                  onClick={cycleRate}
                  aria-label={`재생 속도 ${rate}배`}
                  className="grid h-8 min-w-[46px] place-items-center rounded-full border border-white/20 bg-black/40 px-3 text-xs font-medium text-cream backdrop-blur-md transition-colors duration-300 hover:bg-black/60"
                >
                  {rate}×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
