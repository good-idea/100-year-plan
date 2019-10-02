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
  console.log(appState)
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
  const { video, buttons } = siteData

  const fill = siteData.domain !== '100yearplan.world'

  const wrapperClass = fill
    ? 'main-wrapper'
    : 'main-wrapper main-wrapper--padding'

  return (
    <main>
      <div className={wrapperClass}>
        {video ? (
          <BackgroundVideo video={video.video} actions={actions} />
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
