import * as React from 'react'
import { Button as ButtonType } from './types'

interface ButtonProps {
  button: ButtonType
  /* */
}

export const Button = ({ button }: ButtonProps) => {
  console.log(button)
  const { x, y, w, image, siteLink, label } = button
  if (!image || !siteLink) return null
  const link = `https://${siteLink.domain}`
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
