import Reveal from "./Reveal.jsx";
import { ClusterLabel, PHONE_SHADOW_CLASS } from "./MockupSection.jsx";

/**
 * MockupSection3: 자산 등록 / MY ASSETS (Mockup 마지막 섹션).
 * ▸ 모든 콘텐츠를 Figma 좌표로 1:1 구성(폰 base 245.69×534.17, scale 1.0).
 *   섹션에는 transform/scale 없음 — 절대배치만으로 Figma와 1:1 정렬.
 * ▸ 연결선은 Figma 좌표 그대로의 단일 SVG 오버레이(폰 뒤, z-0).
 * ▸ 폰 정면/회전 없음(균일 드롭섀도), 라이트 #FBFBFB / 다크 #140F0B.
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

// 절대배치(BASE 좌표) + Reveal(스크롤 페이드+상승). right를 주면 우측 기준.
function Abs({ left, right, top, children }) {
  return (
    <div className="absolute z-10" style={right != null ? { right, top } : { left, top }}>
      <Reveal>{children}</Reveal>
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

// 연결선 — BASE 좌표 단일 SVG(폰 뒤, z-0). Figma 실제 path 그대로.
function ConnectorLines() {
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
        {/* Line 35(상단 가로)는 뷰포트 오른쪽 끝까지 늘려야 해서 SVG 밖 div로 분리됨 */}
        {/* Vector 7935 (phone1→phone2) — 그대로 */}
        <path d="M317.5 743V788C317.5 815.6142 339.8858 838 367.5 838H1069.5" />
        {/* Vector 7936 (phone2→phone3) — phone2 실제 하단(solid ≈1089)에서 시작해 아래로 내려와,
            ③ 번호원(top=1319) 위쪽 y=1295 가로줄로 지난 뒤 phone3 우측 안쪽으로 tuck.
            양끝 모두 폰의 '솔리드' 영역에 들어가 자연스럽게 연결됨. */}
        <path d="M1191 1085V1245C1191 1272.614 1168.614 1295 1141 1295H560" />
        {/* Line 36(하단 가로)는 화면 왼쪽 끝까지 늘려야 해서 SVG 밖 div로 분리됨 */}

      </g>
    </svg>
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
        {/* 연결선 + 글로우 (폰 뒤, z-0) */}
        <ConnectorLines />
        {/* Line 35 (상단 가로) — "자산 등록" 타이틀 텍스트 끝(862.8) 바로 오른쪽(885)에서 시작,
            타이틀 세로 중심(y≈120)에 맞춤. 캔버스 1440이 아니라 실제 뷰포트 오른쪽 끝(100vw)까지 연장.
            중앙정렬(1440) 기준 left=885 → 화면 우측 끝 폭 = calc(50vw - 165px). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-0 bg-ink"
          style={{ left: 885, top: 87.5, height: 1, width: "calc(50vw - 165px)" }}
        />
        {/* Line 36 (하단 가로) — 오른쪽 끝(x=605)은 그대로 두고, 왼쪽을 캔버스 0이 아니라
            실제 뷰포트 왼쪽 끝(0vw)까지 연장. 중앙정렬(1440) 기준:
            왼쪽 시작 left = calc(720px - 50vw), 폭 = calc(50vw - 115px) → x605에서 끝남. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-0 bg-ink"
          style={{ left: "calc(720px - 50vw)", top: 1779, height: 1, width: "calc(50vw - 115px)" }}
        />
        <Glow left={913} top={454} />
        <Glow left={414} top={1433} />

        {/* 헤더(라벨) — 우측(left 730). 상단 여백 24→8로 더 줄여 MY ASSETS 위 공간을 최소화. */}
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

        {/* 폰 4개(base 크기, Figma 좌표) */}
        {PHONES.map((ph) => (
          <AssetPhone key={ph.src} {...ph} />
        ))}

        {/* 번호 스텝 4개 — Figma 좌표. ②만 우측정렬. */}
        <Abs left={530} top={541}>
          <StepItem n="1" title="유형 선택" desc="어떤 흔적을 남길지 먼저 고릅니다" />
        </Abs>
        <Abs right={416} top={930}>
          <StepItem n="2" title="정보 입력" desc="기억해야 할 정보를 차분히 기록합니다" align="right" />
        </Abs>
        <Abs left={646} top={1319}>
          <StepItem n="3" title="기준 선택" desc="남길 것과 지울 것을 나의 기준으로 정합니다" />
        </Abs>
        <Abs left={657} top={1708}>
          <StepItem n="4" title="실행 설정" desc="뜻을 실행할 사람과 방법을 연결합니다" />
        </Abs>
      </div>
    </section>
  );
}
