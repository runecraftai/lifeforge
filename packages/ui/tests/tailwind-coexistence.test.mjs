import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const UI_ROOT = resolve(import.meta.dirname, '..')

describe('S3 - Coexistence validation', () => {
  describe('dark mode', () => {
    it('C9: tailwind.css defines dark mode variant using shared CSS custom properties', () => {
      const tailwindCss = readFileSync(resolve(UI_ROOT, 'tailwind.css'), 'utf-8')

      assert.ok(
        tailwindCss.includes('@custom-variant dark'),
        'tailwind.css should define dark mode variant'
      )

      assert.ok(
        tailwindCss.includes('.dark'),
        'dark mode should use .dark class selector'
      )
    })

    it('C9: ModuleHeaderTailwind uses shared CSS custom properties that respond to dark mode', () => {
      const moduleHeader = readFileSync(
        resolve(UI_ROOT, 'src/components/layout/ModuleHeader/ModuleHeader.tailwind.tsx'),
        'utf-8'
      )

      const sharedVars = [
        'bg-primary',
        'text-muted',
        'bg-lf-bg-100'
      ]

      for (const cls of sharedVars) {
        assert.ok(
          moduleHeader.includes(cls),
          `ModuleHeaderTailwind should use shared class ${cls}`
        )
      }
    })

    it('C9: vanilla-extract dark mode uses same CSS custom properties as Tailwind', () => {
      const tailwindCss = readFileSync(resolve(UI_ROOT, 'tailwind.css'), 'utf-8')
      const varsSrc = readFileSync(resolve(UI_ROOT, 'src/system/vars.css.ts'), 'utf-8')

      const tailwindVars = new Set()
      const twVarRegex = /var\(--([\w-]+)\)/g
      let m
      while ((m = twVarRegex.exec(tailwindCss)) !== null) {
        tailwindVars.add(`--${m[1]}`)
      }

      const vanillaVars = new Set()
      const vanillaVarRegex = /var\(--([\w-]+)\)/g
      while ((m = vanillaVarRegex.exec(varsSrc)) !== null) {
        vanillaVars.add(`--${m[1]}`)
      }

      const sharedVars = [...tailwindVars].filter(v => vanillaVars.has(v))

      assert.ok(
        sharedVars.length > 0,
        'Tailwind and vanilla-extract should share CSS custom properties'
      )

      assert.ok(
        sharedVars.includes('--spacing'),
        'Both stacks should share --spacing variable'
      )
    })
  })

  describe('theme switching', () => {
    it('C10: COLORS object references CSS custom properties that update with theme', () => {
      const colorsSrc = readFileSync(
        resolve(UI_ROOT, 'src/system/colors/constants/colors.ts'),
        'utf-8'
      )

      const customVar = colorsSrc.match(/'custom-500':\s*'(.+?)'/)
      assert.ok(customVar, 'COLORS should define custom-500')
      assert.ok(
        customVar[1].includes('var(--color-custom-500)'),
        'custom-500 should reference var(--color-custom-500)'
      )

      const bgVar = colorsSrc.match(/'bg-500':\s*'(.+?)'/)
      assert.ok(bgVar, 'COLORS should define bg-500')
      assert.ok(
        bgVar[1].includes('var(--color-bg-500)'),
        'bg-500 should reference var(--color-bg-500)'
      )
    })

    it('C10: tailwind.css color tokens map to same CSS custom properties as vanilla-extract', () => {
      const tailwindCss = readFileSync(resolve(UI_ROOT, 'tailwind.css'), 'utf-8')
      const colorsSrc = readFileSync(
        resolve(UI_ROOT, 'src/system/colors/constants/colors.ts'),
        'utf-8'
      )

      const twCustom500 = tailwindCss.match(/--color-lf-custom-500:\s*(var\(--color-custom-500\))/
      )
      assert.ok(twCustom500, 'tailwind.css should map --color-lf-custom-500 to var(--color-custom-500)')

      const veCustom500 = colorsSrc.match(/'custom-500':\s*'(var\(--color-custom-500\))'/
      )
      assert.ok(veCustom500, 'COLORS should map custom-500 to var(--color-custom-500)')

      assert.equal(
        twCustom500[1],
        veCustom500[1],
        'Both stacks should reference the same CSS custom property for custom-500'
      )
    })

    it('C10: unified-kanban module uses both Tailwind and vanilla-extract coexistence pattern', () => {
      const kanbanCssPath = resolve(UI_ROOT, '../../modules/lifeforge--unified-kanban/client/src/index.css')
      if (!existsSync(kanbanCssPath)) {
        console.log('  ⚠ unified-kanban index.css not found, skipping')
        return
      }

      const kanbanCss = readFileSync(kanbanCssPath, 'utf-8')

      assert.ok(
        kanbanCss.includes('@import') && kanbanCss.includes('tailwind.css'),
        'unified-kanban should import tailwind.css'
      )
    })
  })
})
