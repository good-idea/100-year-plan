import * as React from 'react'
import ReactPlayer from 'react-player/lib/players/FilePlayer'
import { Button, Video, SanityImage } from './types'
import { AppState, Actions } from './AppState'

const { useEffect, useState, useRef } = React

interface BackgroundVideoProps {
  video?: Video
  actions: Actions
  appState: AppState
  playButtonImage: SanityImage
}

interface PlayProgress {
  played: number
  playedSeconds: number
  loaded: number
  loadedSeconds: number
}

interface ReactPlayerRef {
  seekTo: (num: number) => void
  getDuration: () => number
  getInternalPlayer: () => HTMLVideoElement
}

export const BackgroundVideo = ({
  video,
  actions,
  appState,
  playButtonImage,
}: BackgroundVideoProps) => {
  if (!video || !video.asset) return null
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const playerRef = useRef<ReactPlayerRef>(null)

  const url = `https://stream.mux.com/${video.asset.playbackId}.m3u8`
  const backgroundImage = `url(https://image.mux.com/${video.asset.playbackId}/thumbnail.png?time=0)`

  /**
   * State
   */

  const play = async () => {
    if (playerRef && playerRef.current) {
      try {
        await playerRef.current.getInternalPlayer().play()
      } catch (err) {
        console.log('cannot autoplay')
      }
    } else {
      console.log('no player')
    }
  }

  /**
   * Effects
   */

  useEffect(() => {
    play()
  }, [])

  /**
   * Handlers
   */

  const { initialize, setBuffering, setPlayState, updateTime } = actions
  const onReady = () => initialize()
  const onPlay = () => {
    // do nothing, wait for buffering & progress to set as playing
  }
  const onBuffer = () => setBuffering(true)
  const onBufferEnd = () => setBuffering(false)
  const onPause = () => setPlayState(false)

  const onProgress = async (progress: PlayProgress) => {
    if (appState.isPlaying === false && progress.playedSeconds > 0) {
      setPlayState(true)
    }
    updateTime(progress.playedSeconds)
  }

  const handleError = (err, data) => {
    console.log(err)
    console.log(err.message)
    console.log(data)
    // if (data && data)
    setPlaying(false)
  }

  const playButtonStyles = {
    maxWidth: playButtonImage.maxWidth,
  }

  const backgroundStyles = {
    backgroundImage,
  }

  const buttonClass = [
    'play-button',
    appState.isBuffering ? 'buffering' : null,
    appState.isPlaying ? 'playing' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="video-wrapper">
      <button onClick={play} className={buttonClass}>
        <img
          src={playButtonImage.asset.url}
          style={playButtonStyles}
          alt="Play"
        />
      </button>
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        className="main-video"
        style={backgroundStyles}
        loop={true}
        controls={false}
        playing={playing}
        onReady={onReady}
        onBuffer={onBuffer}
        onBufferEnd={onBufferEnd}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        onError={handleError}
        progressInterval={200}
        playsinline
        config={{
          file: {
            hlsOptions: {
              nudgeOffset: 0.1,
              nudgeMaxRetry: 30,
            },
          },
        }}
        volume={window.location.hostname === 'localhost' ? 0 : 1}
      />
    </div>
  )
}
