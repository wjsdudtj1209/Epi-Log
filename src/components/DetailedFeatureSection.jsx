import { motion } from "framer-motion";
import Container from "./Container.jsx";
import PhoneMockup from "./PhoneMockup.jsx";

// 각 핵심 기능의 '심화 동작'을 실제 앱 화면(목업)으로 시연
const details = [
  {
    tag: "Inventory",
    title: "한 곳에 모이는 디지털 자산",
    desc: "플랫폼별로 흩어진 계정·구독·자산을 등록하면, 카테고리와 중요도로 자동 정리됩니다. 무엇이 남아 있는지 한눈에 파악하세요.",
    img: "/mockups/inventory.png",
    points: ["카테고리별 자산 목록", "정리 기준 미설정 알림", "최종 점검 주기 관리"],
  },
  {
    tag: "Execution",
    title: "내가 정한 기준대로, 사후 실행",
    desc: "자산마다 보관·전달·삭제를 지정하고 실행자를 위임합니다. 남겨진 사람이 헤매지 않도록, 모든 판단을 미리 설계합니다.",
    img: "/mockups/execution.png",
    points: ["보관 · 전달 · 삭제 지정", "실행자 위임 설정", "공개 범위 세분화"],
  },
  {
    tag: "AI Agent",
    title: "당신의 말투로 남기는 기억",
    desc: "남긴 메시지와 기록을 학습한 AI가, 당신의 어조와 가치관을 담아 응답합니다. 사후에도 정서적 연결이 자연스럽게 이어집니다.",
    img: "/mockups/ai-agent.png",
    points: ["메시지 · 기억 아카이브 학습", "어조 · 판단 경향 분석", "남겨진 사람과 대화 연결"],
  },
];

/**
 * DetailedFeatureSection: Key Function 카드 아래에서, 각 기능의 깊은 동작을
 * 실제 앱 화면(목업)으로 좌우 번갈아 보여주는 심화 시연 섹션입니다.
 */
export default function DetailedFeatureSection() {
  return (
    <section id="detail" className="relative px-6 py-32 md:py-40">
      <Container>
        <div className="flex flex-col gap-24">
          {details.map((d, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={d.tag}
                className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                {/* 텍스트 */}
                <motion.div
                  initial={{ opacity: 0, x: reversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={reversed ? "md:order-2" : ""}
                >
                  <p className="text-sm font-semibold tracking-widest text-amber uppercase">
                    {d.tag}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
                    {d.title}
                  </h3>
                  <p className="mt-4 max-w-md leading-relaxed text-ink/60">
                    {d.desc}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {d.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-3 text-sm text-ink/70"
                      >
                        <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-amber/12 text-xs text-amber">
                          ✓
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* 앱 화면 목업 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex justify-center ${reversed ? "md:order-1" : ""}`}
                >
                  <PhoneMockup src={d.img} alt={`${d.title} 화면`} float={false} />
                </motion.div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
