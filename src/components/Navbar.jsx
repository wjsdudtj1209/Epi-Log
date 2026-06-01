import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// 상단 메뉴 — 실제 존재하는 섹션 앵커로 연결
const links = [
  { href: "#intro", label: "Intro" }, // 영상 섹션(VideoSection)
  { href: "#background", label: "Vision" },
  { href: "#design", label: "Design" },
  { href: "#key-function", label: "Service" }, // Key Function 섹션
];

/**
 * Navbar: 히어로(첫 화면)에서만 보이는 우측 메뉴입니다.
 * 히어로를 벗어나 아래로 스크롤하면 부드럽게 위로 사라집니다.
 * 각 메뉴는 둥근 '버튼' 형태로 디자인되어, 호버하면 금색으로 강조됩니다.
 * (배경은 다크 히어로 위에서만 보이므로 항상 밝은 글자 색을 사용합니다)
 */
export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // 히어로는 화면 전체 높이(min-h-screen)를 차지합니다.
    // 화면 높이의 80%를 넘게 스크롤하면 히어로를 벗어난 것으로 보고 메뉴를 숨깁니다.
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: pastHero ? -40 : 0, opacity: pastHero ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 z-50 w-full ${
        pastHero ? "pointer-events-none" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-[1420px] items-center justify-center px-6 py-5 sm:px-10">
        {/* 메뉴 — 하나의 pill(알약) 모양 리퀴드 글라스 바 (모바일에서는 숨김) */}
        <ul className="liquid-glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-full px-4 py-2 text-sm tracking-wide text-cream/80 transition-colors duration-300 hover:bg-white/10 hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
