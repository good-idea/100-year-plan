import * as React from 'react'
import ReactPlayer from 'react-player'
import { Button, Video } from './types'

const { useEffect, useState, useRef } = React

interface BackgroundVideoProps {
  video?: Video
  setIsPlaying: (boolean) => void
}

export const BackgroundVideo = ({
  video,
  setIsPlaying,
}: BackgroundVideoProps) => {
  if (!video) return null
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(true)
  }, [])

  const videoEl = useRef(null)
  const url = `https://stream.mux.com/${video.asset.playbackId}.m3u8`

  const handleError = (err) => {
    console.log(err)
  }

  const handleOnStart = () => {
    setIsPlaying(true)
  }

  return (
    <ReactPlayer
      url={url}
      width="100%"
      height="100%"
      className="main-video"
      playing={playing}
      onStart={handleOnStart}
      onError={handleError}
      loop
    />
  )
}
