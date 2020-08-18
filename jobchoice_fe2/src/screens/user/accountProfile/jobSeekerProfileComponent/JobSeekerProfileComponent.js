import React, { Component } from 'react'
import JobChoiceLayout from '../../../../layouts/jobChoiceLayout/JobChoiceLayout'
import LoadingIcon from '../../../../components/loading/Loading'
import './../AccountProfile.scss'
import { Button } from 'react-bootstrap'
import api from '../../../../utilities/api'
import { Link } from 'react-router-dom'
import Modal from '../../../../components/modal/Modal'
import Input from '../../../../components/input/Input'
import { storeAuthenticatedUser } from '../../../../store/user/actions'
import store from '../../../../store/config'
import TabForm from './../tabForm/TabForm'
import InputDropDown from '../../../../components/inputDropDown/InputDropDown'
import WorkExperienceRow from '../../../../components/accountInformation/workExperienceRow/WorkExperienceRow'
import EducationalBackgroundRow from '../../../../components/accountInformation/educationalBackgroundRow/EducationalBackgroundRow'
import InputFile from '../../../../components/InputFile/InputFile'
import InputTextArea from '../../../../components/inputTextArea/InputTextArea'
import { LANG, EM } from '../../../../constants'
import { fileTypes, emailRegex, contactRegex, kanaRegex  } from '../../../../regex'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import GenericProfileDetailIndividual from './../genericProfileDetailIndividual/GenericProfileDetailIndividual'
import NameProfileDetailIndividual from './../nameProfileDetailIndividual/NameProfileDetailIndividual'
import MaritalStatusDropDown from '../../../../components/maritalStatusDropDown/MaritalStatusDropDown'
import GenderDropDown from '../../../../components/genderDropDown/GenderDropDown'
import AccountInformationComponent from './../accountInformationComponent/AccountInformationComponent'
import BankModal from '../../../../components/bankModal/bankModal'
import BankBranchModal from '../../../../components/bankBranchModal/bankBranchModal'
import DateInput from '../../../../components/dateInput/DateInput'
import { BirthdayValidation } from "../../../../helpers"
import InputRadio from '../../../../components/inputRadio/InputRadio'
import zenginCode from 'zengin-code'
import ZipCodeInput from '../../../../components/zipcodeInput/ZipCodeInput'
import Img from 'react-fix-image-orientation'
import { Image } from "load-image-react"
import ContactNumberInput from '../../../../components/contactNumberInput/ContactNumberInput'

const numRegex = RegExp(/^\d+$/)
const formValid = ({ formErrors }) => {
  let valid = true

  Object.values(formErrors).forEach(val => {
    if (val instanceof Array) {
      Object.values(val).forEach(el => {
        Object.values(el).splice(1).forEach(item => {
          item.length > 0 && (valid = false)
        })
      })
    } else {
      val.length > 0 && (valid = false)
    }
  })

  return valid
}

class JobSeekerProfileComponent extends Component {
    constructor(props) {
        super(props)
        // info is used for display
        // details are used form input
        this.state = {
            isEditing: false,
            editPassword: false,
            willSubmitFile: false,
            bankClick: null,
            bankLabel: null,
            activeTab: 0,
            info: null,
            details: null,
            id: this.props.user.data.id,
            isLoading: false,
            latestImage: Date.now(),
            modal: {
                message: '',
                messageKey: null,
                modal: false,
                modalType: '',
                redirect: null,
            },
            form: {
              educational_bg: [
                {
                  id:0,
                  school: "",
                  year: "",
                  month: ""
                }
              ],
              work_exp: [
                {
                  id:0,
                  company: "",
                  position: "",
                  start_date: "",
                  end_date: ""
                }
              ],
            },
            skills: [],
            formErrors: {
                name: '',
                email: '',
                password: '',
                c_password: '',
                birth_date: '',
                first_name_kana: '',
                last_name_kana: '',
                gender: '',
                contact_no: '',
                zip_code: '',
                station: '',
                complete_address: '',
                marital_status: '',
                about_me: '',
                bank_name: '',
                branch_name: '',
                account_number: '',
                account_holder: '',
                deposit_type: '',
                description: '',
            },
            bankBranches: null,
            bankModal: {
              title: "",
              bank_modal: false
            },
            branchModal: {
              title: "",
              branch_code: "",
              branch_modal: false
            },
        }

        this.handleCancel = this.handleCancel.bind(this)
        this.handleFile = this.handleFile.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onSearchFunction = this.onSearchFunction.bind(this)
        this.showBankModal = this.showBankModal.bind(this)
        this.handleBankModal = this.handleBankModal.bind(this)
        this.setBankData = this.setBankData.bind(this)
        this.showBankBranchModal = this.showBankBranchModal.bind(this)
        this.handleBranchBankModal = this.handleBranchBankModal.bind(this)
        this.setBankBranchData = this.setBankBranchData.bind(this)
        this.handleParentClose = this.handleParentClose.bind(this)
    }

