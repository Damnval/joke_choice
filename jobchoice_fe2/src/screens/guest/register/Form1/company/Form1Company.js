import React, { Component } from "react"
import './../../Register.scss'
import '../RegisterForm1.scss'
import api from '../../../../../utilities/api'
import Input from '../../../../../components/input/Input'
import Modal from '../../../../../components/modal/Modal'
import LoadingIcon from '../../../../../components/loading/Loading'
import InputDropDown from '../../../../../components/inputDropDown/InputDropDown'
import { whiteSpaceValidation } from '../../../../../helpers'
import { Button, Radio } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'
import ContactNumberInput from "../../../../../components/contactNumberInput/ContactNumberInput"
import EmployeeNumberDropDown from "../../../../../components/employeeNumberDropDown/EmployeeNumberDropDown"
import { kanaRegex, contactRegex, numRegex } from '../../../../../regex'
import ZipCodeInput from "../../../../../components/zipcodeInput/ZipCodeInput"

const formValid = ({ formErrors, required }) => {
    let valid = true
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false)
    })
    Object.values(required).forEach(val => {
        (val === null || val.length === 0) && (valid = false)
    })
    return valid
}

class RegisterForm1Company extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: "",
            required: {
                purpose: null,
                password: "",
                c_password: "",
                first_name: null,
                last_name: null,
                first_name_kana: null,
                last_name_kana: null,
                contact_no: null,
                industry_id: "",
                no_employees: null
            },
            nullable: {
                complete_address: null,
                lat: null,
                lng: null,
                zip_code: null,
                prefecture: null,
                company_name: null,
                company_kana: null,
                department: null,
                occupation_id: "",
            },
            isLoading: false,
            companyTypeRequired: false,
            industries: [],
            occupations: [],
            formErrors: {
                password: "",
                c_password: "",
                first_name: "",
                last_name: "",
                first_name_kana: "",
                last_name_kana: "",
                contact_no: "",
                company_name: "",
                company_kana: "",
                no_employees: "",
                zip_code: "",
            },
            modal: {
                messageKey: null,
                message: '',
                modal: false,
                modalType: '',
                redirect: null,
            },
        }
    
        this.handleChange = this.handleChange.bind(this)
        this.clickPurpose = this.clickPurpose.bind(this)
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
        })
        
        // Industry
        api.get('/api/industry').then(response => {
            this.setState({
                industries: response.data.results.industries,
                isLoading: false
            })
        }).catch(error => {
            console.log(error)
            this.setState({
              modal: {
                messageKey: 'serverError',
                message: LANG[localStorage.JobChoiceLanguage].serverError,
                modal: true,
                modalType: 'error',
                redirect: '/',
              }
            })
        })

        // Occupation
        api.get('/api/occupation').then(response => {
            this.setState({
                occupations: response.data.results.occupations,
                isLoading: false
            })
        }).catch(error => {
            console.log(error)
            this.setState({
              modal: {
                messageKey: 'serverError',
                message: LANG[localStorage.JobChoiceLanguage].serverError,
                modal: true,
                modalType: 'error',
                redirect: '/',
              }
            })
        })

        const credentials = {token: this.props.token}
        api.post('api/token/verify', credentials).then(response => {
            this.setState({
              isLoading: false,
              email: response.data.results.email
            }, () => {
              if (!response.data.results.token) {
                this.setState({
                  modal: {
                    messageKey: 'tokenAlreadyExpired',
                    message: LANG[localStorage.JobChoiceLanguage].tokenAlreadyExpired,
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
                  messageKey: null,
                  message: error.response.data.error,
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
        case "password":
            if(value.length < 8) {
                formErrors.password = 'minimum8'
            } else if (value.trim().length < 8) {
                formErrors.password = 'invalidCharactersUsed'
            } else {
                formErrors.password = ""
                formErrors.c_password = ""
            }

            if (value !==  this.state.required.c_password) {
                formErrors.c_password = 'pwDontMatch'
            } 
            if ((value === null || value.length === 0) && this.state.required.c_password.length === 0) {
                formErrors.password = ""
                formErrors.c_password = ""
            }
            break
        case "c_password":
            if(value!== this.state.required.password) {
                formErrors.c_password = 'pwDontMatch'
            } else if (value.trim().length < 8) {
                formErrors.c_password = 'invalidCharactersUsed'
            } else {
                formErrors.password = ""
                formErrors.c_password = ""
            }

            if(this.state.required.password.length < 8) {
                formErrors.password = 'minimum8'
            } 

            if ((value === null || (value && value.length === 0)) && this.state.required.password.length === 0) {
                formErrors.password = ""
                formErrors.c_password = "" 
            } 
            break
        case "first_name_kana":
                if(value.length > 0) {
                    let dummyArr = []
                    for (var x = 0; x < value.length; x++)
                    {
                        dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.first_name_kana = dummyArr.filter(function(item) { return item === false })[0] === false ? 'invalidCharactersUsed' : whiteSpaceValidation(value)
                } else {
                    formErrors.first_name_kana = whiteSpaceValidation(value)
                }
            break
        case "last_name_kana":
                if(value.length > 0) {
                    let dummyArr = []
                    for (var x = 0; x < value.length; x++)
                    {
                        dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.last_name_kana = dummyArr.filter(function(item) { return item === false })[0] === false ? 'invalidCharactersUsed' : whiteSpaceValidation(value)
                } else {
                    formErrors.last_name_kana = whiteSpaceValidation(value)
                }
            break
        case "contact_no":
            const num_count = value.replace(/[^0-9]/g,"").length
            if(num_count < 10) {
                formErrors.contact_no = contactRegex.test(value) || value === "" ? 'minimum10' : 'invalidFormat'
            } else if(num_count > 11) {
                formErrors.contact_no = contactRegex.test(value) || value === "" ? 'minimum10' : 'invalidFormat'
            } else {
                formErrors.contact_no = contactRegex.test(value) || value === "" ? "" : 'invalidFormat'
            }
            break
        case "company_name":
            formErrors.company_name = whiteSpaceValidation(value)
            break
        case "first_name":
            formErrors.first_name = whiteSpaceValidation(value)
            break
        case "last_name":
            formErrors.last_name = whiteSpaceValidation(value)
            break
        case "company_kana":
                if(value.length > 0) {
                    let dummyArr = []
                    for (var x = 0; x < value.length; x++)
                    {
                        dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.company_kana = dummyArr.filter(function(item) { return item === false })[0] === false ? 'invalidCharactersUsed' : whiteSpaceValidation(value)
                } else {
                    formErrors.company_kana = whiteSpaceValidation(value)
                }
            break
        case "no_employees":
            formErrors.no_employees = value < 0 ? 'negativeNotAllowed' : ""
            break
          default:
            break
        }

        switch(name) {
            case "password":
            case "c_password":
            case "first_name":
            case "last_name":
            case "first_name_kana":
            case "last_name_kana":
            case "contact_no":
            case "industry_id":
            case "no_employees":
                this.setState({ 
                    required: {
                        ...this.state.required,
                        [name]: value,
                    } 
                })
                break
            default:
                this.setState({ 
                    nullable: {
                        ...this.state.nullable,
                        [name]: value,
                    } 
                })
                break
        }

        this.setState({ 
          formErrors
        }, () => this.checkPurpose())
    }

    checkPurpose = e => {
        if (this.state.required.purpose === "company_use") {
            if (this.state.nullable.company_name !== null && this.state.nullable.company_kana !== null) {
                this.setState({
                    companyTypeRequired: true,
                })
            }
        }

        if (this.state.required.purpose === "personal_use") {
            this.setState({
                companyTypeRequired: true,
            })
        }
    }

    // This function is used to check whether the company account is for Company Use or Personal.
    // Company Use has No. of Employees while Personal Use has no.
    clickPurpose = (e) => {
        const value = e.target.value
        if (value === 'company_use') {
            this.setState({
                required: {
                    purpose: e.target.value,
                    password: "",
                    c_password: "",
                    first_name: null,
                    last_name: null,
                    first_name_kana: null,
                    last_name_kana: null,
                    contact_no: null,
                    industry_id: "",
                    no_employees: null
                },
                formErrors: {
                    password: "",
                    c_password: "",
                    first_name: "",
                    last_name: "",
                    first_name_kana: "",
                    last_name_kana: "",
                    contact_no: "",
                    company_name: "",
                    company_kana: "",
                    no_employees: "",
                    zip_code: "",
                },
              })
        } else {
            this.setState({
                required: {
                    purpose: e.target.value,
                    password: "",
                    c_password: "",
                    first_name: null,
                    last_name: null,
                    first_name_kana: null,
                    last_name_kana: null,
                    contact_no: null,
                },
                formErrors: {
                    password: "",
                    c_password: "",
                    first_name: "",
                    last_name: "",
                    first_name_kana: "",
                    last_name_kana: "",
                    contact_no: "",
                    company_name: "",
                    company_kana: "",
                    no_employees: "",
                    zip_code: "",
                },
            })
        }
    }

    clickPurposeCancel = e => {
        e.preventDefault()
        this.setState({
            required: {
                ...this.state.required,
                purpose: null,
                password: null,
                c_password: null,
                first_name: null,
                last_name: null,
                first_name_kana: null,
                last_name_kana: null,
                contact_no: null,
                industry_id: null,
            },
            nullable: {
                complete_address: null,
                lat: null,
                lng: null,
                zip_code: null,
                prefecture: null,
                company_name: null,
                company_kana: null,
                no_employees: null,
                department: null,
                occupation_id: null,
            },
        })
    }

    handleSubmit = e => {
        e.preventDefault();
    
        this.setState({
          isLoading:true,
          modal: {
            message: '',
            modal: false,
            modalType: '',
            redirect: null,
          }
        })
    
        let credentials = {
            token: this.props.token,
            first_name: this.state.required.first_name,
            last_name: this.state.required.last_name,
            first_name_kana: this.state.required.first_name_kana,
            last_name_kana: this.state.required.last_name_kana,
            password: this.state.required.password,
            c_password: this.state.required.c_password,
            contact_no: '+81'+this.state.required.contact_no,
            company: {
                purpose: this.state.required.purpose,
                company_name: this.state.nullable.company_name,
                company_kana: this.state.nullable.company_kana,
                no_employees: this.state.required.no_employees,
                department: this.state.nullable.department,
                occupation_id: this.state.nullable.occupation_id,
                industry_id: this.state.required.industry_id,
                address: {
                    complete_address: this.state.nullable.complete_address,
                    lat: 11,
                    lng: 22,
                    zip_code: this.state.nullable.zip_code,
                    prefectures: this.state.nullable.prefecture,
                },
            },
        }

        api.post('api/register/details', credentials).then(response => {         
            this.setState({
              isLoading: false,
              modal: {
                messageKey: 'thankYouForRegistering',
                message: LANG[localStorage.JobChoiceLanguage].thankYouForRegistering,
                modal: true,
                modalType: 'success',
                redirect: '/login',
              }
            })
        }).catch(error => {
            console.log(error)
            this.setState({
              modal: {
                messageKey: 'serverError',
                message: LANG[localStorage.JobChoiceLanguage].serverError,
                modal: true,
                modalType: 'error',
                redirect: '/',
              },
              isLoading: false
            })
        })

    }

    onZipCodeInput = (name, value) => {
        let dummy = ""
        if(value.length > 0 && numRegex.test(value) === false) {
            dummy = LANG[localStorage.JobChoiceLanguage].invalidZipCode
        } else {
            dummy = ""
        }

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout)
        }
      
        if(name === "zip_code" && value.length === 0){
            this.setState({
                formErrors: {
                    ...this.state.formErrors,
                    zip_code: ""
                },
                nullable: {
                    ...this.state.nullable,
                    lat: "",
                    lng: "",
                    zip_code: "",
                    prefecture: "",
                    complete_address: "",
                }, 
                isSearching: true,
            })
        } else {
            this.setState({
                formErrors: {
                    ...this.state.formErrors,
                    zip_code: dummy
                },
                nullable: {
                    ...this.state.nullable,
                    [name]: value,
                }, 
                isSearching: true,
            }, () => setTimeout(this.onSearchFunction(value), 1000))
        }
      }
    
      onSearchFunction = (zipcode) => {
        api.post('api/zipcode', {zipcode:zipcode}).then(response => {
          if (response.data.results) {
            const address = `${response.data.results[0].address2}${response.data.results[0].address3}`
            this.setState({
              nullable: {
                ...this.state.nullable,
                complete_address: address,
                prefecture: response.data.results[0].address1
              }
            })
          }
        }).catch(error => {
          console.log(error)
          this.setState({
            modal: {
              messageKey: "serverError",
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/',
            },
            isLoading: false
          })
        })
      }
    
    render() {

        const { formErrors } = this.state

        return (
        <div className="container register-background">
            <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12">
                <div className="register-card">
                    <h1 className="register-card-title">{ LANG[localStorage.JobChoiceLanguage].registerYourCompany }</h1>
                    <div className="register-card-body">
                    
                        {this.state.required.purpose === null ? 
                            <>
                                <div className="register-company-initial-title">
                                    <span>{ LANG[localStorage.JobChoiceLanguage].chooseWether }</span>
                                </div>
                                <div className="register-company-initial-body">
                                    <Radio className="register-company-initial-body-radio" name="purpose" value="company_use" onChange={this.clickPurpose}>{ LANG[localStorage.JobChoiceLanguage].company }</Radio>
                                    <Radio className="register-company-initial-body-radio" name="purpose" value="personal_use" onChange={this.clickPurpose}>{ LANG[localStorage.JobChoiceLanguage].personal }</Radio>
                                </div>
                            </>
                        :
                            <>
                                <div className="register-company-title">
                                    <Button className="btn pull-left register-company-choose-button" onClick={this.clickPurposeCancel}>
                                        <FontAwesomeIcon icon="arrow-left" />
                                    </Button>
                                    <span>{ LANG[localStorage.JobChoiceLanguage].enterCompanyDetails }</span>
                                </div>
                                <form onSubmit={this.handleSubmit} noValidate className="company-registration-input-container">
                                    <Input
                                        label={ LANG[localStorage.JobChoiceLanguage].email }
                                        field='email'
                                        disabled={true}
                                        initialValue={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                    {this.state.required.purpose === "company_use" && (
                                        <>
                                            <Input
                                                label={ LANG[localStorage.JobChoiceLanguage].companyName }
                                                field='company_name'
                                                placeholder={ LANG[localStorage.JobChoiceLanguage].companyName }
                                                required={true}
                                                value={this.state.nullable.company_name}
                                                onChange={this.handleChange}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.company_name] }
                                                maxLength={70}
                                            />
                                            <Input
                                                label={ LANG[localStorage.JobChoiceLanguage].companyKana }
                                                field='company_kana'
                                                placeholder={ LANG[localStorage.JobChoiceLanguage].companyKana }
                                                required={true}
                                                value={this.state.nullable.company_kana}
                                                onChange={this.handleChange}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.company_kana] }
                                                maxLength={100}
                                            />
                                        </>
                                    )}
                                    <Input
                                        label={ LANG[localStorage.JobChoiceLanguage].lastName }
                                        field='last_name'
                                        placeholder={ LANG[localStorage.JobChoiceLanguage].lastName }
                                        required={true}
                                        value={this.state.required.last_name}
                                        onChange={this.handleChange}
                                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.last_name] }
                                        maxLength={10}
                                    />
                                    <Input
                                        label={ LANG[localStorage.JobChoiceLanguage].firstName }
                                        field='first_name'
                                        placeholder={ LANG[localStorage.JobChoiceLanguage].firstName }
                                        required={true}
                                        value={this.state.required.first_name}
                                        onChange={this.handleChange}
                                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.first_name] }
                                        maxLength={10}
                                    />
                                    <Input
                                      label={ LANG[localStorage.JobChoiceLanguage].lastNameKana }
                                      field='last_name_kana'
                                      placeholder={ LANG[localStorage.JobChoiceLanguage].lastNameKana }
                                      required={true}
                                      value={this.state.required.last_name_kana}
                                      onChange={this.handleChange}
                                      error={ LANG[localStorage.JobChoiceLanguage][formErrors.last_name_kana] }
                                      maxLength={20}
                                    />
                                    <Input
                                        label={ LANG[localStorage.JobChoiceLanguage].firstNameKana }
                                        field='first_name_kana'
                                        placeholder={ LANG[localStorage.JobChoiceLanguage].firstNameKana }
                                        required={true}
                                        value={this.state.required.first_name_kana}
                                        onChange={this.handleChange}
                                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.first_name_kana] }
                                        maxLength={20}
                                    />
                                    <Input
                                        label={ LANG[localStorage.JobChoiceLanguage].password }
                                        field='password'
                                        placeholder={ LANG[localStorage.JobChoiceLanguage].enterMoreThan8 }
                                        required={true}
                                        value={this.state.required.password}
                                        inputType='password'
                                        onChange={this.handleChange}
                                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.password] }
                                        maxLength={20}
                                    />
                                    <Input
                                        label={ LANG[localStorage.JobChoiceLanguage].confirmPassword }
                                        field='c_password'
                                        placeholder={ LANG[localStorage.JobChoiceLanguage].enterMoreThan8 }
                                        required={true}
                                        value={this.state.required.c_password}
                                        inputType='password'
                                        onChange={this.handleChange}
                                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.c_password] }
                                        maxLength={20}
                                    />
                                    <div className="register-additional-text">
                                      <span>{ LANG[localStorage.JobChoiceLanguage].halfWidthAlphanumeric }</span><br/>
                                      <span>{ LANG[localStorage.JobChoiceLanguage].halfWidthKanaSymbols }</span>
                                    </div>
                                    <ContactNumberInput
                                        label={ LANG[localStorage.JobChoiceLanguage].cellphoneNumber }
                                        field='contact_no'
                                        required={true}
                                        placeholder="xxxxxxxxxx"
                                        value={this.state.required.contact_no}
                                        onChange={this.handleChange}
                                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.contact_no] }
                                        maxLength={11}
                                    />
                                    <div className="register-additional-text">
                                        <span>{ LANG[localStorage.JobChoiceLanguage].halfWidthNumberOnly }</span>
                                    </div>
                                    <ZipCodeInput
                                        label={ LANG[localStorage.JobChoiceLanguage].zipCode }
                                        field='zip_code'
                                        value={this.state.nullable.zip_code}
                                        handleInputChange={this.onZipCodeInput}
                                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.zip_code] }
                                    />
                                    <Input
                                        label={ LANG[localStorage.JobChoiceLanguage].prefecture }
                                        field='prefecture'
                                        placeholder={ LANG[localStorage.JobChoiceLanguage].prefecture }
                                        value={this.state.nullable.prefecture}
                                        onChange={this.handleChange}
                                        disabled
                                    />
                                    <Input
                                        label={ LANG[localStorage.JobChoiceLanguage].address }
                                        field='complete_address'
                                        placeholder={ LANG[localStorage.JobChoiceLanguage].address }
                                        value={this.state.nullable.complete_address}
                                        onChange={this.handleChange}
                                        maxLength={100}
                                    />
                                    {this.state.required.purpose === "company_use" && (
                                        <>
                                            <InputDropDown 
                                                label={ LANG[localStorage.JobChoiceLanguage].industry }
                                                field='industry_id'
                                                required={true}
                                                placeholder=" "
                                                value={this.state.nullable.industry_id}
                                                options={this.state.industries}
                                                onChange={this.handleChange}
                                            >
                                                {(this.state.industries.map((value, _) => {
                                                    return (<option key={value.id} value={value.id}>{value.name}</option>)
                                                }))}
                                            </InputDropDown>
                                            <EmployeeNumberDropDown
                                                label={ LANG[localStorage.JobChoiceLanguage].numberOfEmployees }
                                                infoChange={this.handleChange}
                                                required={true}
                                                value={this.state.nullable.no_employees}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.no_employees] }
                                            />
                                            <Input
                                                label={ LANG[localStorage.JobChoiceLanguage].department }
                                                field='department'
                                                placeholder={ LANG[localStorage.JobChoiceLanguage].department }
                                                value={this.state.nullable.department}
                                                onChange={this.handleChange}
                                                maxLength={50}
                                            />
                                        </>
                                    )}
                                    {this.state.required.purpose === "personal_use" && (
                                        <>
                                            <InputDropDown 
                                                label={ LANG[localStorage.JobChoiceLanguage].occupation }
                                                field='occupation_id'
                                                placeholder=" "
                                                value={this.state.nullable.occupation_id}
                                                options={this.state.occupations}
                                                onChange={this.handleChange}
                                            >
                                                {(this.state.occupations.map((value, _) => {
                                                    return (<option key={value.id} value={value.id}>{value.name}</option>)
                                                }))}
                                            </InputDropDown>
                                        </>
                                    )}
                                    <Button
                                    type="submit"
                                    disabled={(!formValid(this.state) || (!this.state.companyTypeRequired))}
                                    className={`btn ${(formValid(this.state) && (this.state.companyTypeRequired)) ? 'register-button' : 'register-disabled'}`}>
                                        { LANG[localStorage.JobChoiceLanguage].register }
                                    </Button>
                                </form>
                            </>
                        }
                    </div>
                </div>
            </div>

            <Modal 
                show={this.state.modal.modal} 
                message={this.state.modal.message}
                messageKey={this.state.modal.messageKey}
                type={this.state.modal.modalType}
                redirect={this.state.modal.redirect}
                data={this.state.modal.data}
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

  export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm1Company)
