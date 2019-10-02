import * as React from 'react'
import * as Sentry from '@sentry/browser'

interface State {
  hasError: boolean
  message?: string
}

const captureException = (error, info): Promise<string> =>
  new Promise((resolve) => {
    Sentry.withScope(function(scope) {
      scope.setExtras(info)
      const eventId = Sentry.captureException(error)
      const message =
        'Sorry, there was an error. It has been reported and we will fix it. In the mean time, reload and try again?'
      resolve(message)
    })
  })

class ErrorBoundary extends React.Component<any, State> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  async componentDidCatch(error, info) {
    const message = await captureException(error, info)
    this.setState({ message })
  }

  render() {
    //when there's not an error, render children untouched
    return this.props.children
  }
}

export default ErrorBoundary
