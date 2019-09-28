import * as React from 'react'
import './App.css'
import { useSiteData } from './hooks/sanity'
import { ErrorDisplay } from './ErrorDisplay'
import { BackgroundVideo } from './BackgroundVideo'
import { Button } from './Button'

const { useState } = React

interface AppProps {
  siteId?: string
}

export const App = ({ siteId }: AppProps) => {
  if (!siteId) throw new Error('No site was provided')
  const { siteData, loading, errorMessage } = useSiteData(siteId)
  const [isPlaying, setIsPlaying] = useState(false)
  if (loading) return null
  if (errorMessage)
    return (
      <main>
        <ErrorDisplay errorMessage={errorMessage} />
      </main>
    )
  if (!siteData) {
    return (
      <main>
        <ErrorDisplay errorMessage="There was a problem" />
      </main>
    )
  }
  const { video, buttons } = siteData

  return (
    <main>
      {video ? (
        <BackgroundVideo video={video.video} setIsPlaying={setIsPlaying} />
      ) : null}
      {buttons && buttons.length
        ? buttons.map((button, index) => <Button key={index} button={button} />)
        : null}
    </main>
  )
}
