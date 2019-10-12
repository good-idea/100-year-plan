import * as React from 'react'
import { Link } from 'react-router-dom'
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

  if (!image || !siteLink) return null
  const src = image.asset.url

  const styles = {
    width: `${w}%`,
    left: `${x}%`,
    top: `${y}%`,
  }

  if (siteLink._type === 'page') {
    const to = `/${siteLink.slug.current}`
    return (
      <Link to={to} style={styles} className="button" rel="noopener noreferrer">
        <img src={src} alt={label} />
      </Link>
    )
  } else if (siteLink._type === 'website') {
    const domain =
      linkType === 'random'
        ? useMemo(() => pickRandom(domains), [])
        : siteLink
        ? siteLink.domain
        : undefined

    if (!domain) {
      return null
    }
    const link = `https://www.${domain}`

    return (
      <a
        href={link}
        style={styles}
        className="button"
        rel="noopener noreferrer"
      >
        <img src={src} alt={label} />
      </a>
    )
  } else {
    return null
  }
}
