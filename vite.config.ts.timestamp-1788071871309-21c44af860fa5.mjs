// vite.config.ts
import { defineConfig } from "file:///sessions/rcw-01kprvbxuizkzjny2aa3lehx/mnt/DA-Website-Redo/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/rcw-01kprvbxuizkzjny2aa3lehx/mnt/DA-Website-Redo/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/sessions/rcw-01kprvbxuizkzjny2aa3lehx/mnt/DA-Website-Redo";
var completeShelfReferenceRoute = () => {
  const rewriteReferenceRoute = () => (request, _response, next) => {
    if (request.url) {
      const [pathname, search] = request.url.split("?", 2);
      const internalRoutes = {
        "/dev/complete-shelf-reference": "/dev/complete-shelf-reference/index.html",
        "/dev/complete-shelf-reference/": "/dev/complete-shelf-reference/index.html",
        "/dev/complete-shelf-rig": "/dev/complete-shelf-rig/index.html",
        "/dev/complete-shelf-rig/": "/dev/complete-shelf-rig/index.html"
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
    }
  };
};
var vite_config_default = defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: ["**/.worktrees/**", "**/scratch/**", "**/.git/**"]
    }
  },
  plugins: [
    completeShelfReferenceRoute(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvcmN3LTAxa3BydmJ4dWl6a3pqbnkyYWEzbGVoeC9tbnQvREEtV2Vic2l0ZS1SZWRvXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvcmN3LTAxa3BydmJ4dWl6a3pqbnkyYWEzbGVoeC9tbnQvREEtV2Vic2l0ZS1SZWRvL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9yY3ctMDFrcHJ2Ynh1aXprempueTJhYTNsZWh4L21udC9EQS1XZWJzaXRlLVJlZG8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHR5cGUgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSBcIm5vZGU6aHR0cFwiO1xyXG5cclxuY29uc3QgY29tcGxldGVTaGVsZlJlZmVyZW5jZVJvdXRlID0gKCk6IFBsdWdpbiA9PiB7XHJcbiAgY29uc3QgcmV3cml0ZVJlZmVyZW5jZVJvdXRlID0gKCkgPT4gKHJlcXVlc3Q6IEluY29taW5nTWVzc2FnZSwgX3Jlc3BvbnNlOiBTZXJ2ZXJSZXNwb25zZSwgbmV4dDogKCkgPT4gdm9pZCkgPT4ge1xyXG4gICAgaWYgKHJlcXVlc3QudXJsKSB7XHJcbiAgICAgIGNvbnN0IFtwYXRobmFtZSwgc2VhcmNoXSA9IHJlcXVlc3QudXJsLnNwbGl0KFwiP1wiLCAyKTtcclxuICAgICAgY29uc3QgaW50ZXJuYWxSb3V0ZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcbiAgICAgICAgXCIvZGV2L2NvbXBsZXRlLXNoZWxmLXJlZmVyZW5jZVwiOiBcIi9kZXYvY29tcGxldGUtc2hlbGYtcmVmZXJlbmNlL2luZGV4Lmh0bWxcIixcclxuICAgICAgICBcIi9kZXYvY29tcGxldGUtc2hlbGYtcmVmZXJlbmNlL1wiOiBcIi9kZXYvY29tcGxldGUtc2hlbGYtcmVmZXJlbmNlL2luZGV4Lmh0bWxcIixcclxuICAgICAgICBcIi9kZXYvY29tcGxldGUtc2hlbGYtcmlnXCI6IFwiL2Rldi9jb21wbGV0ZS1zaGVsZi1yaWcvaW5kZXguaHRtbFwiLFxyXG4gICAgICAgIFwiL2Rldi9jb21wbGV0ZS1zaGVsZi1yaWcvXCI6IFwiL2Rldi9jb21wbGV0ZS1zaGVsZi1yaWcvaW5kZXguaHRtbFwiLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSBpbnRlcm5hbFJvdXRlc1twYXRobmFtZV07XHJcbiAgICAgIGlmICh0YXJnZXQpIHJlcXVlc3QudXJsID0gYCR7dGFyZ2V0fSR7c2VhcmNoID8gYD8ke3NlYXJjaH1gIDogXCJcIn1gO1xyXG4gICAgfVxyXG4gICAgbmV4dCgpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcImNvbXBsZXRlLXNoZWxmLXJlZmVyZW5jZS1yb3V0ZVwiLFxyXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKHJld3JpdGVSZWZlcmVuY2VSb3V0ZSgpKTtcclxuICAgIH0sXHJcbiAgICBjb25maWd1cmVQcmV2aWV3U2VydmVyKHNlcnZlcikge1xyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKHJld3JpdGVSZWZlcmVuY2VSb3V0ZSgpKTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIGlnbm9yZWQ6IFsnKiovLndvcmt0cmVlcy8qKicsICcqKi9zY3JhdGNoLyoqJywgJyoqLy5naXQvKionXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBjb21wbGV0ZVNoZWxmUmVmZXJlbmNlUm91dGUoKSxcclxuICAgIHJlYWN0KCksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdXLFNBQVMsb0JBQWlDO0FBQzFZLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTSw4QkFBOEIsTUFBYztBQUNoRCxRQUFNLHdCQUF3QixNQUFNLENBQUMsU0FBMEIsV0FBMkIsU0FBcUI7QUFDN0csUUFBSSxRQUFRLEtBQUs7QUFDZixZQUFNLENBQUMsVUFBVSxNQUFNLElBQUksUUFBUSxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBQ25ELFlBQU0saUJBQXlDO0FBQUEsUUFDN0MsaUNBQWlDO0FBQUEsUUFDakMsa0NBQWtDO0FBQUEsUUFDbEMsMkJBQTJCO0FBQUEsUUFDM0IsNEJBQTRCO0FBQUEsTUFDOUI7QUFDQSxZQUFNLFNBQVMsZUFBZSxRQUFRO0FBQ3RDLFVBQUksT0FBUSxTQUFRLE1BQU0sR0FBRyxNQUFNLEdBQUcsU0FBUyxJQUFJLE1BQU0sS0FBSyxFQUFFO0FBQUEsSUFDbEU7QUFDQSxTQUFLO0FBQUEsRUFDUDtBQUVBLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGdCQUFnQixRQUFRO0FBQ3RCLGFBQU8sWUFBWSxJQUFJLHNCQUFzQixDQUFDO0FBQUEsSUFDaEQ7QUFBQSxJQUNBLHVCQUF1QixRQUFRO0FBQzdCLGFBQU8sWUFBWSxJQUFJLHNCQUFzQixDQUFDO0FBQUEsSUFDaEQ7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHNCQUFRLGFBQWEsT0FBTztBQUFBLEVBQ2pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFNBQVMsQ0FBQyxvQkFBb0IsaUJBQWlCLFlBQVk7QUFBQSxJQUM3RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLDRCQUE0QjtBQUFBLElBQzVCLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
