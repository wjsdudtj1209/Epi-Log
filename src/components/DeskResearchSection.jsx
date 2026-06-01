import Reveal from "./Reveal.jsx";
import Container from "./Container.jsx";

// Desk Research 5개 아이콘 — 컨테이너 박스 없이 투명 배경의 글리프만 사용 (Figma 그대로)
const icons = [
  { src: "/research/01-apple.png", alt: "Apple" },
  { src: "/research/03-facebook.png", alt: "Facebook" },
  { src: "/research/04-instagram.png", alt: "Instagram" },
  { src: "/research/06-kakaotalk.png", alt: "KakaoTalk", rounded: true },
  { src: "/research/05-google.png", alt: "Google" },
];

// 양끝을 투명하게 흐리게 만드는 그라데이션 마스크
const fadeMask =
  "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)";

/**
 * DeskResearchSection: "흩어진 플랫폼별 사후 처리 절차" 영역입니다.
 * 5개의 플랫폼 아이콘(투명 글리프)이 '지정된 바운딩 박스 안에서만'
 * 끊김 없이 무한히 흐르는 마키로 표현됩니다.
 *  - 트랙을 2배 복제 + CSS translateX(-50%) → 이음새 없는 무한 루프 (GPU 가속)
 *  - 박스 좌우는 그라데이션 마스크로 투명하게 페이드
 */
export default function DeskResearchSection() {
  const loop = [...icons, ...icons]; // 5 → 10 (절반 이동 시 정확히 한 바퀴)

  // 하단 패딩을 넓혀 아래 Design System(다크 라운드 섹션)과의 간격 확보 (md 기준 160→288px)
  return (
    <section id="research" className="relative pt-32 pb-52 md:pt-40 md:pb-72">
      {/* 텍스트 블록: 좌측 정렬, 좌우 120, 요소간 40 (제목↔설명 20) */}
      <Reveal className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[40px] px-6 sm:px-10 lg:px-[120px]">
        <p className="text-section font-semibold text-rust">Desk Research</p>
        <div className="flex flex-col gap-[20px]">
          <h2 className="text-display font-bold text-ink">
            흩어진 플랫폼별 사후 처리 절차
          </h2>
          <p className="text-lead font-medium text-ink">
            디지털 자산은 하나의 삶에서 비롯되지만, 실제 사후 처리 방식은 플랫폼마다 다르게 작동합니다.
            <br />
            어떤 서비스는 추모 전환을 지원하고, 어떤 서비스는 직접 로그인이나 별도 요청 절차가 필요합니다.
          </p>
        </div>
      </Reveal>

      {/* 무한 마키 — 유지: 지정된 바운딩 박스(가운데 정렬) 안에서만 동작 + 양끝 페이드 */}
      <Container className="mt-[111px]">
        <div
          className="mx-auto max-w-3xl overflow-hidden py-8"
          style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}
        >
          <div className="flex w-max animate-marquee will-change-transform">
            {loop.map((icon, i) => (
              <img
                key={i}
                src={icon.src}
                alt={icon.alt}
                draggable={false}
                className={`mr-20 h-24 w-24 shrink-0 object-contain ${
                  icon.rounded ? "rounded-[22%]" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </Container>

      {/* 맺음 메시지 — 다크 박스(box #352B1E) + 크림 텍스트, 가운데 정렬 */}
      <div className="mx-auto mt-[86px] flex w-full max-w-[1440px] justify-center px-6 sm:px-10 lg:px-[120px]">
        <Reveal>
          <div className="rounded-[40px] bg-box px-8 py-10 text-center shadow-lg sm:px-[100px] sm:py-[50px]">
            <p className="text-lead font-medium text-cream-warm">
              이처럼 사후 처리 방식이 플랫폼마다 달라질수록,
              <br />
              남겨진 사람에게는 더 큰 혼란과 부담이 생깁니다.
              <br />
              에필:로그는 흩어진 절차와 판단을 하나의 기준으로 정리할 수 있도록 돕습니다.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
