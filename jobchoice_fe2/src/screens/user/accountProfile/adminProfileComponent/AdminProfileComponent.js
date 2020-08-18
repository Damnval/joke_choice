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
import { emailRegex, kanaRegex } from '../../../../regex'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import GenericProfileDetailIndividual from '../genericProfileDetailIndividual/GenericProfileDetailIndividual'
import NameProfileDetailIndividual from '../nameProfileDetailIndividual/NameProfileDetailIndividual'

class AdminProfileComponent extends Component {
    constructor(props) {
        super(props)
        // info is used for display
        // details are used form input
        this.state = {
          activeTab: 0,
          isEditing: false,
          editPassword: false,
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
              email: '',
              password: '',
              c_password: '',
              first_name_kana: '',
              last_name_kana: '',
              contact_no: '',
          },
        }

        this.handleCancel = this.handleCancel.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
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

        this.setState({
          details: {
            ...user_data,
            password: '',
            c_password: '',
          },
          info: {
            ...user_data,
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
            ...this.state.info,
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

        let credentials = {...state.details}

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
              case "name":
                  formErrors.name =
                      value.length < 3 ? LANG[localStorage.JobChoiceLanguage].minimum3 : ""
                  break
              case "email":
                  formErrors.email = emailRegex.test(value) ? "" :
                  LANG[localStorage.JobChoiceLanguage].invalidEmail
                  break
              case "password":
                  if (value.length === 0) {
                    formErrors.password = LANG[localStorage.JobChoiceLanguage].minimum8
                  } else if(value.length < 8) {
                    formErrors.password = LANG[localStorage.JobChoiceLanguage].minimum8
                  } else {
                    formErrors.password = ""
                    formErrors.c_password = ""
                  }
                  
                  if (value!== this.state.details.c_password) {
                    formErrors.c_password = LANG[localStorage.JobChoiceLanguage].pwDontMatch
                  }
                  break
              case "c_password":
                  if(value!== this.state.form.password) {
                    formErrors.c_password = LANG[localStorage.JobChoiceLanguage].pwDontMatch
                  } else {
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
                    formErrors.first_name_kana = dummyArr.filter(function(el) { return el.value === value.type })[0] === false ? LANG[localStorage.JobChoiceLanguage].invalidCharactersUsed : ""
                  } else {
                    formErrors.first_name_kana = ""
                  }
                  break
              case "last_name_kana":
                  if(value.length > 0) {
                    let dummyArr = []
                    for (var x = 0; x < value.length; x++)
                    {
                      dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.last_name_kana = dummyArr.filter(function(el) { return el.value === value.type })[0] === false ? LANG[localStorage.JobChoiceLanguage].invalidCharactersUsed : ""
                  } else {
                    formErrors.last_name_kana = ""
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
              <Button className='profile-buttons' bsStyle='success' type='submit' >{ LANG[localStorage.JobChoiceLanguage].submit }</Button>
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
            <span className='profile-details-individual-title'>{ LANG[localStorage.JobChoiceLanguage].password } : </span>
              <Input 
                value={this.state.details.password}
                inputType='password'
                field='password'
                inputStyles="profile-details-individual-edit"
                onChange={this.handleInputChange}
                error={this.state.formErrors.password}
              />
          </div>
          <div className='profile-details-individual'>
            <span className='profile-details-individual-title'>{ LANG[localStorage.JobChoiceLanguage].confirmPassword }: </span>
            <Input 
              value={this.state.details.c_password}
              inputType='password'
              field='c_password'
              inputStyles="profile-details-individual-edit"
              onChange={this.handleInputChange}
              error={this.state.formErrors.c_password}
            />
            <Button className="profile-buttons" bsStyle='warning' onClick={this.changePassword}>{ LANG[localStorage.JobChoiceLanguage].cancel }</Button>
          </div>
        </>
      )
    }

    render() {
    const { formErrors } = this.state
    const {...form} = this.state.details
    const user = this.state.info

    return (
      <JobChoiceLayout className="jobchoice-body">
      <div className="admin-profile-bg">
        <div className="admin-profile-editor">
          <Breadcrumb className="breadcrumb-account-profile">
            <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
            <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].profile }</Breadcrumb.Item>
          </Breadcrumb>
          {user &&
          <div className='container-fluid min-height'>
            <div className='row profile-area min-height'>
              <div className='col-md-12'>
                <form onSubmit={this.handleSubmit} noValidate>
                  {this.state.activeTab === 0 && 
                    <TabForm label={ LANG[localStorage.JobChoiceLanguage].adminInformation }>
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].emailAddress}
                        value={user.email}
                        field='email'
                        error={formErrors.email}
                        editValue={form.email}
                        isDisabled={false}
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                      />
                      <NameProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].name}
                        first_label={LANG[localStorage.JobChoiceLanguage].firstName}
                        field={{last_name:'last_name', first_name:'first_name'}}
                        detail={{last_name:user.last_name, first_name:user.first_name}}
                        last_label={LANG[localStorage.JobChoiceLanguage].lastName}
                        value={{last_name:form.last_name, first_name:form.first_name}}
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                      />
                      <NameProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].completeKanaName}
                        first_label={LANG[localStorage.JobChoiceLanguage].firstNameKana}
                        field={{last_name:'last_name_kana', first_name:'first_name_kana'}}
                        detail={{last_name:user.last_name_kana, first_name:user.first_name_kana}}
                        last_label={LANG[localStorage.JobChoiceLanguage].lastNameKana}
                        value={{last_name:form.last_name_kana, first_name:form.first_name_kana}}
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                        error={{last_name: this.state.formErrors.last_name_kana, first_name:this.state.formErrors.first_name_kana}}
                      />
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].contactNo}
                        value={user.contact_no}
                        field='contact_no'
                        error={formErrors.contact_no}
                        editValue={form.contact_no}
                        isDisabled={false}
                        inputType='tel'
                        maxLength='11'
                        pattern = "[0-9 + -]+"
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
          message={this.state.modal.message}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect}
      />
      </JobChoiceLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminProfileComponent)
