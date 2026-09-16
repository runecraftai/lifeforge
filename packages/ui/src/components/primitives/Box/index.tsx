import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import {
  type ArbitraryProps,
  type ColorValue,
  type ResponsiveProp,
  type ThemeConditionProp,
  type TokenizedCommonProps
} from '@/system'

import { Slot } from '../Slot'
import { tailwindStyles } from '../tailwind'

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'

interface BoxOwnProps<T extends ElementType = 'div'>
  extends TokenizedCommonProps, ArbitraryProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<DisplayValue>
  bg?: ThemeConditionProp<ColorValue>
  shadow?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type BoxProps<T extends ElementType = 'div'> = BoxOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof BoxOwnProps<T>>

export function Box<T extends ElementType = 'div'>({
  as,
  asChild = false,
  ref,
  // Padding
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  // Margin
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  // Layout props (CSS string - now responsive!)
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  aspectRatio,
  zIndex,
  inset,
  top,
  right,
  bottom,
  left,
  flex,
  flexBasis,
  flexGrow,
  flexShrink,
  gridArea,
  gridColumnSpan,
  gridRowSpan,
  // Sprinkle props
  display,
  position,
  overflow,
  overflowX,
  overflowY,
  bg,
  r,
  rtl,
  rtr,
  rbl,
  rbr,
  shadow,
  // Standard props
  className,
  style,
  children,
  ...rest
}: BoxProps<T>) {
  const Component = asChild ? Slot : (as ?? 'div')

  const styles = tailwindStyles(
    {
      display,
      position,
      overflow,
      overflowX,
      overflowY,
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      r,
      rtl,
      rtr,
      rbl,
      rbr,
      bg,
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
      aspectRatio,
      zIndex,
      inset,
      top,
      right,
      bottom,
      left,
      flex,
      flexBasis,
      flexGrow,
      flexShrink,
      gridArea,
      gridColumnSpan,
      gridRowSpan
    },
    style
  )
  styles.className = [
    styles.className,
    className,
    shadow && 'shadow-[var(--custom-shadow)]'
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component ref={ref as Ref<never>} {...styles} {...rest}>
      {children}
    </Component>
  )
}
