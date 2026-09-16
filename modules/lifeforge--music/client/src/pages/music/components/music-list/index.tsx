import { WithQuery } from '@lifeforge/ui'

import { useMusicContext } from '../../providers/music-provider'

import MusicListItem from './components/music-list-item'

function MusicList({ searchQuery }: { searchQuery: string }) {
  const { musicsQuery } = useMusicContext()

  return (
    <WithQuery query={musicsQuery}>
      {musics => (
        <ul className="space-y-3 pb-12">
          {musics
            .filter(music =>
              music.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(music => (
              <MusicListItem key={music.id} music={music} />
            ))}
        </ul>
      )}
    </WithQuery>
  )
}

export default MusicList
