import type { CSSProperties } from 'react'

import { COLORS, isColorWithOpacity, normalizeGridSpan } from '@/system'

const spacingValues: Record<string, string> = {
  none: '0',
  xs: 'calc(var(--spacing) * 1)',
  sm: 'calc(var(--spacing) * 2)',
  md: 'calc(var(--spacing) * 4)',
  lg: 'calc(var(--spacing) * 6)',
  xl: 'calc(var(--spacing) * 8)',
  '2xl': 'calc(var(--spacing) * 12)',
  '3xl': 'calc(var(--spacing) * 16)'
}

const radiusValues: Record<string, string> = {
  none: '0',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: '9999px'
}

const responsiveIndexes: Record<string, number> = {
  base: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  '2xl': 5,
  print: 6
}

const responsiveSuffixes = ['', '-sm', '-md', '-lg', '-xl', '-2xl', '-print']

const themeIndexes: Record<string, number> = {
  base: 0,
  dark: 1,
  hover: 2,
  darkHover: 3,
  hasBgImage: 4,
  darkHasBgImage: 5,
  hasBgImageHover: 6,
  hasBgImageDarkHover: 7,
  print: 8
}

const themeSuffixes = [
  '',
  '-dark',
  '-hover',
  '-dark-hover',
  '-has-bg-image',
  '-dark-has-bg-image',
  '-has-bg-image-hover',
  '-has-bg-image-dark-hover',
  '-print'
]

const displayClasses: Record<string, string> = {
  block: 'block sm:block md:block lg:block xl:block 2xl:block print:block',
  inline:
    'inline sm:inline md:inline lg:inline xl:inline 2xl:inline print:inline',
  'inline-block':
    'inline-block sm:inline-block md:inline-block lg:inline-block xl:inline-block 2xl:inline-block print:inline-block',
  flex: 'flex sm:flex md:flex lg:flex xl:flex 2xl:flex print:flex',
  'inline-flex':
    'inline-flex sm:inline-flex md:inline-flex lg:inline-flex xl:inline-flex 2xl:inline-flex print:inline-flex',
  grid: 'grid sm:grid md:grid lg:grid xl:grid 2xl:grid print:grid',
  'inline-grid':
    'inline-grid sm:inline-grid md:inline-grid lg:inline-grid xl:inline-grid 2xl:inline-grid print:inline-grid',
  none: 'hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden print:hidden',
  contents:
    'contents sm:contents md:contents lg:contents xl:contents 2xl:contents print:contents'
}

const positionClasses: Record<string, string> = {
  static:
    'static sm:static md:static lg:static xl:static 2xl:static print:static',
  relative:
    'relative sm:relative md:relative lg:relative xl:relative 2xl:relative print:relative',
  absolute:
    'absolute sm:absolute md:absolute lg:absolute xl:absolute 2xl:absolute print:absolute',
  fixed: 'fixed sm:fixed md:fixed lg:fixed xl:fixed 2xl:fixed print:fixed',
  sticky:
    'sticky sm:sticky md:sticky lg:sticky xl:sticky 2xl:sticky print:sticky'
}

const overflowClasses: Record<string, string> = {
  visible:
    'overflow-visible sm:overflow-visible md:overflow-visible lg:overflow-visible xl:overflow-visible 2xl:overflow-visible print:overflow-visible',
  hidden:
    'overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden 2xl:overflow-hidden print:overflow-hidden',
  scroll:
    'overflow-scroll sm:overflow-scroll md:overflow-scroll lg:overflow-scroll xl:overflow-scroll 2xl:overflow-scroll print:overflow-scroll',
  auto: 'overflow-auto sm:overflow-auto md:overflow-auto lg:overflow-auto xl:overflow-auto 2xl:overflow-auto print:overflow-auto'
}

const overflowXClasses: Record<string, string> = {
  visible:
    'overflow-x-visible sm:overflow-x-visible md:overflow-x-visible lg:overflow-x-visible xl:overflow-x-visible 2xl:overflow-x-visible print:overflow-x-visible',
  hidden:
    'overflow-x-hidden sm:overflow-x-hidden md:overflow-x-hidden lg:overflow-x-hidden xl:overflow-x-hidden 2xl:overflow-x-hidden print:overflow-x-hidden',
  scroll:
    'overflow-x-scroll sm:overflow-x-scroll md:overflow-x-scroll lg:overflow-x-scroll xl:overflow-x-scroll 2xl:overflow-x-scroll print:overflow-x-scroll',
  auto: 'overflow-x-auto sm:overflow-x-auto md:overflow-x-auto lg:overflow-x-auto xl:overflow-x-auto 2xl:overflow-x-auto print:overflow-x-auto'
}

