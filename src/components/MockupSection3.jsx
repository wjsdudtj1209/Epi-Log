import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ClusterLabel, PHONE_SHADOW_CLASS } from "./MockupSection.jsx";

/**
 * MockupSection3: 자산 등록 / MY ASSETS (Mockup 마지막 섹션).
 * ▸ 모든 콘텐츠를 Figma 좌표로 1:1 구성(폰 base 245.69×534.17, scale 1.0).
 *   섹션에는 transform/scale 없음 — 절대배치만으로 Figma와 1:1 정렬.
 * ▸ 연결선은 Figma 좌표 그대로의 SVG 오버레이(폰 뒤, z-0).
 * ▸ 폰 정면/회전 없음(균일 드롭섀도), 라이트 #FBFBFB / 다크 #140F0B.
 *
 * ▣ 스크롤 순차 등장: 헤더 → ① → ② → ③ → ④ 순으로, 각 그룹의
 *   [번호+텍스트 + 폰 + 그 연결선]이 함께 fade+상승(0.6s)으로 1회 등장.
 *   각 그룹은 캔버스 전체를 덮는 투명 레이어라 위치는 1:1 유지하고,
 *   그룹 대표 Y(anchorTop)에 둔 보이지 않는 sentinel을 IntersectionObserver로 관찰해
 *   그 지점이 화면에 들어올 때만 등장시킨다(스크롤 위치 연동).
 */

const BASE_W = 1440;
const BASE_H = 2198; // Figma Section 3 프레임 높이
const PHONE_W = 245.69; // Figma base 폰 크기
const PHONE_H = 534.17;

// 폰 4개 — Figma 절대 좌표(좌상단), base 크기.
const PHONES = [
  { src: "/mk-asset-1.png", alt: "자산 등록 1단계 화면", left: 194, top: 221 },
  { src: "/mk-asset-2.png", alt: "자산 등록 2단계 화면", left: 1074, top: 563 },
  { src: "/mk-asset-3.png", alt: "자산 등록 3단계 화면", left: 323, top: 1044 },
  { src: "/mk-asset-4.png", alt: "자산 등록 4단계 화면", left: 977, top: 1548 },
];

// 번호 스텝(세로 스택): 번호 원(위) → 제목 → 설명. align='right'면 우측정렬.
function StepItem({ n, title, desc, align = "left" }) {
  const right = align === "right";
  return (
    <div className={`flex flex-col gap-5 ${right ? "items-end" : "items-start"}`}>
      <span className="flex size-[30px] items-center justify-center rounded-full border border-ink font-pretendard text-[21px] leading-none text-ink">
        {n}
      </span>
      <div className={`flex flex-col gap-[6px] ${right ? "items-end text-right" : "items-start"}`}>
        <h4 className="font-pretendard text-[32px] font-semibold leading-tight text-ink">{title}</h4>
        <p className="font-pretendard text-[18px] font-normal leading-[1.6] text-ink">{desc}</p>
      </div>
    </div>
  );
}

// 절대배치(BASE 좌표). 등장 애니메이션은 상위 <ScrollGroup>이 그룹 단위로 담당(여기선 위치만).
function Abs({ left, right, top, children }) {
  return (
    <div className="absolute z-10" style={right != null ? { right, top } : { left, top }}>
      {children}
    </div>
  );
}

function AssetPhone({ src, alt, left, top }) {
  return (
    <Abs left={left} top={top}>
      <img
        src={src}
        alt={alt}
        style={{
          width: PHONE_W,
          height: PHONE_H,
          // 폰만 살짝 확대(--mk-asset-scale). 중심 기준이라 4변이 고르게 커져
          // 연결선 끝점이 폰 안쪽으로 더 들어가 자연스럽게 tuck 됩니다.
          transform: "scale(var(--mk-asset-scale, 1))",
          transformOrigin: "center",
        }}
        className={`block object-contain ${PHONE_SHADOW_CLASS}`}
      />
    </Abs>
  );
}

// 장식 글로우(폰 뒤, z-0): honey radial, 263px. 농도 통일(코어 30%/72%, opacity 1, blur 95). (Figma 좌표)
function Glow({ left, top }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-0"
      style={{
        left,
        top,
        width: 263,
        height: 263,
        background: "radial-gradient(circle, var(--color-honey) 0%, var(--color-honey) 30%, transparent 72%)",
        opacity: 1,
        filter: "blur(95px)",
      }}
    />
  );
}

// 연결선 SVG 래퍼 — BASE 좌표 그대로, 폰 뒤(z-0). path만 children으로 받아 그룹별로 나눠 그림.
function LineSvg({ children }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 text-ink"
      width={BASE_W}
      height={BASE_H}
      viewBox={`0 0 ${BASE_W} ${BASE_H}`}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
        {children}
      </g>
    </svg>
  );
}

