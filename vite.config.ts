import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { IncomingMessage, ServerResponse } from "node:http";

const completeShelfReferenceRoute = (): Plugin => {
  const rewriteReferenceRoute = () => (request: IncomingMessage, _response: ServerResponse, next: () => void) => {
    if (request.url) {
      const [pathname, search] = request.url.split("?", 2);
      const internalRoutes: Record<string, string> = {
        "/dev/complete-shelf-reference": "/dev/complete-shelf-reference/index.html",
        "/dev/complete-shelf-reference/": "/dev/complete-shelf-reference/index.html",
        "/dev/complete-shelf-rig": "/dev/complete-shelf-rig/index.html",
        "/dev/complete-shelf-rig/": "/dev/complete-shelf-rig/index.html",
      };
      const target = internalRoutes[pathname];
      if (target) request.url = `${target}${search ? `?${search}` : ""}`;
    }
    next();
  };

  return {
    name: "complete-shelf-reference-route",
    configureServer(server) {
      server.middlewares.use(rewriteReferenceRoute());
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteReferenceRoute());
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: ['**/.worktrees/**', '**/scratch/**', '**/.git/**'],
    },
  },
  plugins: [
    completeShelfReferenceRoute(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
