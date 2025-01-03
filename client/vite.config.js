import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // Map '@' to the 'src' folder
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/Main.css";`,
      },
      build: {
        sourcemap: true,
      },
    }
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: '${import.meta.env.VITE_BACKEND_URL}',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //       secure: false,
  //     },
  //   },
  // },
})