const overflowYClasses: Record<string, string> = {
  visible:
    'overflow-y-visible sm:overflow-y-visible md:overflow-y-visible lg:overflow-y-visible xl:overflow-y-visible 2xl:overflow-y-visible print:overflow-y-visible',
  hidden:
    'overflow-y-hidden sm:overflow-y-hidden md:overflow-y-hidden lg:overflow-y-hidden xl:overflow-y-hidden 2xl:overflow-y-hidden print:overflow-y-hidden',
  scroll:
    'overflow-y-scroll sm:overflow-y-scroll md:overflow-y-scroll lg:overflow-y-scroll xl:overflow-y-scroll 2xl:overflow-y-scroll print:overflow-y-scroll',
  auto: 'overflow-y-auto sm:overflow-y-auto md:overflow-y-auto lg:overflow-y-auto xl:overflow-y-auto 2xl:overflow-y-auto print:overflow-y-auto'
}

const directionClasses: Record<string, string> = {
  row: 'flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row print:flex-row',
  column:
    'flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col print:flex-col',
  'row-reverse':
    'flex-row-reverse sm:flex-row-reverse md:flex-row-reverse lg:flex-row-reverse xl:flex-row-reverse 2xl:flex-row-reverse print:flex-row-reverse',
  'column-reverse':
    'flex-col-reverse sm:flex-col-reverse md:flex-col-reverse lg:flex-col-reverse xl:flex-col-reverse 2xl:flex-col-reverse print:flex-col-reverse'
}

const alignClasses: Record<string, string> = {
  stretch:
    'items-stretch sm:items-stretch md:items-stretch lg:items-stretch xl:items-stretch 2xl:items-stretch print:items-stretch',
  center:
    'items-center sm:items-center md:items-center lg:items-center xl:items-center 2xl:items-center print:items-center',
  start:
    'items-start sm:items-start md:items-start lg:items-start xl:items-start 2xl:items-start print:items-start',
  end: 'items-end sm:items-end md:items-end lg:items-end xl:items-end 2xl:items-end print:items-end',
  baseline:
    'items-baseline sm:items-baseline md:items-baseline lg:items-baseline xl:items-baseline 2xl:items-baseline print:items-baseline'
}

const justifyClasses: Record<string, string> = {
  start:
    'justify-start sm:justify-start md:justify-start lg:justify-start xl:justify-start 2xl:justify-start print:justify-start',
  center:
    'justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center 2xl:justify-center print:justify-center',
  between:
    'justify-between sm:justify-between md:justify-between lg:justify-between xl:justify-between 2xl:justify-between print:justify-between',
  around:
    'justify-around sm:justify-around md:justify-around lg:justify-around xl:justify-around 2xl:justify-around print:justify-around',
  evenly:
    'justify-evenly sm:justify-evenly md:justify-evenly lg:justify-evenly xl:justify-evenly 2xl:justify-evenly print:justify-evenly',
  end: 'justify-end sm:justify-end md:justify-end lg:justify-end xl:justify-end 2xl:justify-end print:justify-end'
}

const wrapClasses: Record<string, string> = {
  nowrap:
    'flex-nowrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap print:flex-nowrap',
  wrap: 'flex-wrap sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap 2xl:flex-wrap print:flex-wrap',
  'wrap-reverse':
    'flex-wrap-reverse sm:flex-wrap-reverse md:flex-wrap-reverse lg:flex-wrap-reverse xl:flex-wrap-reverse 2xl:flex-wrap-reverse print:flex-wrap-reverse'
}

const borderStyleClasses: Record<string, string> = {
  solid:
    'border-solid sm:border-solid md:border-solid lg:border-solid xl:border-solid 2xl:border-solid print:border-solid',
  dashed:
    'border-dashed sm:border-dashed md:border-dashed lg:border-dashed xl:border-dashed 2xl:border-dashed print:border-dashed',
  dotted:
    'border-dotted sm:border-dotted md:border-dotted lg:border-dotted xl:border-dotted 2xl:border-dotted print:border-dotted',
  double:
    'border-double sm:border-double md:border-double lg:border-double xl:border-double 2xl:border-double print:border-double',
  none: 'border-none sm:border-none md:border-none lg:border-none xl:border-none 2xl:border-none print:border-none'
}

const borderWidthClasses: Record<string, string> = {
  '0': 'border-0 sm:border-0 md:border-0 lg:border-0 xl:border-0 2xl:border-0 print:border-0',
  '1': 'border sm:border md:border lg:border xl:border 2xl:border print:border',
  '2': 'border-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 2xl:border-2 print:border-2',
  '4': 'border-4 sm:border-4 md:border-4 lg:border-4 xl:border-4 2xl:border-4 print:border-4',
  '8': 'border-8 sm:border-8 md:border-8 lg:border-8 xl:border-8 2xl:border-8 print:border-8'
}

