import * as types from '../actions'

const initialstate = !!localStorage.accessToken

const authReducer = (state = initialstate, {type, payload}) => {
  switch (type) {
    case types.AUTH_LOGIN_SUCCESS:
      return !!localStorage.accessToken
    case types.AUTH_LOGIN_FAIL:
      return false
    case types.AUTH_LOGOUT:
      return !!localStorage.accessToken
    default:
      return state
  }
}

export default authReducer
