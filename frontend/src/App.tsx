import * as React from 'react'
import './App.css'
import { useSiteData } from './hooks/sanity'
import { ErrorDisplay } from './ErrorDisplay'
import { BackgroundVideo } from './BackgroundVideo'
import { Button } from './Button'
import { pickRandom } from './utils'
import { useAppState, AppState } from './AppState'

const { useState } = React

interface AppProps {
  siteId?: string
}

export const App = ({ siteId }: AppProps) => {
  if (!siteId) throw new Error('No site was provided')
  const { data, loading, errorMessage } = useSiteData(siteId)

  const { appState, actions } = useAppState()
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

  const fill = siteData.domain !== '100yearplan.world'

  const mainClass = [initialized ? 'ready' : null, isPlaying ? 'playing' : null]
    .filter(Boolean)
    .join(' ')

  const wrapperClass = [
    'main-wrapper',
    fill ? 'main-wrapper main-wrapper--padding' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <main className={mainClass}>
      <div className={wrapperClass}>
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
                <Button
                  key={index}
                  button={button}
                  randomDomain={
                    button.linkType === 'random' ? pickRandom(domains) : null
                  }
                />
              ))
            : null}
        </div>
      </div>
    </main>
  )
}
