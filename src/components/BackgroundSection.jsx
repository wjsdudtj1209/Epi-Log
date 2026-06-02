import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Reveal from "./Reveal.jsx";
import Hemisphere from "./Hemisphere.jsx";

// 'Background' 알림 카드 3종 (정리되지 않은 SNS · 구독 결제 · 잠긴 자산)
const notifications = [
  { logo: "/notifications/facebook.svg", app: "Facebook", msg: "(故)임주성님의 생일입니다." },
  { logo: "/notifications/netflix.svg", app: "Netflix", msg: "정기결제가 완료되었습니다." },
  { logo: "/notifications/wallet.png", app: "Wallet", msg: "접근되지 않는 가상자산이 있습니다." },
];

// 유리 질감(Figma Glass 근사) — 카드 공통 스타일.
const CARD_GLASS = {
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5), 0 8px 24px rgba(0,0,0,0.08)",
};

// 알림 카드: 섹션이 보이면 위에서부터 1회 순차 등장(페이드+상승) 후 그대로 유지(반복/사라짐 없음). reduce면 즉시 표시.
function NotificationCard({ n, i, reduce }) {
  return (
    <motion.div
      className="flex h-[121px] w-full max-w-[650px] items-center gap-[30px] rounded-[40px] bg-notification/32 px-[35px] py-[30px]"
      style={CARD_GLASS}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: i * 0.18, ease: "easeOut" }}
    >
      {/* 풀컬러 79px 앱아이콘 (Figma 그대로 — 박스 없이 카드 위에 직접) */}
      <img src={n.logo} alt={n.app} className="size-[79px] shrink-0 object-contain" />
      <div className="flex min-w-0 flex-1 flex-col text-noti text-ink">
        <p className="font-semibold">{n.app}</p>
        <p className="truncate font-medium">{n.msg}</p>
      </div>
    </motion.div>
  );
}

/**
 * BackgroundSection: 시안의 'Overview + Background' 화면입니다.
 * - Overview: 가운데 정렬 + TAN-PEARL (디스플레이 세리프)
 * - Background: Desk Research처럼 '좌측 정렬' + Pretendard 제목
 *   알림 카드 아래로 반구가 은은히 깔리고, "죽음은 준비 없이…" 문장으로 마무리됩니다.
 */
// Overview 큰 카피 — 한 글자씩 채우기 위해 글자 배열로 분해. 앞 구절 medium / 뒤 구절 bold.
const OVERVIEW_SEGMENTS = [
  { text: "사후의 혼란을, ", weight: "font-medium" },
  { text: "생전의 선택으로", weight: "font-bold" },
];
const OVERVIEW_CHARS = OVERVIEW_SEGMENTS.flatMap((s) =>
  [...s.text].map((ch) => ({ ch, weight: s.weight }))
);
// 한 글자가 dim→1로 차는 진행 구간. 글자 간격(≈1/글자수)보다 훨씬 크게 잡아
// 인접 글자 구간이 많이 겹치도록 → 좌→우로 매끄럽게 흐르는 파도 효과(끊김 없음).
const FILL_RAMP = 0.34;

// 한 글자: 공통 스프링 진행도(progress)에 따라 opacity가 dim(0.14)→1로 채워짐.
function FillChar({ char, weight, progress, start }) {
  const opacity = useTransform(progress, [start, start + FILL_RAMP], [0.14, 1]);
  return (
    <motion.span className={weight} style={{ opacity }}>
      {char === " " ? " " : char}
    </motion.span>
  );
}

