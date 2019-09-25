import * as React from 'react'

interface AppProps {
  siteId?: string
}

export const App = ({ siteId }: AppProps) => {
  if (!siteId) throw new Error('No site was provided')
  return <div>{siteId}</div>
}
