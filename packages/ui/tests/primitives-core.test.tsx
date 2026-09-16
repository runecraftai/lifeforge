import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it } from 'vitest'

import { Box, Flex } from '../src/components/primitives'
import { colorWithOpacity } from '../src/system'
import { tailwindStyles } from '../src/components/primitives/tailwind'

describe('primitives core Tailwind output', () => {
  it('C1 maps public values and responsive values to utility classes', () => {
    const output = tailwindStyles({
      alignItems: { base: 'center', md: 'end' },
      borderStyle: 'dashed',
      borderWidth: '2',
      decoration: 'underline',
      direction: { base: 'column', sm: 'row' },
      justify: 'between',
      p: 'md',
      position: 'absolute',
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
      'justify-between',
      'p-[calc(var(--spacing) * 4)]',
      'absolute',
      'rounded-[var(--radius-lg)]',
      'uppercase'
    ]) {
      assert.ok(output.className.includes(className), className)
    }
  })

  it('C2 preserves opacity colors in rendered class and style output', () => {
    const output = tailwindStyles({
      bg: colorWithOpacity('custom-500', '20%')
    })

    assert.ok(output.className.includes('bg-[var(--lf-bg)]'))
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
      >
        child
      </Flex>
    )

    assert.match(markup, /class="[^"]*flex[^"]*"/)
    assert.match(markup, /class="[^"]*flex-col/)
    assert.match(markup, /class="[^"]*items-center/)
    assert.match(markup, /class="[^"]*justify-center/)
    assert.match(markup, /class="[^"]*gap-\[/)
  })
})
