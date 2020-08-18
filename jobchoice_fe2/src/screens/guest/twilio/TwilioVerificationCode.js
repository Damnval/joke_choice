import React, { Component } from "react"
import JobChoiceLayout from "../../../layouts/jobChoiceLayout/JobChoiceLayout"
import "./TwilioVerificationCode.scss"
import api from "../../../utilities/api"
import Modal from "../../../components/modal/Modal"
import LoadingIcon from "../../../components/loading/Loading"
import lockIcon from "../../../assets/img/Lock-Icon.png"
import { LANG } from "../../../constants"
import { Redirect, Link } from 'react-router-dom'
import store from '../../../store/config'
import {storeAuthenticatedUser} from '../../../store/user/actions'
import * as constants from '../../../constants'

const formValid = ({ formErrors, ...rest }) => {
  let valid = true

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  })

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === "" && (valid = false);
  })

  return valid
}

class TwilioVerificationCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      verification_code: "",
      isLoading: false,
      contact_no: null,
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: "",
        redirect: null
      },
      formErrors: {
        verification_code: ""
      },
      isLoggedIn: false
    }
    this.handleClose = this.handleClose.bind(this)
  }

  handleLogin = e => {

    this.setState({
      isLoading: true
    })
    
    if(this.props.location.state) {
      // Set Credentials
      let credentials = {
        client_id: constants.CLIENT_ID,
        client_secret: constants.CLIENT_SECRET,
        grant_type: "password",
        username: this.props.location.state.credentials.email,
        password: this.props.location.state.credentials.password
      }
      
      // Request token
      api.post('oauth/token', credentials).then(response => {
        localStorage.setItem('accessToken', response.data.access_token)
        localStorage.setItem('refreshToken', response.data.refresh_token)
        store.dispatch(storeAuthenticatedUser())

        this.props.history.push("/home")

        this.setState({
          isLoading: false
        })
      }).catch(error => {
        console.log(error)
      })

      
    }
  }

  // Handle Button Submit
  handleSubmit = e => {
    e.preventDefault()

    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: "",
        redirect: null
      },
      isLoading: true
    })

    // Validate the Form
    if (formValid(this.state)) {
      // Set Params
      const verificationCode = {
        token: this.props.match.params.token,
        code: this.state.verification_code
      }

      // Verify Code
      api.post("api/verify-code", verificationCode)
        .then(response => {
        if(localStorage.accessToken && !localStorage.snsApply) {
          this.setState({url: "/logout" })
        } else if(localStorage.snsApply) {
          this.handleLogin()
        } else {
          this.setState({url: "/login" })  
        }

        this.setState({
          modal: {
            messageKey: 'successfullyVerified',
            message: LANG[localStorage.JobChoiceLanguage].successfullyVerified,
            modal: true,
            modalType: "success",
            redirect: this.state.url
          },
          isLoading: false
        })

        }).catch(error => {
          this.setState({
            modal: {
              messageKey: 'invalidVerifyCode',
              message: LANG[localStorage.JobChoiceLanguage].invalidVerifyCode,
              modal: true,
              modalType: "error"
            },
            isLoading: false
          })
        })
    }
  }

  // Handle OnChange Event Listener Input
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors }

    // Validate Verifcation Code
    if (!RegExp(/\d{6}/).test(value)) {
      if (value.length < 6 && value.length > 0) {
        formErrors.verification_code = LANG[localStorage.JobChoiceLanguage].invalidVerificationCode
      } else if (value.length === 0) {
        formErrors.verification_code = ""
      }
    } else {
      if (value.length < 6 && value.length > 0) {
        formErrors.verification_code = LANG[localStorage.JobChoiceLanguage].invalidVerificationCode
      } else {
        formErrors.verification_code = ""
      }
    }

    // return formErrors
    this.setState({ formErrors, [name]: value })
  }

  handleResendCode = e => {
    e.preventDefault()

    // Set loader
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: "",
        redirect: null
      },
      isLoading: true
    })

    // Set Params
    const credentials = {
      token: this.props.match.params.token,
      action: 'resend'
    }
    
    // Resend Code
    api.post("api/send-verification-code", credentials)
    .then(response => {

    this.setState({
      modal: {
        messageKey: 'resendCodeMessage',
        message: LANG[localStorage.JobChoiceLanguage].resendCodeMessage,
        modal: true,
        modalType: "success"
      },
      isLoading: false
    })

    }).catch(error => {
      this.setState({
        modal: {
          messageKey: 'invalidPhoneNumber',
          message: LANG[localStorage.JobChoiceLanguage].invalidPhoneNumber,
          modal: true,
          modalType: "error"
        },
        isLoading: false
      })
    })
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
    return (
      <JobChoiceLayout>
        <div className="main-wrapper">
          <div className="wrapper-verification-code">
            <div className="verification-content">
              <div>
                <img
                  src={lockIcon}
                  width={120}
                  alt="Verify Icon"
                  className="lock-image"
                />
                <small>
                  <strong>{LANG[localStorage.JobChoiceLanguage].enterVerificationCode}</strong>
                </small>
              </div>
              <p>{LANG[localStorage.JobChoiceLanguage].verifyMessage}</p>
              <form onSubmit={this.handleSubmit} noValidate>
                <input
                  className={
                    formErrors.verification_code.length > 0 ? "error" : ""
                  }
                  placeholder={LANG[localStorage.JobChoiceLanguage].sixDigitCode}
                  type="text"
                  name="verification_code"
                  noValidate
                  maxLength="6"
                  onChange={this.handleChange}
                />
                {formErrors.verification_code.length > 0 && (
                  <span className="errorMessage">
                    {formErrors.verification_code}
                  </span>
                )}
                <span className="resend-code" onClick={this.handleResendCode}>{LANG[localStorage.JobChoiceLanguage].resendCode}</span>
                <div className={`submit ${formErrors.verification_code.length > 0 ? 'mTop' : ''}`}>
                  <button
                    className={`${
                      formValid(this.state) === true
                        ? "register-button"
                        : "register-disabled"
                    }`}
                    disabled={!formValid(this.state)}
                    type="submit"
                  >{LANG[localStorage.JobChoiceLanguage].verifyBtn}
                  </button>
                </div>
              </form>
            </div>
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
    );
  }
}

export default TwilioVerificationCode
