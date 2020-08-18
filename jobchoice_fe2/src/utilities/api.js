
import axios from 'axios'
import * as constants from '../constants'

const defaultOptions = {
    baseURL: constants.BASE_URL,
    headers: {
        'Accept': 'application/json',
    }
}

const api = axios.create(defaultOptions)

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken')
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
})

api.interceptors.response.use(response => {
    sessionStorage.removeItem('sessionExpired')
    return response
}, error => {
    return Promise.reject(error)
})

export default api
