import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * PhoneFrame: 아이폰 베젤(mk-iphone.png) 안에 '화면 이미지'를 넣어 보여주는 컴포넌트.
 * ▸ 데스크톱 1:1: 기준 프레임 329×677(px). `scale`로 베젤+화면을 '함께' 확대/축소(화면이 베젤 안에 유지됨).
 *   베젤·화면 이미지 모두 명시 크기 → raw 픽셀로 안 커지고, 늘어남 없음.
 * ▸ 화면 영역: 베젤 안쪽 left:17 / top:15 / 301.5 × 655.5 (Figma 실측) × scale.
 * ▸ screens 여러 장이면 베젤 안에서 '가로 슬라이드' 캐러셀(2.5s 간격, 0.7s ease, translateX).
 *   페이드 아님 → 깜빡임 없음. 마지막 → 첫 장은 '첫 장 복제본'을 끝에 이어붙여 같은 방향으로 매끄럽게 루프.
 *   reduce면 첫 장만(자동 전환 없음).
 * ▸ 베젤은 화면 위에 얹혀 가장자리/노치/라운드를 만들고 클릭 통과.
 * ▸ transform 없음(회전/skew/3D 일절 없음). 그림자는 균일 drop-shadow(prop).
 */
const W = 329;
const H = 677;

export default function PhoneFrame({
  screens = [],
  className = "",
  shadow = "drop-shadow(0 20px 40px rgba(41,36,34,0.22))",
  scale = 1,
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0); // 0..n (n = 첫 장 복제본 위치)
  const [animate, setAnimate] = useState(true); // 순간 복귀 시 transition 잠깐 끔
  // 마우스 호버 중이면 자동 전환을 '잠시 정지'. ref로 두어 타이머를 재생성하지 않고
  // (호버 때마다 setInterval 재시작 없이) 진행 중 슬라이드는 유지하다가 떼면 다시 진행.
  const pausedRef = useRef(false);

  // 자동 전환: 2.5s 간격으로 다음 화면(복제본 포함)으로 한 칸씩 슬라이드.
  // 단, 호버 중(pausedRef)이면 이번 틱은 건너뛰어 정지.
  useEffect(() => {
    if (reduce || screens.length <= 1) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => i + 1);
    }, 2500);
    return () => clearInterval(id);
  }, [reduce, screens.length]);

  // 복제본(맨 끝)에 도달하면 슬라이드가 끝난 직후 첫 장으로 '순간 복귀'(transition off) → 무한 루프.
  // onTransitionEnd 이벤트 대신 setTimeout으로 처리 → 이벤트 누락에 의한 멈춤/빈 화면 없이 항상 확실히 복귀.
  useEffect(() => {
    if (index < screens.length) return; // 복제본(또는 그 이상) 도달 시에만
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, 720); // 슬라이드(700ms) + 약간의 여유
    return () => clearTimeout(t);
  }, [index, screens.length]);

  // 순간 복귀(transition off) 직후, 다음 프레임에 transition을 다시 켜서 스냅이 애니메이션되지 않게.
  useEffect(() => {
    if (animate) return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(r);
  }, [animate]);

  // 베젤·화면 모두 scale 배율로 함께 확대(비율·내부 정렬 유지)
  const screen = { left: 17 * scale, top: 15 * scale, width: 301.5 * scale, height: 655.5 * scale };
  // 마지막→첫 장 매끄러운 루프용: 첫 장 복제본을 끝에 이어붙임(2장 이상일 때만)
  const slides = screens.length > 1 ? [...screens, screens[0]] : screens;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: W * scale, height: H * scale, filter: shadow }}
      // 호버 시 자동 슬라이드 잠시 정지, 마우스 떼면 재개.
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* 화면 영역(베젤 안): overflow hidden + 라운드 + 다크 배경(#140F0B = bg-ink).
          배경이 어두워서 혹시 모를 서브픽셀 틈에도 흰 페이지 배경이 비치지 않음(어두운 화면만 보임). */}
      <div className="absolute overflow-hidden bg-ink" style={{ ...screen, borderRadius: 40 * scale }}>
        {/* 가로 트랙: 폭 = 화면영역 폭(w-full). 슬라이드는 각각 flex 0 0 100%로 화면영역을 꽉 채움(틈 0, edge-to-edge).
            translateX는 트랙 자기폭(=화면영역 폭)의 100% 단위로 이동 → 한 칸이 정확히 화면영역 폭만큼 이동해 딱 정렬. */}
        <div
          className="flex h-full w-full"
          style={{
            // 복제본 위치를 넘지 않도록 clamp → 어떤 경우에도 빈 화면 없음(항상 화면이 보임).
            transform: `translateX(-${Math.min(index, screens.length) * 100}%)`,
            transition: animate ? "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
          }}
        >
          {slides.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              style={{ flex: "0 0 100%" }}
            />
          ))}
        </div>
      </div>

      {/* 베젤 오버레이(맨 위, 클릭 통과) — 명시 크기 + object-contain */}
      <img
        src="/mk-iphone.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}