export default function BackgroundSection() {
  const reduceMotion = useReducedMotion(); // 접근성: 모션 줄이기면 카드 즉시 표시

  // ── Overview 카피 스크롤 연동 '한 글자씩 채우기' ──
  // 카피(<h2>)가 화면을 지나가는 동안의 스크롤 진행도(0~1)를 추적.
  // offset: 카피 상단이 뷰포트 90% 지점에 오면 0(시작) → 55% 지점(화면 중앙쯤)에 오면 1(완료).
  //   → 카피가 화면을 다 지나가기 전에 일찍 채움이 끝남(= 더 빠른 애니메이션).
  const copyRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: copyRef,
    offset: ["start 0.9", "start 0.55"],
  });
  // 스크롤 값을 스프링으로 완만하게(끊김 제거). stiffness를 높여 지연을 줄여 더 즉각적으로 따라옴.
  const fillProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.0005,
  });

  return (
    <section
      id="background"
      className="relative z-10 overflow-hidden bg-paper px-6 py-32 md:py-40"
      // 위(검정 Hero/IntroQuote)로 솟아오르는 둥근 이음새:
      // 음수 마진으로 겹치고, 상단 모서리를 둥글게 → 모서리에 검정이 비침.
      // z-10 으로 위 섹션 위에 그려지고, 끌어올린 만큼 상단 패딩으로 보정.
      style={{
        marginTop: "calc(-1 * var(--seam-radius))",
        borderTopLeftRadius: "var(--seam-radius)",
        borderTopRightRadius: "var(--seam-radius)",
        paddingTop: "calc(var(--seam-radius) + 8rem)",
      }}
    >
      {/* ── Overview (Figma node 1380:13317 반영, 세로 가운데 정렬) ──
          전체 max-w 1440 / 좌우 170·상하 80px(모바일은 축소) / 그룹 간격 74px.
          relative 래퍼: Figma Ellipse 296(제목 뒤 왼쪽 글로우)을 콘텐츠 기준으로 깔기 위함. */}
      <div className="relative mx-auto w-full max-w-[1440px]">
        {/* Figma Ellipse 296: Overview 제목 뒤 '왼쪽'에 깔리는 크고 부드러운 따뜻한 글로우.
            중심을 좌측(28%)·상단(180px)에 두고 blur로 은은하게. (장식 — 눈으로 보며 조정)
            색: Figma 'Ellipse 296' fill이 변수 '하단 글씨'(#FFD99D)로 변경됨 → honey 토큰을
                color-mix로 투명도(22%)만 입혀 사용 (이전엔 gold #FEB951). */}
        <div
          className="pointer-events-none absolute left-[28%] top-[180px] -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--color-honey) 75%, transparent), transparent 62%)",
          }}
        />

        <Reveal className="flex w-full flex-col items-center gap-[74px] px-6 py-20 text-center sm:px-10 lg:px-[120px]">
        {/* 제목 그룹: 제목 + 96px 밑줄 (간격 26px) */}
        <div className="flex flex-col items-center gap-[26px]">
          <p className="font-tan text-t1 tracking-wide text-rust">Overview</p>
          <span className="block h-0.5 w-24 bg-rust/50" />
        </div>

        {/* 본문 그룹: 큰 카피 + 설명문 (간격 50px) */}
        <div className="flex flex-col items-center gap-[50px]">
          {/* 큰 카피: Pretendard Medium + Bold 2단 (모바일 38px → 데스크톱 52px) */}
          <h2 ref={copyRef} className="font-pretendard text-t1 text-brown-deep sm:text-h1">
            {/* 첫 글자부터 좌→우로 한 글자씩 opacity가 채워짐(스프링으로 매끄럽게).
                reduce면 애니메이션 없이 처음부터 또렷. */}
            {reduceMotion
              ? OVERVIEW_SEGMENTS.map((s) => (
                  <span key={s.text} className={s.weight}>
                    {s.text}
                  </span>
                ))
              : OVERVIEW_CHARS.map((c, i) => (
                  <FillChar
                    key={i}
                    char={c.ch}
                    weight={c.weight}
                    progress={fillProgress}
                    start={(i / (OVERVIEW_CHARS.length - 1)) * (1 - FILL_RAMP)}
                  />
                ))}
          </h2>
          {/* 설명문: Pretendard Medium 16px/1.6, 가운데 정렬 (Figma Head/Body/p1-Medium) */}
          <p className="font-pretendard text-p1 font-medium text-ink">
            사용자가 생전에 자신의 디지털 자산과 남기고 싶은 말,
            <br />
            그리고 정리의 기준을 스스로 남길 수 있도록 돕는 디지털 유산 정리 서비스 [에필:로그] 입니다.
          </p>
        </div>
        </Reveal>
      </div>

      {/* ── Background (Figma node 1380:13318 반영) ──
          컨테이너는 콘텐츠를 max-w-1440으로 가운데 정렬 + relative(곡선 원의 '세로' 좌표 기준).
          ※ 곡선을 잘라내는 '창문'은 이 컨테이너가 아니라 전체 폭 <section>(relative + overflow-hidden)임.
            여기에 overflow-hidden을 두면 원이 1440 안에만 갇혀, 넓은 화면에서 좌우에 곡선 없는 흰 띠가 남음.
            → overflow는 section에만 두어, 원이 1440 밖(화면 좌우 끝)까지 뻗고 section이 잘라내게 함.
          그룹 간격: 텍스트↔카드 108 / 카드↔선 38 / 선↔맺음 67.
          mt-[190px] = Overview 블록과의 세로 간격. Figma는 Overview 설명문 하단~BACKGROUND 라벨 상단이 300px인데,
            코드엔 이미 Overview Reveal 하단패딩 py-20(80px) + Background Reveal 상단패딩 py-[30px](30px)=110px이 있어
            mt=300-110=190px로 맞춰 총 300px이 되게 함. (곡선은 이 컨테이너 기준 absolute라 함께 내려가 모양 불변) */}
      <div className="relative isolate z-10 mx-auto mt-[190px] flex w-full max-w-[1440px] flex-col gap-[38px]">
        {/* 곡선 배경 원(Ellipse): 좌우 꽉참(전체 폭)은 section이 잘라주고, 여기선 '곡률'을 잡음.
            크기 w-[200%] 정원(작을수록 봉긋↑ / 단 너무 작으면 넓은 화면서 좌우 띠 재발 → 200%=최대 2880px 화면까지 덮음)
            / left -50%(apex 가로 중앙: -50+200/2=50%)
            / top 62%(아치 꼭대기 세로 위치 = top 값에만 의존, width와 무관 → 그대로 유지).
            -z-10 = 콘텐츠보다 뒤(텍스트·카드는 위에 정상 표시) / pointer-events-none(컴포넌트 기본).
            원이 좌·우·하단으로 넘쳐 '윗 아치'만 보이고, 넘친 부분은 전체 폭 section의 overflow-hidden이 잘라냄.
            ▼ 미세조정: 더 봉긋=width↓(예: 170%, left-35%) / 더 평평=width↑(예: 240%, left-70%). left=(100-width)/2. */}
        <Hemisphere className="left-[-50%] top-[62%] w-[200%] -z-10" />

        {/* 텍스트 블록 + 알림 카드 (간격 108px) */}
        <div className="flex flex-col gap-[108px]">
          {/* 텍스트 블록: 좌측 정렬, 좌우 170·상하 30, 요소간 40 */}
          <Reveal className="flex flex-col items-start gap-[40px] px-6 py-[30px] sm:px-10 lg:px-[120px]">
            <p className="text-section font-semibold text-rust uppercase">
              Background
            </p>
            {/* 제목 ↔ 설명문 사이 20px */}
            <div className="flex flex-col gap-[20px]">
              <h3 className="text-display font-bold text-ink">
                죽음 이후에도 남는 디지털 흔적
              </h3>
              {/* 본문: Figma 'Head/Body/p1' 줄간격 1.6 (text-lead 토큰 기본 1.4를 이 섹션만 국소 보정) */}
              <p className="text-lead font-medium leading-[1.6] text-ink">
                남겨진 사람은 슬픔만 마주하는 것이 아니라,
                <br />
                정리되지 않은 계정과 결제, 접근할 수 없는 기록까지 함께 마주하게 됩니다.
              </p>
            </div>
          </Reveal>

          {/* 알림 카드: 가운데, 카드끼리 25px. 섹션 진입 시 위에서부터 1회 순차 등장 후 그대로 유지.
              relative 기준 → 안에 둔 반구가 이 묶음 하단(=Wallet 카드 하단)에 정렬됨. */}
          <div className="flex flex-col items-center gap-[25px] px-6 sm:px-10 lg:px-[120px]">
            {notifications.map((n, i) => (
              <NotificationCard key={n.app} n={n} i={i} reduce={reduceMotion} />
            ))}
          </div>
        </div>

        {/* 세로 연결선+점 + 맺음 문구 (간격 67px) */}
        <div className="flex flex-col items-center gap-[67px]">
          {/* 타임라인: 점이 지나간 경로에 '빛의 자취(궤적)'가 남았다 위(오래된 쪽)부터 흐려지는 방식.
              [방법 A] 경로 전체 길이(249px)의 그라데이션 '궤적 선'을 깔고, origin-top + scaleY(0→1)로
                점이 지나온 만큼만 위에서부터 '그려지듯' 노출시킴(=지나온 경로에만 자취).
                그라데이션이 위=투명 → 아래(점 쪽)=gold-bright라 오래된 윗부분일수록 투명해 사라지는 잔상이 됨.
              점은 별도로 같은 속도(3s linear)로 내려가며 궤적의 맨 아래(선두)에 위치. 전체는 wrapper opacity로 부드럽게 in/out.
              전부 transform(scaleY·y)만 + will-change → GPU 합성으로 매끄럽게(끊김·blur 재계산 없음). 무한 반복. */}
          <div className="relative h-[249px] w-[14px]"> {/* 경로 범위 249px / 폭은 점 14px 기준(가로 중앙) */}
            {/* wrapper opacity = 점+궤적 공통 가시성(하나의 소스라 둘이 어긋날 일 없음).
                [0,1,1,0,0] @times[0,0.07,0.78,0.9,1]: 0~7% 등장 → ~78% 유지 → 90%까지 fade out
                → 90~100% '0으로 유지(빈 pause)'. 이 0 구간에서 아래의 위치 리셋(100%↔0%)이 일어나 안 보임 → 깜빡임 제거. */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0, 1, 1, 0, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.07, 0.78, 0.9, 1], ease: "easeInOut" }}
            >
              {/* 궤적(자취): 경로 전체 길이 선을 origin-top scaleY로 점까지만 노출.
                  scaleY [0,1,1] @times[0,0.9,1]: 0~90% 단일 linear로 끝까지 자람 → 90~100% 바닥서 정지(pause).
                  그라데이션은 부드러운 다단 페이드(딱딱한 경계 없이 위로 갈수록 천천히 투명). 두께 3px · 가로중앙(left 5.5px) · blur(1px). */}
              <motion.div
                className="absolute left-[5.5px] top-0 h-[249px] w-[3px] origin-top will-change-transform"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--color-gold-bright) 18%, transparent) 45%, color-mix(in oklab, var(--color-gold-bright) 55%, transparent) 75%, var(--color-gold-bright) 100%)",
                  filter: "blur(1px)",
                }}
                animate={{ scaleY: [0, 1, 1] }}
                transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.9, 1], ease: "linear" }}
              />
              {/* 머리(점): 14×14 원 + 글로우 2겹 + blur(1). 궤적 선두(맨 아래)에 정렬되도록 y로 동기 이동.
                  y [-7,242,242] @times[0,0.9,1]: 0~90% 단일 linear로 바닥(중심 249px)까지 한 번에 → 90~100% 바닥서 정지(pause).
                  left-0(14px=트랙폭)으로 가로 중앙. 생김새 그대로 유지. */}
              <motion.div
                className="absolute left-0 top-0 h-[14px] w-[14px] rounded-full bg-gold-bright will-change-transform"
                style={{
                  boxShadow:
                    "0 0 14.9px 2px var(--color-dot-glow-outer), 0 0 4px 1px color-mix(in oklab, var(--color-dot-glow-inner) 56%, transparent)",
                  filter: "blur(1px)",
                }}
                animate={{ y: [-7, 242, 242] }}
                transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.9, 1], ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* 맺음 문구: 가운데 정렬 */}
          <Reveal className="px-6 text-center sm:px-10 lg:px-[120px]">
            <p className="text-headline font-semibold text-brown-deep">
              죽음은 준비 없이 오지만,
              <br />
              디지털 흔적은 준비 없이 남아 있습니다
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
