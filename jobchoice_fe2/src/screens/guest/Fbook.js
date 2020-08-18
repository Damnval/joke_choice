import React, { Component } from 'react'
import api from '../../utilities/api'
import Modal from '../../components/modal/Modal'
import { withRouter } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login'
import { storeAuthenticatedUser } from '../../store/user/actions'
import store from '../../store/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { FB_ID } from '../../constants'

class Fbook extends Component {

  constructor(props) {
    super(props)
    this.state = {
      type: null,
      name: null,
      email: null,
      social_id: null,
      isLoading: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      }
    }
  }

  responseFacebook = (response) => {
    this.setState({
      name: response.name,
      email: response.email,
      social_id: response.userID,
    })
    localStorage.setItem('SNSaccessToken', response.accessToken)
    this.callAPI()

  }

  callAPI = () => {
    const credentials = {
      type: 'facebook',
      first_name: this.state.name,
      email: this.state.email,
      job_seeker: {
        social_id: this.state.social_id,
      }
    }
    if (credentials.job_seeker.social_id !== undefined) {
      api.post('api/register/social', credentials).then(response => {
        localStorage.setItem('accessToken', response.data.results.token)
        store.dispatch(storeAuthenticatedUser())
        this.props.history.push('/home')
      }).catch(error => {
        console.log(error)
        this.setState({
          isLoading: false,
          modal: {
            messageKey: 'serverError',
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            modal: true,
            modalType: 'error',
            redirect: '/',
          }
        })
      })
    }
  }

  render() {
    return (
      <div className="App">
        <FacebookLogin
          appId={FB_ID}
          fields="name,email,picture"
          callback={this.responseFacebook}
          cssClass="facebook"
          icon={<FontAwesomeIcon icon={['fab', 'facebook']}  size="3x" />}
          textButton = ""
        />

        <Modal
          show={this.state.modal.modal}
          message={this.state.modal.message}
          messageKey={this.state.modal.messageKey}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect} />
      </div>
    )
  }

}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Fbook))
