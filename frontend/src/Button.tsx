import * as React from 'react'
import { Button as ButtonType } from './types'
import { pickRandom } from './utils'

const { useMemo } = React

interface ButtonProps {
  button: ButtonType
  domains: string[]
  /* */
}

export const Button = ({ button, domains }: ButtonProps) => {
  const { x, y, w, image, siteLink, label, linkType } = button

  const domain =
    linkType === 'random'
      ? useMemo(() => pickRandom(domains), [])
      : siteLink
      ? siteLink.domain
      : undefined

  if (!image || !domain) return null
  const link = `https://www.${domain}`
  const src = image.asset.url
  const styles = {
    width: `${w}%`,
    left: `${x}%`,
    top: `${y}%`,
  }

  return (
    <a href={link} style={styles} className="button" rel="noopener noreferrer">
      <img src={src} alt={label} />
    </a>
  )
}
