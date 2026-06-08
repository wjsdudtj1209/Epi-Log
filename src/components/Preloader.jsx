import { useEffect, useRef, useState } from "react";

/**
 * Preloader (V7): 코드만으로 만든 인트로 오버레이. (영상 파일 없음)
 *
 * 시퀀스 (~6.5초 + 0.8초 페이드아웃):
 *   1) 0 ~ 1.4s    FLOAT     — 점 20개가 중앙 포함 화면 전역에 퍼져 각자 무중력 유영 + 안내 문구
 *   2) 1.4 ~ 2.9s  GATHER    — 점들이 '천천히(1.5s)' 중앙으로 모여 작은 '빛나는 구체'(36px)로 병합
 *   3) 3.0 ~ 3.7s  LEFT      — 구체가 왼쪽으로 글라이드(이때 로고 점 높이까지 살짝 내려감)
 *   4) 3.75 ~ 4.65 RIGHT     — '같은 높이'로 똑바로 오른쪽 이동(수평) → 중앙 로고의 오른쪽 끝 점에 도착.
 *                            ★ 이동하는 0.9s 동안 로고가 blur(14px)→0 + opacity 0→1 로 '점점 드러나며 선명'해짐.
 *   ── 엔딩 ──
 *   5) ~4.65 ~ 5.65 HOLD     — 로고가 완전히 선명하게 표시된 채 ~1s 머묾(홀드)
 *   6) 5.65 ~ 6.55s CROSSFADE— 로고가 느긋하게(0.9s) 페이드아웃 (구체도 함께). 타이틀은 여기서 안 그림.
 *   7) 6.1s ~      FADE      — 오버레이 페이드아웃(로고 아웃의 뒷부분에만 겹침). 걷히면서 밑의 히어로
 *                            [Epi:Log] '하나'만 드러남 → 이중 노출 없음.
 *
 * 구현 원칙:
 *   - JS 타이머는 "단계(phase) 전환"만 담당, 실제 움직임은 전부 CSS transition/keyframes.
 *   - 애니메이션 속성은 transform + opacity 만 사용 (구체 글로우의 정적 blur는 허용 범위).
 *   - 안전장치: 어떤 이유로든 멈추면 9초에 강제 제거 → 검은 화면에 갇히지 않음.
 *   - prefers-reduced-motion(동작 줄이기): 아예 렌더하지 않고 즉시 히어로 노출.
 */

// ── 타임라인 (ms) ──────────────────────────────────────────────────────
const T_FLOAT = 80; //      마운트 직후 → 점/문구 페이드인
const T_GATHER = 2200; //    점들이 중앙으로 모이기 시작 (문구를 +0.8s 더 보여준 뒤 수렴 / 1.5s에 걸쳐)
const T_LEFT = 3800; //      왼쪽 글라이드 (0.7s) — 점들이 다 모여 구체가 된 뒤 시작
const T_RIGHT = 4550; //     수평 오른쪽 이동 (0.9s → ~5.45s 도착)
// (로고는 별도 단계 없이 RIGHT 이동 동안 '블러→선명 + opacity 0→1'로 드러남 — 이동 시간 0.9s와 동기화)
const T_CROSSFADE = 6450; // 로고 페이드아웃 시작 (느긋한 0.9s) + 구체 아웃. 그 전 ~1s는 로고 완전 표시(홀드)
const T_FADE = 6900; //      오버레이 페이드아웃 시작 (0.9s) — 로고 아웃의 '뒷부분'에만 겹쳐, 급하게 잘리지 않게
const T_REMOVE = 7800; //    완전히 제거(언마운트)
const T_SAFETY = 9800; //    ⛑ 안전장치: 무조건 이 시점엔 강제 제거 (길어진 시퀀스 대비)

const DOT_COUNT = 20; // 부유하는 점 개수 (16~22 권장 범위 내)
const ORB_SIZE = 36; // 구체 코어 지름(px) — 작고 정제된 크기

const LEFT_X = "-16vw"; // 3단계: 왼쪽 글라이드 도착점(가로)

