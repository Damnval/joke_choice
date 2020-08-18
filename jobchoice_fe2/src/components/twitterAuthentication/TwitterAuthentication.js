import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js'
import api from '../../utilities/api'
import { TWIITER_TOKEN, TWIITER_AUTH } from '../../constants'

class TwitterAuthentication extends Component {
  constructor(props) {
    super(props)

    this.onFailed = this.onFailed.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  async onSuccess(response) {
    await this.props.setParent({ isLoading: true })
    response.json().then(body => {
      const credentials = {
        oauth_token: body.oauth_token,
        oauth_token_secret: body.oauth_token_secret
      }
      if (this.props.type === 'authentication') {
        api.post('api/auth/twitter/credentials', credentials).then(response => {
          localStorage.setItem('SNSaccessToken', body.oauth_token)
          const loginCredentials = {
            type: 'twitter',
            first_name: response.data.name,
            email: response.data.email,
            job_seeker: {
              social_id: response.data.id
            }
          }
          this.props.twitterLogin(loginCredentials)
        }).catch(error => {
          console.log(error)
        })
      } else if (this.props.type === 'share') {
        this.props.twitterLogin(credentials)
      }
    })
    
  }

  onFailed(error) {
    this.props.setParent({ errorMessage: error })
  }
  
  render() {

    return (
      <TwitterLogin
        loginUrl={ TWIITER_AUTH }
        onFailure={this.onFailed}
        onSuccess={this.onSuccess}
        requestTokenUrl={ TWIITER_TOKEN }
        showIcon={true}
        forceLogin={true}
        className="twitter"
      >
        <FontAwesomeIcon icon={['fab', 'twitter']}  size="2x" />
      </TwitterLogin>
    )
  }
}

export default TwitterAuthentication