const decorationClasses: Record<string, string> = {
  underline:
    'decoration-underline sm:decoration-underline md:decoration-underline lg:decoration-underline xl:decoration-underline 2xl:decoration-underline print:decoration-underline',
  'line-through':
    'decoration-line-through sm:decoration-line-through md:decoration-line-through lg:decoration-line-through xl:decoration-line-through 2xl:decoration-line-through print:decoration-line-through',
  none: 'decoration-none sm:decoration-none md:decoration-none lg:decoration-none xl:decoration-none 2xl:decoration-none print:decoration-none'
}

const transformClasses: Record<string, string> = {
  uppercase:
    'uppercase sm:uppercase md:uppercase lg:uppercase xl:uppercase 2xl:uppercase print:uppercase',
  lowercase:
    'lowercase sm:lowercase md:lowercase lg:lowercase xl:lowercase 2xl:lowercase print:lowercase',
  capitalize:
    'capitalize sm:capitalize md:capitalize lg:capitalize xl:capitalize 2xl:capitalize print:capitalize',
  none: 'normal-case sm:normal-case md:normal-case lg:normal-case xl:normal-case 2xl:normal-case print:normal-case'
}

type VariableDefinition = {
  classes: string
  variable: `--${string}`
}

const variableDefinitions: Record<string, VariableDefinition> = {
  p: {
    classes:
      'p-[var(--lf-tw-p)] sm:p-[var(--lf-tw-p-sm)] md:p-[var(--lf-tw-p-md)] lg:p-[var(--lf-tw-p-lg)] xl:p-[var(--lf-tw-p-xl)] 2xl:p-[var(--lf-tw-p-2xl)] print:p-[var(--lf-tw-p-print)]',
    variable: '--lf-tw-p'
  },
  px: {
    classes:
      'px-[var(--lf-tw-px)] sm:px-[var(--lf-tw-px-sm)] md:px-[var(--lf-tw-px-md)] lg:px-[var(--lf-tw-px-lg)] xl:px-[var(--lf-tw-px-xl)] 2xl:px-[var(--lf-tw-px-2xl)] print:px-[var(--lf-tw-px-print)]',
    variable: '--lf-tw-px'
  },
  py: {
    classes:
      'py-[var(--lf-tw-py)] sm:py-[var(--lf-tw-py-sm)] md:py-[var(--lf-tw-py-md)] lg:py-[var(--lf-tw-py-lg)] xl:py-[var(--lf-tw-py-xl)] 2xl:py-[var(--lf-tw-py-2xl)] print:py-[var(--lf-tw-py-print)]',
    variable: '--lf-tw-py'
  },
  pt: {
    classes:
      'pt-[var(--lf-tw-pt)] sm:pt-[var(--lf-tw-pt-sm)] md:pt-[var(--lf-tw-pt-md)] lg:pt-[var(--lf-tw-pt-lg)] xl:pt-[var(--lf-tw-pt-xl)] 2xl:pt-[var(--lf-tw-pt-2xl)] print:pt-[var(--lf-tw-pt-print)]',
    variable: '--lf-tw-pt'
  },
  pr: {
    classes:
      'pr-[var(--lf-tw-pr)] sm:pr-[var(--lf-tw-pr-sm)] md:pr-[var(--lf-tw-pr-md)] lg:pr-[var(--lf-tw-pr-lg)] xl:pr-[var(--lf-tw-pr-xl)] 2xl:pr-[var(--lf-tw-pr-2xl)] print:pr-[var(--lf-tw-pr-print)]',
    variable: '--lf-tw-pr'
  },
  pb: {
    classes:
      'pb-[var(--lf-tw-pb)] sm:pb-[var(--lf-tw-pb-sm)] md:pb-[var(--lf-tw-pb-md)] lg:pb-[var(--lf-tw-pb-lg)] xl:pb-[var(--lf-tw-pb-xl)] 2xl:pb-[var(--lf-tw-pb-2xl)] print:pb-[var(--lf-tw-pb-print)]',
    variable: '--lf-tw-pb'
  },
  pl: {
    classes:
      'pl-[var(--lf-tw-pl)] sm:pl-[var(--lf-tw-pl-sm)] md:pl-[var(--lf-tw-pl-md)] lg:pl-[var(--lf-tw-pl-lg)] xl:pl-[var(--lf-tw-pl-xl)] 2xl:pl-[var(--lf-tw-pl-2xl)] print:pl-[var(--lf-tw-pl-print)]',
    variable: '--lf-tw-pl'
  },
  m: {
    classes:
      'm-[var(--lf-tw-m)] sm:m-[var(--lf-tw-m-sm)] md:m-[var(--lf-tw-m-md)] lg:m-[var(--lf-tw-m-lg)] xl:m-[var(--lf-tw-m-xl)] 2xl:m-[var(--lf-tw-m-2xl)] print:m-[var(--lf-tw-m-print)]',
    variable: '--lf-tw-m'
  },
  mx: {
    classes:
      'mx-[var(--lf-tw-mx)] sm:mx-[var(--lf-tw-mx-sm)] md:mx-[var(--lf-tw-mx-md)] lg:mx-[var(--lf-tw-mx-lg)] xl:mx-[var(--lf-tw-mx-xl)] 2xl:mx-[var(--lf-tw-mx-2xl)] print:mx-[var(--lf-tw-mx-print)]',
    variable: '--lf-tw-mx'
  },
  my: {
    classes:
      'my-[var(--lf-tw-my)] sm:my-[var(--lf-tw-my-sm)] md:my-[var(--lf-tw-my-md)] lg:my-[var(--lf-tw-my-lg)] xl:my-[var(--lf-tw-my-xl)] 2xl:my-[var(--lf-tw-my-2xl)] print:my-[var(--lf-tw-my-print)]',
    variable: '--lf-tw-my'
  },
  mt: {
    classes:
      'mt-[var(--lf-tw-mt)] sm:mt-[var(--lf-tw-mt-sm)] md:mt-[var(--lf-tw-mt-md)] lg:mt-[var(--lf-tw-mt-lg)] xl:mt-[var(--lf-tw-mt-xl)] 2xl:mt-[var(--lf-tw-mt-2xl)] print:mt-[var(--lf-tw-mt-print)]',
    variable: '--lf-tw-mt'
  },
  mr: {
    classes:
      'mr-[var(--lf-tw-mr)] sm:mr-[var(--lf-tw-mr-sm)] md:mr-[var(--lf-tw-mr-md)] lg:mr-[var(--lf-tw-mr-lg)] xl:mr-[var(--lf-tw-mr-xl)] 2xl:mr-[var(--lf-tw-mr-2xl)] print:mr-[var(--lf-tw-mr-print)]',
    variable: '--lf-tw-mr'
  },
  mb: {
    classes:
      'mb-[var(--lf-tw-mb)] sm:mb-[var(--lf-tw-mb-sm)] md:mb-[var(--lf-tw-mb-md)] lg:mb-[var(--lf-tw-mb-lg)] xl:mb-[var(--lf-tw-mb-xl)] 2xl:mb-[var(--lf-tw-mb-2xl)] print:mb-[var(--lf-tw-mb-print)]',
    variable: '--lf-tw-mb'
  },
  ml: {
    classes:
      'ml-[var(--lf-tw-ml)] sm:ml-[var(--lf-tw-ml-sm)] md:ml-[var(--lf-tw-ml-md)] lg:ml-[var(--lf-tw-ml-lg)] xl:ml-[var(--lf-tw-ml-xl)] 2xl:ml-[var(--lf-tw-ml-2xl)] print:ml-[var(--lf-tw-ml-print)]',
    variable: '--lf-tw-ml'
  },
  r: {
    classes:
      'rounded-[var(--lf-tw-r)] sm:rounded-[var(--lf-tw-r-sm)] md:rounded-[var(--lf-tw-r-md)] lg:rounded-[var(--lf-tw-r-lg)] xl:rounded-[var(--lf-tw-r-xl)] 2xl:rounded-[var(--lf-tw-r-2xl)] print:rounded-[var(--lf-tw-r-print)]',
    variable: '--lf-tw-r'
  },
  rtl: {
    classes:
      'rounded-tl-[var(--lf-tw-rtl)] sm:rounded-tl-[var(--lf-tw-rtl-sm)] md:rounded-tl-[var(--lf-tw-rtl-md)] lg:rounded-tl-[var(--lf-tw-rtl-lg)] xl:rounded-tl-[var(--lf-tw-rtl-xl)] 2xl:rounded-tl-[var(--lf-tw-rtl-2xl)] print:rounded-tl-[var(--lf-tw-rtl-print)]',
    variable: '--lf-tw-rtl'
  },
  rtr: {
    classes:
      'rounded-tr-[var(--lf-tw-rtr)] sm:rounded-tr-[var(--lf-tw-rtr-sm)] md:rounded-tr-[var(--lf-tw-rtr-md)] lg:rounded-tr-[var(--lf-tw-rtr-lg)] xl:rounded-tr-[var(--lf-tw-rtr-xl)] 2xl:rounded-tr-[var(--lf-tw-rtr-2xl)] print:rounded-tr-[var(--lf-tw-rtr-print)]',
    variable: '--lf-tw-rtr'
  },
  rbl: {
    classes:
      'rounded-bl-[var(--lf-tw-rbl)] sm:rounded-bl-[var(--lf-tw-rbl-sm)] md:rounded-bl-[var(--lf-tw-rbl-md)] lg:rounded-bl-[var(--lf-tw-rbl-lg)] xl:rounded-bl-[var(--lf-tw-rbl-xl)] 2xl:rounded-bl-[var(--lf-tw-rbl-2xl)] print:rounded-bl-[var(--lf-tw-rbl-print)]',
    variable: '--lf-tw-rbl'
  },
  rbr: {
    classes:
      'rounded-br-[var(--lf-tw-rbr)] sm:rounded-br-[var(--lf-tw-rbr-sm)] md:rounded-br-[var(--lf-tw-rbr-md)] lg:rounded-br-[var(--lf-tw-rbr-lg)] xl:rounded-br-[var(--lf-tw-rbr-xl)] 2xl:rounded-br-[var(--lf-tw-rbr-2xl)] print:rounded-br-[var(--lf-tw-rbr-print)]',
    variable: '--lf-tw-rbr'
  },
  width: {
    classes:
      'w-[var(--lf-w)] sm:w-[var(--lf-w-sm)] md:w-[var(--lf-w-md)] lg:w-[var(--lf-w-lg)] xl:w-[var(--lf-w-xl)] 2xl:w-[var(--lf-w-2xl)] print:w-[var(--lf-w-print)]',
    variable: '--lf-w'
  },
  minWidth: {
    classes:
      'min-w-[var(--lf-min-w)] sm:min-w-[var(--lf-min-w-sm)] md:min-w-[var(--lf-min-w-md)] lg:min-w-[var(--lf-min-w-lg)] xl:min-w-[var(--lf-min-w-xl)] 2xl:min-w-[var(--lf-min-w-2xl)] print:min-w-[var(--lf-min-w-print)]',
    variable: '--lf-min-w'
  },
  maxWidth: {
    classes:
      'max-w-[var(--lf-max-w)] sm:max-w-[var(--lf-max-w-sm)] md:max-w-[var(--lf-max-w-md)] lg:max-w-[var(--lf-max-w-lg)] xl:max-w-[var(--lf-max-w-xl)] 2xl:max-w-[var(--lf-max-w-2xl)] print:max-w-[var(--lf-max-w-print)]',
    variable: '--lf-max-w'
  },
  height: {
    classes:
      'h-[var(--lf-h)] sm:h-[var(--lf-h-sm)] md:h-[var(--lf-h-md)] lg:h-[var(--lf-h-lg)] xl:h-[var(--lf-h-xl)] 2xl:h-[var(--lf-h-2xl)] print:h-[var(--lf-h-print)]',
    variable: '--lf-h'
  },
  minHeight: {
    classes:
      'min-h-[var(--lf-min-h)] sm:min-h-[var(--lf-min-h-sm)] md:min-h-[var(--lf-min-h-md)] lg:min-h-[var(--lf-min-h-lg)] xl:min-h-[var(--lf-min-h-xl)] 2xl:min-h-[var(--lf-min-h-2xl)] print:min-h-[var(--lf-min-h-print)]',
    variable: '--lf-min-h'
  },
  maxHeight: {
    classes:
      'max-h-[var(--lf-max-h)] sm:max-h-[var(--lf-max-h-sm)] md:max-h-[var(--lf-max-h-md)] lg:max-h-[var(--lf-max-h-lg)] xl:max-h-[var(--lf-max-h-xl)] 2xl:max-h-[var(--lf-max-h-2xl)] print:max-h-[var(--lf-max-h-print)]',
    variable: '--lf-max-h'
  },
  aspectRatio: {
    classes:
      'aspect-[var(--lf-ar)] sm:aspect-[var(--lf-ar-sm)] md:aspect-[var(--lf-ar-md)] lg:aspect-[var(--lf-ar-lg)] xl:aspect-[var(--lf-ar-xl)] 2xl:aspect-[var(--lf-ar-2xl)] print:aspect-[var(--lf-ar-print)]',
    variable: '--lf-ar'
  },
  zIndex: {
    classes:
      'z-[var(--lf-zi)] sm:z-[var(--lf-zi-sm)] md:z-[var(--lf-zi-md)] lg:z-[var(--lf-zi-lg)] xl:z-[var(--lf-zi-xl)] 2xl:z-[var(--lf-zi-2xl)] print:z-[var(--lf-zi-print)]',
    variable: '--lf-zi'
  },
  inset: {
    classes:
      'inset-[var(--lf-inset)] sm:inset-[var(--lf-inset-sm)] md:inset-[var(--lf-inset-md)] lg:inset-[var(--lf-inset-lg)] xl:inset-[var(--lf-inset-xl)] 2xl:inset-[var(--lf-inset-2xl)] print:inset-[var(--lf-inset-print)]',
    variable: '--lf-inset'
  },
  top: {
    classes:
      'top-[var(--lf-t)] sm:top-[var(--lf-t-sm)] md:top-[var(--lf-t-md)] lg:top-[var(--lf-t-lg)] xl:top-[var(--lf-t-xl)] 2xl:top-[var(--lf-t-2xl)] print:top-[var(--lf-t-print)]',
    variable: '--lf-t'
  },
  right: {
    classes:
      'right-[var(--lf-r)] sm:right-[var(--lf-r-sm)] md:right-[var(--lf-r-md)] lg:right-[var(--lf-r-lg)] xl:right-[var(--lf-r-xl)] 2xl:right-[var(--lf-r-2xl)] print:right-[var(--lf-r-print)]',
    variable: '--lf-r'
  },
  bottom: {
    classes:
      'bottom-[var(--lf-b)] sm:bottom-[var(--lf-b-sm)] md:bottom-[var(--lf-b-md)] lg:bottom-[var(--lf-b-lg)] xl:bottom-[var(--lf-b-xl)] 2xl:bottom-[var(--lf-b-2xl)] print:bottom-[var(--lf-b-print)]',
    variable: '--lf-b'
  },
  left: {
    classes:
      'left-[var(--lf-l)] sm:left-[var(--lf-l-sm)] md:left-[var(--lf-l-md)] lg:left-[var(--lf-l-lg)] xl:left-[var(--lf-l-xl)] 2xl:left-[var(--lf-l-2xl)] print:left-[var(--lf-l-print)]',
    variable: '--lf-l'
  },
  flex: {
    classes:
      'flex-[var(--lf-fl)] sm:flex-[var(--lf-fl-sm)] md:flex-[var(--lf-fl-md)] lg:flex-[var(--lf-fl-lg)] xl:flex-[var(--lf-fl-xl)] 2xl:flex-[var(--lf-fl-2xl)] print:flex-[var(--lf-fl-print)]',
    variable: '--lf-fl'
  },
  flexBasis: {
    classes:
      'basis-[var(--lf-fb)] sm:basis-[var(--lf-fb-sm)] md:basis-[var(--lf-fb-md)] lg:basis-[var(--lf-fb-lg)] xl:basis-[var(--lf-fb-xl)] 2xl:basis-[var(--lf-fb-2xl)] print:basis-[var(--lf-fb-print)]',
    variable: '--lf-fb'
  },
  flexGrow: {
    classes:
      'grow-[var(--lf-fg)] sm:grow-[var(--lf-fg-sm)] md:grow-[var(--lf-fg-md)] lg:grow-[var(--lf-fg-lg)] xl:grow-[var(--lf-fg-xl)] 2xl:grow-[var(--lf-fg-2xl)] print:grow-[var(--lf-fg-print)]',
    variable: '--lf-fg'
  },
  flexShrink: {
    classes:
      'shrink-[var(--lf-fs)] sm:shrink-[var(--lf-fs-sm)] md:shrink-[var(--lf-fs-md)] lg:shrink-[var(--lf-fs-lg)] xl:shrink-[var(--lf-fs-xl)] 2xl:shrink-[var(--lf-fs-2xl)] print:shrink-[var(--lf-fs-print)]',
    variable: '--lf-fs'
  },
  gridArea: {
    classes:
      '[grid-area:var(--lf-ga)] sm:[grid-area:var(--lf-ga-sm)] md:[grid-area:var(--lf-ga-md)] lg:[grid-area:var(--lf-ga-lg)] xl:[grid-area:var(--lf-ga-xl)] 2xl:[grid-area:var(--lf-ga-2xl)] print:[grid-area:var(--lf-ga-print)]',
    variable: '--lf-ga'
  },
  gridColumnSpan: {
    classes:
      '[grid-column:var(--lf-gcsp)] sm:[grid-column:var(--lf-gcsp-sm)] md:[grid-column:var(--lf-gcsp-md)] lg:[grid-column:var(--lf-gcsp-lg)] xl:[grid-column:var(--lf-gcsp-xl)] 2xl:[grid-column:var(--lf-gcsp-2xl)] print:[grid-column:var(--lf-gcsp-print)]',
    variable: '--lf-gcsp'
  },
  gridRowSpan: {
    classes:
      '[grid-row:var(--lf-grsp)] sm:[grid-row:var(--lf-grsp-sm)] md:[grid-row:var(--lf-grsp-md)] lg:[grid-row:var(--lf-grsp-lg)] xl:[grid-row:var(--lf-grsp-xl)] 2xl:[grid-row:var(--lf-grsp-2xl)] print:[grid-row:var(--lf-grsp-print)]',
    variable: '--lf-grsp'
  },
  gap: {
    classes:
      'gap-[var(--lf-tw-gap)] sm:gap-[var(--lf-tw-gap-sm)] md:gap-[var(--lf-tw-gap-md)] lg:gap-[var(--lf-tw-gap-lg)] xl:gap-[var(--lf-tw-gap-xl)] 2xl:gap-[var(--lf-tw-gap-2xl)] print:gap-[var(--lf-tw-gap-print)]',
    variable: '--lf-tw-gap'
  },
  gapX: {
    classes:
      'gap-x-[var(--lf-tw-gap-x)] sm:gap-x-[var(--lf-tw-gap-x-sm)] md:gap-x-[var(--lf-tw-gap-x-md)] lg:gap-x-[var(--lf-tw-gap-x-lg)] xl:gap-x-[var(--lf-tw-gap-x-xl)] 2xl:gap-x-[var(--lf-tw-gap-x-2xl)] print:gap-x-[var(--lf-tw-gap-x-print)]',
    variable: '--lf-tw-gap-x'
  },
  gapY: {
    classes:
      'gap-y-[var(--lf-tw-gap-y)] sm:gap-y-[var(--lf-tw-gap-y-sm)] md:gap-y-[var(--lf-tw-gap-y-md)] lg:gap-y-[var(--lf-tw-gap-y-lg)] xl:gap-y-[var(--lf-tw-gap-y-xl)] 2xl:gap-y-[var(--lf-tw-gap-y-2xl)] print:gap-y-[var(--lf-tw-gap-y-print)]',
    variable: '--lf-tw-gap-y'
  }
}

