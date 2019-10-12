import { useReducer } from 'react'

/**
 * Action Types
 */

const INIT = 'INIT'
const USER_STARTED = 'USER_STARTED'
const SET_BUFFERING = 'BUFFERING'
const SET_PLAYSTATE = 'SET_PLAYSTATE'

type Action =
  | { type: typeof INIT }
  | { type: typeof USER_STARTED }
  | { type: typeof SET_PLAYSTATE; isPlaying: boolean }
  | { type: typeof SET_BUFFERING; isBuffering: boolean }

/**
 * Reducer
 */

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        initialized: true,
      }
    case USER_STARTED:
      return {
        ...state,
        startedByUser: true,
      }
    case SET_BUFFERING:
      return {
        ...state,
        isBuffering: action.isBuffering,
      }

    case SET_PLAYSTATE:
      return {
        ...state,
        // If the video autoplays, set started to true
        startedByUser: action.isPlaying ? true : state.startedByUser,
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
  startedByUser: boolean
  isBuffering: boolean
}

export interface Actions {
  initialize: () => void
  setBuffering: (isBuffering: boolean) => void
  setPlayState: (isPlaying: boolean) => void
  startByUserInput: () => void
}

interface AppStateAndActions {
  appState: AppState
  actions: Actions
}

const initialState = {
  initialized: false,
  isBuffering: false,
  startedByUser: false,
  isPlaying: false,
}

export const useAppState = (): AppStateAndActions => {
  const [appState, dispatch] = useReducer(reducer, initialState)

  const initialize = () => dispatch({ type: INIT })
  const setPlayState = (isPlaying: boolean) => {
    if (appState.isPlaying !== isPlaying) {
      dispatch({ type: SET_PLAYSTATE, isPlaying })
    }
  }
  const setBuffering = (isBuffering: boolean) =>
    dispatch({ type: SET_BUFFERING, isBuffering })
  const startByUserInput = () => dispatch({ type: USER_STARTED })

  const actions = {
    initialize,
    setPlayState,
    setBuffering,
    startByUserInput,
  }

  return {
    appState,
    actions,
  }
}
