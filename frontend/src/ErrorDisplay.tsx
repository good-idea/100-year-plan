import * as React from 'react'

interface ErrorDisplayProps {
  /* */
  errorMessage: string
}

export const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  return <div>{errorMessage}</div>
}
