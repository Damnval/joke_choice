import { combineReducers } from 'redux'
import authReducer from './auth/reducer'
import userReducer from './user/reducer'
import langReducer from './lang/reducer'

const rootReducer = combineReducers({
  isAuthenticated: authReducer,
  user: userReducer,
  langauge: langReducer
})

export default rootReducer
