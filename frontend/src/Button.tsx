import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button as ButtonType } from './types'
import { pickRandom } from './utils'

const { useMemo } = React

interface ButtonProps {
  button: ButtonType
  currentTime: number
  domains: string[]
}

const parseTimeString = (timeString: string): number => {
  const split = timeString.split(':').reverse()
  const s = split[0] ? parseInt(split[0], 10) : 0
  const m = split[1] ? parseInt(split[1], 10) : 0
  return s + m * 60
}

const currentTimeIsBetween = (
  time: number,
  start: string,
  end: string,
): boolean => time >= parseTimeString(start) && time <= parseTimeString(end)

export const Button = ({ button, domains, currentTime }: ButtonProps) => {
  const { x, y, w, image, siteLink, label, linkType, durations } = button
  const visible =
    durations && durations.length
      ? durations.find(({ start, end }) =>
          start && end ? currentTimeIsBetween(currentTime, start, end) : false,
        )
      : true

  if (!image || !siteLink) return null
  const src = image.asset.url

  const styles = {
    width: `${w}%`,
    left: `${x}%`,
    top: `${y}%`,
    display: visible ? 'block' : 'none',
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
