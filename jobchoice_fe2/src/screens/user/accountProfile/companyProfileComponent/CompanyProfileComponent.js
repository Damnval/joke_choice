import React, { Component } from 'react'
import JobChoiceLayout from '../../../../layouts/jobChoiceLayout/JobChoiceLayout'
import LoadingIcon from '../../../../components/loading/Loading'
import './../AccountProfile.scss'
import { Button } from 'react-bootstrap'
import api from '../../../../utilities/api'
import Modal from '../../../../components/modal/Modal'
import Input from '../../../../components/input/Input'
import { storeAuthenticatedUser } from '../../../../store/user/actions'
import store from '../../../../store/config'
import TabForm from '../tabForm/TabForm'
import { LANG } from '../../../../constants'
import { whiteSpaceValidation } from '../../../../helpers'
import { emailRegex, contactRegex, kanaRegex } from '../../../../regex'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import GenericProfileDetailIndividual from '../genericProfileDetailIndividual/GenericProfileDetailIndividual'
import NameProfileDetailIndividual from '../nameProfileDetailIndividual/NameProfileDetailIndividual'
import ClientDashboardSidebar from '../../../client/clientDashboard/clientDashboardComponents/ClientDashboardSidebar'
import ContactNumberInput from '../../../../components/contactNumberInput/ContactNumberInput'
import AccountInformationComponent from '../accountInformationComponent/AccountInformationComponent'

const formValid = ({ formErrors, details }) => {
  let valid = true
  const company = details.company_data
  
  Object.values(details.user_data).forEach(val => {
    val.length === 0 && (valid = false)
  })

  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  })

  return valid && ( company.company_kana && company.company_name )
}


class CompanyProfileComponent extends Component {
    constructor(props) {
        super(props)
        // info is used for display
        // details are used form input
        this.state = {
          activeTab: 0,
          isEditing: false,
          editPassword: false,
          willSubmitFile: false,
          info: null,
          details: null,
          id: this.props.user.data.id,
          isLoading: false,
          modal: {
              messageKey: null,
              message: '',
              modal: false,
              modalType: '',
              redirect: null,
          },
          formErrors: {
              name: '',
              email: '',
              password: '',
              c_password: '',
              first_name_kana: '',
              last_name_kana: '',
              contact_no: '',
              zip_code: '',
              station: '',
              complete_address: '',
              marital_status: '',
              description: '',
          },
        }

        this.handleCancel = this.handleCancel.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleParentClose = this.handleParentClose.bind(this)
    }

