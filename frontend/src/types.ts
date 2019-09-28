export interface Button {
  _key
  _type
  image?: SanityImage
  label?: string
  linkType: string
  siteLink?: {
    domain: string
  }
  w: number
  x: number
  y: number
}

export interface Video {
  _key
  _type
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
  seo: {
    _type: 'seo'
    description?: string
    image?: SanityImage
  }
  video?: {
    video: Video
  }
}
