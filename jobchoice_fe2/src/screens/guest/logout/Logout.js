import React from 'react'
import store from '../../../store/config'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import { logoutUser } from '../../../store/auth/actions'
import LoadingIcon from '../../../components/loading/Loading'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class Logout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      modal: {
        messageKey:null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,     
      },
    }
  }

  componentWillMount() {
    api.post('api/logout').then(response => {
      if (response.data.status === 200) {
        store.dispatch(logoutUser())
        this.props.history.push('/login')
      }
    }).catch(error => {
      console.log(error)
      store.dispatch(logoutUser())
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

  render() {
    return (<div><LoadingIcon show={true}/>
      <Modal
      show={this.state.modal.modal}
      message={this.state.modal.message}
      messageKey={this.state.modal.messageKey}
      type={this.state.modal.modalType}
      redirect={this.state.modal.redirect}
      data={this.state.modal.data}
    />
    </div>
    )}
}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
