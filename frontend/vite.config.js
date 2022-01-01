import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite(path) {
          return path.replace("/auth", "");
        },
      },
      "/facilities": {
        target: "http://localhost:3002",
        changeOrigin: true,
        rewrite(path) {
          return path.replace("/facilities", "");
        },
      },
      "/uploads": {
        target: "http://localhost:3003",
        changeOrigin: true,
        rewrite(path) {
          return path.replace("/uploads", "");
        },
      },
    },
  },
});