const colorDefinitions: Record<string, VariableDefinition> = {
  bg: {
    classes:
      'bg-[var(--lf-bg)] dark:bg-[var(--lf-bg-dark)] hover:bg-[var(--lf-bg-hover)] dark:hover:bg-[var(--lf-bg-dark-hover)] [.has-bg-image_&]:bg-[var(--lf-bg-has-bg-image)] dark:[.has-bg-image_&]:bg-[var(--lf-bg-dark-has-bg-image)] [.has-bg-image_&]:hover:bg-[var(--lf-bg-has-bg-image-hover)] dark:[.has-bg-image_&]:hover:bg-[var(--lf-bg-has-bg-image-dark-hover)] print:bg-[var(--lf-bg-print)]',
    variable: '--lf-bg'
  },
  text: {
    classes:
      'text-[var(--lf-color)] dark:text-[var(--lf-color-dark)] hover:text-[var(--lf-color-hover)] dark:hover:text-[var(--lf-color-dark-hover)] [.has-bg-image_&]:text-[var(--lf-color-has-bg-image)] dark:[.has-bg-image_&]:text-[var(--lf-color-dark-has-bg-image)] [.has-bg-image_&]:hover:text-[var(--lf-color-has-bg-image-hover)] dark:[.has-bg-image_&]:hover:text-[var(--lf-color-has-bg-image-dark-hover)] print:text-[var(--lf-color-print)]',
    variable: '--lf-color'
  },
  border: {
    classes:
      'border-[var(--lf-border-color)] dark:border-[var(--lf-border-color-dark)] hover:border-[var(--lf-border-color-hover)] dark:hover:border-[var(--lf-border-color-dark-hover)] [.has-bg-image_&]:border-[var(--lf-border-color-has-bg-image)] dark:[.has-bg-image_&]:border-[var(--lf-border-color-dark-has-bg-image)] [.has-bg-image_&]:hover:border-[var(--lf-border-color-has-bg-image-hover)] dark:[.has-bg-image_&]:hover:border-[var(--lf-border-color-has-bg-image-dark-hover)] print:border-[var(--lf-border-color-print)]',
    variable: '--lf-border-color'
  }
}

