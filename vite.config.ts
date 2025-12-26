import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-helmet-async": path.resolve(
        __dirname,
        "node_modules/react-helmet-async/lib/index.esm.js"
      ),
    },
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  css: {
    transformer: "postcss",
  },
  build: {
    cssMinify: "esbuild",
  },
}));
