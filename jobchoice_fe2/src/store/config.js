import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './rootReducer'
import thunk from 'redux-thunk'
import * as constants from '../constants'
import { loadState, saveState } from './localStorage'

const persistedState = loadState()

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : f => f

const store = createStore(
  rootReducer,
  persistedState,
  compose(
    applyMiddleware(thunk)
  ),
)

store.subscribe(() => {
  saveState(store.getState())
})

export default store
