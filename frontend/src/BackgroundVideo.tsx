import * as React from 'react'
import ReactPlayer from 'react-player/lib/players/FilePlayer'
import { Button as ButtonType, Video, SanityImage, SiteData } from './types'
import { AppState, Actions } from './AppState'
import { Button } from './Button'

const { useEffect, useState, useRef } = React

interface BackgroundVideoProps {
  video?: Video
  actions: Actions
  domains: string[]
  buttons?: ButtonType[]
  appState: AppState
  siteData: SiteData
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

const displayTime = (seconds: number): string => {
  const floored = Math.floor(seconds)
  const s = floored % 60
  const sString = s === 0 ? '00' : s < 10 ? `0${s}` : s
  const m = Math.floor(seconds / 60)
  const mString = m === 0 ? '00' : m < 10 ? `0${m}` : m
  return `${mString}:${sString}`
}

export const BackgroundVideo = ({
  video,
  actions,
  siteData,
  buttons,
  domains,
  appState,
  playButtonImage,
}: BackgroundVideoProps) => {
  if (!video || !video.asset) return null
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [time, setTime] = useState(0)
  const playerRef = useRef<ReactPlayerRef>(null)

  const url = `https://stream.mux.com/${video.asset.playbackId}.m3u8`
  const backgroundImage = `url(https://image.mux.com/${video.asset.playbackId}/thumbnail.png?time=0)`

  /**
   * State
   */

  const play = () => {
    if (playerRef && playerRef.current) {
      return playerRef.current.getInternalPlayer().play()
    }
  }

  /**
   * Effects
   */

  useEffect(() => {
    const autoPlay = async () => {
      try {
        await play()
      } catch (err) {
        console.log('could not autoplay')
      }
    }
    autoPlay()
  }, [])

  /**
   * Handlers
   */

  const {
    initialize,
    setBuffering,
    setPlayState,
    // updateTime,
    startByUserInput,
  } = actions
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
    setTime(progress.playedSeconds)
  }

  const handleClick = async () => {
    try {
      startByUserInput()
      await play()
    } catch (err) {
      console.log('could not play on click')
    }
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
    !appState.isPlaying && !appState.startedByUser ? 'ready' : null,
    appState.startedByUser && !appState.isPlaying ? 'loading' : null,
    appState.isPlaying ? 'playing' : null,
  ]
    .filter(Boolean)
    .join(' ')

  const otherDomains = domains.filter((d) => d !== siteData.domain)

  return (
    <>
      <div className="timeDisplay">{displayTime(time)}</div>
      <div className="buttons">
        {buttons && buttons.length
          ? buttons.map((button, index) => (
              <Button
                currentTime={time}
                key={index}
                button={button}
                domains={otherDomains}
              />
            ))
          : null}
      </div>
      <div className="video-wrapper">
        <button onClick={handleClick} className={buttonClass}>
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
    </>
  )
}
