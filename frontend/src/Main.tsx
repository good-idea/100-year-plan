import * as React from 'react'
import './App.css'
import { useMainQuery } from './hooks/sanity'
import { ErrorDisplay } from './ErrorDisplay'
import { BackgroundVideo } from './BackgroundVideo'
import { Button } from './Button'
import { useAppState, AppState } from './AppState'

const { useState, useRef, useEffect } = React

interface MainProps {
  siteId?: string
}

export const Main = ({ siteId }: MainProps) => {
  if (!siteId) throw new Error('No site was provided')
  const { data, loading, errorMessage } = useMainQuery({ siteId })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  const { appState, actions } = useAppState()

  const scrollable =
    data && data.siteData
      ? data.siteData.domain === '100yearplan.world'
      : undefined

  /* Center the scroll position on scrollable videos */
  useEffect(() => {
    if (!scrollable || !wrapperRef.current || !mainRef.current) return
    const wrapper = wrapperRef.current
    const main = mainRef.current
    const bounds = wrapper.getBoundingClientRect()
    main.scrollLeft = bounds.width / 2 - window.innerWidth / 2
    main.scrollTop = bounds.height / 2 - window.innerHeight / 2
  }, [scrollable, wrapperRef])

  if (loading) return null
  if (errorMessage)
    return (
      <main>
        <ErrorDisplay errorMessage={errorMessage} />
      </main>
    )
  if (!data) {
    return (
      <main>
        <ErrorDisplay errorMessage="There was a problem" />
      </main>
    )
  }
  const { domains, siteData } = data
  const { video, buttons, playButtonImage } = siteData
  const { initialized, isPlaying } = appState

  const mainClass = [initialized ? 'ready' : null, isPlaying ? 'playing' : null]
    .filter(Boolean)
    .join(' ')

  const wrapperClass = [
    'main-wrapper',
    scrollable ? 'main-wrapper--padding' : 'main-wrapper--cover',
  ]
    .filter(Boolean)
    .join(' ')

  const otherDomains = domains.filter((d) => d !== siteData.domain)

  return (
    <main className={mainClass} ref={mainRef}>
      <div className={wrapperClass} ref={wrapperRef}>
        {video ? (
          <BackgroundVideo
            playButtonImage={playButtonImage}
            video={video.video}
            appState={appState}
            actions={actions}
          />
        ) : null}
        <div className="buttons">
          {buttons && buttons.length
            ? buttons.map((button, index) => (
                <Button key={index} button={button} domains={otherDomains} />
              ))
            : null}
        </div>
      </div>
    </main>
  )
}
