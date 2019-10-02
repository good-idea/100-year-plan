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

export const BackgroundVideo = ({
  video,
  actions,
  appState,
  playButtonImage,
}: BackgroundVideoProps) => {
  if (!video || !video.asset) return null
  const [playing, setPlaying] = useState(false)

  const url = `https://stream.mux.com/${video.asset.playbackId}.m3u8`

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
  const onProgress = (progress: PlayProgress) =>
    updateTime(progress.playedSeconds)

  const handleError = (err, data) => {
    console.log(err)
    console.log(err.message)
    console.log(data)
    // if (data && data)
    setPlaying(false)
  }

  return (
    <div className="video-wrapper">
      <button onClick={play} className="play-button">
        <img src={playButtonImage.asset.url} alt="Play" />
      </button>
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        className="main-video"
        playing={playing}
        onReady={onReady}
        onStart={onStart}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        onError={handleError}
        progressInterval={200}
        config={{
          file: {
            hlsOptions: {
              nudgeOffset: 0.3,
              nudgeMaxRetry: 10,
            },
          },
        }}
        volume={window.location.hostname === 'localhost' ? 0 : 1}
        loop
      />
    </div>
  )
}
