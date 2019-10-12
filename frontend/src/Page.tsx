import * as React from 'react'
import { Link } from 'react-router-dom'
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

export const Page = ({ match }: PageProps) => {
  const state = usePageQuery({ slug: match.params.slug })
  const { loading, data } = state
  return (
    <div className="page">
      <p className="closeButton">
        <Link to="/">close</Link>
      </p>
      {loading || !data ? null : (
        <div className="column">
          <BlockContent blocks={data.body} />
        </div>
      )}
    </div>
  )
}
