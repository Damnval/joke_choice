import React, { Component } from 'react'
import './Login.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import Input from '../../../components/input/Input'
import * as authActions from '../../../store/auth/actions'
import api from '../../../utilities/api'
import logoHeader from '../../../assets/img/Logo-Header.png'
import { LANG, LINE_AUTH } from '../../../constants'
import store from '../../../store/config'
import {storeAuthenticatedUser} from '../../../store/user/actions'
import LoadingIcon from '../../../components/loading/Loading'
import Fbook from './../Fbook.js'
import TwitterAuthentication from '../../../components/twitterAuthentication/TwitterAuthentication'
import CoverImageComponent from '../landing/coverImageComponent/CoverImageComponent'
import { EditorFormatListBulleted } from 'material-ui/svg-icons'
import Modal from "../../../components/modal/Modal"

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      credentials: {
        username: "",
        password: "",
        grant_type: "password"
      },
      isLoading: false,
      invalidCredentials: false,
      errorMessage: "",
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      }
    }
    this.twitterLogin = this.twitterLogin.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = newInput => {
    this.setState(newInput);
  };

  handleInputChange = (name, value) => {
    const field = name;
    const credentials = this.state.credentials
    credentials[field] = value

    return this.setState({
      credentials: credentials
    })
  }

  handleSubmit = event => {
    event.preventDefault()

    this.setState({
      isLoading: true,
      invalidCredentials: false,
      errorMessage: ""
    })

    // Validate username and password if empty
    if( this.state.credentials.username == "" &&  this.state.credentials.password ==  "" ) {
      this.setState({
        isLoading: false,
        invalidCredentials: true,
        errorMessage: "emptyEmailAndPassword"
      })
    } else if(this.state.credentials.username == "") {
      this.setState({
        isLoading: false,
        invalidCredentials: true,
        errorMessage: "emptyEmail"
      })
    } else if(this.state.credentials.password == "") {
      this.setState({
        isLoading: false,
        invalidCredentials: true,
        errorMessage: "emptyPassword"
      })
    } else {
      this.props.actions.loginUser(this.state.credentials).catch(error => {
        this.setState({
          isLoading: false,
          invalidCredentials: true,
          errorMessage: "incorrectLoginCred"
        })
      })
    }   
     
  }

  twitterLogin = credentials => {
    api.post("api/register/social", credentials)
      .then(response => {
        localStorage.setItem("accessToken", response.data.results.token)
        store.dispatch(storeAuthenticatedUser())

        this.props.history.push("/home")
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleInDevelopment = (e) => {
    e.preventDefault() 
    
    // set message

    this.setState({
      modal: {
        message: "",
        modal: false,
        modalType: '',
      }
    }, () => {
      this.setState({
        modal: {
          messageKey: 'inDevCompanyRegMsg1',
          link: 'https://job-choice.jp/contact',
          to: '/contact',
          modal: true,
          modalType: 'error',
        }
      })
    })
  }

  render() {
    if (
      this.props.isAuthenticated &&
      (this.props.user.data && this.props.user.data.sms_verified_at)
    ) {
      return <Redirect to="/home" />
    } else if (
      this.props.isAuthenticated &&
      (this.props.user.data && !this.props.user.data.sms_verified_at)
    ) {
      return <Redirect to={{pathname:`/verify/${localStorage.accessToken}` }}/>
    }

    return (
      <div>
        <JobChoiceLayout>
          <CoverImageComponent>
            <div className="container login-background">
              <div className="row">
                <div className="login-wrapper-container col-xl-6 offset-xl-3 col-lg-10 offset-lg-1 col-sm-12 col-xs-12">
                  <div className="login-wrapper">
                    <div className="row logo-row">
                      <div className="col-md-6 offset-md-3 col-sm-10 col-xs-10 flex login-logo-wrapper">
                        <img src={logoHeader} alt="logo"/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2 col-md-6 offset-md-3 col-sm-10 col-xs-12 login-wrapper-main">
                        <form onSubmit={this.handleSubmit} noValidate className="login-form login-form-wrap">
                            {(this.state.invalidCredentials === true)  &&
                              <span className="login-error">
                                {LANG[localStorage.JobChoiceLanguage][this.state.errorMessage]}
                              </span>
                            }
                            <Input 
                              inputStyles="email-login"
                              field="username"
                              placeholder={ LANG[localStorage.JobChoiceLanguage].username }
                              onChange={this.handleInputChange}
                              autoComplete="username" 
                              disabled={this.state.isLoading} 
                              required
                            />
                            <Input 
                              inputStyles="password-login"
                              field="password"
                              inputType="password"
                              placeholder={ LANG[localStorage.JobChoiceLanguage].password }
                              onChange={this.handleInputChange}
                              autoComplete="current-password" 
                              disabled={this.state.isLoading} 
                              required
                            />
                          <button disabled={this.state.isLoading} className="btn btn-login btn-tertiary">
                            { LANG[localStorage.JobChoiceLanguage].login }
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8 offset-md-2">
                        <div className='link-container'>
                            <Link to='/forgot-password'>{ LANG[localStorage.JobChoiceLanguage].forgotPW }</Link>
                        </div>
                        <h5 className="add-info">{ LANG[localStorage.JobChoiceLanguage].loginThrough }</h5>
                        <div className="flex-row-center login-sns">

                          <Fbook />
                          <TwitterAuthentication
                            setParent={this.handleChange}
                            twitterLogin={this.twitterLogin}
                            type={'authentication'}
                          />
                          <Button id='line' href={ LINE_AUTH }><FontAwesomeIcon icon={['fab', 'line']}  size="3x" /></Button>
                        </div>
                        <h5 className="add-info">{ LANG[localStorage.JobChoiceLanguage].through }</h5>
                        <div className='login-to-register'>
                            <span className="add-info">{ LANG[localStorage.JobChoiceLanguage].dontHaveAnAccount }</span><br />
                            <div className="link-container">
                            <Link to='/email-registration/job_seeker'>{ LANG[localStorage.JobChoiceLanguage].registerJS }</Link>
                            <span id="or">{ LANG[localStorage.JobChoiceLanguage].or }</span>
                            <Link to='/email-registration/company' onClick={this.handleInDevelopment}>{ LANG[localStorage.JobChoiceLanguage].registerCompany }</Link>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CoverImageComponent>
        </JobChoiceLayout>

        <Modal 
            show={this.state.modal.modal} 
            message={this.state.modal.message}
            messageKey={this.state.modal.messageKey}
            to={this.state.modal.to}
            link={this.state.modal.link}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}
            data={this.state.modal.data}
        />

        <LoadingIcon show={this.state.isLoading} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
