import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/daily-music-mobile-demo/",
  plugins: [vue()],
  server: {
    allowedHosts: true,
  },
});