    retrieveUserInfo = (id, state = "get") => {
      api.get(`api/user/${id}`).then(response => {
        const data = response.data.results.user
        const user_data = {
          contact_no: data.contact_no,
          email: data.email,
          first_name: data.first_name,
          first_name_kana: data.first_name_kana,
          last_name: data.last_name,
          last_name_kana: data.last_name_kana
        }
        const company_data = {
          company_kana: data.company.company_kana,
          company_name: data.company.company_name,
          department: data.company.department,
          no_employees: data.company.no_employees,
          purpose: data.company.purpose
        }
        const address_data = { ...data.company.geolocation }
        this.setState({
          modal: {
            messageKey: null,
            message: '',
            modal: false,
            modalType: '',
            redirect: null,
          },
          details: {
            user_data: {
              ...user_data,
              contact_no: user_data.contact_no.slice(3)
            },
            company_data: {...company_data},
            address_data: {...address_data},
            password: '',
            c_password: '',
          },
          info: {
            user_data: {...user_data},
            company_data: {...company_data},
            address_data: {...address_data},
          },
          isLoading: false
        }, () => {
          if (state === 'update') {
            this.setState({
              modal: {
                messageKey: 'successfullyUpdated',
                message: LANG[localStorage.JobChoiceLanguage].successfullyUpdated,
                modal: true,
                modalType: 'success',
              }
            })
          }
        })
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

    componentDidMount() {
      this.setState({
        modal: {
          messageKey: null,
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
        },
        isLoading: true,
      })
      this.retrieveUserInfo(this.props.user.data.id)
      this.isActiveClass(this.state.activeTab)
    }

    handleEdit = e => {
        e.preventDefault()
        let errorList = {}

        this.setState({
            isEditing: true,
            formErrors: {
              ...this.state.formErrors,
              ...errorList
            }
        })
    }

    isActiveClass = (tab) => {
      return `btn ${this.state.activeTab === tab ? 'btn-dark' : 'btn-light'}`
    }

    handleCancel = e => {
        e.preventDefault()
        this.setState({
          isEditing: false,
          details: {
            user_data: {
              ...this.state.info.user_data,
              contact_no: this.state.info.user_data.contact_no.slice(3)
            },
            company_data: {...this.state.info.company_data},
            address_data: {...this.state.info.address_data},
            password: '',
            c_password: '',
          },
          editPassword: false,
          formErrors: {
            ...this.state.formErrors,
            name: '',
            email: '',
            password: '',
            c_password: '',
            birth_date: '',
            first_name_kana: '',
            last_name_kana: '',
            contact_no: '',
          },
        })
    }

    handleSubmit = e => {

        e.preventDefault()
        const state = this.state
        this.setState({
            modal: {
                messageKey: null,
                message: '',
                modal: false,
                modalType: '',
                redirect: null,
            },
            isEditing: false,
            isLoading: true,
        })

        let credentials = {...state.details.user_data,
                           contact_no:'+81'+state.details.user_data.contact_no,
                           company: {...state.details.company_data,
                                     address: {...state.details.address_data}
                           }
                          }

        if (state.editPassword) {
            if (state.details.password.trim() === '') {
                this.setState({
                    modal: {
                      messageKey: 'passwordCannotBeNull',
                      message: LANG[localStorage.JobChoiceLanguage].passwordCannotBeNull,
                      modal: true,
                      modalType: 'error',
                    },
                    isLoading: false
                })
                return
            }

            if (state.details.password !== state.details.c_password) {
                this.setState({
                    modal: {
                      messageKey: 'pwDontMatch',
                      message: LANG[localStorage.JobChoiceLanguage].LANG[localStorage.JobChoiceLanguage].pwDontMatch,
                      modal: true,
                      modalType: 'error',
                    },
                    isLoading: false
                })
                return
            }

            credentials = {
                ...credentials,
                password: state.details.password,
                c_password: state.details.c_password,
            }
        } else {
          delete credentials.password
          delete credentials.c_password
        }

        // Submit to Backend the credentials
        api.patch('api/user/' + this.state.id, credentials).then(response => {

            if(response.data.status === 200){
                if(response.data.error) {
                    const errorValue = Object.values(JSON.parse(response.data.error))
                    this.setState({
                        modal: {
                          messageKey: null,
                          message: errorValue[0][0],
                          modal: true,
                          modalType: 'error',
                        },
                        isLoading: false,
                        editPassword: false
                    })
                }
                else {
                    store.dispatch(storeAuthenticatedUser())
                    this.retrieveUserInfo(this.props.user.data.id, 'update')
                }
            } else {
              this.setState({
                modal: {
                  messageKey: 'somethingWentWrong',
                  message: LANG[localStorage.JobChoiceLanguage].somethingWentWrong,
                  modal: true,
                  modalType: 'error',
                },
                isLoading: false
              })
            }
        }).catch(error => {
          console.log(error.response.data.error)
          store.dispatch(storeAuthenticatedUser())
          this.retrieveUserInfo(this.props.user.data.id)
          let log = error.response.data.error
          try {
            log = Object.entries(JSON.parse(error.response.data.error))
            this.setState({
              isLoading: false,
              modal: {
                messageKey: null,
                message: log[0][1][0],
                modal: true,
                modalType: 'error',
              }
            })
          } catch (e) {
            console.log(e)
            this.setState({
              isLoading: false,
              modal: {
                messageKey: null,
                message: log,
                modal: true,
                modalType: 'error',
              }
            })
          }
        })
    }

    // Object is the object to change
    // Field is an array of fields eg. job_seeker.address.zipcode => [zipcode, address, zipcode]
    // Value is the value to be placed inside
    changeWithinField = (object, field, value) => {
      if (object) {
        let target = object[field[0]]
        if ( typeof(target) === "object" ) {
          object[field[0]] = this.changeWithinField(object[field[0]], field.splice(1), value)
        } else {
          object[field[0]] = value
        }
      } else {
        object = value
      }

      return object
    }

    handleInputChange = (name, value) => {
      if([name] !== ([name] in this.props.user.data)){
          let formErrors = { ...this.state.formErrors }
          switch (name) {
              case "user_data.first_name":
                  formErrors.first_name = whiteSpaceValidation(value)
                  break
              case "user_data.last_name":
                  formErrors.last_name = whiteSpaceValidation(value)
                  break
              case "company_data.company_name":
                  formErrors.company_name = whiteSpaceValidation(value)
                  break
              case "user_data.name":
                  formErrors.name =
                      value.length < 3 ? "minimum3" : whiteSpaceValidation(value)
                  break
              case "user_data.email":
                  formErrors.email = emailRegex.test(value) ? "" : "invalidEmail"
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

                if (value !==  this.state.details.c_password) {
                    formErrors.c_password = 'pwDontMatch'
                }
                if ((value === null || value.length === 0) && this.state.details.c_password.length === 0) {
                    formErrors.password = ""
                    formErrors.c_password = ""
                }
                break
              case "c_password":
                if(value!== this.state.details.password) {
                    formErrors.c_password = 'pwDontMatch'
                } else if (value.trim().length < 8) {
                  formErrors.c_password = 'invalidCharactersUsed'
                } else {
                    formErrors.password = ""
                    formErrors.c_password = ""
                }

                if(this.state.details.password.length < 8) {
                    formErrors.password = 'minimum8'
                }

                if ((value === null || (value && value.length === 0)) && this.state.details.password.length === 0) {
                    formErrors.password = ""
                    formErrors.c_password = ""
                }
                break
              case "user_data.first_name_kana":
                  if(value.length > 0) {
                    let dummyArr = []
                    for (var x = 0; x < value.length; x++)
                    {
                      dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.first_name_kana = dummyArr.filter(function(item) {return item === false})[0] === false ? 
                      "invalidCharactersUsed" : whiteSpaceValidation(value)
                  } else {
                    formErrors.first_name_kana = whiteSpaceValidation(value)
                  }
                  break
              case "user_data.contact_no":
                const num_count = value.replace(/[^0-9]/g,"").length
                if(num_count < 10) {
                  formErrors.contact_no = contactRegex.test(value) || value === "" ? "minimum10" : "invalidFormat"
                } else if(num_count > 11) {
                  formErrors.contact_no = contactRegex.test(value) || value === "" ? "maximum11" : "invalidFormat"
                } else {
                  formErrors.contact_no = contactRegex.test(value) || value === "" ? "" : "invalidFormat"
                }
              break
              case "company_data.company_kana":
                  if(value.length > 0) {
                    let dummyArr = []
                    for (var x = 0; x < value.length; x++)
                    {
                      dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.company_kana = dummyArr.filter(function(item) {return item === false})[0] === false ? "invalidCharactersUsed" : whiteSpaceValidation(value)
                  } else {
                    formErrors.company_kana = whiteSpaceValidation(value)
                  }
                  break
              case "user_data.last_name_kana":
                  if(value.length > 0) {
                    let dummyArr = []
                    for (var x = 0; x < value.length; x++)
                    {
                      dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.last_name_kana = dummyArr.filter(function(item) {return item === false})[0] === false ? "invalidCharactersUsed" : whiteSpaceValidation(value)
                  } else {
                    formErrors.last_name_kana = whiteSpaceValidation(value)
                  }
                  break
              default:
                break
          }
          const fields = name.split('.')
          let {...details} = this.state.details
          this.setState({
            formErrors,
            details: this.changeWithinField(details, fields, value)
          })

      }
  }

    changePassword = (e) => {
      e.preventDefault()

      if(this.state.editPassword){
        this.setState({editPassword: false})
      }

      if(!this.state.editPassword){
        this.setState({
          editPassword: true,
          details: {
            ...this.state.details,
            password: '',
            c_password: '',
          }
        })
      }
    }

    renderDetailRow = (children) => {
      return (
        <div className="row row-bottom-border">
          <div className="col-md-11 offset-md-1">{children}</div>
        </div>
      )
    }

    renderDetailSubmit = () => {
      return (
        <div className='row profile-details-individual'>
          {!this.state.isEditing ?
          <Button className='profile-buttons' bsStyle='primary' onClick={this.handleEdit}>{ LANG[localStorage.JobChoiceLanguage].editProfile }</Button>
          :
          <Button className='profile-buttons' bsStyle='danger' onClick={this.handleCancel}>{ LANG[localStorage.JobChoiceLanguage].cancel }</Button>
          }

          {(this.state.isEditing ||this.state.editPassword) &&
              <Button
                className={`profile-buttons ${(formValid(this.state)) ? 'btn-success' : 'btn-secondary'}`}
                type='submit'
                disabled={(!formValid(this.state))}
              >{ LANG[localStorage.JobChoiceLanguage].submit }</Button>
          }
        </div>
      )
    }

    passwordChangeDetails = () => {
      if (!this.state.editPassword) {
        return (
          <div className='profile-details-individual'>
            <span className='profile-details-individual-title'>{ LANG[localStorage.JobChoiceLanguage].password }: </span>
            <span className='profile-details-individual-value'>**********</span>
            <Button className="profile-buttons" bsStyle='warning' onClick={this.changePassword}>{ LANG[localStorage.JobChoiceLanguage].changePassword }</Button>
          </div>
        )
      }
      return (
        <>
          <div className='profile-details-individual'>
            <span className='profile-details-individual-title'>
              { LANG[localStorage.JobChoiceLanguage].password }
              <span className="required-badge">
                <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
              </span>
            </span>
              <Input
                value={this.state.details.password}
                inputType='password'
                field='password'
                inputStyles="profile-details-individual-edit"
                onChange={this.handleInputChange}
                error={(this.state.formErrors.password) ? LANG[localStorage.JobChoiceLanguage][this.state.formErrors.password] : ''}
              />
          </div>
          <div className='profile-details-individual'>
            <span className='profile-details-individual-title'>
              { LANG[localStorage.JobChoiceLanguage].confirmPassword }
              <span className="required-badge">
                <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
              </span>
            </span>
            <Input
              value={this.state.details.c_password}
              inputType='password'
              field='c_password'
              inputStyles="profile-details-individual-edit"
              onChange={this.handleInputChange}
              error={(this.state.formErrors.c_password) ? LANG[localStorage.JobChoiceLanguage][this.state.formErrors.c_password] : ''}
            />
            <Button className="profile-buttons" bsStyle='warning' onClick={this.changePassword}>{ LANG[localStorage.JobChoiceLanguage].cancel }</Button>
          </div>
        </>
      )
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
    const {...form} = this.state.details
    const user = this.state.info

    return (
      <div>
          <JobChoiceLayout className="jobchoice-body">
            <div className="clientDash-background">
              <ClientDashboardSidebar />
              <div className="client-profile-editor">
                <Breadcrumb className="breadcrumb-account-profile">
                  <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
                  <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].profile }</Breadcrumb.Item>
                </Breadcrumb>
                {user &&
                <div className='container-fluid min-height'>
                  <div className='row profile-area min-height'>
                    <div className='col-md-12'>
                      <div className="row tab-headers">
                        <div className="col-md-12">
                          <div className="tab-container">
                            <button className={this.isActiveClass(0)} onClick={() => this.setState({activeTab: 0})}>{LANG[localStorage.JobChoiceLanguage].userInformation}</button>
                            <button className={this.isActiveClass(1)} onClick={() => this.setState({activeTab: 1})}>{LANG[localStorage.JobChoiceLanguage].companyInformation}</button>
                          </div>
                        </div>
                      </div>
                      <form onSubmit={this.handleSubmit} noValidate>
                        {this.state.activeTab === 0 &&
                          <TabForm label={LANG[localStorage.JobChoiceLanguage].userInformation} buttonSet={this.renderDetailSubmit()}>
                            <GenericProfileDetailIndividual
                              label={LANG[localStorage.JobChoiceLanguage].emailAddress}
                              value={user.user_data.email}
                              field='user_data.email'
                              error={LANG[localStorage.JobChoiceLanguage][formErrors.email]}
                              editValue={form.user_data.email}
                              isDisabled={false}
                              isEditing={this.state.isEditing}
                              handleInputChange={this.handleInputChange}
                              maxLength="50"
                              required={true}
                            />
                            {this.renderDetailRow(
                              this.passwordChangeDetails()
                            )}
                            <NameProfileDetailIndividual
                              label={LANG[localStorage.JobChoiceLanguage].name}
                              first_label={LANG[localStorage.JobChoiceLanguage].firstName}
                              field={{first_name:'user_data.first_name', last_name:'user_data.last_name'}}
                              detail={{first_name:user.user_data.first_name, last_name:user.user_data.last_name}}
                              last_label={LANG[localStorage.JobChoiceLanguage].lastName}
                              value={{first_name:form.user_data.first_name, last_name:form.user_data.last_name}}
                              isEditing={this.state.isEditing}
                              handleInputChange={this.handleInputChange}
                              error={
                                {first_name:LANG[localStorage.JobChoiceLanguage][this.state.formErrors.first_name],
                                 last_name: LANG[localStorage.JobChoiceLanguage][this.state.formErrors.last_name]}
                                }
                              required={true}
                            />
                            <NameProfileDetailIndividual
                              label={LANG[localStorage.JobChoiceLanguage].completeKanaName}
                              first_label={LANG[localStorage.JobChoiceLanguage].firstNameKana}
                              field={{first_name:'user_data.first_name_kana', last_name:'user_data.last_name_kana'}}
                              detail={{first_name:user.user_data.first_name_kana, last_name:user.user_data.last_name_kana}}
                              last_label={LANG[localStorage.JobChoiceLanguage].lastNameKana}
                              value={{first_name:form.user_data.first_name_kana, last_name:form.user_data.last_name_kana}}
                              isEditing={this.state.isEditing}
                              handleInputChange={this.handleInputChange}
                              error={
                                {first_name:LANG[localStorage.JobChoiceLanguage][this.state.formErrors.first_name_kana],
                                 last_name: LANG[localStorage.JobChoiceLanguage][this.state.formErrors.last_name_kana]}
                                }
                              required={true}
                            />
                            <AccountInformationComponent label={LANG[localStorage.JobChoiceLanguage].contactNo} isEditing={this.state.isEditing}>
                              {!this.state.isEditing ?
                                <span className='profile-details-individual-value'>
                                  {user.user_data.contact_no ? user.user_data.contact_no : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                                </span> :
                                <ContactNumberInput
                                  field='user_data.contact_no'
                                  placeholder="xxxxxxxxxx"
                                  value={form.user_data.contact_no}
                                  onChange={this.handleInputChange}
                                  error={ LANG[localStorage.JobChoiceLanguage][formErrors.contact_no] }
                                  required={true}
                                />
                              }
                            </AccountInformationComponent>
                          </TabForm>
                        }
                        {this.state.activeTab === 1 &&
                          <TabForm label={LANG[localStorage.JobChoiceLanguage].companyInformation} buttonSet={this.renderDetailSubmit()}>
                            <GenericProfileDetailIndividual
                              label={LANG[localStorage.JobChoiceLanguage].companyKana}
                              value={user.company_data.company_kana}
                              field='company_data.company_kana'
                              error={LANG[localStorage.JobChoiceLanguage][formErrors.company_kana]}
                              editValue={form.company_data.company_kana}
                              isDisabled={false}
                              isEditing={this.state.isEditing}
                              handleInputChange={this.handleInputChange}
                              required={true}
                            />
                            <GenericProfileDetailIndividual
                              label={LANG[localStorage.JobChoiceLanguage].companyName}
                              value={user.company_data.company_name}
                              field='company_data.company_name'
                              error={LANG[localStorage.JobChoiceLanguage][formErrors.company_name]}
                              editValue={form.company_data.company_name}
                              isDisabled={false}
                              isEditing={this.state.isEditing}
                              handleInputChange={this.handleInputChange}
                              required={true}
                            />
                            <GenericProfileDetailIndividual
                              label={LANG[localStorage.JobChoiceLanguage].department}
                              value={user.company_data.department}
                              field='company_data.department'
                              error={LANG[localStorage.JobChoiceLanguage][formErrors.department]}
                              editValue={form.company_data.department}
                              isDisabled={false}
                              isEditing={this.state.isEditing}
                              handleInputChange={this.handleInputChange}
                            />
                          </TabForm>
                        }
                      </form>
                    </div>
                  </div>
                </div>}
              </div>
            </div>
          <LoadingIcon show={this.state.isLoading} />
          <Modal
              show={this.state.modal.modal}
              messageKey={this.state.modal.messageKey}
              message={this.state.modal.message}
              type={this.state.modal.modalType}
              redirect={this.state.modal.redirect}
              handleParentClose={this.handleParentClose}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfileComponent)