// 로고 이미지(/logo.png, 653×579) 안에서 '오른쪽 끝 점' 중심의 위치 (이미지 박스 대비 비율)
const LOGO_DOT_X = 0.914; // 가로 91.4%
const LOGO_DOT_Y = 0.654; // 세로 65.4%
const LOGO_ASPECT = 579 / 653; // 높이/너비 ≈ 0.8867
// 화면 중앙 로고에서 그 '오른쪽 끝 점'까지의 중앙 기준 오프셋(로고 너비 W 기준 배수)
const DOT_DX = LOGO_DOT_X - 0.5; //                 = 0.414 × W
const DOT_DY = (LOGO_DOT_Y - 0.5) * LOGO_ASPECT; //  ≈ 0.1365 × W
const DOT_X_CSS = `calc(var(--logo-w) * ${DOT_DX})`;
// 로고를 위로 끌어올리는 양 — 이미지 박스가 아니라 '글자/빛점'(이미지의 65.4% 높이)이
// 화면 정중앙에 오도록 DOT_DY 만큼 올린다. (앞의 구체·뒤의 히어로 [Epi:Log]와 같은 높이)
const LOGO_SHIFT_Y_CSS = `calc(var(--logo-w) * ${-DOT_DY})`;

// 안내 문구 (1단계에서 표시, 2단계에서 사라짐)
const CAPTION = "흩어진 디지털 흔적들을 한 곳에 안전하게 모으고 있습니다";

// 단계 순서표 — "지금 단계가 X 이상인가?" 판정에 사용
const ORDER = [
  "init", "float", "gather", "left", "right", "crossfade", "fade",
];

/**
 * 점(파티클) 설정을 1회만 생성합니다.
 * 배치: 각도 무작위 + 반지름 √균등 분포(0.04~1.0) → 중앙 포함 화면 전체에 고르게 퍼짐.
 */
function generateDots() {
  return Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(0.04 + 0.96 * Math.random());
    const amp = 1.5 + Math.random() * 1.5; // 드리프트 진폭 1.5~3vw·vh
    const wp = () => ({
      x: (Math.random() - 0.5) * 2 * amp,
      y: (Math.random() - 0.5) * 2 * amp,
    });
    return {
      id: i,
      x: Math.cos(angle) * 46 * radius, // 최대 ±46vw
      y: Math.sin(angle) * 42 * radius, // 최대 ±42vh
      size: 2.5 + Math.random() * 2.5, // 2.5~5px
      honey: Math.random() < 0.4, // 일부는 밝은 허니색(#FFD99D 토큰)
      delay: Math.random() * 0.3, // 등장/수렴 시차(초)
      driftDur: 6 + Math.random() * 5, // 드리프트 한 바퀴 6~11초 (점마다 속도 다름)
      driftDelay: -Math.random() * 8, // 위상 분산(음수 = 중간 지점부터 시작)
      w1: wp(), // 무작위 경유 지점 3개 → 점마다 전혀 다른 궤적
      w2: wp(),
      w3: wp(),
    };
  });
}

/** 점마다 서로 다른 드리프트 keyframes를 문자열로 생성 (transform만 사용). */
function buildDriftKeyframes(dots) {
  return dots
    .map(
      (d) => `
@keyframes preloader-drift-${d.id} {
  0%, 100% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(${d.w1.x.toFixed(2)}vw, ${d.w1.y.toFixed(2)}vh, 0); }
  50% { transform: translate3d(${d.w2.x.toFixed(2)}vw, ${d.w2.y.toFixed(2)}vh, 0); }
  75% { transform: translate3d(${d.w3.x.toFixed(2)}vw, ${d.w3.y.toFixed(2)}vh, 0); }
}`,
    )
    .join("\n");
}

// 구체의 은은한 맥동 — transform만 사용
const PULSE_KEYFRAMES = `
@keyframes preloader-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.07); }
}`;

// 문구 끝 '...' 로딩 점 — 점마다 시차를 두고 깜빡임 (opacity만 사용)
const ELLIPSIS_KEYFRAMES = `
@keyframes preloader-ellipsis {
  0%, 80%, 100% { opacity: 0.2; }
  40%           { opacity: 1; }
}`;

