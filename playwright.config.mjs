import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './.github/visual',
  outputDir: './visual-results/test-output',
  timeout: 90_000,
  fullyParallel: false,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'visual-report', open: 'never' }]
  ],
  use: {
    baseURL: process.env.VISUAL_BASE_URL || 'http://127.0.0.1:5173',
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
})
