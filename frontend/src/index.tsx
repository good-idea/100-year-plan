/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { App } from './App'

if (window.location.hostname !== 'localhost') {
  Sentry.init({
    dsn: 'https://53f208dd79ce4456a3c050a85796acd8@sentry.io/1768718',
  })
}

const root = document.getElementById('root')
// @ts-ignore
const siteId = root.getAttribute('data-siteId')

const render = (Component: React.ComponentType) => {
  // @ts-ignore
  ReactDOM.render(<Component siteId={siteId} />, document.getElementById(
    'root',
  ) as HTMLElement)
}

// @ts-ignore
render(App)

if ((module as any).hot) {
  ;(module as any).hot.accept('./App.tsx', () => {
    // eslint-disable-next-line
    const NewApp = require('./App.tsx')
    render(NewApp.App)
  })
}
