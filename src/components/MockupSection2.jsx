import Reveal from "./Reveal.jsx";
import { ClusterLabel, StaticPhone, PHONE_SHADOW_CLASS } from "./MockupSection.jsx";

/**
 * MockupSection2: Mockup 영역의 'Section 2' — 기존 Mockup(SERVICE/HOME/AI) 바로 아래.
 * ▸ 라이트 #FBFBFB 배경, 1440 고정 캔버스 + 절대좌표(데스크톱 1:1), 폰 정면/그림자만(회전 없음).
 * ▸ 클러스터 2개(기록 / 정리함), 사이 간격 313px.
 * ▸ 폰 크기는 아래 MK2 스케일로 조정. 라벨과의 간격은 그대로 유지(폰을 라벨 반대쪽으로만 키움),
 *   기록 두 폰은 사이 간격도 함께 키워 겹치지 않게 함.
 */

// ▼▼▼ Section 2 폰별 스케일 — 여기 숫자만 바꿔 조정 ▼▼▼
const MK2 = {
  record2Scale: 1.37, // 기록 오른쪽 폰(record-2) — 베젤 포함 풀 디바이스(기준 크기)
  recordGap: -10, // 두 기록 폰 '박스' 사이 간격(px). 음수=살짝 겹침
  // record-1(왼쪽 화면)은 record-2의 '화면' 측정값에 자동으로 맞춰짐(아래 R1 계산 참고)
  legacyScale: 1.25, // 정리함 폰(257.61×560.08)
};
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// ── 기록(라벨 우): 오른쪽 폰의 '오른쪽 끝'을 고정(라벨 간격 유지). 왼쪽 폰은 그 왼쪽에 두되 record1ShiftX로 미세 이동.
//    세로: object-contain 레터박스를 보정해 '보이는 폰 윗변'을 라벨 상단(REC_VISIBLE_TOP)에 맞춤. ──
const REC = { w: 249.91, h: 543.33 };
const REC_ASSET2 = { aw: 332, ah: 624 }; // record-2 원본 px
const REC_GROUP_RIGHT = 840; // 오른쪽 폰의 오른쪽 끝 x (기록 폰 그룹을 살짝 오른쪽으로)
const DEVICE_TOP = 117; // record-2 '기기 윗변'을 맞출 Y (= MEMORIES eyebrow 상단)
const REC2_DEVICE_FUDGE = 15; // record-2 이미지 내부 여백 보정(기기 윗변을 DEVICE_TOP에 맞춤)
// object-contain 세로 레터박스(박스 위쪽 여백): box 가로비율 < asset 가로비율일 때 visibleH = ah*(boxW/aw).
const lbTop = (boxW, boxH, aw, ah) => (boxH - ah * (boxW / aw)) / 2;

// record-2: 베젤 포함 기준 폰. 오른쪽 끝 고정 + 기기 윗변을 DEVICE_TOP에.
const r2w = REC.w * MK2.record2Scale;
const r2h = REC.h * MK2.record2Scale;
const R2 = {
  width: r2w,
  height: r2h,
  left: REC_GROUP_RIGHT - r2w,
  top: DEVICE_TOP - lbTop(r2w, r2h, REC_ASSET2.aw, REC_ASSET2.ah) - REC2_DEVICE_FUDGE,
};
// ── record-1: 픽셀 측정값으로 record-2의 '화면'에 정확히 매핑(추측 X) ──
//  record-2 이미지(332×624) 내 화면 사각형(측정): 좌상단(24,19), 262×563.
//  record-1 이미지(302×596) 내 콘텐츠(베어 화면) 여백 15, 콘텐츠폭 249.
const R2_IMG = { w: 332, h: 624, scrX: 24, scrY: 19, scrW: 262, scrH: 563 };
const R1_IMG = { w: 302, h: 596, margin: 15, contentW: 249 };
const r2Scale = r2w / R2_IMG.w; // record-2 이미지 표시 배율(object-contain, 폭 꽉참)
const r2vLB = (r2h - R2_IMG.h * r2Scale) / 2; // record-2 박스 내 세로 레터박스
const r2ScreenTop = R2.top + r2vLB + R2_IMG.scrY * r2Scale; // record-2 화면 윗변(cluster Y)
const r2ScreenW = R2_IMG.scrW * r2Scale; // record-2 화면 표시 폭
const r1Scale = r2ScreenW / R1_IMG.contentW; // record-1 콘텐츠 폭 = record-2 화면 폭
const r1w = R1_IMG.w * r1Scale;
const r1h = R1_IMG.h * r1Scale;
const R1 = {
  width: r1w,
  height: r1h,
  left: R2.left - r1w - MK2.recordGap, // 가로 갭은 기존대로(roughly)
  top: r2ScreenTop - R1_IMG.margin * r1Scale, // record-1 콘텐츠 윗변 = record-2 화면 윗변
};

