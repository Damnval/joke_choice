import React, { Component } from 'react'
import axios from 'axios'
import api from '../../utilities/api'
import LoadingIcon from '../../components/loading/Loading'
import { storeAuthenticatedUser } from '../../store/user/actions'
import store from '../../store/config'
import { STAGING_URL, LINE_CHANNEL_ID, LINE_CHANNEL_SECRET } from '../../constants'

class Line extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      social_id: '',
      redirect: false,
      successful: false,
    }
  }

  componentDidMount() {

    const search = window.location.search
    const searchParams = new URLSearchParams(search)
    let code = searchParams.get('code')

    const credentials = {'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': STAGING_URL,
      'client_id': LINE_CHANNEL_ID,
      'client_secret': LINE_CHANNEL_SECRET,
    }

    api.post('api/line', credentials).then(response => {
      this.handleProfile(response)
    }).catch(error => {
      console.log(error)
    })

  }

  handleProfile = (data) => {
    axios({
      method:'get',
      url:'https://api.line.me/v2/profile',
      headers: {
        'Authorization': 'Bearer ' + data.data.access_token,
      }
    }).then(response => {
      this.setState({
        name: response.data.displayName,
        email: '',
        social_id: response.data.userId,
        redirect: true,
        successful: true
      })
      localStorage.setItem('SNSaccessToken', data.data.access_token)
    }).catch(function(err) {
      console.log(err)
    })
  }


  render() {

    if (this.state.successful) {
      const credentials = {
        type: 'line',
        first_name: this.state.name,
        email: '',
        job_seeker: {
          social_id: this.state.social_id
        },
      }

      api.post('api/register/social', credentials).then(response => {
        localStorage.setItem('accessToken', response.data.results.token)
        store.dispatch(storeAuthenticatedUser())

        if (this.state.redirect) {
          this.props.history.push('/home')
        }

      }).catch(error => {
        console.log(error)
      })
    }

    return <LoadingIcon show={true} />;
  }
}

export default Line
