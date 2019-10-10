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

  const play = () => setPlaying(true)

  /**
   * Effects
   */

  useEffect(() => {
    play()
  }, [])

  /**
   * Handlers
   */

  const { initialize, setPlayState, updateTime } = actions
  const onReady = initialize
  const onStart = () => setPlayState(true)
  const onPlay = () => setPlayState(true)
  const onPause = () => setPlayState(false)
  const onProgress = async (progress: PlayProgress) => {
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

  return (
    <div style={backgroundStyles} className="video-wrapper">
      <button onClick={play} className="play-button">
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
        loop={true}
        controls={false}
        playing={playing}
        onReady={onReady}
        onStart={onStart}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        onError={handleError}
        progressInterval={200}
        playsinline
        config={{
          file: {
            hlsOptions: {
              nudgeOffset: 0.3,
              nudgeMaxRetry: 10,
            },
          },
        }}
        volume={window.location.hostname === 'localhost' ? 0 : 1}
      />
    </div>
  )
}
