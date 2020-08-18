import React, { Component } from 'react'
import "./ForgotPassword.scss"
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { LANG } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/)

const formValid = ({ formErrors, ...rest }) => {
  let valid = true

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  })

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    ( val === null || val.length === 0 ) && (valid = false);
  })

  return valid
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      isLoading: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },

      formErrors: {
        email: "", 
        
      }
    }

    this.handleClose = this.handleClose.bind(this)
  }

  handleSubmit = e => {
    e.preventDefault()

    this.setState({ 
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      isLoading: true
    })

    if (formValid(this.state)) {
        const newEmail = {
            email: this.state.email
           }
        api.post('api/password/create', newEmail).then(response => {
          this.setState({ 
          modal: {
            messageKey: 'resetPasswordSent',
            message: LANG[localStorage.JobChoiceLanguage].resetPasswordSent,
            modal: true,
            modalType: 'success',
            redirect: '/home',
          },
          isLoading: false
        })

        }).catch(error => {
          this.setState({ 
          modal: {
            messageKey: 'emailNotExist',
            message: LANG[localStorage.JobChoiceLanguage].emailNotExist,
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
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : ( value.length > 0 ? LANG[localStorage.JobChoiceLanguage].invalidEmail : "" )
        break
      default:
        break
    }

    this.setState({ formErrors, [name]: value });
  }

  handleClose = () => {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: "",
        redirect: null
      },
    })
  }

  render() {
    const { formErrors } = this.state

    if (this.props.isAuthenticated && this.props.user) {
      return (<Redirect to="/home" />)
    }

    return (
      <div>
        <JobChoiceLayout>
        <div className="wrapper-forgotpassword">
          <div className="form-wrapper-forgotpassword">
            <h1>{LANG[localStorage.JobChoiceLanguage].pleaseEnterYourEmail}</h1>
            <form onSubmit={this.handleSubmit} noValidate>
              <div className="email">
                <input
                  className={formErrors.email.length > 0 ? "error" : null}
                  placeholder={LANG[localStorage.JobChoiceLanguage].pleaseEnterYourEmail}
                  type="email"
                  name="email"
                  maxLength="50"
                  noValidate
                  onChange={this.handleChange}
                />
                {formErrors.email.length > 0 && (
                  <span className="errorMessage">{LANG[localStorage.JobChoiceLanguage].invalidEmail}</span>
                )}
                <div className="register-additional-text">
                  <span>{LANG[localStorage.JobChoiceLanguage].forgotPW1}</span>
                </div>
                <div className="register-additional-text">
                  <span>{LANG[localStorage.JobChoiceLanguage].forgotPW2}</span>
                </div>
                <div className="register-additional-text">
                  <span>{LANG[localStorage.JobChoiceLanguage].forgotPW3}</span>
                </div>
              </div>
              <div className="submit">
                <button className={`${formValid(this.state) === true ? 'register-button' : 'register-disabled'}`} 
                 disabled={!formValid(this.state)} 
                 type="submit">{LANG[localStorage.JobChoiceLanguage].submit}</button>
              </div>
            </form>
          </div>
        </div>

        <Modal 
          show={this.state.modal.modal} 
          message={this.state.modal.message}
          messageKey={this.state.modal.messageKey}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}
          handleParentClose={this.handleClose}
          />

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

export default connect(mapStateToProps)(ForgotPassword)
