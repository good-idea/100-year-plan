import * as sanityClient from '@sanity/client'
import { useEffect, useReducer, Reducer } from 'react'
import { SiteData } from '../types'

const client = sanityClient({
  projectId: 'ddpo9nmo',
  dataset: process.env.DEV ? 'production' : 'production',
  useCdn: process.env.DEV ? false : true,
})

/**
 * State
 */

interface State<Data> {
  loading: boolean
  data?: Data
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

interface SuccessAction<DataType> {
  type: typeof SUCCESS
  data: DataType
}

interface ErrorAction {
  type: typeof ERROR
  errorMessage: string
}

type Action<T> = ErrorAction | SuccessAction<T> | FetchingAction

const createTypedReducer = <T>() => (
  state: State<T>,
  action: Action<T>,
): State<T> => {
  switch (action.type) {
    case FETCHING:
      return {
        loading: true,
        ...state,
      }
    case SUCCESS:
      return {
        loading: false,
        data: action.data,
      }
    case ERROR:
      return {
        loading: false,
        errorMessage: action.errorMessage,
      }
  }
}

const initialState = {
  loading: true,
}
/**
 * Queries
 */

interface MainPageData {
  siteData: SiteData
  domains: string[]
}

const mainPageQuery = `
{
  "siteSettings": *[_type == 'siteSettings'][0]{
    debug
  },
  "domains": *[_type == 'website'].domain,
	"siteData": *[_type == 'website' && domain == $siteId][0]{
    playButtonImage{
      asset->{
        ...
      },
      ...
    },
    buttons[]{
      label,
      durations[]{
        ...
      },
      image{
        asset->{
          ...
        },	
      },
      siteLink->{
        domain,
        ...
      },
      ...
    },
      video {
        video {
          asset->{
            ...
          },
            ...
        },
        ...
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
  },
}
`

interface PageData {
  title: string
  body: any[]
}

const pageQuery = `
*[_type == 'page' && slug.current == $slug][0]{
  body[]{
    asset->{
      ...
    },
    ...
  },
  ...
}
`

/* Generic fetching hook */

const createFetchHook = <DataType>(query: string) => (variables: {
  [key: string]: string
}) => {
  const [state, dispatch] = useReducer(
    createTypedReducer<DataType>(),
    initialState,
  )

  /**
   * Dispatchers
   */

  const fetchData = async () => {
    dispatch({ type: FETCHING })
    try {
      const data = await client.fetch(query, variables)
      dispatch({ type: SUCCESS, data })
    } catch (err) {
      const errorMessage = err.message.startsWith('Network error')
        ? 'There was an error loading the site data. If you are using an ad blocker, make sure that ddpo9nmo.api.sanity.io is not blocked'
        : 'Sorry, there was an error :('
      dispatch({ type: ERROR, errorMessage })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return state
}

export const useMainQuery = createFetchHook<MainPageData>(mainPageQuery)
export const usePageQuery = createFetchHook<PageData>(pageQuery)

// export const useSiteData = (siteId: string): State<AllData> => {
//   const [state, dispatch] = useReducer(createTypedReducer<AllData>(), initialState)
//
//   /**
//    * Dispatchers
//    */
//
//   const fetchSiteData = async () => {
//     dispatch({ type: FETCHING })
//     try {
//       const data = await client.fetch(query, { siteId })
//       dispatch({ type: SUCCESS, data })
//     } catch (err) {
//       const errorMessage = err.message.startsWith('Network error')
//         ? 'There was an error loading the site data. If you are using an ad blocker, make sure that ddpo9nmo.api.sanity.io is not blocked'
//         : 'Sorry, there was an error :('
//       dispatch({ type: ERROR, errorMessage })
//     }
//   }
//
//   useEffect(() => {
//     fetchSiteData()
//   }, [])
//
//   return state
// }

/**
 * Fetching Pages
 */

//
// export const usePageQuery = (slug: string): State<PageData> => {
//   const [state, dispatch] = useReducer(createTypedReducer<PageData>(), initialState)
//   /**
//    * Dispatchers
//    */
//
//   const fetchSiteData = async () => {
//     dispatch({ type: FETCHING })
//     try {
//       const data = await client.fetch(query, { siteId })
//       dispatch({ type: SUCCESS, data })
//     } catch (err) {
//       const errorMessage = err.message.startsWith('Network error')
//         ? 'There was an error loading the site data. If you are using an ad blocker, make sure that ddpo9nmo.api.sanity.io is not blocked'
//         : 'Sorry, there was an error :('
//       dispatch({ type: ERROR, errorMessage })
//     }
//   }
//
//   useEffect(() => {
//     fetchSiteData()
//   }, [])
//
//
// }
