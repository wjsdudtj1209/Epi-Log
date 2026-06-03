import Reveal from "./Reveal.jsx";
import PhoneFrame from "./PhoneFrame.jsx";

/**
 * MockupSection: 피그마 'Section 1'(리디자인) — Key Function 아래.
 * ▸ 데스크톱 1:1 재현을 위해 '1440px 고정 캔버스 + 절대좌표'로 배치(반응형 flex 아님).
 *   각 클러스터(relative, 고정 높이) 안에서 라벨/폰을 absolute로 Figma 좌표 그대로 놓습니다.
 * ▸ 모바일은 추후 처리 — 지금은 깨지지만 않도록 section에 overflow-hidden(캔버스가 좌우로 잘림).
 * ▸ 폰은 전부 '똑바로 선 정면'(회전/3D 없음), 그림자만 적용.
 *   - SERVICE: PhoneFrame(베젤 mk-iphone.png + 크로스페이드), 비율이 Figma와 일치(329×677)
 *   - 그 외(home/ai): export 비율이 0.53(여백 포함)이라 object-cover로 여백을 크롭하며 Figma 크기에 맞춤
 * 각 클러스터는 기존 Reveal(스크롤 페이드+상승)로 등장.
 * (지금은 SERVICE / HOME / AI AGENT 3개. 기록·정리함·자산 등록은 추후.)
 */

const SERVICE_SCREENS = ["/mk-start1.png", "/mk-start2.png", "/mk-start3.png", "/mk-start4.png"];

// 각 클러스터의 라벨 문구(eyebrow/title/body) — 데스크톱·모바일 레이아웃이 '같은 텍스트'를 공유하도록
// 한 곳에 모아둔다. (한쪽만 고쳐서 문구가 달라지는 일을 방지)
const CLUSTERS = {
  service: {
    eyebrow: "SERVICE",
    title: "당신의 뜻을 남기는 첫걸음",
    body: "사용자가 남긴 기록을 통해 삶의 흔적과 감정, 생각을 보존하고, AI 기억 에이전트를 통해 그 의미와 연결이 이후에도 이어질 수 있도록 돕습니다.",
  },
  home: {
    eyebrow: "HOME",
    title: "오늘의 이야기",
    body: "등록된 자산과 기록 현황을 한눈에 확인하고, 오늘의 질문과 AI 리포트를 통해 당신만의 기억과 이야기를 차곡차곡 완성해 나가는 메인 홈 화면입니다.",
  },
  aiAgent: {
    eyebrow: "AI AGENT",
    title: "AI 리포트",
    body: "에필:로그의 AI는 사용자의 답변을 통해 말투, 가치관, 판단 기준을 정리합니다.",
  },
};

// 모든 폰 공통 '균일' 드롭섀도(대각선 오프셋 없음 → 기울어 보이지 않음).
// PhoneFrame은 filter 문자열, StaticPhone은 Tailwind 임의값('_'=공백).
const PHONE_SHADOW = "drop-shadow(0 20px 40px rgba(41,36,34,0.22))";
export const PHONE_SHADOW_CLASS = "drop-shadow-[0_20px_40px_rgba(41,36,34,0.22)]";

// AI AGENT GIF 폰 전용 '더 진한' 그림자.
//  - GIF 폰(scale 0.87)이 옆 리포트 폰보다 작아 같은 그림자라도 약해 보여서, 농도·깊이를 키워 시각적 무게를 맞춤.
//  - 같은 그림자 색(41,36,34)으로, '접지(가까운) + 확산(먼)' 2겹을 겹쳐 더 또렷하고 깊게 보이게 함.
//  - 진하기 조절: 아래 0.20 / 0.32 농도값을 ↑(진하게)·↓(연하게).
const AI_GIF_SHADOW = "drop-shadow(0 6px 14px rgba(41,36,34,0.20)) drop-shadow(0 22px 44px rgba(41,36,34,0.32))";

// ▼▼▼ 폰별 스케일 — 여기 숫자만 바꿔서 개별 조정 ▼▼▼ (SERVICE는 1.0=원래대로)
const MK = {
  serviceScale: 1.0, // 329×677
  homeScale: 1.15, // 301.5×655.5 → ~347×754
  aiAgentScale: 1.3, // 247×537 → ~321×698
  aiReportScale: 1.3, // 247×537 → ~321×698
};
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// 각 폰의 기준 크기(w,h)+좌상단(left,top) — Figma 값.
const BASE = {
  service: { w: 329, h: 677, left: 720, top: -63 },
  home: { w: 301.5, h: 655.5, left: 241, top: -101 },
  aiAgent: { w: 247, h: 537, left: 825, top: 111 },
  aiReport: { w: 247, h: 537, left: 460, top: 457 },
};