    retrieveUserInfo = (id) => {
      api.get(`api/user/${id}`).then(response => {
        const data = response.data.results
        if (data.user.job_seeker) {
          const job_seeker = {...data.user.job_seeker}
          const educ_form = job_seeker.educational_background.map((el, key) => {
            return ({
              id:key,
              school: "",
              year: "",
              month: ""
            })
          })
          const work_form = job_seeker.work_experience.map((el, key) => {
            return ({
              id:key,
              company: "",
              position: "",
              start_date: "",
              end_date: ""
              })
          })
          const work_list = job_seeker.work_experience.map((el, key) => {
            return ({
              id:key,
              company: el.company,
              position: el.position,
              start_date: el.start_date,
              end_date: el.end_date
              })
          })
          const educ_list = job_seeker.educational_background.map((el, key) => {
            return ({
              id:key,
              school: el.school,
              year: el.year,
              month: el.month
              })
          })
          let bank_account = {account_holder: '',
                              account_number: '',
                              bank_code: '',
                              bank_name: '',
                              branch_code: '',
                              branch_name: '',
                              deposit_type: ''}
          if (job_seeker.bank_account) {
            bank_account = {
              account_holder: (job_seeker.bank_account.account_holder === null) ? '' : job_seeker.bank_account.account_holder,
              account_number: (job_seeker.bank_account.account_number === null) ? '' : job_seeker.bank_account.account_number,
              bank_code: (job_seeker.bank_account.bank_code === null) ? '' : job_seeker.bank_account.bank_code,
              bank_name: (job_seeker.bank_account.bank_name === null) ? '' : job_seeker.bank_account.bank_name,
              branch_code: (job_seeker.bank_account.branch_code === null) ? '' : job_seeker.bank_account.branch_code,
              branch_name: (job_seeker.bank_account.branch_name === null) ? '' : job_seeker.bank_account.branch_name,
              deposit_type: (job_seeker.bank_account.deposit_type === null) ? '' : job_seeker.bank_account.deposit_type
            }

            Object.keys(zenginCode).map((val,i) => {
              if(job_seeker.bank_account.bank_code !== '' && job_seeker.bank_account.bank_code == zenginCode[val].code) {
                this.setState({
                  bankBranches: zenginCode[val].branches
                })
              }
            })
          }
          this.setState({
            latestImage: Date.now(),
            details: {
              ...data.user,
              contact_no: data.user.contact_no.slice(3),
              password: '',
              c_password: '',
              job_seeker: {
                ...job_seeker,
                address: {...job_seeker.address},
                bank_account: {...bank_account}
              }
            },
            info: {
              ...data.user,
              job_seeker: {
                ...job_seeker,
                address: {...job_seeker.address},
                bank_account: {...bank_account}
              }
            },
            form: {
              work_exp: work_list,
              educational_bg: educ_list,
            },
            formErrors: {
              ...this.state.formErrors,
              work_exp: work_form,
              educational_bg:educ_form
            },
          }, () => {
            api.get('api/skill').then(response => {
              const mySkills = this.state.info.job_seeker.job_seeker_skills
              const skills = response.data.results.skills.map (value => {
                return({
                  id: value.id,
                  name: value.name,
                  value: (mySkills.filter(function (el) {return el.skill_id === value.id})[0] !== undefined),
                })
              })
              this.setState({
                isLoading: false,
                skills: skills
              })
            }).catch(error => {
              console.log(error)
              this.setState({
                isLoading: false,
                modal: {
                  message: LANG[localStorage.JobChoiceLanguage].serverError,
                  messageKey: 'serverError',
                  modal: true,
                  modalType: 'error',
                  redirect: '/',
                }
              })
            })
          })
        } else {
          this.setState({
            isLoading: false,
            info: data.user,
            details: data.user
          })
        }
      }).catch(error => {
        console.log(error)
        this.setState({
          isLoading: false,
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            messageKey: 'serverError',
            modal: true,
            modalType: 'error',
            redirect: '/',
          }
        })
      })
    }

    componentDidMount() {
      const activeTab = this.props.location.state ? this.props.location.state.whatTab : 0
      this.setState({
        modal: {
          message: '',
          messageKey: null,
          modal: false,
          modalType: '',
          redirect: null,
        },
        isLoading: true,
        activeTab: activeTab
      })
      this.retrieveUserInfo(this.props.user.data.id)
      this.isActiveClass(this.state.activeTab)
    }

    handleEdit = e => {
        e.preventDefault()
        let checkList = {}
        let errorList = {}
        if (this.state.form.work_exp.length === 0) {
          checkList = {
            ...checkList,
            work_exp: [{
                id:0,
                company: "",
                position: "",
                start_date: "",
                end_date: ""
              }]
          }
          errorList = {
            work_exp: [{
              id:0,
                company: "",
                position: "",
                start_date: "",
                end_date: ""
            }]
          }
        }
        if (this.state.form.educational_bg.length === 0) {
          checkList = {
            ...checkList,
            educational_bg: [{
              id:0,
              school: "",
              year: "",
              month: ""
            }]
          }
          errorList = {
            ...errorList,
            educational_bg: [{
              id:0,
              school: "",
              year: "",
              month: ""
            }]
          }
        }

        this.setState({
            isEditing: true,
            form: {
              ...this.state.form,
              ...checkList,
            },
            formErrors: {
              ...this.state.formErrors,
              ...errorList
            }
        })
    }

    toggleSkill = (e, field) => {
      const obj = [...this.state[field]]
      const name = e.target.name
      obj[name].value = !obj[name].value
      this.setState({
        [field]: obj
      })
    }

    // Function used when user cancels from Edit Profile
    // Educational Background and Work Experience is reset
    // details state is reset back to info data
    handleCancel = e => {
        e.preventDefault()
        if (this.state.details.job_seeker) {
          const educ_form = this.state.details.job_seeker.educational_background.map(el => {
            return (
              {
                id:el.id,
                school: "",
                year: "",
                month: ""
              }
            )
          })
          const work_form = this.state.details.job_seeker.work_experience.map(el => {
            return (
              {
              id:el.id,
              company: "",
              position: "",
              start_date: "",
              end_date: ""
              }
            )
          })
          this.setState({
              isEditing: false,
              details: {
                ...this.state.info,
                contact_no: this.state.info.contact_no.slice(3),
                job_seeker: {
                  ...this.state.info.job_seeker,
                  address: {...this.state.info.job_seeker.address},
                  bank_account: {...this.state.info.job_seeker.bank_account}
                },
                password: '',
                c_password: '',
              },
              form: {
                work_exp: this.state.details.job_seeker.work_experience,
                educational_bg: this.state.details.job_seeker.educational_background,
              },
              editPassword: false,
              formErrors: {
                description: '',
                gender: '',
                zip_code: '',
                station: '',
                complete_address: '',
                marital_status: '',
                about_me: '',
                bank_name: '',
                branch_name: '',
                account_number: '',
                account_holder: '',
                deposit_type: '',
                work_exp: [...work_form],
                educational_bg:[...educ_form]
              },
          })
        }
    }

    handleFile = e => {
      e.preventDefault()
      let reader = new FileReader()
      const file = e.target.files[0]

      if ( file ) {
        if (!fileTypes.every(type =>file.type !== type)) {
          if (file.size > 5000000) {
            this.setState({
              details: {
                ...this.state.details,
                job_seeker: {
                  ...this.state.details.job_seeker,
                  profile_picture: "",
                },
              },
              formErrors: {
                ...this.state.formErrors,
                profile_picture: 'fileSizeTooLarge',
              },
            }, e.target.value = null)
          } else {
            reader.onload = (e) => {
              this.setState({
                details: {
                  ...this.state.details,
                  job_seeker: {
                    ...this.state.details.job_seeker,
                    profile_picture: e.target.result,
                  },
                },
                formErrors: {
                  ...this.state.formErrors,
                  profile_picture: "",
                },
              })
            }
            reader.readAsDataURL(e.target.files[0])
          }
        } else {
          this.setState({
            formErrors: {
              ...this.state.formErrors,
              profile_picture: LANG[localStorage.JobChoiceLanguage].invalidFileType,
            },
          }, e.target.value = null)
        }
      }
    }

    handleFileSubmit = e => {
      e.preventDefault();

      this.setState({
        isLoading:true,
        modal: {
          message: '',
          messageKey: null,
          modal: false,
          modalType: '',
          redirect: null,
        }
      }, () => {

        let workList = Object.values([...this.state.form.work_exp]).filter(el => {
          return (
            Object.values(el).splice(1).every(field => field !== "")
          )
        })

        let educList = Object.values([...this.state.form.educational_bg]).filter(el => {
          return (
            Object.values(el).splice(1).every(field => field !== "")
          )
        })

        const skillSet = this.state.skills.filter(el => el.value).map (el => {
          return el.id
        })

        let {...credentials} = this.state.details
        credentials.contact_no = '+81'+this.state.details.contact_no
        credentials['job_seeker']['profile_picture'] = this.state.details.job_seeker.profile_picture
        delete credentials.job_seeker.bank_account.created_at
        delete credentials.job_seeker.bank_account.updated_at
        delete credentials.job_seeker.bank_account.id
        delete credentials.job_seeker.bank_account.job_seeker_id
        credentials.bank_account = credentials.job_seeker.bank_account
        delete credentials.job_seeker.bank_account
        delete credentials.password
        delete credentials.c_password
        credentials.skills = [...skillSet]
        credentials.educational_bg = [...educList]
        credentials.work_exp = [...workList]

        api.patch('api/user/' + this.state.id, credentials).then(response => {

            if(response.data.status === 200){
                if(response.data.error) {
                    const errorValue = Object.values(JSON.parse(response.data.error))
                    this.setState({
                        modal: {
                            message: errorValue[0][0],
                            messageKey: null,
                            modal: true,
                            modalType: 'error',
                        },
                        isLoading: false,
                        editPassword: false,
                    })
                }
                else {
                    store.dispatch(storeAuthenticatedUser())
                    this.retrieveUserInfo(this.props.user.data.id)
                    this.setState({willSubmitFile: false})
                }
            } else {
              this.setState({
                modal: {
                  message: LANG[localStorage.JobChoiceLanguage].somethingWentWrong,
                  messageKey: "somethingWentWrong",
                  modal: true,
                  modalType: 'error',
                },
                isLoading: false,
                willSubmitFile: false
              })
            }
        }).catch(error => {
            console.log(error)
            this.setState({
              modal: {
                message: LANG[localStorage.JobChoiceLanguage].serverError,
                messageKey: "serverError",
                modal: true,
                modalType: 'error',
                redirect: '/home',
              },
              isLoading: false,
            })
        })
      })
    }

    // This function is used when submitting Editted Profile
    // This does not include submitting Profile Picture
    handleSubmit = e => {

        e.preventDefault()
        const state = this.state
        this.setState({
            modal: {
                message: '',
                messageKey: null,
                modal: false,
                modalType: '',
                redirect: null,
            },
            isEditing: false,
            isLoading: true,
        })

        let {...credentials} = state.details

        // If Job Seeker
        credentials.job_seeker = {...credentials.job_seeker}
        let workList = Object.values([...this.state.form.work_exp]).filter(el => {
          return (
            Object.values(el).splice(1).every(field => field !== "")
          )
        })

        let educList = Object.values([...this.state.form.educational_bg]).filter(el => {
          return (
            Object.values(el).splice(1).every(field => field !== "")
          )
        })

        const skillSet = this.state.skills.filter(el => el.value).map (el => {
          return el.id
        })

        delete credentials.job_seeker.bank_account.created_at
        delete credentials.job_seeker.bank_account.updated_at
        delete credentials.job_seeker.bank_account.id
        delete credentials.job_seeker.bank_account.job_seeker_id
        credentials.educational_bg = [...educList]
        credentials.work_exp = [...workList]
        credentials.job_seeker.address = {...credentials.job_seeker.geolocation}
        credentials.skills = [...skillSet]
        credentials.bank_account = credentials.job_seeker.bank_account
        credentials.contact_no = '+81'+this.state.details.contact_no
        delete credentials.job_seeker.geolocation
        delete credentials.job_seeker.job_seeker_skill
        delete credentials.job_seeker.bank_account

        if (state.editPassword) {
            if (state.details.password.trim() === '') {
                this.setState({
                    modal: {
                      message: LANG[localStorage.JobChoiceLanguage].passwordCannotBeNull,
                      messageKey: "passwordCannotBeNull",
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
                      message: LANG[localStorage.JobChoiceLanguage].LANG[localStorage.JobChoiceLanguage].pwDontMatch,
                      messageKey: "pwDontMatch",
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
                            message: errorValue[0][0],
                            messageKey: null,
                            modal: true,
                            modalType: 'error',
                        },
                        isLoading: false,
                        editPassword: false
                    })
                }
                else {
                    store.dispatch(storeAuthenticatedUser())
                    this.retrieveUserInfo(this.props.user.data.id)
                    this.setState({
                      modal: {
                        message: LANG[localStorage.JobChoiceLanguage].successfullyUpdated,
                        messageKey: "successfullyUpdated",
                        modal: true,
                        modalType: 'success',
                      }
                    })
                }
            } else {
              this.setState({
                modal: {
                  message: LANG[localStorage.JobChoiceLanguage].somethingWentWrong,
                  messageKey: "somethingWentWrong",
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
                message: log[0][1][0],
                messageKey: null,
                modal: true,
                modalType: 'error',
              }
            })
          } catch (e) {
            console.log(e)
            this.setState({
              isLoading: false,
              modal: {
                message: log,
                messageKey: null,
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


    onZipCodeInput = (name, value) => {
      const details = this.state.details
      if (this.state.typingTimeout) {
        clearTimeout(this.state.typingTimeout)
      }

      this.setState({
        details: {
          ...details,
          job_seeker: {
            ...details.job_seeker,
            geolocation: {
              ...details.job_seeker.geolocation,
              zip_code: value
            }
          }
        },
        isSearching: true,
      }, () => this.setState({
        typingTimeout:setTimeout(() => this.onSearchFunction(value), 1000)
      }))
    }

    onSearchFunction = (zipcode) => {
      const details = this.state.details
      api.post('api/zipcode', {zipcode:zipcode}).then(response => {
        if (response.data.results) {
          const address = `${response.data.results[0].address2}${response.data.results[0].address3}`
          this.setState({
            details: {
              ...details,
              job_seeker: {
                ...details.job_seeker,
                geolocation: {
                  ...details.job_seeker.geolocation,
                  complete_address: address,
                  prefectures: response.data.results[0].address1
                }
              }
            },
          })
        } else {
          this.setState({
            details: {
              ...details,
              job_seeker: {
                ...details.job_seeker,
                geolocation: {
                  ...details.job_seeker.geolocation,
                  complete_address: '',
                  prefectures: ''
                }
              }
            }
          })
        }
      }).catch(error => {
        console.log(error)
        this.setState({
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            messageKey: 'serverError',
            modal: true,
            modalType: 'error',
            redirect: '/',
          },
          isLoading: false
        })
      })
    }

    handleInputChange = (name, value) => {
      if([name] !== ([name] in this.props.user.data)){
          let formErrors = { ...this.state.formErrors }
          const bankInfo = {...this.state.details.job_seeker.bank_account}

          switch(name) {
            case "job_seeker.bank_account.account_number":
              bankInfo['account_number'] = value
              break
            case "job_seeker.bank_account.account_holder":
                bankInfo['account_holder'] = value
              break
            case "job_seeker.bank_account.deposit_type":
              bankInfo['deposit_type'] = value
              break
            case "bank_data":
              bankInfo['bank_name'] = value.name
              bankInfo['bank_code'] = value.code
              this.setState({
                bankBranches: value.branches
              })
              break
            case "branch_data":
              bankInfo['branch_name'] = value.name
              bankInfo['branch_code'] = value.code
            break
            default:
              break
          }

          const bankInfoKey = Object.keys(bankInfo)
          bankInfoKey.forEach((el) => {
            if(bankInfo['deposit_type'].length == 0 && bankInfo['bank_name'].length == 0 && bankInfo['branch_name'].length == 0 && bankInfo['account_number'].length == 0 && bankInfo['account_holder'].length == 0) {
              formErrors[el] = ""
            } else {
              formErrors[el] = (typeof bankInfo[el] === 'string' && bankInfo[el].trim().length === 0) ?  'requiredInput' : ""
            }
          })
  
          switch (name) {
              case "name":
                  formErrors.name =
                      value.length < 3 ? LANG[localStorage.JobChoiceLanguage].minimum3 : ""
                  break
              case "email":
                  formErrors.email = emailRegex.test(value) ? "" :
                  'invalidEmail'
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
              case "contact_no":
                const num_count = value.replace(/[^0-9]/g,"").length
                if(num_count < 10) {
                  formErrors.contact_no = contactRegex.test(value) || value === "" ? 'minimum10' : 'invalidFormat'
                } else if(num_count > 11) {
                  formErrors.contact_no = contactRegex.test(value) || value === "" ? 'maximum11' : 'invalidFormat'
                } else {
                  formErrors.contact_no = contactRegex.test(value) || value === "" ? "" : 'invalidFormat'
                }
              break
              case "first_name_kana":
                  if(value.length > 0) {
                    let dummyArr = []
                    for (let x = 0; x < value.length; x++)
                    {
                      dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.first_name_kana = dummyArr.filter(function (item) {return item === false})[0] === false ? 'invalidCharactersUsed' : ""
                  } else {
                    formErrors.first_name_kana = ""
                  }
                  break
              case "job_seeker.birth_date":
                const moment = require("moment")
                const timestamp = moment(value, "YYYY-MM-DD", true).isValid()
                if ( value.length === 0 ) {
                  formErrors.birth_date = ""
                } else {
                  if ( !timestamp ) {
                    formErrors.birth_date = LANG[localStorage.JobChoiceLanguage].invalidDateInput
                  } else {
                    formErrors.birth_date = BirthdayValidation(value)
                  }
                }
              break
              case "last_name_kana":
                  if(value.length > 0) {
                    let dummyArr = []
                    for (let x = 0; x < value.length; x++)
                    {
                      dummyArr.push(kanaRegex.test(value.charAt(x)))
                    }
                    formErrors.last_name_kana = dummyArr.filter(function (item) {return item === false})[0] === false ? 'invalidCharactersUsed' : ""
                  } else {
                    formErrors.last_name_kana = ""
                  }
                  break
              case "job_seeker.bank_account.account_number":
                    if(value.length > 0) {
                      formErrors.account_number =
                     value.length >= 7 || value === ""
                       ? numRegex.test(value) || value === ""
                         ? ""
                         : 'invalidAccountNumber'
                         : 'minimum7'

                     if(bankInfo['account_holder'].length > 0) {
                       let dummyArr = []
                       for (let x = 0; x < bankInfo['account_holder'].length; x++)
                       {
                           dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
                       }
                       formErrors.account_holder  = dummyArr.filter(function (item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
                     }
                   } else {
                     if(bankInfo['deposit_type'].length > 0 && bankInfo['bank_name'].length > 0 && bankInfo['branch_name'].length > 0 && bankInfo['account_holder'].length > 0 && bankInfo['account_number'].length === 0) {
                       formErrors.account_number = 'requiredInput'
                     } else if(bankInfo['deposit_type'].length > 0 || bankInfo['bank_name'].length > 0 || bankInfo['branch_name'].length > 0 || bankInfo['account_holder'].length > 0 && bankInfo['account_number'].length === 1) {
                       formErrors.account_number = 'requiredInput'
                     } else {
                       formErrors.account_number  = ""
                     }
                   }
                  break
                case "job_seeker.bank_account.account_holder":
                    if(value.length > 0) {
                      let dummyArr = []
                      for (let x = 0; x < value.length; x++)
                      {
                          dummyArr.push(kanaRegex.test(value.charAt(x)))
                      }
                      formErrors.account_holder  = dummyArr.filter(function (item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
                    } else {
                      if(bankInfo['deposit_type'].length > 0 && bankInfo['bank_name'].length > 0 && bankInfo['branch_name'].length > 0 && bankInfo['account_number'].length > 0 && bankInfo['account_holder'].length === 0) {
                        formErrors.account_holder = 'requiredInput'
                      } else if(bankInfo['deposit_type'].length > 0 || bankInfo['bank_name'].length > 0 || bankInfo['branch_name'].length > 0 || bankInfo['account_number'].length > 0 && bankInfo['account_holder'].length === 0) {
                        formErrors.account_holder = 'requiredInput'
                      } else {
                        formErrors.account_holder  = ""
                      }
                    }
                    break
                case "bank_data":
                    if( bankInfo['account_holder'].length > 0 ) {
                      let dummyArr = []
                      for (let x = 0; x < bankInfo['account_holder'].length; x++)
                      {
                          dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
                      }
                      formErrors.account_holder  = dummyArr.filter(function (item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
                    }
                  break
                case "branch_data":
                    if( bankInfo['account_holder'].length > 0 ) {
                      let dummyArr = []
                      for (let x = 0; x < bankInfo['account_holder'].length; x++)
                      {
                          dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
                      }
                      formErrors.account_holder  = dummyArr.filter(function (item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
                    }
                  break
                case "job_seeker.bank_account.deposit_type":
                    if(bankInfo['deposit_type'].length === 0 && bankInfo['bank_name'].length > 0 && bankInfo['branch_name'].length > 0 && bankInfo['account_number'].length > 0 && bankInfo['account_holder'].length > 0) {
                      formErrors.deposit_type = LANG[localStorage.JobChoiceLanguage].selectDepositType
                    } else {
                      if(bankInfo['account_holder'].length > 0) {
                        let dummyArr = []
                        for (let x = 0; x < bankInfo['account_holder'].length; x++)
                        {
                            dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
                        }
                        formErrors.account_holder  = dummyArr.filter(function (item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
                      }
                    }
                  break
              default:
                break
          }
          const fields = name.split('.')
          let {...details} = this.state.details
          if ( name === "job_seeker.geolocation.complete_address" &&
               value.length === 0
             ) {
              this.setState({
                formErrors,
                details: this.changeWithinField(details, fields, value)
              }, () => {
                this.setState({
                  details: {
                    ...this.state.details,
                    job_seeker: {
                      ...this.state.details.job_seeker,
                      geolocation: {
                        ...this.state.details.job_seeker.geolocation,
                        zip_code: ""
                      }
                    }
                  }
                })
              })
          } else {
            if (
              name === "account_number" ||
              name === "account_holder" ||
              name === "bank_data" ||
              name === "branch_data" ||
              name === "deposit_type"
            ) {
              this.setState({
                formErrors,
                details: {
                  ...this.state.details,
                  job_seeker: {
                    ...this.state.details.job_seeker,
                    bank_account: {
                      ...bankInfo
                    }
                  }
                }
              })
            } else {
              this.setState({
                formErrors,
                details: this.changeWithinField(details, fields, value)
              })
            }

          }


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

    isActiveClass = (tab) => {
      return `btn ${this.state.activeTab === tab ? 'btn-dark' : 'btn-light'}`
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
          <Button
            className='profile-buttons'
            bsStyle='danger'
            onClick={this.handleCancel}
          >{ LANG[localStorage.JobChoiceLanguage].cancel }</Button>
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

      const { formErrors } = this.state

      if (!this.state.editPassword) {
        return (
          <div className='profile-details-individual'>
            <span className='profile-details-individual-title'>
              { LANG[localStorage.JobChoiceLanguage].password }
              {this.state.editPassword && <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>}
            </span>
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
              {this.state.editPassword && <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>}
            </span>
              <Input
                value={this.state.details.password}
                inputType='password'
                field='password'
                inputStyles="profile-details-individual-edit"
                onChange={this.handleInputChange}
                error={ LANG[localStorage.JobChoiceLanguage][formErrors.password] }
              />
          </div>
          <div className='profile-details-individual'>
            <span className='profile-details-individual-title'>
              { LANG[localStorage.JobChoiceLanguage].confirmPassword }
              {this.state.editPassword && <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span>}
            </span>
            <Input
              value={this.state.details.c_password}
              inputType='password'
              field='c_password'
              inputStyles="profile-details-individual-edit"
              onChange={this.handleInputChange}
              error={ LANG[localStorage.JobChoiceLanguage][formErrors.c_password] }
            />
            <Button className="profile-buttons" bsStyle='warning' onClick={this.changePassword}>{ LANG[localStorage.JobChoiceLanguage].cancel }</Button>
          </div>
        </>
      )
    }

    capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }

    addRow = (e, key, field) => {
      e.preventDefault()
      const list = this.state.form[field]
      const errorList = this.state.formErrors
      const newInput =  (field === "educational_bg") ?
                        { id: key+1,
                          school: "",
                          year: "",
                          month: "" } :
                        { id: key+1,
                          company: "",
                          position: "",
                          start_date: "",
                          end_date: ""}
      this.setState({
        form: {
          ...this.state.form,
          [field]: [
            ...list,
            newInput
          ]
        },
        formErrors: {
          ...errorList,
          [field]: [
            ...errorList[field],
            {...newInput}
          ]
        }
      })
    }

    removeRow = (e, key, field) => {
      e.preventDefault()
      const list = this.state.form[field]
      const errorList = this.state.formErrors
      this.setState({
        form: {
          ...this.state.form,
          [field]: list.filter(el => el.id !== key)
        },
        formErrors: {
          ...errorList,
          [field]: errorList[field].filter(el => el.id !== key)
        }
      })
    }

    // When using deep fields with Input Components
    handleChangeFormList = (field, value) => {
      let formField = [...this.state.form[field.name]]
      let errorList = [...this.state.formErrors[field.name]]
      let limit = (field.name === "educational_bg") ? 3 :
        (field.name === "work_exp") ? 4 : 0

      formField[field.key][field.attr] = value

      // Checks if all fields are inputted
      let currentField = Object.entries(formField[field.key]).splice(1)
      if (currentField.filter(el => el && el[1].length === 0).length > 0 &&
          currentField.filter(el => el && el[1].length === 0).length < limit) {
        const invalidList =currentField.map(el => {
          return (typeof el[1] === 'string' && el[1].trim().length === 0) ? [el[0],'requiredInput']: [el[0], ""]
        })
        invalidList.forEach(el => {
          errorList[field.key][el[0]] = el[1]
        })

      } else if (currentField.filter(el => el && el[1].length === 0).length === 0) {
        const invalidList =currentField.map(el => {
          return (typeof el[1] === 'string' && el[1].trim().length === 0) ? [el[0],'requiredInput']: [el[0], ""]
        })
        invalidList.forEach(el => {
          errorList[field.key][el[0]] = el[1]
        })
      } else {
        currentField.forEach(el => {
          errorList[field.key][el[0]] = ""
        })
      }
      if (field.name === "work_exp") {
        (formField[field.key].end_date < formField[field.key].start_date) ?
          errorList[field.key].end_date = 'invalidDateRange'
          : errorList[field.key].end_date = ""
      }else if (field.name === 'educational_bg') {
        const moment = require('moment')
        if (formField[field.key].year && formField[field.key].month) {
          const dateSet = moment(`${formField[field.key].year}/${formField[field.key].month}`, "YYYY/MMMM")
          errorList[field.key].month = (dateSet > moment()) ? 'invalidDateInput' : ""
        }
      }

      this.setState({
        form: {
          ...this.state.form,
          [field.name]: formField,
        },
        formErrors: {
          ...this.state.formErrors,
          [field.name]: errorList
        }
      })
    }

    // for renderdeposittype
    renderDepositType = (label, value, field, error, editValue) => {
      let formErrors = { ...this.state.formErrors }
      const deposit_type = [
        {
          name : LANG[localStorage.JobChoiceLanguage].select,
          value: ''
        },
        {
          name: LANG[localStorage.JobChoiceLanguage].checkingsAccount,
          value: 'current_account'
        },
        {
          name: LANG[localStorage.JobChoiceLanguage].savingsAccount,
          value: 'savings_account'
        }
      ]
      const display = deposit_type.filter(function (el) {return el.value === value})[0]
      if (!editValue) {
        editValue = ''
      }

      return (
        <div className="row profile-details-individual">
          <span className='profile-details-individual-title'>
            {label}
            {this.state.isEditing && <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>}
          </span>
          {!this.state.isEditing ?
            <span className={`profile-details-individual-value ${value ? '' : 'empty'}`}>
              {value ? display.name : LANG[localStorage.JobChoiceLanguage].valueNotSet}
            </span> :
            <InputDropDown
              className="profile-details-individual-edit"
              field={field}
              onChange={this.handleInputChange}
              value={editValue}
              error={LANG[localStorage.JobChoiceLanguage][formErrors.deposit_type]}
            >
              {
                (deposit_type.map((value, key) => {
                  return (<option key={key} value={value.value}>{value.name}</option>)
                }))
              }
            </InputDropDown>
          }
        </div>

      )
    }

    // Show Bank Modal
    showBankModal = () => {
      this.setState(
        {
          bankModal: {
            bank_modal: false,
            title: ""
          }
        },
        () => {
          this.setState({
            bankModal: {
              bank_modal: true,
              title: "Select Bank"
            }
          })
        }
      )
    }

    handleBankModal = (state) => {
      this.setState({
        bankModal: {
          ...this.state.bankModal,
          bank_modal: state
        }
      })
    }

    setBankData = (bankData) => {
      this.setState({
        details: {
          ...this.state.details,
          job_seeker: {
            ...this.state.details.job_seeker,
            bank_account: {
              ...this.state.details.job_seeker.bank_account,
              bank_name: bankData.name,
              bank_code: bankData.code
            }
          }
        },
        bankBranches: bankData.branches
      })
    }

    showBankBranchModal = () => {
      this.setState(
        {
          branchModal: {
            title: "",
            branch_code: "",
            branch_modal: false
          }
        },
        () => {
          this.setState({
            branchModal: {
              title: "Select Bank Branch",
              branch_code: 'test',
              branch_modal: true
            }
          })
        }
      )
    }

    handleBranchBankModal = (state) => {
      this.setState({
        branchModal: {
          ...this.state.branchModal,
          branch_modal: state
        }
      })
    }

    setBankBranchData = (branchData) => {
      this.setState({
        details: {
          ...this.state.details,
          job_seeker: {
            ...this.state.details.job_seeker,
            bank_account: {
              ...this.state.details.job_seeker.bank_account,
              branch_name: branchData.name,
              branch_code: branchData.code
            }
          }
        },
      })
    }

    handleClear = e => {
      this.setState({
        formErrors:{
          ...this.state.formErrors,
          bank_name: "",
          branch_name: "",
          deposit_type: "",
          account_number: "",
          account_holder: ""
        },
        details: {
          ...this.state.details,
          job_seeker: {
            ...this.state.details.job_seeker,
            bank_account : {
              branch_name: "",
              branch_code: "",
              bank_code: "",
              bank_name: "",
              account_number : "",
              account_holder: "",
              deposit_type: ""
            }
          }
        },
        bankBranches: ""
      })
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

    showInvalidBank = (e) => {
      this.setState({
        modal: {
          message: "",
          modal: false,
          modalType: '',
        }
      }, () => {
        this.setState({
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].invalidBank,
            messageKey: 'invalidBank',
            modal: true,
            modalType: 'error',
          },
          branchModal: {
            title: "",
            branch_code: "",
            branch_modal: false
          }
        })
      })
    }

    render() {
    const { formErrors } = this.state
    const {...form} = this.state.details
    const user = this.state.info

    return (
      <div>
          <JobChoiceLayout className="jobchoice-body">
          <Breadcrumb className="breadcrumb-account-profile">
            <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
            <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].profileBreadcrumbs }</Breadcrumb.Item>
          </Breadcrumb>
          {user &&
          <div className='container-fluid min-height'>
            <div className='row profile-area min-height'>
              <div className='col-md-3 col-sm-3 col-xs-6 left-panel min-height'>
                <div className='profile-picture'>
                {user.job_seeker ?
                  (user.job_seeker.profile_picture && 
                    <Image
                      src={`${user.job_seeker.profile_picture}?${this.state.latestImage}`}
                      alt="logo"
                      loadOptions={{
                        downsamplingRatio: 0.5,
                        contain: true,
                        cover: true
                      }}
                    />
                  ) :
                  ''
                }
                </div>
                <div className="profile-sidebar-row">
                    <Button
                      className='profile-buttons'
                      bsStyle='info'
                      onClick={() =>{this.setState({willSubmitFile: !this.state.willSubmitFile})}}
                    >{ LANG[localStorage.JobChoiceLanguage].changePicture }</Button><br />
                </div>
                {this.state.willSubmitFile &&
                  <>
                  <InputFile
                    className="profile-sidebar-row"
                    error={ LANG[localStorage.JobChoiceLanguage][formErrors.profile_picture] }
                    handleChange={this.handleFile}
                  />
                  <div className="profile-sidebar-row">
                    <button className={`profile-buttons btn ${(formValid(this.state)) ? 'btn-success' : 'btn-secondary'}`}
                      disabled={(!formValid(this.state))}
                      onClick={this.handleFileSubmit}>{ LANG[localStorage.JobChoiceLanguage].submit }</button>
                  </div>
                  </>
                }
                {this.state.info.job_seeker ? <div className="profile-sidebar-row">
                  <Link to={{pathname:'/hatarakikata', state:{mode:'save', prevLocation: '/account-profile'}}}
                      className='btn profile-buttons user-dashboard-hatarakikata-button'>
                      { LANG[localStorage.JobChoiceLanguage].editHatarakikata }
                  </Link>
                  </div> : ''
                }
              </div>
              <div className='col-md-9 col-sm-9 col-xs-6'>
                <div className="row tab-headers">
                  <div className="col-md-12">
                    <div className="tab-container">
                      <button className={this.isActiveClass(0)} onClick={() => this.setState({activeTab: 0})}>{ LANG[localStorage.JobChoiceLanguage].loginInformation }</button>
                      {
                        this.state.info.job_seeker ?
                      <>
                      <button className={this.isActiveClass(1)} onClick={() => this.setState({activeTab: 1})}>{ LANG[localStorage.JobChoiceLanguage].basicInformation }</button>
                      <button className={this.isActiveClass(2)} onClick={() => this.setState({activeTab: 2})}>{ LANG[localStorage.JobChoiceLanguage].profile }</button>
                      <button className={this.isActiveClass(3)} onClick={() => this.setState({activeTab: 3})}>{ LANG[localStorage.JobChoiceLanguage].accountInformation }</button>
                      </> : ''
                      }
                    </div>
                  </div>
                </div>
                <form onSubmit={this.handleSubmit} noValidate>
                  {this.state.activeTab === 0 &&
                    <TabForm label={ LANG[localStorage.JobChoiceLanguage].loginInformationLabel } buttonSet={this.renderDetailSubmit()}>
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].emailAddress}
                        value={user.email}
                        field='email'
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.email] }
                        editValue={form.email}
                        isDisabled={false}
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                        maxLength="50"
                        required={true}
                      />
                      {this.renderDetailRow(
                        this.passwordChangeDetails()
                      )}
                      <AccountInformationComponent label={LANG[localStorage.JobChoiceLanguage].contactNo} isEditing={this.state.isEditing}>
                        {!this.state.isEditing ?
                          <span className='profile-details-individual-value'>
                            {user.contact_no ? user.contact_no : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                          </span> :
                          <ContactNumberInput
                            field='contact_no'
                            placeholder="xxxxxxxxxx"
                            value={form.contact_no}
                            onChange={this.handleInputChange}
                            error={ LANG[localStorage.JobChoiceLanguage][formErrors.contact_no] }
                            required={true}
                          />
                        }
                      </AccountInformationComponent>
                      <div className="row row-bottom-border">
                        <div className="col-md-11 offset-md-1">
                          <div className="row profile-details-individual">
                            <span className='profile-details-individual-title'>{ LANG[localStorage.JobChoiceLanguage].smsAuthentication }:</span>
                              { this.state.details.sms_verified_at !== null ? LANG[localStorage.JobChoiceLanguage].done : LANG[localStorage.JobChoiceLanguage].notYet }
                          </div>
                        </div>
                      </div>
                    </TabForm>
                  }
                  {this.state.activeTab === 1 &&
                    <TabForm label={ LANG[localStorage.JobChoiceLanguage].basicInformationLabel } buttonSet={this.renderDetailSubmit()}>
                      <NameProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].name}
                        first_label={LANG[localStorage.JobChoiceLanguage].firstName}
                        field={{first_name:'first_name', last_name:'last_name'}}
                        detail={{first_name:user.first_name, last_name:user.last_name}}
                        last_label={LANG[localStorage.JobChoiceLanguage].lastName}
                        value={{first_name:form.first_name, last_name:form.last_name}}
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                      />
                      <NameProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].completeKanaName}
                        first_label={LANG[localStorage.JobChoiceLanguage].firstNameKana}
                        field={{first_name:'first_name_kana', last_name:'last_name_kana'}}
                        detail={{first_name:user.first_name_kana, last_name:user.last_name_kana}}
                        last_label={LANG[localStorage.JobChoiceLanguage].lastNameKana}
                        value={{first_name:form.first_name_kana, last_name:form.last_name_kana}}
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                        error={{first_name: LANG[localStorage.JobChoiceLanguage][formErrors.first_name_kana], last_name: LANG[localStorage.JobChoiceLanguage][formErrors.last_name_kana]}}
                      />
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].nickName}
                        value={user.job_seeker.nickname}
                        field='job_seeker.nickname'
                        editValue={form.job_seeker.nickname}
                        isDisabled={false}
                        maxLength='11'
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                      />
                      <AccountInformationComponent label={LANG[localStorage.JobChoiceLanguage].birthday} isEditing={this.state.isEditing}>
                        {!this.state.isEditing ?
                          <span className='profile-details-individual-value'>
                            {user.job_seeker.birth_date ? user.job_seeker.birth_date : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                          </span> :
                          <DateInput
                            onChange={this.handleInputChange}
                            error={LANG[localStorage.JobChoiceLanguage][this.state.formErrors.birth_date]}
                            field="job_seeker.birth_date"
                            value={form.job_seeker.birth_date}
                          />
                        }
                      </AccountInformationComponent>
                      <AccountInformationComponent label={LANG[localStorage.JobChoiceLanguage].gender} isEditing={this.state.isEditing}>
                        {!this.state.isEditing ?
                            <span className={`profile-details-individual-value ${this.state.info.job_seeker.gender ? '' : 'empty'}`}>
                              {user.job_seeker.gender ? EM[localStorage.JobChoiceLanguage].GENDER.filter(function (gender) {return gender.value ===  user.job_seeker.gender})[0].name : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                            </span> :
                            <GenderDropDown
                            className={`profile-details-individual-edit ${formErrors.gender && formErrors.gender.value > 0 ? "error" : ''}`}
                            value={form.job_seeker.gender}
                            name='job_seeker.gender'
                            infoChange={this.handleInputChange}
                          />
                        }
                      </AccountInformationComponent>
                      <AccountInformationComponent label={LANG[localStorage.JobChoiceLanguage].zipCode} isEditing={this.state.isEditing}>
                        {!this.state.isEditing ?
                          <span className='profile-details-individual-value'>
                            {user.job_seeker.geolocation.zip_code ? user.job_seeker.geolocation.zip_code : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                          </span> :
                          <ZipCodeInput
                            isDisabled={false}
                            isEditing={this.state.isEditing}
                            handleInputChange={this.onZipCodeInput}
                            value={user.job_seeker.geolocation.zip_code}
                          />
                        }
                      </AccountInformationComponent>
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].address}
                        value={user.job_seeker.geolocation.complete_address}
                        field='job_seeker.geolocation.complete_address'
                        error={formErrors.complete_address}
                        editValue={form.job_seeker.geolocation.complete_address}
                        isDisabled={false}
                        maxLength="255"
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                      />
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].station}
                        value={user.job_seeker.geolocation.station}
                        field='job_seeker.geolocation.station'
                        error={formErrors.station}
                        editValue={form.job_seeker.geolocation.station}
                        isDisabled={false}
                        maxLength="255"
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                      />
                    </TabForm>
                  }
                  {this.state.activeTab === 2 &&
                    <TabForm label={ LANG[localStorage.JobChoiceLanguage].profileLabel } buttonSet={this.renderDetailSubmit()}>
                      <AccountInformationComponent label={LANG[localStorage.JobChoiceLanguage].areYouMarried} isEditing={this.state.isEditing}>
                        {!this.state.isEditing ?
                            <span className={`profile-details-individual-value ${user.job_seeker.marital_status ? '' : 'empty'}`}>
                              {this.state.info.job_seeker.marital_status ?
                                LANG[localStorage.JobChoiceLanguage][`married${this.capitalize(this.state.info.job_seeker.marital_status)}`] :
                                LANG[localStorage.JobChoiceLanguage].valueNotSet}
                            </span> :
                            <InputRadio
                              id="marital_status"
                              field="job_seeker.marital_status"
                              value={form.job_seeker.marital_status}
                              options={EM[localStorage.JobChoiceLanguage].BIQUESTION}
                              onChange={this.handleInputChange}
                              additionalStyle="registration-form-3-marital-status"
                            />
                          }
                      </AccountInformationComponent>
                      {this.renderDetailRow(
                        <div className="column profile-details-individual">
                        <span className='profile-details-individual-title'>
                          { LANG[localStorage.JobChoiceLanguage].educationalBackground }
                          {this.state.isEditing && <span className="optional-badge">
                            <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                          </span>}
                        </span>
                        {this.state.form.educational_bg.length > 0 ?
                          this.state.form.educational_bg.map((value, key) => {
                            return (
                              <EducationalBackgroundRow
                                key={key}
                                id={value.id}
                                num={key}
                                max={this.state.form.educational_bg.length}
                                school={{name: "educational_bg", key: key, attr: "school"}}
                                year_educ={{name: "educational_bg", key: key, attr: "year"}}
                                month_educ={{name: "educational_bg", key: key, attr: "month"}}
                                error= {this.state.formErrors.educational_bg[key]}
                                errorKey= {this.state.formErrors.educational_bg[key]}
                                value={this.state.form.educational_bg[key]}
                                isEditing={this.state.isEditing}
                                addRow={this.addRow}
                                removeRow={this.removeRow}
                                handleChange={this.handleChangeFormList}
                                schoolClassName="edit-school-input-form"
                                ifError={(Object.values(
                                  this.state.formErrors.educational_bg[key]).splice(1).filter(
                                    el => el !== "").length > 0)}
                              />
                            )
                          }) :
                          <span className='profile-details-individual-value empty'>
                            { LANG[localStorage.JobChoiceLanguage].valueNotSet }
                          </span>
                        }
                        </div>
                      )}
                      {this.renderDetailRow(
                        <div className="column profile-details-individual">
                        <span className='profile-details-individual-title'>
                          { LANG[localStorage.JobChoiceLanguage].skillQualificationLicense }
                          {this.state.isEditing && <span className="optional-badge">
                            <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                          </span>}
                        </span>
                        { this.state.isEditing ?
                          <div className="skill-set">
                            {this.state.skills.map((value, key) => {
                              return (
                                <label key={key} className="checkbox">
                                  <input
                                    id={key}
                                    name={key}
                                    type="checkbox"
                                    checked={value.value}
                                    onChange={e => this.toggleSkill(e, 'skills')} />
                                  <span className="label-checkbox">{value.name}</span>
                                </label>
                              )
                            })}
                          </div>
                          :
                          user.job_seeker.job_seeker_skills.length > 0 ?
                          user.job_seeker.job_seeker_skills.map((job_seeker, key) => {
                              return (
                                <ul key={key} className="skill-item">
                                  <li>{job_seeker.skill.name}</li>
                                </ul>
                              )
                          }) :
                          <span className='profile-details-individual-value empty'>
                            { LANG[localStorage.JobChoiceLanguage].valueNotSet }
                          </span>

                        }
                        </div>
                      )}
                      <AccountInformationComponent label={LANG[localStorage.JobChoiceLanguage].qualificationExperiencePR} isEditing={this.state.isEditing}>
                        {!this.state.isEditing ?
                        <span className={`profile-details-individual-value ${user.job_seeker.description ? '' : 'empty'}`}>
                          {user.job_seeker.description ? user.job_seeker.description : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                        </span> :
                        <InputTextArea
                          value={form.job_seeker.description}
                          field='job_seeker.description'
                          inputStyles="profile-details-individual-edit aboutme-edit"
                          onChange={this.handleInputChange}
                          error={formErrors.description}
                          disabled={false}
                        />}
                      </AccountInformationComponent>
                      {this.renderDetailRow(
                        <div className="column profile-details-individual">
                        <span className='profile-details-individual-title'>
                          { LANG[localStorage.JobChoiceLanguage].workExperience }
                          {this.state.isEditing && <span className="optional-badge">
                            <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                          </span>}
                        </span>
                        {this.state.form.work_exp.length > 0 ?
                          this.state.form.work_exp.map((value, key) => {
                            return (
                              <WorkExperienceRow
                                key={key}
                                id={value.id}
                                num={key}
                                max={this.state.form.work_exp.length}
                                company={{name: "work_exp", key: key, attr: "company"}}
                                position={{name: "work_exp", key: key, attr: "position"}}
                                start_date={{name: "work_exp", key: key, attr: "start_date"}}
                                end_date={{name: "work_exp", key: key, attr: "end_date"}}
                                error= {this.state.formErrors.work_exp[key]}
                                errorKey= {this.state.formErrors.work_exp[key]}
                                value={this.state.form.work_exp[key]}
                                isEditing={this.state.isEditing}
                                addRow={this.addRow}
                                removeRow={this.removeRow}
                                handleChange={this.handleChangeFormList}
                                ifError={(Object.values(
                                  this.state.formErrors.work_exp[key]).splice(1).filter(
                                    el => el !== "").length > 0)}
                              />
                            )
                          }) :
                          <span className='profile-details-individual-value empty'>
                            { LANG[localStorage.JobChoiceLanguage].valueNotSet }
                          </span>
                        }
                        </div>
                      )}
                    </TabForm>
                  }
                  {this.state.activeTab === 3 &&
                    <TabForm label={ LANG[localStorage.JobChoiceLanguage].accountInformationLabel }buttonSet={this.renderDetailSubmit()} event={this.handleClear} editing={this.state.isEditing} title={LANG[localStorage.JobChoiceLanguage].clearBankInfo}>
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].bankName}
                        value={user.job_seeker.bank_account.bank_name}
                        field='job_seeker.bank_account.bank_name'
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.bank_name] }
                        editValue={form.job_seeker.bank_account ? form.job_seeker.bank_account.bank_name : null }
                        isDisabled={true}
                        isEditing={this.state.isEditing}
                        onClick={this.showBankModal}
                        maxLength="255"
                        handleInputChange={this.handleInputChange}
                        bankClick={this.showBankModal}
                        bankLabel={LANG[localStorage.JobChoiceLanguage].selectBank}
                      />
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].branchName}
                        value={user.job_seeker.bank_account.branch_name}
                        field='job_seeker.bank_account.branch_name'
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.branch_name] }
                        editValue={form.job_seeker.bank_account ? form.job_seeker.bank_account.branch_name : null}
                        isDisabled={true}
                        isEditing={this.state.isEditing}
                        onClick={this.showBankBranchModal}
                        maxLength="255"
                        handleInputChange={this.handleInputChange}
                        bankClick={ this.state.bankBranches ? this.showBankBranchModal : this.showInvalidBank }
                        bankLabel={LANG[localStorage.JobChoiceLanguage].selectBranch}
                      />
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].accountNum}
                        value={user.job_seeker.bank_account.account_number}
                        field='job_seeker.bank_account.account_number'
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.account_number] }
                        editValue={form.job_seeker.bank_account ? form.job_seeker.bank_account.account_number : null }
                        isDisabled={false}
                        maxLength="7"
                        pattern="[0-9]*"
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                      />
                      <GenericProfileDetailIndividual
                        label={LANG[localStorage.JobChoiceLanguage].accountHolder}
                        value={user.job_seeker.bank_account.account_holder}
                        field='job_seeker.bank_account.account_holder'
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.account_holder] }
                        editValue={form.job_seeker.bank_account ? form.job_seeker.bank_account.account_holder : null}
                        maxLength="255"
                        isDisabled={false}
                        isEditing={this.state.isEditing}
                        handleInputChange={this.handleInputChange}
                      />
                      {this.renderDetailRow(
                        this.renderDepositType(
                          LANG[localStorage.JobChoiceLanguage].depositType,
                          user.job_seeker.bank_account.deposit_type,
                          'job_seeker.bank_account.deposit_type',
                          formErrors.deposit_type,
                          form.job_seeker.bank_account ? form.job_seeker.bank_account.deposit_type : null)
                      )}
                    </TabForm>
                  }
                </form>
              </div>
            </div>
          </div>}

          <LoadingIcon show={this.state.isLoading} />

          <Modal
              show={this.state.modal.modal}
              message={this.state.modal.message}
              messageKey={this.state.modal.messageKey}
              type={this.state.modal.modalType}
              redirect={this.state.modal.redirect}
              handleParentClose={this.handleParentClose}
          />

          <BankModal
            show={this.state.bankModal.bank_modal}
            title={this.state.bankModal.title}
            handleBankModal={this.handleBankModal}
            setBankData={this.handleInputChange}
          />

          <BankBranchModal
            show={this.state.branchModal.branch_modal}
            title={this.state.branchModal.title}
            handleBankBranchModal={this.handleBranchBankModal}
            bankBranches={this.state.bankBranches}
            setBankBranchData={this.handleInputChange}
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

export default connect(mapStateToProps, mapDispatchToProps)(JobSeekerProfileComponent)
