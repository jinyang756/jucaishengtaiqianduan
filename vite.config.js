import { defineConfig } from 'vite'
// https://vite.dev/config/
export default {
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
}
