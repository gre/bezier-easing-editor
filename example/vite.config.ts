import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base matches the GitHub Pages URL: https://gre.github.io/bezier-easing-editor/
export default defineConfig({
  base: "/bezier-easing-editor/",
  plugins: [react()],
  resolve: {
    // bezier-easing-editor is symlinked (file:..), so its "react" import
    // resolves to the parent repo's node_modules: dedupe to avoid bundling
    // two React copies (hooks crash with a null dispatcher otherwise)
    dedupe: ["react", "react-dom"],
  },
});