function valueEntries(
  value: unknown,
  indexes: Record<string, number>
): [number, unknown][] {
  if (value === undefined) return []

  if (
    typeof value !== 'object' ||
    value === null ||
    isColorWithOpacity(value)
  ) {
    return [[0, value]]
  }

  return Object.entries(value).flatMap(([condition, entry]) => {
    const index = indexes[condition]

    return entry === undefined || index === undefined ? [] : [[index, entry]]
  })
}

function staticClasses(
  value: unknown,
  classes: Record<string, string>
): string[] {
  return valueEntries(value, responsiveIndexes).flatMap(([index, entry]) => {
    const className = classes[String(entry)]?.split(' ')[index]

    return className ? [className] : []
  })
}

function variableClasses(
  value: unknown,
  definition: VariableDefinition,
  values?: Record<string, string>,
  resolve: (entry: unknown) => string = String
): { classes: string[]; style: CSSProperties } {
  const candidates = definition.classes.split(' ')
  const classes: string[] = []
  const style: Record<string, string> = {}

  for (const [index, entry] of valueEntries(value, responsiveIndexes)) {
    classes.push(candidates[index])
    style[`${definition.variable}${responsiveSuffixes[index]}`] =
      values?.[String(entry)] ?? resolve(entry)
  }

  return { classes, style: style as CSSProperties }
}