// 스케일을 '중심 고정'으로 적용(커져도 폰 중심이 그대로 → 세로/가로 균형 유지, 라벨과 정렬).
export function place(b, s) {
  return {
    width: b.w * s,
    height: b.h * s,
    left: b.left - (b.w * s - b.w) / 2,
    top: b.top - (b.h * s - b.h) / 2,
  };
}
const SVC = place(BASE.service, MK.serviceScale);
const HM = place(BASE.home, MK.homeScale);
const AIA = place(BASE.aiAgent, MK.aiAgentScale);
const AIR = place(BASE.aiReport, MK.aiReportScale);

// AI AGENT 우측 목업: mk-iphone.png 베젤(PhoneFrame) 안에 GIF(ai_epi.gif)를 넣어 실제 폰처럼 표시.
//  - PhoneFrame의 화면 영역 비율(301.5×655.5=0.460)과 GIF 비율(402×874=0.460)이 같아 왜곡/크롭 없이 딱 맞음.
//  - 옆 리포트 폰과 비슷한 크기가 되도록 scale을 잡고, 기존 AI 에이전트 박스(AIA)의 중심에 맞춰 배치.
const AIA_GIF = (() => {
  const scale = 0.87;                                 // ← 폰 크기 조절(키우려면 ↑, 줄이려면 ↓)
  const frameW = 329 * scale, frameH = 677 * scale;   // PhoneFrame 기준 프레임 329×677
  const cx = AIA.left + AIA.width / 2;                 // 기존 AI 에이전트 박스의 중심 x
  const cy = AIA.top + AIA.height / 2;                 // 중심 y
  return { scale, left: cx - frameW / 2, top: cy - frameH / 2 };
})();

/**
 * ClusterLabel: eyebrow → (title → body) 그룹.
 *  - eyebrow 17 SemiBold #A04B00 자간0.02 / title 36 Bold #140F0B lh140 / body 18 Regular #140F0B lh160 자간-0.02 폭355
 *  - 간격: eyebrow→그룹 30px, title→body 20px. break-keep으로 한국어 단어깨짐 방지.
 */
export function ClusterLabel({ eyebrow, title, body, bodyWidth = 355, center = false }) {
  return (
    // center=true(모바일)면 가운데 정렬 + 고정폭 대신 최대폭(좁은 화면에서 넘치지 않게).
    <div className={`flex flex-col gap-[30px] ${center ? "items-center text-center" : ""}`}>
      <p className="font-pretendard text-[17px] font-semibold tracking-[0.02em] text-kf-label">{eyebrow}</p>
      <div
        className="flex flex-col gap-[20px]"
        style={center ? { maxWidth: bodyWidth } : { width: bodyWidth }}
      >
        <h3 className="font-pretendard text-[28px] font-bold leading-[1.4] break-keep text-ink sm:text-[36px]">{title}</h3>
        <p className="font-pretendard text-[16px] font-normal leading-[1.6] tracking-[-0.02em] break-keep text-ink sm:text-[18px]">
          {body}
        </p>
      </div>
    </div>
  );
}

/**
 * StaticPhone: 베젤 포함 export 이미지를 absolute로 정확히 배치.
 * object-contain으로 지정한 width×height 박스 안에 비율 유지하며 담음(왜곡 없음).
 */
export function StaticPhone({ src, alt, left, top, width, height, shadow }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ left, top, width, height }}
      className={`absolute z-10 object-contain ${shadow}`}
    />
  );
}

