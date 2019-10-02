import * as React from 'react'
import ReactPlayer from 'react-player/lib/players/FilePlayer'
import { Button, Video } from './types'
import { Actions } from './AppState'

const { useEffect, useState, useRef } = React

interface BackgroundVideoProps {
  video?: Video
  actions: Actions
}

interface PlayProgress {
  played: number
  playedSeconds: number
  loaded: number
  loadedSeconds: number
}

export const BackgroundVideo = ({ video, actions }: BackgroundVideoProps) => {
  if (!video || !video.asset) return null
  const [playing, setPlaying] = useState(false)

  const url = `https://stream.mux.com/${video.asset.playbackId}.m3u8`

  /**
   * Effects
   */
  useEffect(() => {
    setPlaying(true)
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

  const handleError = (err) => {
    console.log(err)
    console.log(err.message)
  }

  return (
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
      volume={window.location.hostname === 'localhost' ? 0 : 1}
      loop
    />
  )
}
