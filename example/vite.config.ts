import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base matches the GitHub Pages URL: https://gre.github.io/bezier-easing-editor/
export default defineConfig({
  base: "/bezier-easing-editor/",
  plugins: [react()],
});
