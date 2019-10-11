import { useReducer } from 'react'

/**
 * Action Types
 */

const INIT = 'INIT'
const UPDATE_TIME = 'UPDATE_TIME'
const SET_BUFFERING = 'BUFFERING'
const SET_PLAYSTATE = 'SET_PLAYSTATE'

type Action =
  | { type: typeof INIT }
  | { type: typeof UPDATE_TIME; time: number }
  | { type: typeof SET_PLAYSTATE; isPlaying: boolean }
  | { type: typeof SET_BUFFERING; isBuffering: boolean }

/**
 * Reducer
 */

const reducer = (state: AppState, action: Action): AppState => {
  console.log('dispatched:', action.type)
  switch (action.type) {
    case INIT:
      return {
        ...state,
        initialized: true,
      }
    case UPDATE_TIME:
      return {
        ...state,
        currentTime: action.time,
      }
    case SET_BUFFERING:
      return {
        ...state,
        isBuffering: action.isBuffering,
      }

    case SET_PLAYSTATE:
      return {
        ...state,
        isPlaying: action.isPlaying,
      }
    default:
      return state
  }
}

/**
 * Main
 */

export interface AppState {
  initialized: boolean
  isPlaying: boolean
  isBuffering: boolean
  currentTime: number
}

export interface Actions {
  initialize: () => void
  setBuffering: (isBuffering: boolean) => void
  setPlayState: (isPlaying: boolean) => void
  updateTime: (time: number) => void
}

interface AppStateAndActions {
  appState: AppState
  actions: Actions
}

const initialState = {
  initialized: false,
  isBuffering: false,
  isPlaying: false,
  currentTime: -1,
}

export const useAppState = (): AppStateAndActions => {
  const [appState, dispatch] = useReducer(reducer, initialState)

  const initialize = () => dispatch({ type: INIT })
  const setPlayState = (isPlaying: boolean) =>
    dispatch({ type: SET_PLAYSTATE, isPlaying })
  const updateTime = (time: number) => dispatch({ type: UPDATE_TIME, time })
  const setBuffering = (isBuffering: boolean) =>
    dispatch({ type: SET_BUFFERING, isBuffering })

  const actions = {
    initialize,
    setPlayState,
    updateTime,
    setBuffering,
  }

  return {
    appState,
    actions,
  }
}
