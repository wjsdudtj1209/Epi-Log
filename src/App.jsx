import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import IntroQuote from "./components/IntroQuote.jsx";
import VideoSection from "./components/VideoSection.jsx";
import BackgroundSection from "./components/BackgroundSection.jsx";
import DeskResearchSection from "./components/DeskResearchSection.jsx";
import DesignSystemSection from "./components/DesignSystemSection.jsx";
import KeyFunctionSection from "./components/KeyFunctionSection.jsx";
import MockupSection from "./components/MockupSection.jsx";
import Footer from "./components/Footer.jsx";
import Spotlight from "./components/Spotlight.jsx";
import Preloader from "./components/Preloader.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

/**
 * App: 전체 페이지의 뼈대입니다.
 * 흐름: Hero → 질문(IntroQuote) → Overview/Background → Desk Research →
 *       Key Function(스크롤 목업) → Design System → 마무리 → Footer
 * (Service Flow 섹션, 이메일 폼, Detailed Feature(목업) 섹션은 제거된 상태)
 */
export default function App() {
  return (
    <>
      {/* 메인 사이트 진입 직전 잠시 떠 있는 프리미엄 로딩 화면 (자체적으로 사라짐) */}
      <Preloader />
      <Navbar />
      <main>
        {/* Atmospheric Canvas: Hero와 Question(IntroQuote)을 하나의 순수 블랙(#000000)
            배경으로 묶어, 따뜻한 글로우만으로 두 섹션을 경계 없이 잇습니다.
            Spotlight로 감싸 마우스를 따라 은은한 빛이 흐르게 합니다. */}
        <Spotlight className="bg-[#000000]" size={200}>
          <Hero />
          <IntroQuote />
        </Spotlight>
        <VideoSection />
        <BackgroundSection />
        <DeskResearchSection />
        <DesignSystemSection />
        <KeyFunctionSection />
        <MockupSection />
      </main>
      <Footer />
      {/* 우측 하단 '맨 위로' 플로팅 버튼 (히어로 벗어나면 등장) */}
      <ScrollToTop />
    </>
  );
}
