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

// 모든 폰 공통 '균일' 드롭섀도(대각선 오프셋 없음 → 기울어 보이지 않음).
// PhoneFrame은 filter 문자열, StaticPhone은 Tailwind 임의값('_'=공백).
const PHONE_SHADOW = "drop-shadow(0 20px 40px rgba(41,36,34,0.22))";
export const PHONE_SHADOW_CLASS = "drop-shadow-[0_20px_40px_rgba(41,36,34,0.22)]";

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

/**
 * ClusterLabel: eyebrow → (title → body) 그룹.
 *  - eyebrow 17 SemiBold #A04B00 자간0.02 / title 36 Bold #140F0B lh140 / body 18 Regular #140F0B lh160 자간-0.02 폭355
 *  - 간격: eyebrow→그룹 30px, title→body 20px. break-keep으로 한국어 단어깨짐 방지.
 */
export function ClusterLabel({ eyebrow, title, body, bodyWidth = 355 }) {
  return (
    <div className="flex flex-col gap-[30px]">
      <p className="font-pretendard text-[17px] font-semibold tracking-[0.02em] text-kf-label">{eyebrow}</p>
      <div className="flex flex-col gap-[20px]" style={{ width: bodyWidth }}>
        <h3 className="font-pretendard text-[36px] font-bold leading-[1.4] break-keep text-ink">{title}</h3>
        <p className="font-pretendard text-[18px] font-normal leading-[1.6] tracking-[-0.02em] break-keep text-ink">
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
      {/* 1440 고정 캔버스(가운데). 상하 패딩 186, 클러스터 세로 간격 239. */}
      <div className="relative mx-auto flex w-[1440px] flex-col gap-[239px] py-[186px]">
        {/* ── 클러스터 1: SERVICE (높이 503) ── 라벨(120,120) / 폰(720,-63) 크로스페이드 */}
        <Reveal className="relative h-[503px]">
          <div className="absolute z-10" style={{ left: 120, top: 120 }}>
            <ClusterLabel
              eyebrow="SERVICE"
              title="당신의 뜻을 남기는 첫걸음"
              body="사용자가 남긴 기록을 통해 삶의 흔적과 감정, 생각을 보존하고, AI 기억 에이전트를 통해 그 의미와 연결이 이후에도 이어질 수 있도록 돕습니다."
            />
          </div>
          <div className="absolute z-10" style={{ left: SVC.left, top: SVC.top }}>
            <PhoneFrame screens={SERVICE_SCREENS} shadow={PHONE_SHADOW} scale={MK.serviceScale} />
          </div>
        </Reveal>

        {/* ── 클러스터 2: HOME (높이 453) ── 라벨(730,120) / 폰(241,-101) static */}
        <Reveal className="relative h-[453px]">
          <div className="absolute z-10" style={{ left: 730, top: 120 }}>
            <ClusterLabel
              eyebrow="HOME"
              title="오늘의 이야기"
              body="등록된 자산과 기록 현황을 한눈에 확인하고, 오늘의 질문과 AI 리포트를 통해 당신만의 기억과 이야기를 차곡차곡 완성해 나가는 메인 홈 화면입니다."
            />
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
            <ClusterLabel
              eyebrow="AI AGENT"
              title="AI 리포트"
              body="에필:로그의 AI는 사용자의 답변을 통해 말투, 가치관, 판단 기준을 정리합니다."
            />
          </div>
          <StaticPhone
            src="/mk-ai-agent.png"
            alt="AI 에이전트 화면"
            left={AIA.left}
            top={AIA.top}
            width={AIA.width}
            height={AIA.height}
            shadow={PHONE_SHADOW_CLASS}
          />
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
    </section>
  );
}
