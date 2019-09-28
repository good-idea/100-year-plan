import * as sanityClient from '@sanity/client'
import { useEffect, useReducer } from 'react'
import { SiteData } from '../types'

const client = sanityClient({
  projectId: 'ddpo9nmo',
  dataset: process.env.DEV ? 'production' : 'production',
  useCdn: process.env.DEV ? false : true,
})

/**
 * State
 */

interface State {
  loading: boolean
  siteData?: SiteData
  errorMessage?: string
}

/**
 * Reducer
 */

const FETCHING = 'FETCHING'
const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

interface FetchingAction {
  type: typeof FETCHING
}

interface SuccessAction {
  type: typeof SUCCESS
  siteData: SiteData
}

interface ErrorAction {
  type: typeof ERROR
  errorMessage: string
}

type Action = ErrorAction | SuccessAction | FetchingAction

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case FETCHING:
      return {
        loading: true,
        ...state,
      }
    case SUCCESS:
      return {
        loading: false,
        siteData: action.siteData,
      }
    case ERROR:
      return {
        loading: false,
        errorMessage: action.errorMessage,
      }
  }
}

const initialState: State = {
  loading: true,
}

const query = `
*[_type == 'website' && domain == $siteId][0]{
	buttons[]{
  	label,
    image{
    	asset->{
    		...
  		},	
  	},
    siteLink->{
      domain
  	},
    ...
	},
    video {
      video {
        asset->{
          ...
        },
      },
    },
    seo {
      _type,
      description,
      image{
        asset->{
          ...
        },
      },
    },
  ...
}
`

export const useSiteData = (siteId: string): State => {
  const [state, dispatch] = useReducer(reducer, initialState)

  /**
   * Dispatchers
   */

  const fetchSiteData = async () => {
    dispatch({ type: FETCHING })
    try {
      const siteData = await client.fetch(query, { siteId })
      dispatch({ type: SUCCESS, siteData })
    } catch (err) {
      const errorMessage = err.message.startsWith('Network error')
        ? 'There was an error loading the site data. If you are using an ad blocker, make sure that ddpo9nmo.api.sanity.io is not blocked'
        : 'Sorry, there was an error :('
      dispatch({ type: ERROR, errorMessage })
    }
  }

  useEffect(() => {
    fetchSiteData()
  }, [])

  return state
}
