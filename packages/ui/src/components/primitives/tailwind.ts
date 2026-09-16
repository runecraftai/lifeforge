import type { CSSProperties } from 'react'

import { COLORS, isColorWithOpacity } from '@/system'

const spacingValues = {
  none: '0',
  xs: 'calc(var(--spacing) * 1)',
  sm: 'calc(var(--spacing) * 2)',
  md: 'calc(var(--spacing) * 4)',
  lg: 'calc(var(--spacing) * 6)',
  xl: 'calc(var(--spacing) * 8)',
  '2xl': 'calc(var(--spacing) * 12)',
  '3xl': 'calc(var(--spacing) * 16)'
} as const

const radiusValues = {
  none: '0',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: '9999px'
} as const

const conditions: Record<string, string> = {
  base: '',
  dark: 'dark:',
  hover: 'hover:',
  darkHover: 'dark:hover:',
  hasBgImage: 'has-[.has-bg-image]:',
  darkHasBgImage: 'dark:has-[.has-bg-image]:',
  hasBgImageHover: 'has-[.has-bg-image]:hover:',
  hasBgImageDarkHover: 'dark:has-[.has-bg-image]:hover:',
  print: 'print:'
}

function entries(value: unknown): [string, unknown][] {
  if (value === undefined) return []
  if (
    typeof value !== 'object' ||
    value === null ||
    isColorWithOpacity(value)
  ) {
    return [['', value]]
  }
  return Object.entries(value).map(([condition, entry]) => [
    conditions[condition] ?? `${condition}:`,
    entry
  ])
}

function utility(
  prefix: string,
  value: unknown,
  map: (entry: unknown) => string = String
): string[] {
  return entries(value)
    .filter(([, entry]) => entry !== undefined)
    .map(([variant, entry]) => `${variant}${prefix}-${map(entry)}`)
}

function mapped(
  prefix: string,
  value: unknown,
  map: Record<string, string>
): string[] {
  return utility(prefix, value, entry => map[String(entry)] ?? String(entry))
}

function arbitrary(prefix: string, value: unknown): string[] {
  return utility(prefix, value, entry => `[${String(entry)}]`)
}

function tokenized(
  prefix: string,
  value: unknown,
  tokens: Record<string, string>
): string[] {
  return utility(prefix, value, entry => {
    const token = tokens[String(entry)]
    return token ? `[${token}]` : `[${String(entry)}]`
  })
}

function colorClasses(
  prefix: string,
  value: unknown
): { classes: string[]; style: CSSProperties } {
  const style: CSSProperties = {}
  const classes: string[] = []

  for (const [variant, entry] of entries(value)) {
    if (entry === undefined) continue
    if (isColorWithOpacity(entry)) {
      const suffix = variant.replace(/:$/, '').replaceAll(':', '-')
      const variable = `--lf-${prefix}${suffix ? `-${suffix}` : ''}`
      style[variable as keyof CSSProperties] =
        `color-mix(in srgb, ${COLORS[entry.token]} ${entry.opacity}, transparent)` as never
      classes.push(`${variant}${prefix}-[var(${variable})]`)
      continue
    }
    const token = String(entry)
    if (token.startsWith('bg-') || token.startsWith('custom-')) {
      classes.push(`${variant}${prefix}-lf-${token}`)
    } else if (
      token in COLORS &&
      !['transparent', 'inherit', 'primary', 'muted'].includes(token)
    ) {
      const cssValue = COLORS[token as keyof typeof COLORS]
      classes.push(`${variant}${prefix}-[${cssValue}]`)
    } else {
      classes.push(`${variant}${prefix}-${token}`)
    }
  }

  return { classes, style }
}

