import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it } from 'vitest'

import { Box, Flex } from '../src/components/primitives'
import { tailwindStyles } from '../src/components/primitives/tailwind'
import { colorWithOpacity } from '../src/system'

describe('primitives core Tailwind output', () => {
  it('C1 maps public values and responsive values to utility classes', () => {
    const output = tailwindStyles({
      alignItems: { base: 'center', md: 'end' },
      borderStyle: 'dashed',
      borderWidth: '2',
      decoration: 'underline',
      direction: { base: 'column', sm: 'row' },
      display: { base: 'none', sm: 'flex' },
      justify: 'between',
      maxHeight: { md: 'calc(100vh - 8px)' },
      overflow: { base: 'hidden', lg: 'auto' },
      p: 'md',
      position: 'absolute',
      width: 'calc(100% - 8px)',
      r: 'lg',
      transform: 'uppercase'
    })

    for (const className of [
      'items-center',
      'md:items-end',
      'border-dashed',
      'border-2',
      'decoration-underline',
      'flex-col',
      'sm:flex-row',
      'hidden',
      'sm:flex',
      'justify-between',
      'overflow-hidden',
      'lg:overflow-auto',
      'p-[var(--lf-tw-p)]',
      'absolute',
      'w-[var(--lf-w)]',
      'md:max-h-[var(--lf-max-h-md)]',
      'rounded-[var(--lf-tw-r)]',
      'uppercase'
    ]) {
      assert.ok(output.className.includes(className), className)
    }

    assert.equal(output.style['--lf-tw-p'], 'calc(var(--spacing) * 4)')
    assert.equal(output.style['--lf-w'], 'calc(100% - 8px)')
    assert.equal(output.style['--lf-max-h-md'], 'calc(100vh - 8px)')
  })

  it('C2 preserves conditional opacity colors in rendered output', () => {
    const output = tailwindStyles({
      bg: {
        base: colorWithOpacity('custom-500', '20%'),
        hasBgImage: 'bg-500',
        hasBgImageDarkHover: 'custom-500'
      }
    })

    assert.ok(output.className.includes('bg-[var(--lf-bg)]'))
    assert.ok(
      output.className.includes(
        '[.has-bg-image_&]:bg-[var(--lf-bg-has-bg-image)]'
      )
    )
    assert.ok(
      output.className.includes(
        'dark:[.has-bg-image_&]:hover:bg-[var(--lf-bg-has-bg-image-dark-hover)]'
      )
    )
    assert.equal(
      output.style['--lf-bg'],
      'color-mix(in srgb, var(--color-custom-500) 20%, transparent)'
    )
  })

  it('C3 renders Box classes on elements and composes asChild output', () => {
    const markup = renderToStaticMarkup(
      <Box
        asChild
        className="consumer-class"
        p="md"
        position="relative"
        style={{ width: '4rem' }}
      >
        <section>content</section>
      </Box>
    )

    assert.match(markup, /<section[^>]*class="[^"]*relative[^"]*p-\[/)
    assert.match(markup, /class="[^"]*consumer-class/)
    assert.match(markup, /style="[^"]*width:4rem/)
  })

  it('C4 renders Flex mapped classes including centered behavior', () => {
    const markup = renderToStaticMarkup(
      <Flex
        centered
        direction="column"
        gap="sm"
        justify="end"
        align="start"
        wrap="wrap"
      >
        child
      </Flex>
    )

    assert.match(markup, /class="[^"]*flex[^"]*"/)
    assert.match(markup, /class="[^"]*flex-col/)
    assert.match(markup, /class="[^"]*items-center/)
    assert.match(markup, /class="[^"]*justify-center/)
    assert.match(markup, /class="[^"]*gap-\[/)
    assert.match(markup, /class="[^"]*flex-wrap/)
  })
})
