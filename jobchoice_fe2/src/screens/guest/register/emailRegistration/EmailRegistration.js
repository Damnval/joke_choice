import React, { Component } from 'react'
import './EmailRegistration.scss'
import api from '../../../../utilities/api'
import Modal from '../../../../components/modal/Modal'
import LoadingIcon from '../../../../components/loading/Loading'
import JobChoiceLayout from '../../../../layouts/jobChoiceLayout/JobChoiceLayout'
import logoHeader from '../../../../assets/img/Logo-Header.png'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG, LINE_AUTH } from '../../../../constants'
import { emailRegex } from '../../../../regex'
import Fbook from './../../Fbook.js'
import store from '../../../../store/config'
import {storeAuthenticatedUser} from '../../../../store/user/actions'
import TwitterAuthentication from '../../../../components/twitterAuthentication/TwitterAuthentication'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import CoverImageComponent from '../../landing/coverImageComponent/CoverImageComponent';
import CompanySuccessMessage from './CompanySuccessMessage';

const formValid = ({ formErrors, ...rest }) => {
  let valid = true

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  })

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  })

  return valid
};

class EmailRegistration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      s:true,
      email: null,
      isLoading: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
        registrationType: null
      },
      formErrors: {
        email: "",
      }
    }
    this.twitterLogin = this.twitterLogin.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  handleInputChange = (newInput) => {this.setState(newInput)}

  twitterLogin = (credentials) => {
    api.post('api/register/social', credentials).then(response => {
      localStorage.setItem('accessToken', response.data.results.token)
      store.dispatch(storeAuthenticatedUser())
      this.props.history.push('/home')
    }).catch(error => {
      console.log(error)
    })
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
      const credentials = {
        email: this.state.email,
        type: this.props.match.params.type,
      }

      api.post('api/register/email', credentials).then(response => {

        // Set Modal Message
        let message = <CompanySuccessMessage email={this.state.email} credentials={credentials}/>

        this.setState({
          modal: {
            messageKey: null,
            message: message,
            modal: true,
            modalType: 'success',
            redirect: '/',
            registrationType: this.props.match.params.type
          },
          isLoading: false
        })
      }).catch(error => {
        console.log(error)
        this.setState({
          modal: {
            messageKey: 'emailAlreadyExist',
            message: LANG[localStorage.JobChoiceLanguage].emailAlreadyExist,
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
        formErrors.email = ( emailRegex.test(value) || value.length === 0 )
          ? ""
          : 'invalidEmail'
        break
      default:
        break
    }

    this.setState({ formErrors, [name]: value });
  }

  handleParentClose() {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    })
  }

  render() {
    const { formErrors } = this.state

    return (
      <div>
        <JobChoiceLayout>
          <CoverImageComponent>
            <div className="container email-register-background">
              <div className="row">
                <div className="flex justify-content-center col-xl-6 offset-xl-3 col-lg-10 offset-lg-1 col-sm-12 col-xs-12">
                  <div className="email-register-wrapper">
                    <div className="row logo-row">
                      <div className="col-md-8 offset-md-2 col-sm-10 col-10 flex mx-auto">
                        <img src={logoHeader} alt="logo"/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-10 offset-md-1">
                        <form onSubmit={this.handleSubmit} noValidate className="email-valid-form">
                          <div className="email">
                            <input
                              className={`email-reg-input ${formErrors.email.length > 0 ? "error" : null}`}
                              placeholder={ LANG[localStorage.JobChoiceLanguage].pleaseEnterYourEmail }
                              type="email"
                              name="email"
                              maxLength="50"
                              noValidate
                              onChange={this.handleChange}
                            />
                            {formErrors.email.length > 0 ?
                              <span className="error-message">{ LANG[localStorage.JobChoiceLanguage][formErrors.email] }</span> :
                              <span className="error-none"></span>
                            }
                          <div className="register-additional-text">
                            <span>
                                { LANG[localStorage.JobChoiceLanguage].weSendRegistration }
                                <a href="/terms" className="external-link">{LANG[localStorage.JobChoiceLanguage].termsOfService}</a>
                                { LANG[localStorage.JobChoiceLanguage].andThe }
                                <a href="/privacy-policy" className="external-link">{LANG[localStorage.JobChoiceLanguage].thePrivacy}</a>
                                { LANG[localStorage.JobChoiceLanguage].pleaseClickRegister }
                            </span>
                          </div>
                          </div>
                          <button className={`btn btn-email-valid ${formValid(this.state) === true ? 'btn-tertiary' : 'email-register-disabled'}`}
                            disabled={!formValid(this.state)}
                            type="submit">{ LANG[localStorage.JobChoiceLanguage].register }</button>
                        </form>
                      </div>
                    </div>
                    <div className="row font-size-6">
                        <div className="col-md-8 offset-md-2">
                          <div className="flex-row-center login-sns" id={this.props.match.params.type === 'company' ?'hide' : 'show' }>
                            <Fbook />
                            <TwitterAuthentication
                              setParent={this.handleInputChange}
                              twitterLogin={this.twitterLogin}
                              type={'authentication'}
                            />
                            <Button id='line' href={LINE_AUTH}>
                              <FontAwesomeIcon icon={['fab', 'line']} size="3x" />
                            </Button>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CoverImageComponent>

          <Modal
            show={this.state.modal.modal}
            message={this.state.modal.message}
            messageKey={this.state.modal.messageKey}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}
            handleParentClose={this.handleParentClose}
            registrationType={this.state.modal.registrationType} />

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

export default connect(mapStateToProps, mapDispatchToProps)(EmailRegistration)
