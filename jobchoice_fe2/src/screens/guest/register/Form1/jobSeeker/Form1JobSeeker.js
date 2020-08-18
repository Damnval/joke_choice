import React, { Component } from "react"
import '../../Register.scss'
import '../RegisterForm1.scss'
import Input from '../../../../../components/input/Input'
import Modal from '../../../../../components/modal/Modal'
import LoadingIcon from '../../../../../components/loading/Loading'
import api from '../../../../../utilities/api'
import { LANG } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'
import RegisterHatarakikataModal from './registerHatarakikataModal/RegisterHatarakikataModal'
import {contactRegex} from '../../../../../regex'
import RegisterBreadcrumbs from "../../registerBreadcrumbs/RegisterBreadcrumbs"
import ContactNumberInput from "../../../../../components/contactNumberInput/ContactNumberInput"

const formValid = ({ formErrors, form }) => {
  let valid = true

  Object.keys(formErrors).map(function(el) {
    if ( formErrors[el].length > 0 ) {
        valid = false
    }
  })

  Object.keys(form).map(function(el) {
      if ( form[el].length === 0 ) {
          valid = false
      }
  })

  return valid
}

class Form1JobSeeker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: "",
      form: {
        contact_no: "",
        password: "",
        c_password: "",
      },
      user_id: null,
      isLoading: false,
      formErrors: {
        contact_no: "",
        password: "",
        c_password: ""
      },
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
      hatarakikataModal: {
        modal: false,
        Redirect: null,
        data: null,
      },
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.setState({
        isLoading: true,
    }, () => {
      if (this.props.history.location.state) {
        this.setState({
          form: {
            contact_no: this.props.history.location.state.data.contact_no.toString().slice(3),
            password: this.props.history.location.state.data.password,
            c_password: this.props.history.location.state.data.password,
          }
        })
      }
    })
    const credentials = {token: this.props.token}
    api.post('api/token/verify', credentials).then(response => {
      this.setState({
        isLoading: false,
        email: response.data.results.email,
      }, () => {
        if (!response.data.results.token) {
          this.setState({
            modal: {
              message: LANG[localStorage.JobChoiceLanguage].tokenAlreadyExpired,
              messageKey: 'tokenAlreadyExpired',
              modal: true,
              modalType: 'error',
              redirect: '/',
            }
          })
        }
      })
    }).catch(error => {
        console.log(error)
        this.setState({
          modal: {
            message: error.response.data.error,
            messageKey: null,
            modal: true,
            modalType: 'error',
            redirect: '/',
          },
          isLoading: false
        })
    })
}

  handleChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "contact_no":
        const num_count = value.replace(/[^0-9]/g,"").length
        if(num_count > 0 && num_count < 10) {
          formErrors.contact_no = contactRegex.test(value) || value === "" ? 'minimum10' : 'invalidFormat'
        } else if(num_count === 0) {
          formErrors.contact_no = "" 
        } else if(num_count > 11) {
          formErrors.contact_no = contactRegex.test(value) || value === "" ? 'tenCharOnly' : 'invalidFormat'
        } else {
          formErrors.contact_no = contactRegex.test(value) || value === "" ? "" : 'invalidFormat'
        }
        break
      case "password":
        if(value.length < 8) {
            formErrors.password = 'minimum8'
        } else if (value.trim().length < 8) {
          formErrors.password = 'invalidCharactersUsed'
        } else {
            formErrors.password = ""
            formErrors.c_password = ""
        }

        if (value !==  this.state.form.c_password && this.state.form.c_password.length > 0) {
            formErrors.c_password = 'pwDontMatch'
        } 
        if ((value === null || value.length === 0) && this.state.form.c_password.length === 0) {
            formErrors.password = ""
            formErrors.c_password = ""
        }
        break
      case "c_password":
        if(value!== this.state.form.password) {
            formErrors.c_password = 'pwDontMatch'
        } else if (value.trim().length < 8) {
          formErrors.c_password = 'invalidCharactersUsed'
        }else {
            formErrors.password = ""
            formErrors.c_password = ""
        }

        if(this.state.form.password.length < 8) {
            formErrors.password = 'minimum8'
        } 

        if ((value === null || (value && value.length === 0)) && this.state.form.password.length === 0) {
            formErrors.password = ""
            formErrors.c_password = "" 
        } 
        break
      default:
        break
    }
    this.setState({ 
      formErrors,
      form: {
        ...this.state.form,
        [name]: value,
      } 
    })
  }

  handleSubmit = e => {
    e.preventDefault();

    const previous_data = this.props.history.location.state

    this.setState({
      isLoading:true,
      modal: {
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      }
    }, () => {
      
      const token = this.props.token
      let credentials = {}
      
      api.post('api/verify-phone-number', { contact_no : '+81'+this.state.form.contact_no}).then(response => {
        if(response.data.status == 200) {

          if ( previous_data ) {
            credentials = {
              ...previous_data.data,
              contact_no: '+81'+this.state.form.contact_no,
              password: this.state.form.password,
              c_password: this.state.form.c_password,
            }
          } else {
            credentials = {
              email: this.state.email,
              name: "",
              kana: null,
              token: token,
              contact_no: '+81'+this.state.form.contact_no,
              password: this.state.form.password,
              c_password: this.state.form.c_password,
              job_seeker: {
                profile_picture:null,
                birth_date: "",
                gender: "",
                nearest_station: "",
                hataraki_kata: [],
                address: {
                  complete_address: "",
                  lat: null,
                  lng: null,
                  zip_code: null
                },
                marital_status: null,
                description: null
              },
              bank_account: {
                bank_name: "",
                branch_name: "",
                deposit_type: "",
                account_number: "",
                account_holder: "",  
              },
              educational_bg: null,
              work_exp: null,
              skills: [],
            }
          }
    
          let formErrors = this.props.history.location.state && this.props.history.location.state.formErrors ?
            this.props.history.location.state.formErrors : null
    
          this.setState({
            hatarakikataModal: {
              modal: true,
              history: this.props.history,
              Redirect: this.redirect,
              data: {
                credentials: credentials,
                formErrors: formErrors
              },
              token: this.props.token
            },
            isLoading: false
          })

        }
      }).catch( error => { 

        this.setState({
          modal: {
            message: 'invalidPhoneNumber',
            messageKey: 'invalidPhoneNumber',
            modal: true,
            modalType: 'error',
            redirect: null,
          },
          isLoading: false
        })  
    
      })
      
    })
  }

  redirect = (path) => {
    let formErrors = this.props.history.location.state && this.props.history.location.state.formErrors ?
        this.props.history.location.state.formErrors : null

    this.props.history.push({
      pathname: path,
      state: {
        data: this.state.hatarakikataModal.data,
        token: this.state.hatarakikataModal.token,
        formErrors: formErrors,
        mode: 'registration'
      }
    })
  }

  render() {

    const { formErrors } = this.state

    return (
      <div className="register-background">
        {!this.state.isLoading && <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12 col-xs-12">
              <RegisterBreadcrumbs step={this.props.step}/>
              <div className="register-card">
                <h1 className="register-card-title">{ LANG[localStorage.JobChoiceLanguage].loginInformation }</h1>
                <form onSubmit={this.handleSubmit} noValidate>
                  <div className="register-card-body">
                    <div className="form-box no-border">
                      <Input
                        label={ LANG[localStorage.JobChoiceLanguage].pleaseEnterYourEmail }
                        field='email'
                        disabled={true}
                        initialValue={this.state.email}
                        onChange={this.handleChange}
                        required={true}
                      />
                      <ContactNumberInput
                        label={ LANG[localStorage.JobChoiceLanguage].cellphoneNumber }
                        field='contact_no'
                        placeholder="xxxxxxxxxx"
                        value={this.state.form.contact_no}
                        onChange={this.handleChange}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.contact_no] }
                        required={true}
                      />
                      <div className="register-additional-text">
                        <span>{ LANG[localStorage.JobChoiceLanguage].halfWidthNumberOnly }</span>
                      </div>
                      <div className="register-additional-text">
                        <span>{ LANG[localStorage.JobChoiceLanguage].pleaseEnterAfter }</span>
                      </div>
                      <div className="register-additional-text">
                        <span>090-1234-5678 → 9012345678</span>
                      </div>
                      <Input
                        label={ LANG[localStorage.JobChoiceLanguage].password }
                        field='password'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].enterNotMoreThan20 }
                        value={this.state.form.password}
                        inputType='password'
                        onChange={this.handleChange}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.password] }
                        required={true}
                        maxLength={20}
                      />
                      <div className="register-additional-text">
                        <span>{ LANG[localStorage.JobChoiceLanguage].halfWidthAlphanumeric }</span><br/>
                        <span>{ LANG[localStorage.JobChoiceLanguage].halfWidthKanaSymbols }</span>
                      </div>
                      <Input
                        label={ LANG[localStorage.JobChoiceLanguage].confirmPassword }
                        field='c_password'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].enterNotMoreThan20 }
                        value={this.state.form.c_password}
                        inputType='password'
                        onChange={this.handleChange}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.c_password] }
                        required={true}
                        maxLength={20}
                      />
                    </div>
                    <div className="submit-container">
                      <button
                        type="submit"
                        disabled={(!formValid(this.state))}
                        className={`${(!formValid(this.state) === true) ? 'register-disabled' : 'register-button'}`}
                      >
                        { LANG[localStorage.JobChoiceLanguage].register }
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>}

        <Modal 
          show={this.state.modal.modal} 
          message={this.state.modal.message}
          messageKey={this.state.modal.messageKey}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}
          data={this.state.modal.data}
        />

        <RegisterHatarakikataModal
          show={this.state.hatarakikataModal.modal}
          Redirect={this.state.hatarakikataModal.Redirect}
          token={this.state.hatarakikataModal.token}
        />

        <LoadingIcon show={this.state.isLoading} />
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Form1JobSeeker)