export default function MockupSection() {
  return (
    <section id="mockup" className="w-full overflow-hidden bg-mockup-bg">
      {/* [데스크톱 ≥lg] 1440 고정 캔버스(가운데). 상하 패딩 186, 클러스터 세로 간격 239.
          좁은 화면에서는 숨기고(hidden), 아래의 모바일 전용 세로 스택을 대신 보여준다. */}
      <div className="relative mx-auto hidden w-[1440px] flex-col gap-[239px] py-[186px] lg:flex">
        {/* ── 클러스터 1: SERVICE (높이 503) ── 라벨(120,120) / 폰(720,-63) 크로스페이드 */}
        <Reveal className="relative h-[503px]">
          <div className="absolute z-10" style={{ left: 120, top: 120 }}>
            <ClusterLabel {...CLUSTERS.service} />
          </div>
          <div className="absolute z-10" style={{ left: SVC.left, top: SVC.top }}>
            <PhoneFrame screens={SERVICE_SCREENS} shadow={PHONE_SHADOW} scale={MK.serviceScale} />
          </div>
        </Reveal>

        {/* ── 클러스터 2: HOME (높이 453) ── 라벨(730,120) / 폰(241,-101) static */}
        <Reveal className="relative h-[453px]">
          <div className="absolute z-10" style={{ left: 730, top: 120 }}>
            <ClusterLabel {...CLUSTERS.home} />
          </div>
          <StaticPhone
            src="/mk-home.png"
            alt="Epi:Log 홈 화면 목업"
            left={HM.left}
            top={HM.top}
            width={HM.width}
            height={HM.height}
            shadow={PHONE_SHADOW_CLASS}
          />
        </Reveal>

        {/* ── 클러스터 3: AI AGENT ── 라벨(330,120) / 폰 에이전트(825,111)·리포트(460,457) + 글로우(209,40)
            Figma 프레임 높이는 424지만, 리포트 폰(top457+537=994)이 아래로 넘쳐서 잘리지 않도록 높이를 994로 확장(=Figma 하단 여유). */}
        <Reveal className="relative h-[994px]">
          {/* 장식 글로우: honey(#FFD99D) radial → 투명, 320px. 농도 통일(코어 30%/72%, opacity 1, blur 95). 폰 뒤(z-0). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              left: 209,
              top: 40,
              width: 320,
              height: 320,
              background: "radial-gradient(circle, var(--color-honey) 0%, var(--color-honey) 30%, transparent 72%)",
              opacity: 1,
              filter: "blur(95px)",
            }}
          />
          <div className="absolute z-10" style={{ left: 330, top: 120 }}>
            <ClusterLabel {...CLUSTERS.aiAgent} />
          </div>
          {/* 우측 목업: mk-iphone.png 베젤(PhoneFrame) 안에 GIF를 넣어 실제 폰처럼 표시.
              폰이 작아 그림자가 약해 보이므로, 전용 AI_GIF_SHADOW(더 진한 2겹 그림자)로 무게를 맞춤. */}
          <div className="absolute z-10" style={{ left: AIA_GIF.left, top: AIA_GIF.top }}>
            <PhoneFrame screens={["/ai_epi.gif"]} shadow={AI_GIF_SHADOW} scale={AIA_GIF.scale} />
          </div>
          <StaticPhone
            src="/mk-ai-report.png"
            alt="AI 리포트 화면"
            left={AIR.left}
            top={AIR.top}
            width={AIR.width}
            height={AIR.height}
            shadow={PHONE_SHADOW_CLASS}
          />
        </Reveal>
      </div>

      {/* [모바일 <lg] 세로 스택: 절대좌표 캔버스 대신, 클러스터(라벨+폰)를 가운데로 차곡차곡 쌓는다.
          폰은 normal flow로 배치 — PhoneFrame은 그대로 쓰고, StaticPhone(PNG)은 일반 <img>로 표시. */}
      <div className="flex flex-col items-center gap-24 px-6 py-24 lg:hidden">
        {/* SERVICE — 시작 화면 캐러셀 */}
        <Reveal className="flex flex-col items-center gap-8">
          <ClusterLabel {...CLUSTERS.service} center />
          <PhoneFrame screens={SERVICE_SCREENS} shadow={PHONE_SHADOW} scale={0.78} />
        </Reveal>

        {/* HOME — 홈 화면(정적 PNG) */}
        <Reveal className="flex flex-col items-center gap-8">
          <ClusterLabel {...CLUSTERS.home} center />
          <img
            src="/mk-home.png"
            alt="Epi:Log 홈 화면 목업"
            className={`w-[70%] max-w-[280px] object-contain ${PHONE_SHADOW_CLASS}`}
          />
        </Reveal>

        {/* AI AGENT — GIF 에이전트 폰 + 리포트 폰(정적 PNG)을 세로로 */}
        <Reveal className="flex flex-col items-center gap-8">
          <ClusterLabel {...CLUSTERS.aiAgent} center />
          <PhoneFrame screens={["/ai_epi.gif"]} shadow={AI_GIF_SHADOW} scale={0.6} />
          <img
            src="/mk-ai-report.png"
            alt="AI 리포트 화면"
            className={`w-[70%] max-w-[280px] object-contain ${PHONE_SHADOW_CLASS}`}
          />
        </Reveal>
      </div>
    </section>
  );
}
