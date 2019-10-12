import * as React from 'react'
import './App.css'
import { BrowserRouter, Route } from 'react-router-dom'
import { Main } from './Main'
import { Page } from './Page'
interface AppProps {
  siteId?: string
}

export const App = ({ siteId }: AppProps) => (
  <BrowserRouter>
    <Main siteId={siteId} />
    <Route path="/:slug" component={Page} />
  </BrowserRouter>
)
