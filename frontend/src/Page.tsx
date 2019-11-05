import * as React from 'react'
import { Link, Redirect } from 'react-router-dom'
import * as BlockContent from '@sanity/block-content-to-react'
import './Page.css'
import { usePageQuery } from './hooks/sanity'

interface PageProps {
  match: {
    params: {
      slug: string
    }
  }
  /* */
}

const customSerializers = {
  types: {
    image: ({ node }: any) => {
      if (node.link) {
        return (
          <a href={node.link} target="_blank" rel="noopener noreferrer">
            <img src={node.asset.url} />
          </a>
        )
      }
      return <img src={node.asset.url} />
    },
  },
  marks: {
    link: ({ children, mark }: any) => {
      return (
        <a href={mark.href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  },
}

export const Page = ({ match }: PageProps) => {
  const state = usePageQuery({ slug: match.params.slug })
  const { loading, data } = state
  if (!loading && !data.body) return <Redirect to="/" />
  return (
    <div className="page">
      {loading || !data ? null : (
        <div className="column">
          <Link className="closeButton" to="/">
            👈 back
          </Link>
          <BlockContent serializers={customSerializers} blocks={data.body} />
          <Link className="closeButton" to="/">
            👈 back
          </Link>
        </div>
      )}
    </div>
  )
}
