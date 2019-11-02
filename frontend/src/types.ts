export interface Duration {
  _key: string
  _type: string
  start?: string
  end?: string
}

export interface Button {
  _key: string
  _type: string
  image?: SanityImage
  label?: string
  urlLink?: string
  linkType: string
  durations?: Duration[]

  siteLink?: {
    _type: string
    domain: string
    title?: string
    body: any
    slug: {
      current: string
    }
  }
  w: number
  x: number
  y: number
}

export interface Video {
  _key: string
  _type: string
  asset: {
    assetId: string
    filename: string
    playbackId: string
    status: string
    data: {
      aspect_ratio: string
      duration: number
      id: string
      mp4_support: string
      passthrough: string
      status: string
    }
  }
}

export interface SanityImage {
  _key: string
  _type: string
  maxWidth?: number
  asset: {
    _id: string
    _type: string
    assetId: string
    extension: string
    mimeType: string
    originalFilename: string
    path: string
    size: number
    url: string
    metadata: {
      dimensions: {
        aspectRatio: number
        height: number
        width: number
      }
      hasAlpha: boolean
      isOpaque: boolean
      lqip: string
    }
  }
}

export interface SiteData {
  name: string
  domain: string
  buttons: Button[]
  playButtonImage: SanityImage
  seo: {
    _type: 'seo'
    description?: string
    image?: SanityImage
  }
  video?: {
    video: Video
  }
}
