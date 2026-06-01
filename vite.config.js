import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite 설정 파일입니다. 어떤 플러그인을 사용할지 정의합니다.
export default defineConfig({
  plugins: [
    react(), // React(JSX) 문법을 사용할 수 있게 해줍니다.
    tailwindcss(), // Tailwind CSS v4를 연결합니다.
  ],
  server: {
    // ngrok 같은 외부 터널로 접속할 때, Vite는 모르는 주소(host)를 기본적으로 막습니다.
    // 아래 주소로 끝나는 요청은 허용하도록 해 ngrok 공개 URL로 접속할 수 있게 합니다.
    // (맨 앞의 점(.)은 "이 도메인의 모든 하위 주소 허용"을 뜻합니다.)
    allowedHosts: [".ngrok-free.dev", ".ngrok-free.app", ".ngrok.io", ".trycloudflare.com"],
    watch: {
      // 이 프로젝트는 OneDrive 동기화 폴더 안에 있습니다.
      // OneDrive가 파일을 동기화하며 잠그면 기본 파일 감시 방식이 EBUSY 오류로 죽습니다.
      // 그래서 일정 간격으로 직접 확인하는 '폴링' 방식을 사용해 안정적으로 동작시킵니다.
      usePolling: true,
      interval: 300,
    },
  },
});
