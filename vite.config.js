import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 5173,
    historyApiFallback: true
  },
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
})
