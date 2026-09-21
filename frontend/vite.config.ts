/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Libraries get their own long-lived chunks: the single main chunk was 521 kB (over Vite's
        // 500 kB warning), and library chunks stay cached in browsers when only app code changes.
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 3,
            },
            { name: 'router', test: /node_modules[\\/]react-router(-dom)?[\\/]/, priority: 2 },
            {
              name: 'radix',
              test: /node_modules[\\/](radix-ui|@radix-ui|@floating-ui)[\\/]/,
              priority: 2,
            },
            { name: 'data', test: /node_modules[\\/](@tanstack|zod)[\\/]/, priority: 2 },
            // Only the Canvas Designer page uses these, so they stay out of every other page.
            {
              name: 'canvas',
              test: /node_modules[\\/](konva|react-konva|react-reconciler|its-fine)[\\/]/,
              priority: 2,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Pages here render large grids and tables in jsdom, and the files run in parallel. The default
    // five seconds passes on an idle machine and fails at random on a busy one, which is worse than
    // a slow suite: it turns a green run into a coin toss.
    testTimeout: 20_000,
  },
})
