import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import IntroQuote from "./components/IntroQuote.jsx";
import VideoSection from "./components/VideoSection.jsx";
import BackgroundSection from "./components/BackgroundSection.jsx";
import DeskResearchSection from "./components/DeskResearchSection.jsx";
import DesignSystemSection from "./components/DesignSystemSection.jsx";
import KeyFunctionSection from "./components/KeyFunctionSection.jsx";
import MockupSection from "./components/MockupSection.jsx";
import MockupSection2 from "./components/MockupSection2.jsx";
import MockupSection3 from "./components/MockupSection3.jsx";
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
        {/* Hero: 자체 배경 이미지를 가진 독립 섹션 (Atmospheric Canvas에서 분리). */}
        <Hero />
        {/* Question(IntroQuote): 순수 블랙(#000000) 위에서 마우스를 따라 은은한 빛이 흐름. */}
        <Spotlight className="bg-[#000000]" size={200}>
          <IntroQuote />
        </Spotlight>
        <VideoSection />
        <BackgroundSection />
        <DeskResearchSection />
        <DesignSystemSection />
        <KeyFunctionSection />
        <MockupSection />
        <MockupSection2 />
        <MockupSection3 />
      </main>
      <Footer />
      {/* 우측 하단 '맨 위로' 플로팅 버튼 (히어로 벗어나면 등장) */}
      <ScrollToTop />
    </>
  );
}
