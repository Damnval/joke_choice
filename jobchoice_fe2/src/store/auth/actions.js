import * as types from '../actions'
import api from '../../utilities/api'
import * as constants from '../../constants'
import { updateAuthenticatedUser } from '../user/actions'
import store from '../config'
import { storeAuthenticatedUser } from '../user/actions'

export function loginUser(credentials) {
  return dispatch => {
    return api.post('oauth/token', {
      client_id: constants.CLIENT_ID,
      client_secret: constants.CLIENT_SECRET,
      grant_type: credentials.grant_type,
      username: credentials.username,
      password: credentials.password,
    }).then(response => {
      localStorage.setItem('accessToken', response.data.access_token)
      localStorage.setItem('refreshToken', response.data.refresh_token)
      store.dispatch(storeAuthenticatedUser())
      dispatch(loginSuccess())
      return Promise.resolve(response)
    }).catch(error => {
      dispatch(loginFail())
      return Promise.reject(error)
    })
  }
}

export function loginSuccess() {
  return {
    type: types.AUTH_LOGIN_SUCCESS,
  }
}
export function loginFail() {
  return {
    type: types.AUTH_LOGIN_FAIL,
  }
}

export function logoutUser() {
  const user = {}
  store.dispatch(updateAuthenticatedUser(user))
  localStorage.removeItem('accessToken')
  return {
    type: types.AUTH_LOGOUT
  }
}
