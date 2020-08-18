import React, { Component } from 'react'
import './ResetPassword.scss'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

const formValid = ({ formErrors, ...rest }) => {
  let valid = true

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  })

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false)
  })

  return valid
}

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      c_password: "",
      isLoading: false,
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },

      formErrors: {
        password: "",
        c_password: ""
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
      isLoading: true
    })

    const credentials = {
      password: this.state.password,
      c_password: this.state.c_password,
      token: this.props.match.params.token
    }

    if (formValid(this.state)) {
        api.post('api/password/reset', credentials).then(response => {
          this.setState({
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].passwordChanged,
            messageKey: 'passwordChanged',
            modal: true,
            modalType: 'success',
            redirect: '/home',
          },
          isLoading: false
        })

        }).catch(error => {
          this.setState({
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].resetTokenInvalid,
            messageKey: 'resetTokenInvalid',
            modal: true,
            modalType: 'error'
          },
          isLoading: false
        })

        })
    }
  }

  handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "password":
          if(value.length < 8) {
              formErrors.password = 'minimum8'
          } else if (value.trim().length < 8) {
            formErrors.password = 'invalidCharactersUsed'
          } else {
              formErrors.password = ""
              formErrors.c_password = ""
          }
  
          if (value !==  this.state.c_password && this.state.c_password.length > 0) {
              formErrors.c_password = 'pwDontMatch'
          } 
          if ((value === null || value.length === 0) && this.state.c_password.length === 0) {
              formErrors.password = ""
              formErrors.c_password = ""
          }
          break
        case "c_password":
          if(value!== this.state.password) {
              formErrors.c_password = 'pwDontMatch'
          } else if (value.trim().length < 8) {
            formErrors.c_password = 'invalidCharactersUsed'
          }else {
              formErrors.password = ""
              formErrors.c_password = ""
          }
  
          if(this.state.password.length < 8) {
              formErrors.password = 'minimum8'
          } 
  
          if ((value === null || (value && value.length === 0)) && this.state.password.length === 0) {
              formErrors.password = ""
              formErrors.c_password = "" 
          } 
          break
      default:
        break
    }

    this.setState({ formErrors, [name]: value })
  }

  render() {
    const { formErrors } = this.state

    return (
      <div>
        <JobChoiceLayout>
        <div className="wrapper-resetpassword">
          <div className="form-wrapper-resetpassword">
            <h1>{LANG[localStorage.JobChoiceLanguage].enterNewPassword}</h1>
            <form onSubmit={this.handleSubmit} noValidate>
              <div className="password">
                <label htmlFor="password">{LANG[localStorage.JobChoiceLanguage].password}</label>
                <input
                  className={formErrors.password.length > 0 ? "error" : null}
                  placeholder={LANG[localStorage.JobChoiceLanguage].newPassword}
                  type="password"
                  name="password"
                  noValidate
                  onChange={this.handleChange}
                />
                {formErrors.password.length > 0 && (
                  <span className="errorMessage">{LANG[localStorage.JobChoiceLanguage][formErrors.password]}</span>
                )}
              </div>
              <div className="c_password">
                <label htmlFor="c_password">{LANG[localStorage.JobChoiceLanguage].confirmPassword}</label>
                <input
                  className={formErrors.c_password.length > 0 ? "error" : null}
                  placeholder={ LANG[localStorage.JobChoiceLanguage].retypePassword }
                  type="password"
                  name="c_password"
                  noValidate
                  onChange={this.handleChange}
                />
                {formErrors.c_password.length > 0 && (
                  <span className="errorMessage">{LANG[localStorage.JobChoiceLanguage][formErrors.c_password]}</span>
                )}
              </div>
              <div className="submit">
                <button
                 className={`${formValid(this.state) === true ? 'register-button' : 'register-disabled'}`}
                 disabled={!formValid(this.state)}
                 type="submit">
                  {LANG[localStorage.JobChoiceLanguage].submit}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Modal
          show={this.state.modal.modal}
          message={this.state.modal.message}
          messageKey={this.state.modal.messageKey}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect} />

        <LoadingIcon show={this.state.isLoading} />

        </JobChoiceLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
