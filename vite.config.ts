import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [
        react(),
        dts({
          include: ['src/lib'],
          tsconfigPath: './tsconfig.lib.json',
          skipDiagnostics: true,
        }),
        {
          name: 'copy-styles',
          closeBundle() {
            mkdirSync('dist', { recursive: true })
            copyFileSync('src/lib/styles.css', 'dist/styles.css')
          },
        },
      ],
      publicDir: false,
      build: {
        lib: {
          entry: {
            index: resolve(__dirname, 'src/lib/index.ts'),
            mantine: resolve(__dirname, 'src/lib/mantine.tsx'),
            mui: resolve(__dirname, 'src/lib/mui.tsx'),
          },
        },
        rollupOptions: {
          external: [
            'react',
            'react/jsx-runtime',
            'react-dom',
            '@mantine/core',
            '@mui/material',
            '@emotion/react',
            '@emotion/styled',
          ],
          output: [
            {
              format: 'es',
              entryFileNames: '[name].js',
              chunkFileNames: '[name].shared.js',
            },
            {
              format: 'cjs',
              entryFileNames: '[name].cjs',
              chunkFileNames: '[name].shared.cjs',
            },
          ],
        },
      },
    }
  }

  return {
    plugins: [react()],
  }
})
