import jp from './messages.js'
import data from './data.js'

//development
export const SITE = 'http://192.168.99.100:8080/'
export const BASE_URL = 'http://192.168.99.100:8080/'
export const STAGING_URL = 'http://localhost:3000/line'
export const LINE_AUTH = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1582909390" +
 "&redirect_uri=http://localhost:3000/line&state=kFbiOyIQadhXSSadu78x&scope=openid%20profile"

//staging
// export const SITE = 'https://staging.job-choice.jp/'
// export const BASE_URL = 'https://staging-api.job-choice.jp/'
// export const STAGING_URL = 'https://staging.job-choice.jp/line'
// export const LINE_AUTH = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1582909390" +
//  "&redirect_uri=https://staging.job-choice.jp/line&state=kFbiOyIQadhXSSadu78x&scope=openid%20profile"

//production
//export const SITE = 'https://job-choice.jp/'
//export const BASE_URL = 'https://api.job-choice.jp/'
//export const STAGING_URL = 'https://job-choice.jp/line'
//export const LINE_AUTH = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1582909390" +
// "&redirect_uri=https://job-choice.jp/line&state=kFbiOyIQadhXSSadu78x&scope=openid%20profile"

export const FB_ID = 2407983829246454

export const TWIITER_TOKEN = BASE_URL + "api/auth/twitter/reverse"
export const TWIITER_AUTH = BASE_URL + "api/auth/twitter"

export const LINE_CHANNEL_ID = 1582909390
export const LINE_CHANNEL_SECRET = '1c41fc1dfee73ba8190eea30fb5047e2'

//true if project is still in development
export const DEVELOPMENT = true

// PASSPORT
export const CLIENT_ID = 2
export const CLIENT_SECRET = 'CPwhcQyphVPT2k7JA4S5sqNfT7O8HRB4ogjeu8OX'

export const LANG = jp._props
export const EM = data._props

export const RECATPCHA = '6LeRk50UAAAAAA4E3nkmIqtfMZrnQrxTbRA48_FG'