// 스크롤 방향 양방향 토글: 선 위치(anchorTop)에 둔 보이지 않는 sentinel이
// 뷰포트 트리거선(화면 높이의 trigger 비율 지점)을 '지나 위로' 가면 그려짐(true),
// 다시 '아래로' 내려오면 되감김(false). 선이 화면 위로 완전히 지나가도 그려진 상태는 유지됨
// (boundingClientRect.top 비교 → top<0 이어도 트리거선보다 위라 true). → 올릴 때만 반대로 되감김.
//
// trigger: 트리거선의 화면 세로 비율(0~1). 기본 0.8 = 화면 80% 지점(하단 부근).
//   값을 낮출수록(예: 0.5) 트리거선이 화면 중앙으로 올라가, 더 스크롤해야 그려지고
//   되감김도 화면 중앙에서 일어나 더 잘 보인다.
function useScrollDrawn(anchorTop, trigger = 0.8) {
  const reduce = useReducedMotion();
  const sentinelRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDrawn(true);
      return;
    }
    const el = sentinelRef.current;
    if (!el) return;
    // rootMargin 하단 여백을 trigger에 맞춰 계산(예: trigger 0.5 → 하단 -50%).
    const bottomMargin = Math.round((1 - trigger) * 100);
    const io = new IntersectionObserver(
      ([entry]) => {
        // sentinel이 트리거선(화면 높이의 trigger 비율)보다 위면 그려짐, 아래면 되감김.
        setDrawn(entry.boundingClientRect.top < window.innerHeight * trigger);
      },
      // 위/아래 경계를 모두 통과 보고받도록(되감기 위해 disconnect 안 함).
      { threshold: 0, rootMargin: `0px 0px -${bottomMargin}% 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, trigger]);

  return [sentinelRef, reduce ? true : drawn];
}

// 보이지 않는 1px 트리거(선 위치 기준)
function Sentinel({ innerRef, top }) {
  return (
    <div
      ref={innerRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 w-px"
      style={{ top, height: 1 }}
    />
  );
}

// 연결선(SVG) — 선이 화면에 들어오면 pathLength 0→1로 출발 폰 → 다음 폰 방향으로 그려지고,
// 스크롤을 올리면 1→0으로 반대로 되감김(useScrollDrawn이 스크롤 방향에 따라 토글).
function DrawLine({ d, anchorTop, trigger }) {
  const reduce = useReducedMotion();
  const [sentinelRef, drawn] = useScrollDrawn(anchorTop, trigger);
  return (
    <>
      <Sentinel innerRef={sentinelRef} top={anchorTop} />
      <LineSvg>
        {reduce ? (
          <path d={d} />
        ) : (
          <motion.path
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: drawn ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}
      </LineSvg>
    </>
  );
}

// 가로선(div) — scaleX 0→1로 origin 쪽 끝에서 '뻗어 나가듯' 그려지고, 올리면 0으로 되감김.
function HLine({ style, origin, anchorTop }) {
  const reduce = useReducedMotion();
  const [sentinelRef, drawn] = useScrollDrawn(anchorTop);
  return (
    <>
      <Sentinel innerRef={sentinelRef} top={anchorTop} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 bg-ink"
        style={{ ...style, transformOrigin: origin }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={reduce ? undefined : { scaleX: drawn ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </>
  );
}

/**
 * ScrollGroup: 한 그룹(번호+텍스트 + 폰 + 그 연결선)을 묶어, 그룹 대표 Y(anchorTop)가
 * 화면에 들어올 때 '한 번만' fade+상승(1.2s ease-out)으로 천천히 등장(스크롤 순차 등장).
 * - 캔버스 전체를 덮는 투명 레이어 안에 절대좌표 요소를 그대로 두어 위치는 1:1 유지.
 * - 트리거: anchorTop 위치의 보이지 않는 1px sentinel을 IntersectionObserver로 관찰.
 *   (레이어 자체는 캔버스만큼 커서 그걸 관찰하면 모든 그룹이 동시에 떠버리므로 sentinel을 따로 둠)
 * - prefers-reduced-motion이면 즉시 표시(애니메이션·순차 없음).
 */
function ScrollGroup({ anchorTop, children }) {
  const reduce = useReducedMotion();
  const sentinelRef = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce) {
      setShown(true); // 동작 줄이기: 바로 표시
      return;
    }
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // 1회만(스크롤을 올려도 다시 숨기지 않음)
        }
      },
      // 뷰포트 하단에서 20% 올라온 지점을 이 sentinel이 지날 때 등장(충분히 보일 때).
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <>
      {/* 스크롤 트리거 기준점(보이지 않음) — 그룹 대표 Y에 위치 */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 w-px"
        style={{ top: anchorTop, height: 1 }}
      />
      {/* 콘텐츠 레이어(캔버스 전체 덮음) — 그룹이 함께 fade+상승. 사이트 공통 스타일과 동일. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={
          reduce
            ? undefined
            : {
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
              }
        }
      >
        {children}
      </div>
    </>
  );
}

export default function MockupSection3() {
  return (
    <section id="mockup-3" className="w-full overflow-hidden bg-mockup-bg">
      {/* Figma 좌표 그대로(1440×2198), transform/scale 없음 — 절대배치만.
          --mk-asset-scale: 폰만 살짝 확대하는 배율(여기서 한 곳만 고치면 됨). */}
      <div
        className="relative mx-auto"
        style={{ width: BASE_W, height: BASE_H, "--mk-asset-scale": 1.3 }}
      >
        {/* ── 그룹 0: 헤더(MY ASSETS · 자산 등록) + 상단 가로선 ── */}
        <ScrollGroup anchorTop={8}>
          {/* Line 35 (상단 가로) — "자산 등록" 타이틀 끝(885)에서 시작, 화면 우측 끝까지.
              타이틀 쪽(왼쪽 끝)에서 오른쪽으로 뻗어 나가듯 그려짐. */}
          <HLine style={{ left: 885, top: 87.5, height: 1, width: "calc(50vw - 165px)" }} origin="left" anchorTop={87.5} />
          <Abs left={730} top={8}>
            <ClusterLabel
              eyebrow="MY ASSETS"
              title="자산 등록"
              body={
                <>
                  무엇을 남기고, 지우고, 전달할지 미리 정해두어
                  <br />
                  남겨진 사람이 혼자 판단하지 않도록 돕습니다.
                </>
              }
              bodyWidth={590}
            />
          </Abs>
        </ScrollGroup>

        {/* ── 그룹 ①: 유형 선택 (phone1 + 연결선 phone1→phone2) ── */}
        <ScrollGroup anchorTop={221}>
          {/* Vector 7935 (phone1→phone2) — 선이 화면에 들어오면 1→2 방향으로 그려짐 */}
          <DrawLine d="M317.5 743V788C317.5 815.6142 339.8858 838 367.5 838H1069.5" anchorTop={743} />
          <AssetPhone {...PHONES[0]} />
          <Abs left={530} top={541}>
            <StepItem n="1" title="유형 선택" desc="어떤 흔적을 남길지 먼저 고릅니다" />
          </Abs>
        </ScrollGroup>

        {/* ── 그룹 ②: 정보 입력 (phone2 + 연결선 phone2→phone3 + 글로우) ── */}
        <ScrollGroup anchorTop={563}>
          <Glow left={913} top={454} />
          {/* Vector 7936 (phone2→phone3) — 선이 화면에 들어오면 2→3 방향으로 그려짐.
              trigger=0.35: 기준선이 화면 위쪽(35%)이라, 위로 스크롤할 때 선이 더 일찍 줄어들기 시작함
              (덜 스크롤해도 되감김 시작). 나타나는 시점은 그만큼 조금 더 뒤로. */}
          <DrawLine d="M1191 1085V1245C1191 1272.614 1168.614 1295 1141 1295H560" anchorTop={1085} trigger={0.35} />
          <AssetPhone {...PHONES[1]} />
          <Abs right={416} top={930}>
            <StepItem n="2" title="정보 입력" desc="기억해야 할 정보를 차분히 기록합니다" align="right" />
          </Abs>
        </ScrollGroup>

        {/* ── 그룹 ③: 기준 선택 (phone3 + 글로우) ── 연결선 없음(요청에 따라 phone3→phone4 선 제거) */}
        <ScrollGroup anchorTop={1044}>
          <Glow left={414} top={1433} />
          <AssetPhone {...PHONES[2]} />
          <Abs left={646} top={1319}>
            <StepItem n="3" title="기준 선택" desc="남길 것과 지울 것을 나의 기준으로 정합니다" />
          </Abs>
        </ScrollGroup>

        {/* ── 그룹 ④: 실행 설정 (phone4 + 하단 가로선) ── */}
        <ScrollGroup anchorTop={1548}>
          {/* Line 36 (하단 가로) — 화면 왼쪽 끝에서 x605까지.
              좌측 끝에서 오른쪽으로 뻗어 나가듯 그려짐. */}
          <HLine style={{ left: "calc(720px - 50vw)", top: 1779, height: 1, width: "calc(50vw - 115px)" }} origin="left" anchorTop={1779} />
          <AssetPhone {...PHONES[3]} />
          <Abs left={657} top={1708}>
            <StepItem n="4" title="실행 설정" desc="뜻을 실행할 사람과 방법을 연결합니다" />
          </Abs>
        </ScrollGroup>
      </div>
    </section>
  );
}
