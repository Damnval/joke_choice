import * as types from '../actions'
import api from '../../utilities/api'
import store from '../config'
import { logoutUser } from '../auth/actions'

export function storeAuthenticatedUser() {
  return dispatch => {
    return api.get('api/user').then(user => {
        dispatch({
            type: types.USER_AUTHENTICATED,
            payload: user,
        })
    }).catch(error => {
      if (error.response && error.response.data.code === 401 && !sessionStorage.getItem('sessionExpired')) {
        return store.dispatch(logoutUser())
      }

      if (error.response === undefined && error.message === 'Network Error') {
        return dispatch({
          type: types.NETWORK_ERROR,
          payload: {
            message: 'Failed to connect with the API. Please contact the administrator.'
          }
        })
      }
    })
  }
}

export function updateAuthenticatedUser(payload) {
  return dispatch => {
    dispatch({
      type: types.USER_AUTHENTICATED,
      payload: {},
    })
  }
}