// ── 정리함(라벨 좌): 위치(left/top) 그대로 두고 크기만 키움 → 라벨 간격·스태거 유지(왼쪽-위 기준 확대). ──
const LEG = (b, s) => ({ width: b.w * s, height: b.h * s, left: b.left, top: b.top });
const LL = LEG({ w: 257.61, h: 560.08, left: 561, top: -213 }, MK2.legacyScale);
const LR = LEG({ w: 257.61, h: 560.08, left: 953, top: -64 }, MK2.legacyScale);

export default function MockupSection2() {
  // -mt: 위 섹션(AI)과의 빈 간격을 줄여 Figma의 촘촘한 리듬에 맞춤(라이트끼리라 이음새 없음).
  return (
    <section id="mockup-2" className="-mt-[120px] w-full overflow-hidden bg-mockup-bg">
      {/* 1440 고정 캔버스. 클러스터 세로 간격 313, 하단 패딩(정리함 아래 다음 섹션과의 간격) 186→100으로 축소. */}
      <div className="relative mx-auto flex w-[1440px] flex-col gap-[313px] pb-[100px]">
        {/* ── 클러스터 A: 기록 (라벨 우 / 폰 2대 좌, 나란히) ── 높이로 정리함과의 간격 조절(작을수록 가까움) */}
        <Reveal className="relative h-[760px]">
          <div className="absolute z-10" style={{ left: 937, top: 120 }}>
            <ClusterLabel
              eyebrow="MEMORIES"
              title="기록"
              body="소중한 사람에게 전하고 싶은 마음을 관계별로 남기고, 필요한 순간에 전달될 수 있도록 돕습니다."
              bodyWidth={369}
            />
          </div>
          <StaticPhone src="/mk-record-1.png" alt="기록 화면 1" {...R1} shadow={PHONE_SHADOW_CLASS} />
          <StaticPhone src="/mk-record-2.png" alt="기록 화면 2" {...R2} shadow={PHONE_SHADOW_CLASS} />
        </Reveal>

        {/* ── 클러스터 B: LEGACY / 정리함 (라벨 좌 / 폰 2대 우, 세로 스태거 + 뒤 글로우) ── */}
        <Reveal className="relative h-[680px]">
          {/* 장식 글로우: honey(#FFD99D) radial, 320px. 농도 통일(코어 30%/72%, opacity 1, blur 95). 폰 뒤(z-0).
              위치 left441 / top-304 = 첫 정리함 폰(top-213) 상단-좌측 뒤에 자리(빈칸이 아니라 폰 뒤). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              left: 441,
              top: -304,
              width: 320,
              height: 320,
              background: "radial-gradient(circle, var(--color-honey) 0%, var(--color-honey) 30%, transparent 72%)",
              opacity: 1,
              filter: "blur(95px)",
            }}
          />
          <div className="absolute z-10" style={{ left: 120, top: 120 }}>
            <ClusterLabel
              eyebrow="LEGACY"
              title="정리함"
              body={
                <>
                  SNS, 구독, 계정, 문서처럼 흩어진 디지털
                  <br />
                  자산을 한곳에 모으는 공간입니다.
                </>
              }
            />
          </div>
          {/* 폰 2대: 좌(목록)이 위로, 우(실행 기준)가 아래로 스태거 — 위치 유지, 크기만 확대. */}
          <StaticPhone src="/mk-legacy-list.png" alt="정리함 자산 목록 화면" {...LL} shadow={PHONE_SHADOW_CLASS} />
          <StaticPhone src="/mk-legacy-rule.png" alt="정리함 실행 기준 화면" {...LR} shadow={PHONE_SHADOW_CLASS} />
        </Reveal>
      </div>
    </section>
  );
}
