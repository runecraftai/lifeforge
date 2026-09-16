import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const UI_ROOT = resolve(import.meta.dirname, '..')
const TAILWIND_CSS = readFileSync(resolve(UI_ROOT, 'tailwind.css'), 'utf-8')

function parseThemeBlock(css) {
  const match = css.match(/@theme\s+inline\s*\{([\s\S]*?)\}/)
  if (!match) throw new Error('No @theme inline block found')
  const block = match[1]
  const tokens = {}
  for (const line of block.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//')) continue
    const m = trimmed.match(/^--([\w-]+)\s*:\s*(.+?);$/)
    if (m) tokens[m[1]] = m[2].trim()
  }
  return tokens
}

function readVanillaVars() {
  const src = readFileSync(resolve(UI_ROOT, 'src/system/vars.css.ts'), 'utf-8')
  const vars = {}
  const parseSection = (sectionName) => {
    const match = src.match(new RegExp(`${sectionName}:\\s*\\{([\\s\\S]*?)\\}`))
    if (!match) return {}
    const result = {}
    for (const line of match[1].split('\n')) {
      const m = line.match(/["']?([\w-]+)["']?\s*:\s*["'](.+?)["']/)
      if (m) result[m[1]] = m[2]
    }
    return result
  }
  const space = parseSection('space')
  for (const [k, v] of Object.entries(space)) vars[`space.${k}`] = v
  const radii = parseSection('radii')
  for (const [k, v] of Object.entries(radii)) vars[`radii.${k}`] = v
  const fontSize = parseSection('fontSize')
  for (const [k, v] of Object.entries(fontSize)) vars[`fontSize.${k}`] = v
  return vars
}

function readColors() {
  const src = readFileSync(resolve(UI_ROOT, 'src/system/colors/constants/colors.ts'), 'utf-8')
  const colors = {}
  const baseMatch = src.match(/BASE_COLORS\s*=\s*\{([\s\S]*?)\} as const/)
  if (baseMatch) {
    for (const line of baseMatch[1].split('\n')) {
      const m = line.match(/'([\w-]+)':\s*'(.+?)'/)
      if (m) colors[m[1]] = m[2]
    }
  }
  return colors
}

const theme = parseThemeBlock(TAILWIND_CSS)
const vanillaVars = readVanillaVars()
const colors = readColors()

describe('S1 - Token verification', () => {
  describe('spacing', () => {
    it('C1: p-4 spacing maps to calc(var(--spacing) * 4), matching vars.space.md', () => {
      const twSpacing = theme['spacing-lf']
      assert.equal(twSpacing, 'var(--spacing)', 'spacing-lf should reference var(--spacing)')

      const vanillaMd = vanillaVars['space.md']
      assert.ok(vanillaMd, 'vars.space.md should exist')

      const expected = 'calc(var(--spacing) * 4)'
      assert.equal(vanillaMd, expected, `vars.space.md should be ${expected}`)

      const twValue = 'calc(var(--spacing) * 4)'
      assert.equal(twValue, vanillaMd, 'Tailwind spacing calc should match vanilla-extract space.md')
    })
  })

  describe('radius', () => {
    it('C2: rounded-lg maps to var(--radius-lg), matching vars.radii.lg', () => {
      const twRadiusLg = theme['radius-lf-lg']
      assert.equal(twRadiusLg, 'var(--radius-lg)', 'radius-lf-lg should reference var(--radius-lg)')

      const vanillaLg = vanillaVars['radii.lg']
      assert.ok(vanillaLg, 'vars.radii.lg should exist')
      assert.equal(vanillaLg, 'var(--radius-lg)', 'vars.radii.lg should be var(--radius-lg)')
    })
  })

  describe('fontSize', () => {
    it('C3: text-sm maps to var(--text-sm), matching vars.fontSize.sm', () => {
      const twTextSm = theme['text-lf-sm']
      assert.equal(twTextSm, 'var(--text-sm)', 'text-lf-sm should reference var(--text-sm)')

      const vanillaSm = vanillaVars['fontSize.sm']
      assert.ok(vanillaSm, 'vars.fontSize.sm should exist')
      assert.equal(vanillaSm, 'var(--text-sm)', 'vars.fontSize.sm should be var(--text-sm)')
    })
  })

  describe('custom color', () => {
    it('C4: bg-lf-custom-500 maps to var(--color-custom-500), matching COLORS.custom-500', () => {
      const twCustom500 = theme['color-lf-custom-500']
      assert.equal(twCustom500, 'var(--color-custom-500)', 'color-lf-custom-500 should reference var(--color-custom-500)')

      const colorCustom500 = colors['custom-500']
      assert.ok(colorCustom500, 'COLORS.custom-500 should exist')
      assert.equal(colorCustom500, 'var(--color-custom-500)', 'COLORS.custom-500 should be var(--color-custom-500)')
    })
  })

  describe('bg color', () => {
    it('C5: bg-lf-bg-500 maps to var(--color-bg-500), matching COLORS.bg-500', () => {
      const twBg500 = theme['color-lf-bg-500']
      assert.equal(twBg500, 'var(--color-bg-500)', 'color-lf-bg-500 should reference var(--color-bg-500)')

      const colorBg500 = colors['bg-500']
      assert.ok(colorBg500, 'COLORS.bg-500 should exist')
      assert.equal(colorBg500, 'var(--color-bg-500)', 'COLORS.bg-500 should be var(--color-bg-500)')
    })
  })
})