function colorClasses(
  value: unknown,
  definition: VariableDefinition
): { classes: string[]; style: CSSProperties } {
  const candidates = definition.classes.split(' ')
  const classes: string[] = []
  const style: Record<string, string> = {}

  for (const [index, entry] of valueEntries(value, themeIndexes)) {
    classes.push(candidates[index])
    style[`${definition.variable}${themeSuffixes[index]}`] = isColorWithOpacity(
      entry
    )
      ? entry.toString()
      : COLORS[String(entry) as keyof typeof COLORS]
  }

  return { classes, style: style as CSSProperties }
}

export function tailwindStyles(
  props: Record<string, unknown>,
  style?: CSSProperties
): { className: string; style: CSSProperties } {
  const classes = [
    'box-border',
    ...staticClasses(props.display, displayClasses),
    ...staticClasses(props.position, positionClasses),
    ...staticClasses(props.overflow, overflowClasses),
    ...staticClasses(props.overflowX, overflowXClasses),
    ...staticClasses(props.overflowY, overflowYClasses)
  ]
  const resolvedStyle: CSSProperties = { ...style }

  for (const property of [
    'p',
    'px',
    'py',
    'pt',
    'pr',
    'pb',
    'pl',
    'm',
    'mx',
    'my',
    'mt',
    'mr',
    'mb',
    'ml',
    'gap',
    'gapX',
    'gapY'
  ]) {
    const resolved = variableClasses(
      props[property],
      variableDefinitions[property],
      spacingValues
    )
    classes.push(...resolved.classes)
    Object.assign(resolvedStyle, resolved.style)
  }

  for (const property of ['r', 'rtl', 'rtr', 'rbl', 'rbr']) {
    const resolved = variableClasses(
      props[property],
      variableDefinitions[property],
      radiusValues
    )
    classes.push(...resolved.classes)
    Object.assign(resolvedStyle, resolved.style)
  }

  for (const property of [
    'width',
    'minWidth',
    'maxWidth',
    'height',
    'minHeight',
    'maxHeight',
    'aspectRatio',
    'zIndex',
    'inset',
    'top',
    'right',
    'bottom',
    'left',
    'flex',
    'flexBasis',
    'flexGrow',
    'flexShrink',
    'gridArea'
  ]) {
    const resolved = variableClasses(
      props[property],
      variableDefinitions[property]
    )
    classes.push(...resolved.classes)
    Object.assign(resolvedStyle, resolved.style)
  }

  for (const property of ['gridColumnSpan', 'gridRowSpan']) {
    const resolved = variableClasses(
      props[property],
      variableDefinitions[property],
      undefined,
      entry => normalizeGridSpan(entry as string | number)
    )
    classes.push(...resolved.classes)
    Object.assign(resolvedStyle, resolved.style)
  }

  for (const [property, definition] of [
    ['bg', colorDefinitions.bg],
    ['color', colorDefinitions.text],
    ['borderColor', colorDefinitions.border]
  ] as const) {
    const resolved = colorClasses(props[property], definition)
    classes.push(...resolved.classes)
    Object.assign(resolvedStyle, resolved.style)
  }

  classes.push(
    ...staticClasses(props.direction, directionClasses),
    ...staticClasses(props.alignItems, alignClasses),
    ...staticClasses(props.justify, justifyClasses),
    ...staticClasses(props.wrap, wrapClasses),
    ...staticClasses(props.borderStyle, borderStyleClasses),
    ...staticClasses(props.borderWidth, borderWidthClasses),
    ...staticClasses(props.decoration, decorationClasses),
    ...staticClasses(props.transform, transformClasses)
  )

  return { className: classes.join(' '), style: resolvedStyle }
}