export default function Preloader() {
  // 동작 줄이기 설정이면 처음부터 show=false → 아무것도 안 그리고 즉시 히어로.
  const [show, setShow] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [phase, setPhase] = useState("init");

  // 점 설정 + 점별 keyframes CSS는 첫 렌더에서 한 번만 생성
  const dotsRef = useRef(null);
  if (!dotsRef.current) {
    const dots = generateDots();
    dotsRef.current = {
      dots,
      css: buildDriftKeyframes(dots) + PULSE_KEYFRAMES + ELLIPSIS_KEYFRAMES,
    };
  }

  // "지금 단계가 p 이상 진행됐나?"
  const atLeast = (p) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

  // ── 타임라인: JS 타이머는 단계 전환만 담당 ──
  useEffect(() => {
    if (!show) return;
    const timers = [
      setTimeout(() => setPhase("float"), T_FLOAT),
      setTimeout(() => setPhase("gather"), T_GATHER),
      setTimeout(() => setPhase("left"), T_LEFT),
      setTimeout(() => setPhase("right"), T_RIGHT),
      setTimeout(() => setPhase("crossfade"), T_CROSSFADE),
      setTimeout(() => setPhase("fade"), T_FADE),
      setTimeout(() => setShow(false), T_REMOVE),
      setTimeout(() => setShow(false), T_SAFETY), // ⛑ 안전장치
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 진입 즉시: 브라우저 스크롤 복원 끄고 맨 위(히어로)로 고정
  useEffect(() => {
    const hist = window.history;
    const prevRestoration =
      "scrollRestoration" in hist ? hist.scrollRestoration : "auto";
    if ("scrollRestoration" in hist) hist.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      if ("scrollRestoration" in hist) hist.scrollRestoration = prevRestoration;
      document.body.style.overflow = "";
    };
  }, []);

  // 떠 있는 동안 스크롤 잠금 → 사라질 때 풀고 맨 위로 + (필요 시) 신호
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("preloader:done"));
    }
  }, [show]);

  if (!show) return null;

  const gathered = atLeast("gather"); // 2단계 이상: 점들이 중앙으로
  // 로고: 구체가 오른쪽으로 이동하는 'right' 단계 동안 드러나기 시작(블러→선명) → crossfade에서 아웃
  const logoVisible = atLeast("right") && !atLeast("crossfade");
  const orbGone = atLeast("crossfade"); // 구체: crossfade에서 함께 아웃
  const fading = phase === "fade"; //     전체 페이드아웃 (걷히면서 밑의 히어로 [Epi:Log]가 드러남)

  // 3·4단계 구체 경로 (로고를 위로 올려 빛점을 화면 정중앙에 맞췄으므로, 구체도 Y=중앙 유지):
  //  - left:  (-16vw, 중앙)   ← 수평 높이는 화면 정중앙 그대로
  //  - right: ( 로고점 X, 중앙) ← Y 그대로 유지 → '순수 수평' 이동, 빛점에 도착
  const carrierTransform = atLeast("right")
    ? `translate(-50%, -50%) translate(${DOT_X_CSS}, 0px)`
    : atLeast("left")
      ? `translate(-50%, -50%) translate(${LEFT_X}, 0px)`
      : "translate(-50%, -50%)";
  const carrierTransition = atLeast("right")
    ? "transform 0.9s cubic-bezier(0.45, 0, 0.25, 1)" // 수평 이동: 차분한 ease-in-out
    : "transform 0.7s cubic-bezier(0.5, 0, 0.2, 1)"; //   왼쪽 글라이드

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-night"
      style={{
        "--logo-w": "clamp(300px, 32vw, 470px)", // 로고 표시·구체 도착점이 공유하는 단일 값
        opacity: fading ? 0 : 1,
        transition: "opacity 0.8s ease-in-out",
        pointerEvents: fading ? "none" : "auto",
      }}
      aria-hidden="true"
    >
      {/* 이 컴포넌트 전용 keyframes — 점별 드리프트 + 구체 맥동 (transform만 사용) */}
      <style>{dotsRef.current.css}</style>

      {/* ── 1·2단계: 자유 부유하는 점들 → 중앙 수렴 ── */}
      {dotsRef.current.dots.map((d) => (
        <span
          key={d.id}
          className="absolute top-1/2 left-1/2"
          style={{
            transform: gathered
              ? "translate(0vw, 0vh)"
              : `translate(${d.x}vw, ${d.y}vh)`,
            opacity: phase === "init" ? 0 : gathered ? 0 : 1,
            transition: gathered
              ? // 더 천천히(1.5s) 중앙으로 수렴 → 도착할 무렵(+1.1s) 구체 속으로 흡수되듯 사라짐
                `transform 1.5s cubic-bezier(0.55, 0, 0.2, 1) ${d.delay}s, opacity 0.45s ease ${d.delay + 1.1}s`
              : `opacity 0.8s ease ${d.delay}s`,
            willChange: "transform, opacity",
          }}
        >
          <span
            className="block"
            style={{
              animation: `preloader-drift-${d.id} ${d.driftDur}s ease-in-out ${d.driftDelay}s infinite`,
              willChange: "transform",
            }}
          >
            <span
              className={`block rounded-full ${d.honey ? "bg-honey" : "bg-gold"}`}
              style={{
                width: d.size,
                height: d.size,
                marginLeft: -d.size / 2,
                marginTop: -d.size / 2,
                boxShadow: "0 0 7px 2px rgba(254, 185, 81, 0.55)",
              }}
            />
          </span>
        </span>
      ))}

      {/* ── 2~4단계: 병합된 구체 — 중앙 → 왼쪽(로고점 높이로 하강) → 수평 오른쪽으로 로고 끝점 도착 ── */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          transform: carrierTransform,
          transition: carrierTransition,
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: ORB_SIZE,
            height: ORB_SIZE,
            transform: gathered ? "scale(1)" : "scale(0)",
            opacity: orbGone ? 0 : 1,
            transition:
              "transform 0.7s cubic-bezier(0.34, 1.25, 0.5, 1) 0.9s, opacity 0.9s ease", // 점들이 천천히 다 모이는 시점(~0.9s 후)에 구체가 맺힘 / 퇴장은 0.9s
            willChange: "transform, opacity",
          }}
        >
          {/* 뒤 레이어: 넓은 오렌지 헤일로 (정적 blur) */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: ORB_SIZE * 2.8,
              height: ORB_SIZE * 2.8,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(255, 164, 17, 0.5) 0%, rgba(255, 164, 17, 0.18) 45%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          {/* 코어: 밝은 중심(honey→gold)이 오렌지(--color-accent = #FFA411)로 번지다 투명으로 */}
          <div
            className="relative h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--color-honey) 0%, var(--color-gold) 32%, var(--color-accent) 55%, rgba(255, 164, 17, 0.25) 72%, transparent 80%)",
              boxShadow:
                "0 0 18px 6px rgba(255, 164, 17, 0.45), 0 0 48px 18px rgba(255, 164, 17, 0.18)",
              animation: "preloader-pulse 3s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* ── 5·6단계: Visual Motif 로고(/logo.png). 이미지 박스가 아니라 '글자/빛점'이
          화면 정중앙에 오도록 위로(LOGO_SHIFT_Y) 끌어올림. crossfade에서 페이드아웃 ── */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ transform: `translateY(${LOGO_SHIFT_Y_CSS})` }}
      >
        <img
          src="/logo.png"
          alt=""
          className="max-w-none"
          style={{
            width: "var(--logo-w)",
            transform: `scale(${logoVisible ? 1 : 0.985})`,
            transformOrigin: `${LOGO_DOT_X * 100}% ${LOGO_DOT_Y * 100}%`,
            opacity: logoVisible ? 1 : 0,
            // 핵심: 구체가 오른쪽으로 이동하는 0.9s 동안 blur(14px)→0 + opacity 0→1
            //        → '점이 이동하면서 로고가 점점 드러나고 선명해지는' 효과.
            // 퇴장(crossfade): 다시 옅어지며 살짝 흐려져 부드럽게 사라짐.
            filter: logoVisible ? "blur(0px)" : "blur(14px)",
            transition: logoVisible
              ? "opacity 0.9s ease-out, filter 0.9s ease-out, transform 0.9s ease-out"
              : "opacity 0.9s ease-in, filter 0.9s ease-in, transform 0.9s ease-in",
            willChange: "transform, opacity, filter",
          }}
        />
      </div>

      {/* [Epi:Log] 타이틀은 오버레이에서 그리지 않습니다. 로고가 사라지는 타이밍과 오버레이 페이드가
          겹치도록 맞춰서(아래 T_FADE 참고), 오버레이가 걷힐 때 밑의 '히어로 [Epi:Log] 하나'만
          자연스럽게 드러납니다 → 타이틀이 두 번 보이지 않음. */}

      {/* ── 1단계 안내 문구: 중앙 아래쪽, 2단계 진입과 함께 페이드아웃 ── */}
      <p
        className="font-pretendard text-noti absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 text-center break-keep text-cream-warm/80"
        style={{
          opacity: phase === "float" ? 1 : 0,
          transition: phase === "float" ? "opacity 0.8s ease 0.3s" : "opacity 0.5s ease",
        }}
      >
        {CAPTION}
        {/* 끝의 '...' — 점 3개가 시차를 두고 천천히 깜빡이는 로딩 애니메이션.
            간격은 '점과 점 사이'(marginLeft)로만 줘서 마지막 점 뒤에 빈 공간이 안 생김
            → text-center 기준이 그대로 유지되어 문장이 중앙에 정렬됨. */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              marginLeft: i === 0 ? "0.12em" : "0.3em",
              animation: `preloader-ellipsis 2s ease-in-out ${i * 0.35}s infinite`,
              willChange: "opacity",
            }}
          >
            .
          </span>
        ))}
      </p>
    </div>
  );
}
