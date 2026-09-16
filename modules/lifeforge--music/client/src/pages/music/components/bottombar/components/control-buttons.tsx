import clsx from 'clsx'

import { Button, toast } from '@lifeforge/ui'

import { useMusicContext } from '../../../providers/music-provider'

export default function ControlButtons({
  isWidget = false,
  isFull = false
}: {
  isWidget?: boolean
  isFull?: boolean
}) {
  const {
    currentMusic,
    isPlaying,
    isShuffle,
    isRepeat,
    setIsShuffle,
    setIsRepeat,
    togglePlay,
    nextMusic,
    lastMusic
  } = useMusicContext()

  if (currentMusic === null) {
    return <></>
  }

  const showExtendedControls = isFull || !isWidget
  const playIcon = isPlaying
    ? 'tabler:player-pause-filled'
    : 'tabler:player-play-filled'
  const playVariant = isPlaying ? 'plain' : 'primary'

  return (
    <div className={clsx('flex-center gap-2', !isWidget && 'xl:w-1/3')}>
      {showExtendedControls && (
        <Button
          icon="uil:shuffle"
          variant={isShuffle ? 'tertiary' : 'plain'}
          onClick={() => {
            setIsShuffle(!isShuffle)
            if (!isShuffle) setIsRepeat(false)
          }}
        />
      )}
      <Button icon="tabler:skip-back" variant="plain" onClick={lastMusic} />
      <Button
        icon={playIcon}
        variant={playVariant}
        onClick={() => {
          togglePlay(currentMusic).catch(err => {
            toast.error(`Failed to play music. Error: ${err}`)
          })
        }}
      />
      <Button icon="tabler:skip-forward" variant="plain" onClick={nextMusic} />
      {showExtendedControls && (
        <Button
          icon="uil:repeat"
          variant={isRepeat ? 'tertiary' : 'plain'}
          onClick={() => {
            setIsRepeat(!isRepeat)
            if (!isRepeat) setIsShuffle(false)
          }}
        />
      )}
    </div>
  )
}