export function tailwindStyles(
  props: Record<string, unknown>,
  style?: CSSProperties
): { className: string; style: CSSProperties } {
  const bg = colorClasses('bg', props.bg)
  const color = colorClasses('text', props.color)
  const borderColor = colorClasses('border', props.borderColor)
  const classes = [
    'box-border',
    ...entries(props.display)
      .filter(([, entry]) => entry !== undefined)
      .map(
        ([variant, entry]) =>
          `${variant}${
            (
              {
                block: 'block',
                inline: 'inline',
                'inline-block': 'inline-block',
                flex: 'flex',
                'inline-flex': 'inline-flex',
                grid: 'grid',
                'inline-grid': 'inline-grid',
                none: 'hidden',
                contents: 'contents'
              } as Record<string, string>
            )[String(entry)] ?? String(entry)
          }`
      ),
    ...entries(props.position)
      .filter(([, entry]) => entry !== undefined)
      .map(([variant, entry]) => `${variant}${String(entry)}`),
    ...utility('overflow', props.overflow),
    ...utility('overflow-x', props.overflowX),
    ...utility('overflow-y', props.overflowY),
    ...tokenized('p', props.p, spacingValues),
    ...tokenized('px', props.px, spacingValues),
    ...tokenized('py', props.py, spacingValues),
    ...tokenized('pt', props.pt, spacingValues),
    ...tokenized('pr', props.pr, spacingValues),
    ...tokenized('pb', props.pb, spacingValues),
    ...tokenized('pl', props.pl, spacingValues),
    ...tokenized('m', props.m, spacingValues),
    ...tokenized('mx', props.mx, spacingValues),
    ...tokenized('my', props.my, spacingValues),
    ...tokenized('mt', props.mt, spacingValues),
    ...tokenized('mr', props.mr, spacingValues),
    ...tokenized('mb', props.mb, spacingValues),
    ...tokenized('ml', props.ml, spacingValues),
    ...tokenized('rounded', props.r, radiusValues),
    ...tokenized('rounded-tl', props.rtl, radiusValues),
    ...tokenized('rounded-tr', props.rtr, radiusValues),
    ...tokenized('rounded-bl', props.rbl, radiusValues),
    ...tokenized('rounded-br', props.rbr, radiusValues),
    ...bg.classes,
    ...color.classes,
    ...borderColor.classes,
    ...arbitrary('w', props.width),
    ...arbitrary('min-w', props.minWidth),
    ...arbitrary('max-w', props.maxWidth),
    ...arbitrary('h', props.height),
    ...arbitrary('min-h', props.minHeight),
    ...arbitrary('max-h', props.maxHeight),
    ...arbitrary('aspect', props.aspectRatio),
    ...arbitrary('z', props.zIndex),
    ...arbitrary('inset', props.inset),
    ...arbitrary('top', props.top),
    ...arbitrary('right', props.right),
    ...arbitrary('bottom', props.bottom),
    ...arbitrary('left', props.left),
    ...arbitrary('flex', props.flex),
    ...arbitrary('basis', props.flexBasis),
    ...arbitrary('grow', props.flexGrow),
    ...arbitrary('shrink', props.flexShrink),
    ...arbitrary('grid-area', props.gridArea),
    ...mapped('flex', props.direction, {
      row: 'row',
      column: 'col',
      'row-reverse': 'row-reverse',
      'column-reverse': 'col-reverse'
    }),
    ...tokenized('gap', props.gap, spacingValues),
    ...tokenized('gap-x', props.gapX, spacingValues),
    ...tokenized('gap-y', props.gapY, spacingValues),
    ...mapped('items', props.alignItems, {
      stretch: 'stretch',
      center: 'center',
      start: 'start',
      end: 'end',
      baseline: 'baseline'
    }),
    ...mapped('justify', props.justify, {
      start: 'start',
      center: 'center',
      between: 'between',
      around: 'around',
      evenly: 'evenly',
      end: 'end'
    }),
    ...entries(props.wrap)
      .filter(([, entry]) => entry !== undefined)
      .map(([variant, entry]) => `${variant}${String(entry)}`),
    ...utility('col-span', props.gridColumnSpan),
    ...utility('row-span', props.gridRowSpan),
    ...mapped('border', props.borderStyle, {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
      none: 'none'
    }),
    ...utility('border', props.borderWidth),
    ...mapped('decoration', props.decoration, {
      underline: 'underline',
      'line-through': 'line-through',
      none: 'none'
    }),
    ...entries(props.transform)
      .filter(([, entry]) => entry !== undefined)
      .map(([variant, entry]) => `${variant}${String(entry)}`)
  ]

  return {
    className: classes.join(' '),
    style: { ...style, ...bg.style, ...color.style, ...borderColor.style }
  }
}
