import type { InferOutput } from '@lifeforge/api'
import { Card, Flex } from '@lifeforge/ui'

import { forgeAPI } from '@/shared/api'

import ActionButton from './components/action-button'
import ActionMenu from './components/action-menu'
import MovieMetadata from './components/movie-metadata'
import MoviePoster from './components/movie-poster'
import MovieItemProvider from './contexts/movie-item-context'

function MovieItem({
  data,
  type
}: {
  data: InferOutput<typeof forgeAPI.entries.list>['entries'][number]
  type: 'grid' | 'list'
}) {
  return (
    <MovieItemProvider data={data} type={type}>
      <Card
        as="li"
        direction={type === 'grid' ? 'column' : { base: 'column', md: 'row' }}
        gap="md"
      >
        <MoviePoster />
        <Flex direction="column" flex="1" width="100%">
          <MovieMetadata />
          <ActionButton />
        </Flex>
        <ActionMenu />
      </Card>
    </MovieItemProvider>
  )
}

export default MovieItem
