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

interface LinkInfo {
  href: string
  isExternal: boolean
}

const getLink = (button: Button): LinkInfo | void => {
  const { siteLink, urlLink } = button
  if (!siteLink && !urlLink) return undefined
  if (siteLink && siteLink._type === 'page') {
    return { href: `/${siteLink.slug.current}`, isExternal: false }
  } else if (siteLink && siteLink._type === 'website') {
    return { href: `https://www.${siteLink.domain}`, isExternal: true }
  } else if (urlLink) {
    return { href: urlLink, isExternal: true }
  }
}

export const Button = ({ button, domains, currentTime }: ButtonProps) => {
  const {
    x,
    y,
    w,
    image,
    siteLink,
    urlLink,
    label,
    linkType,
    durations,
  } = button
  const visible =
    durations && durations.length
      ? durations.find(({ start, end }) =>
          start && end ? currentTimeIsBetween(currentTime, start, end) : false,
        )
      : true

  const link = getLink(button)
  if (!image || !link) return null
  const src = image.asset.url

  const styles = {
    width: `${w}%`,
    left: `${x}%`,
    top: `${y}%`,
    display: visible ? 'block' : 'none',
  }

  if (!link.isExternal) {
    return (
      <Link to={link.href} style={styles} className="button">
        <img src={src} alt={label} />
      </Link>
    )
  }

  return (
    <a
      href={link.href}
      style={styles}
      className="button"
      rel="noopener noreferrer"
    >
      <img src={src} alt={label} />
    </a>
  )
}
