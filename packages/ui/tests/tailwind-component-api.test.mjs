import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const UI_ROOT = resolve(import.meta.dirname, '..')

describe('S2 - Component API and import verification', () => {
  describe('ModuleHeader', () => {
    it('C6: ModuleHeaderTailwind exists as a separate Tailwind-native export', () => {
      const componentPath = resolve(UI_ROOT, 'src/components/layout/ModuleHeader/ModuleHeader.tailwind.tsx')
      assert.ok(existsSync(componentPath), 'ModuleHeader.tailwind.tsx should exist')

      const source = readFileSync(componentPath, 'utf-8')
      assert.ok(source.includes('export function ModuleHeaderTailwind'), 'Should export ModuleHeaderTailwind function')
      assert.ok(source.includes('className='), 'Should use className for Tailwind classes')
      assert.ok(source.includes('bg-primary'), 'Should use Tailwind color utility (bg-primary)')
      assert.ok(source.includes('text-muted'), 'Should use Tailwind color utility (text-muted)')
      assert.ok(source.includes('rounded-lg'), 'Should use Tailwind radius utility')
      assert.ok(source.includes('gap-'), 'Should use Tailwind spacing utility')
    })
  })

  describe('import availability', () => {
    it('C7: tailwind.css exports @theme tokens as CSS custom properties', () => {
      const tailwindCss = readFileSync(resolve(UI_ROOT, 'tailwind.css'), 'utf-8')

      assert.ok(tailwindCss.includes('@theme inline'), 'Should have @theme inline block')

      const requiredTokens = [
        '--color-lf-bg-500',
        '--color-lf-custom-500',
        '--text-lf-sm',
        '--radius-lf-lg',
        '--spacing-lf'
      ]

      for (const token of requiredTokens) {
        assert.ok(
          tailwindCss.includes(token),
          `tailwind.css should define ${token}`
        )
      }
    })

    it('C7: tailwind.css is exported from package.json', () => {
      const pkg = JSON.parse(readFileSync(resolve(UI_ROOT, 'package.json'), 'utf-8'))
      assert.ok(pkg.exports['./tailwind.css'], 'tailwind.css should be in exports')
      assert.equal(pkg.exports['./tailwind.css'], './tailwind.css', 'Export path should be correct')
    })
  })

  describe('coexistence', () => {
    it('C8: tailwind.css and dist/index.css can both be imported without variable conflicts', () => {
      const tailwindCss = readFileSync(resolve(UI_ROOT, 'tailwind.css'), 'utf-8')
      const distCssPath = resolve(UI_ROOT, 'dist/index.css')

      assert.ok(existsSync(distCssPath), 'dist/index.css must exist — run `pnpm build` in packages/ui before testing coexistence')

      const distCss = readFileSync(distCssPath, 'utf-8')

      const tailwindVars = new Set()
      const twVarRegex = /--([\w-]+)\s*:/g
      let m
      while ((m = twVarRegex.exec(tailwindCss)) !== null) {
        tailwindVars.add(`--${m[1]}`)
      }

      const distVars = new Set()
      const distVarRegex = /--([\w-]+)\s*:/g
      while ((m = distVarRegex.exec(distCss)) !== null) {
        distVars.add(`--${m[1]}`)
      }

      const conflicts = []
      for (const v of tailwindVars) {
        if (distVars.has(v)) {
          conflicts.push(v)
        }
      }

      assert.equal(
        conflicts.length,
        0,
        `CSS variable conflicts found: ${conflicts.join(', ')}`
      )
    })
  })
})
