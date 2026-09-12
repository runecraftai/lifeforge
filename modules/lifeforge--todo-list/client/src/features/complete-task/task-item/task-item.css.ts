import { style } from '@vanilla-extract/css'

import { COLORS, colorWithOpacity, vars } from '@lifeforge/ui'

export const item = style({
  isolation: 'isolate'
})

export const summary = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

export const dueDate = style({
  flexShrink: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})

export const tag = style({
  color: COLORS['custom-500'],
  isolation: 'isolate',
  minWidth: '3rem',
  overflow: 'hidden',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

export const tagBackground = style({
  backgroundColor: colorWithOpacity('custom-500', '20%').toString(),
  borderRadius: vars.radii.full,
  inset: 0,
  position: 'absolute',
  zIndex: -1
})

export const moreTags = style({
  color: COLORS['bg-500'],
  flexShrink: 0,
  fontSize: vars.fontSize.xs
})

export const overlay = style({
  appearance: 'none',
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
  inset: 0,
  padding: 0,
  position: 'absolute'
})
