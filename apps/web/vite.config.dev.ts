import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

const dirname = path.resolve(import.meta.dirname)
const rootDir = path.resolve(dirname, '..')

function clientAliasResolver(id: string, importer: string | undefined): string | null {
  if (!importer) return null
  let normalizedImporter = importer.replace(/^\/@fs\/?/, '')
  if (!path.isAbsolute(normalizedImporter)) {
    normalizedImporter = path.resolve(process.cwd(), normalizedImporter)
  }
  normalizedImporter = normalizedImporter.replace(/\\/g, '/')
  let resolveRoot: string
  const clientMatch = normalizedImporter.match(/(.+\/(?:client|web))/)
  if (clientMatch) {
    const clientDir = clientMatch[1]
    resolveRoot = id === '@/manifest' || id === '@/manifest.ts' ? clientDir : `${clientDir}/src`
  } else {
    const srcMatch = normalizedImporter.match(/(.+\/src)/)
    if (!srcMatch) return null
    resolveRoot = srcMatch[1]
  }
  const subPath = id === '@' ? '' : id.slice(2)
  const basePath = path.resolve(resolveRoot, subPath)
  const candidates = [
    `${basePath}.tsx`, `${basePath}.ts`, `${basePath}.json`,
    path.resolve(basePath, 'index.tsx'), path.resolve(basePath, 'index.ts'), basePath
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

const aliasList = [
  {
    find: /^@lifeforge\/api$/,
    replacement: path.resolve(rootDir, 'packages/api/src/index.ts')
  },
  {
    find: /^@lifeforge\/federation$/,
    replacement: path.resolve(rootDir, 'packages/federation/src/index.ts')
  },
  {
    find: /^@lifeforge\/localization$/,
    replacement: path.resolve(rootDir, 'packages/localization/src/index.ts')
  },
  {
    find: /^@lifeforge\/ui$/,
    replacement: path.resolve(rootDir, 'packages/ui/src/index.ts')
  },
  { find: '@modules', replacement: path.resolve(rootDir, 'modules') }
]

export default defineConfig({
  envDir: path.resolve(rootDir, 'env'),
  plugins: [
    {
      name: 'alias-resolver',
      enforce: 'pre',
      resolveId(source: string, importer: string | undefined) {
        if (source === '@' || source.startsWith('@/')) {
          return clientAliasResolver(source, importer)
        }
        return null
      }
    },
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    vanillaExtractPlugin({
      unstable_pluginFilter: ({ name }) => {
        return ['vite-tsconfig-paths', 'alias-resolver'].includes(name)
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 80,
    fs: { strict: true },
    watch: { ignored: ['**/node_modules/**', '**/.git/**'] },
    proxy: {
      '/api': {
        target: 'http://server:3636',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://server:3636',
        changeOrigin: true,
        ws: true
      }
    }
  },
  resolve: {
    alias: aliasList
  },
  optimizeDeps: {
    exclude: ['@lifeforge/api', '@lifeforge/federation', '@lifeforge/localization', '@lifeforge/ui']
  },
  build: {
    target: 'esnext',
    sourcemap: false
  }
})
