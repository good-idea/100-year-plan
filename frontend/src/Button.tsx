import * as React from 'react'
import { Button as ButtonType } from './types'

interface ButtonProps {
  button: ButtonType
  randomDomain: string | null
  /* */
}

export const Button = ({ button, randomDomain }: ButtonProps) => {
  const { x, y, w, image, siteLink, label } = button
  const domain = randomDomain || (siteLink ? siteLink.domain : null)
  console.log(domain)
  if (!image || !domain) return null
  const link = `https://${domain}`
  const src = image.asset.url
  const styles = {
    width: `${w}%`,
    left: `${x}%`,
    top: `${y}%`,
  }

  return (
    <a
      href={link}
      style={styles}
      className="button"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={src} alt={label} />
    </a>
  )
}
