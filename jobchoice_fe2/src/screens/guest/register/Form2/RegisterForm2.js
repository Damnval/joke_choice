import React, { Component } from "react"
import "./RegisterForm2.scss"
import api from "../../../../utilities/api"
import JobChoiceLayout from "../../../../layouts/jobChoiceLayout/JobChoiceLayout"
import Input from "../../../../components/input/Input"
import Modal from "../../../../components/modal/Modal"
import LoadingIcon from "../../../../components/loading/Loading"
import { LANG } from "./../../../../constants"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import * as authActions from "../../../../store/auth/actions"
import BankModal from "../../../../components/bankModal/bankModal"
import BankBranchModal from "../../../../components/bankBranchModal/bankBranchModal"
import RegisterBreadcrumbs from "../registerBreadcrumbs/RegisterBreadcrumbs"
import DateInput from "../../../../components/dateInput/DateInput"
import { BirthdayValidation } from "../../../../helpers"
import { kanaRegex } from '../../../../regex'
import ZipCodeInput from "../../../../components/zipcodeInput/ZipCodeInput"

const numRegex = RegExp(/^\d+$/)

const formValid = ({ formErrors, form }) => {
  let valid = true

  Object.keys(formErrors).map(function(el) {
    if ( formErrors[el].length > 0 ) {
        valid = false
    }
  })

  return valid
}

class RegisterForm2 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        nickname: "",
        first_name: "",
        last_name: "",
        first_name_kana: "",
        last_name_kana: "",
        birthday: "",
        gender: "",
        zip_code: "",
        complete_address: "",
        station: "",
        prefectures: "",
        mail_setting: "",
        bankInfo: {
          bank_name: "",
          branch_name: "",
          deposit_type: "",
          account_number: "",
          account_holder: "",
          bank_code: "",
          branch_code: ""
        }
      },
      bankBranches: null,
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: "",
        redirect: null
      },
      formErrors: {
        first_name_kana: "",
        last_name_kana: "",
        zip_code: "",
        gender: "",
        birthday: "0000-00-00",
        bank_name: "",
        branch_name: "",
        deposit_type: "",
        account_number: "",
        account_holder: ""
      },
      typingTimeout: 0,
      isLoading: true,
      isSearching: false,
      bankModal: {
        title: "",
        bank_modal: false
      },
      branchModal: {
        title: "",
        branch_code: "",
        branch_modal: false
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.submitInfo = this.submitInfo.bind(this)
    this.showBankModal = this.showBankModal.bind(this)
    this.handleBankModal = this.handleBankModal.bind(this)
    this.setBankData = this.setBankData.bind(this)
    this.showBankBranchModal = this.showBankBranchModal.bind(this)
    this.handleBranchBankModal = this.handleBranchBankModal.bind(this)
    this.setBankBranchData = this.setBankBranchData.bind(this)
  }

  // Initializing Hataraki kata
  // If from hataraki kata page, it will be passed via this.props.location.state.data.credentials
  // If skipped from form 1 and set from a previous time during registration
  // 
  componentDidMount() {
    if (this.props.location.state) {
      const hataraki_kata = this.props.location.state.data.hataraki_kata
      const credentials = this.props.location.state.data.credentials
      let formErrors = {
        first_name_kana: "",
        last_name_kana: "",
        zip_code: "",
        gender: "",
        birthday: "",
        bank_name: "",
        branch_name: "",
        deposit_type: "",
        account_number: "",
        account_holder: ""
      }

      if (this.props.location.state.data.formErrors && this.props.location.state.data.formErrors.form2 ) {
        formErrors = { ...this.props.location.state.data.formErrors.form2 }
      }

      this.setState({
        modal: {
          messageKey: "regInfo1",
          message: LANG[localStorage.JobChoiceLanguage].regInfo1,
          modal: true,
          modalType: "success"
        },
        credentials: {
          ...credentials,
        },
        formErrors: {...formErrors}
      }, () => {
        if (hataraki_kata) {
          this.setState({
            credentials: {
              ...credentials,
              hataraki_kata: hataraki_kata
            }
          })
        }
        if (this.props.location.state.data.credentials) {
          this.setState({
            form: {
              ...this.state.form,
              nickname: credentials.job_seeker.nickname,
              first_name: credentials.first_name,
              last_name: credentials.last_name,
              first_name_kana: credentials.first_name_kana,
              last_name_kana: credentials.last_name_kana,
              birthday: credentials.job_seeker.birth_date,
              gender: credentials.job_seeker.gender,
              zip_code: credentials.job_seeker.address.zip_code,
              complete_address: credentials.job_seeker.address.complete_address,
              station: credentials.job_seeker.address.station,
              prefectures: credentials.job_seeker.address.prefectures,
              mail_setting: credentials.mail_setting,
              bankInfo: {
                bank_name: credentials.bank_account.bank_name,
                branch_name: credentials.bank_account.branch_name,
                deposit_type: credentials.bank_account.deposit_type,
                account_number: credentials.bank_account.account_number,
                account_holder: credentials.bank_account.account_holder,
                bank_code: credentials.bank_account.bank_code,
                branch_code: credentials.bank_account.branch_code
              }
            },
          })
        }
        this.setState({
          isLoading: false,
        })
      })
    } else {
      this.props.history.push('/register/form/1/job_seeker/'+this.props.match.params.token)
    }
  }

  // This function is used to move to Registration Form 3
  // In UI, this is the blue button "Continue"
  handleSubmit = e => {
    e.preventDefault()
    const formInfo = this.state.form
    const bankformInfo = this.state.form.bankInfo
    let credentials = this.state.credentials
    this.setState(
      {
        modal: {
          messageKey: "",
          message: "",
          modal: false,
          modalType: "",
          redirect: null
        },
        isLoading: true
      },
      () => {
        credentials["lang"] = localStorage.JobChoiceLanguage
        credentials["first_name"] = formInfo.first_name
        credentials["last_name"] = formInfo.last_name
        credentials["mail_setting"] = formInfo.mail_setting
        credentials["first_name_kana"] = formInfo.first_name_kana
        credentials["last_name_kana"] = formInfo.last_name_kana
        credentials["job_seeker"]["nickname"] = formInfo.nickname
        credentials["job_seeker"]["birth_date"] = formInfo.birthday
        credentials["job_seeker"]["gender"] = formInfo.gender
        credentials["bank_account"]["bank_name"] = bankformInfo.bank_name
        credentials["bank_account"]["bank_code"] = bankformInfo.bank_code
        credentials["bank_account"]["branch_name"] = bankformInfo.branch_name
        credentials["bank_account"]["branch_code"] = bankformInfo.branch_code
        credentials["bank_account"]["account_number"] =bankformInfo.account_number
        credentials["bank_account"]["account_holder"] =bankformInfo.account_holder
        credentials["bank_account"]["deposit_type"] = bankformInfo.deposit_type
        credentials["job_seeker"]["address"] = {
          complete_address: formInfo.complete_address,
          zip_code: formInfo.zip_code,
          station: formInfo.station,
          prefectures: formInfo.prefectures,
          lat: 11,
          lng: 22
        }

        let formErrors = 
          this.props.location.state.data.formErrors && this.props.location.state.data.formErrors.form3
           ? this.props.location.state.data.formErrors.form3 : null

        this.setState({
          modal: {
            messageKey: "awesomeYouMay",
            message: LANG[localStorage.JobChoiceLanguage].awesomeYouMay,
            modal: true,
            modalType: "success",
            redirect: `/register/form/3/${this.props.match.params.token}`,
            data: {
              credentials: credentials,
              formErrors: {
                form3: formErrors
              }
            }
          },
          isLoading: false
        })
      }
    )
  }

  // This function is used to REGISTER an account with the information filled
  // In UI, this is the green button "Submit"
  submitInfo = e => {
    e.preventDefault()
    const formInfo = this.state.form
    const bankformInfo = this.state.form.bankInfo
    let { ...credentials } = this.state.credentials

    this.setState(
      {
        modal: {
          messageKey: null,
          message: "",
          modal: false,
          modalType: "",
          redirect: null
        },
        isLoading: true
      },
      () => {
        credentials["first_name"] = formInfo.first_name
        credentials["last_name"] = formInfo.last_name
        credentials["job_seeker"]["nickname"] = formInfo.nickname
        credentials["mail_setting"] = formInfo.mail_setting
        credentials["first_name_kana"] = formInfo.first_name_kana
        credentials["last_name_kana"] = formInfo.last_name_kana
        credentials["job_seeker"]["birth_date"] = formInfo.birthday
        credentials["job_seeker"]["gender"] = formInfo.gender
        credentials["bank_account"]["bank_name"] = bankformInfo.bank_name
        credentials["bank_account"]["bank_code"] = bankformInfo.bank_code
        credentials["bank_account"]["branch_name"] = bankformInfo.branch_name
        credentials["bank_account"]["branch_code"] = bankformInfo.branch_code
        credentials["bank_account"]["account_number"] =bankformInfo.account_number
        credentials["bank_account"]["account_holder"] =bankformInfo.account_holder
        credentials["bank_account"]["deposit_type"] = bankformInfo.deposit_type
        credentials["job_seeker"]["address"] = {
          complete_address: formInfo.complete_address,
          zip_code: formInfo.zip_code,
          station: formInfo.station,
          prefectures: formInfo.prefectures,
          lat: 11,
          lng: 22
        }

        api.post("api/register/details", credentials)
          .then(response => {
            this.setState({
              isLoading: false,
              modal: {
                messageKey: "awesomeYouMay",
                message:
                  LANG[localStorage.JobChoiceLanguage].registeredSuccessfully,
                modal: true,
                modalType: "success",
                redirect: `/verify/${this.props.match.params.token}`
              }
            })
          })
          .catch(error => {
            console.log(error.response.data.error)
            let log = error.response.data.error
            try {
              log = Object.entries(JSON.parse(error.response.data.error))
              this.setState({
                isLoading: false,
                modal: {
                  messageKey: null,
                  message: log[0][1][0],
                  modal: true,
                  modalType: "error"
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
                  modalType: "error"
                }
              })
            }
          })
      }
    )
  }

  backPage = () => {

    const formInfo = this.state.form
    const bankformInfo = this.state.form.bankInfo
    let { ...credentials } = this.state.credentials

    credentials["first_name"] = formInfo.first_name
    credentials["last_name"] = formInfo.last_name
    credentials["job_seeker"]["nickname"] = formInfo.nickname
    credentials["mail_setting"] = formInfo.mail_setting
    credentials["first_name_kana"] = formInfo.first_name_kana
    credentials["last_name_kana"] = formInfo.last_name_kana
    credentials["job_seeker"]["birth_date"] = formInfo.birthday
    credentials["job_seeker"]["gender"] = formInfo.gender
    credentials["bank_account"]["bank_name"] = bankformInfo.bank_name
    credentials["bank_account"]["bank_code"] = bankformInfo.bank_code
    credentials["bank_account"]["branch_name"] = bankformInfo.branch_name
    credentials["bank_account"]["branch_code"] = bankformInfo.branch_code
    credentials["bank_account"]["account_number"] =bankformInfo.account_number
    credentials["bank_account"]["account_holder"] =bankformInfo.account_holder
    credentials["bank_account"]["deposit_type"] = bankformInfo.deposit_type
    credentials["job_seeker"]["address"] = {
      complete_address: formInfo.complete_address,
      zip_code: formInfo.zip_code,
      station: formInfo.station,
      lat: 11,
      lng: 22
    }

    let formErrors = 
          this.props.location.state.data.formErrors && this.props.location.state.data.formErrors.form3
           ? this.props.location.state.data.formErrors.form3 : null

    this.props.history.push({pathname:`/register/form/1/job_seeker/${this.props.match.params.token}`,
      state:{
        data: credentials,
        hataraki_kata: credentials.hataraki_kata,
        formErrors: {
          ...this.props.location.state.formErrors,
          form2: {
            ...this.state.formErrors
          },
          form3: formErrors

        }
      }})

  }

  infoChange = e => {
    e.preventDefault()
    let formErrors = { ...this.state.formErrors }
    const bankInfo = {...this.state.form.bankInfo}
    let moment = require("moment")
    const { name, value } = e.target

    if(name == "deposit_type") {
      bankInfo['deposit_type']= value
    }
    
    const bankInfoKey = Object.keys(bankInfo)

    bankInfoKey.map((el, key) => {
      if(bankInfo['deposit_type'].length == 0 && bankInfo['bank_name'].length == 0 && bankInfo['branch_name'].length == 0 && bankInfo['account_number'].length == 0 && bankInfo['account_holder'].length == 0 ) {
        formErrors[el] = ""
      } else {
        formErrors[el] = (typeof bankInfo[el] === 'string' && bankInfo[el].trim().length === 0) ?  'requiredInput' : ""
      }
    }) 

    switch (name) {
      case "gender":
        formErrors.gender = value !== null ? "" : 'pleaseSelectGender'
        break
      case "birthday":
        const age = moment().diff(value, "years")
        const isOk = age >= 15
        formErrors.birthday =
          moment(value).isAfter(new Date()) === true
            ? 'selectBday'
            : isOk
            ? ""
            : 'mustBe15'
        break
      case "deposit_type":
        if(bankInfo['deposit_type'].length == 0 && bankInfo['bank_name'].length > 0 && bankInfo['branch_name'].length > 0 && bankInfo['account_number'].length > 0 && bankInfo['account_holder'].length > 0) {
          formErrors.deposit_type = 'selectDepositType'
        } else {
          if(bankInfo['account_holder'].length > 0) {
            let dummyArr = []
            for (var x = 0; x < bankInfo['account_holder'].length; x++)
            {
                dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
            }
            formErrors.account_holder  = dummyArr.filter(function(item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
          }
        }
        break
      default:
        break
    }
    if (name === "deposit_type") {    
    
      this.setState({
        formErrors,
        form: {
          ...this.state.form,
          bankInfo: {
            ...bankInfo,
          }
        }
      })
    } else {
      this.setState({
        formErrors,
        form: {
          ...this.state.form,
          [name]: value
        }
      })
    }
  }

  handleChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }
    let moment = require('moment')
    switch (name) {
      case "zip_code":
        formErrors.zip_code =
          numRegex.test(value) || value === "" ? "" : 'invalidZipCode'
        break
      case "first_name_kana":
        if (value.length > 0) {
          let dummyArr = []
          for (var x = 0; x < value.length; x++) {
            dummyArr.push(kanaRegex.test(value.charAt(x)))
          }
          formErrors.first_name_kana =
            dummyArr.filter(function(item) {return item === false})[0] === false
              ? 'pleaseEnterKatakana'
              : ""
        } else {
          formErrors.first_name_kana = ""
        }
        break
      case "last_name_kana":
        if (value.length > 0) {
          let dummyArr = []
          for (var x = 0; x < value.length; x++) {
            dummyArr.push(kanaRegex.test(value.charAt(x)))
          }
          formErrors.last_name_kana =
            dummyArr.filter(function(item) {return item === false})[0] === false
              ? 'pleaseEnterKatakana'
              : ""
        } else {
          formErrors.last_name_kana = ""
        }
        break
      case "birthday":
        const timestamp = moment(value, "YYYY-MM-DD", true).isValid()
        if ( value.length === 0 ) {
          formErrors.birthday = ""
        } else {
          if ( !timestamp ) {
            formErrors.birthday = 'invalidDateInput'
          } else {
            formErrors.birthday = BirthdayValidation(value)
          }
        }
        break   
      default:
        break
    }

    this.setState({
      formErrors,
      form: {
        ...this.state.form,
        [name]: value
      }
    })

  }

  handleChangeBankInfo = (name,value) => {
    const moment = require('moment')
    let formErrors = { ...this.state.formErrors }
    const bankInfo = {...this.state.form.bankInfo}
    if (name != "bank_data" && name != "branch_data") {
      bankInfo[name] = value
    } else {
      if(name == "bank_data") {
        bankInfo['bank_name'] = value.name
        bankInfo['bank_code'] = value.code
        this.setState({
          bankBranches: value.branches
        })
      } else {
        bankInfo['branch_name'] = value.name
        bankInfo['branch_code'] = value.code
      }
    }

    const bankInfoKey = Object.keys(bankInfo)
    
    bankInfoKey.map((el, key) => {
      if(bankInfo['deposit_type'].length == 0 && bankInfo['bank_name'].length == 0 && bankInfo['branch_name'].length == 0 && bankInfo['account_number'].length == 0 && bankInfo['account_holder'].length == 0) {
        formErrors[el] = ""
      } else {
        formErrors[el] = (typeof bankInfo[el] === 'string' && bankInfo[el].trim().length === 0) ?  'requiredInput' : ""
      }
    })
  
    switch(name) {
      case "bank_name":
        formErrors.bank_name =
          value.length < 3 && value.length > 0
            ? 'minimum3'
            : ""
        break
      case "branch_name":
        formErrors.branch_name =
          value.length < 3 && value.length > 0
            ? 'minimum3'
            : ""
        if(value.length == 0) {
          bankInfo['branch_code'] = ""
        } else {
          if(bankInfo['account_holder'].length > 0) {
            let dummyArr = []
            for (var x = 0; x < bankInfo['account_holder'].length; x++)
            {
                dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
            }
            formErrors.account_holder  = dummyArr.filter(function(item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
          }
        }
        break
      case "account_number":
          if(value.length > 0 ) {
             formErrors.account_number =
            value.length >= 7 || value === ""
              ? numRegex.test(value) || value === ""
                ? ""
                : 'invalidAccountNumber'
              : 'minimum7'

            if(bankInfo['account_holder'].length > 0) {
              let dummyArr = []
              for (var x = 0; x < bankInfo['account_holder'].length; x++)
              {
                  dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
              }
              formErrors.account_holder  = dummyArr.filter(function(item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
            }
          } else {
            if(bankInfo['deposit_type'].length > 0 && bankInfo['bank_name'].length > 0 && bankInfo['branch_name'].length > 0 &&  bankInfo['account_holder'].length > 0 && bankInfo['account_number'].length == 0) {
              formErrors.account_number = 'requiredInput'
            } else if(bankInfo['deposit_type'].length > 0 || bankInfo['bank_name'].length > 0 || bankInfo['branch_name'].length > 0 || bankInfo['account_holder'].length > 0 && bankInfo['account_number'].length == 0) {
              formErrors.account_number = 'requiredInput'
            } else {
              formErrors.account_number  = ""
            }
          }
          break
      case "account_holder":
        if(value.length > 0) {
          let dummyArr = []
          for (var x = 0; x < value.length; x++)
          {
              dummyArr.push(kanaRegex.test(value.charAt(x)))
          }
          formErrors.account_holder  = dummyArr.filter(function(item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
        } else {
          if(bankInfo['deposit_type'].length > 0 && bankInfo['bank_name'].length > 0 && bankInfo['branch_name'].length > 0 && bankInfo['account_number'].length > 0 && bankInfo['account_holder'].length == 0) {
            formErrors.account_holder = 'requiredInput'
          } else if(bankInfo['deposit_type'].length > 0 || bankInfo['bank_name'].length > 0 || bankInfo['branch_name'].length > 0 || bankInfo['account_number'].length > 0 && bankInfo['account_holder'].length == 0) {
            formErrors.account_holder = 'requiredInput'
          } else {  
            formErrors.account_holder  = ""
          }
        }
        break
      case "bank_data":
          if( bankInfo['account_holder'].length > 0 ) {
            let dummyArr = []
            for (var x = 0; x < bankInfo['account_holder'].length; x++)
            {
                dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
            }
            formErrors.account_holder  = dummyArr.filter(function(item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
          } 
        break
      case "branch_data" : 
        if( bankInfo['account_holder'].length > 0 ) {
          let dummyArr = []
          for (var x = 0; x < bankInfo['account_holder'].length; x++)
          {
              dummyArr.push(kanaRegex.test(bankInfo['account_holder'].charAt(x)))
          }
          formErrors.account_holder  = dummyArr.filter(function(item) {return item === false})[0] === false ? 'kanaCharactersAllowed' : ""
        } 
        break
      default:
        break
    }
    
    if (
      name === "bank_name" ||
      name === "branch_name" ||
      name === "account_number" ||
      name === "account_holder" ||
      name === "bank_data" || 
      name === "branch_data"
    ) {
      this.setState({
        formErrors,
        form: {
          ...this.state.form,
          bankInfo: {
            ...bankInfo
          }
        }
      })
    } else {
      this.setState({
        formErrors,
        form: {
          ...this.state.form,
          [name]: value
        }
      })
    }
  }

  onZipCodeInput = (name, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    if(name === "zip_code" && value.length === 0) {
      this.setState({
          form: {
            ...this.state.form,
            zip_code: "",
            complete_address: "",
          },
          isSearching: true
        })
    } else {
      this.setState(
        {
          form: {
            ...this.state.form,
            [name]: value
          },
          isSearching: true
        },
        () => setTimeout(this.onSearchFunction(value), 1000)
      )
    }
  }

  onSearchFunction = zipcode => {
    api.post("api/zipcode", { zipcode: zipcode })
      .then(response => {
        if (response.data.results) {
          const address = `${response.data.results[0].address2}${response.data.results[0].address3}`
          this.setState({
            form: {
              ...this.state.form,
              complete_address: address,
              prefectures: response.data.results[0].address1
            }
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          modal: {
            messageKey: "serverError",
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            modal: true,
            modalType: "error",
            redirect: "/"
          },
          isLoading: false
        })
      })
  }

  onToggle = () => {
    this.setState({
      form: {
        ...this.state.form,
        mail_setting: !this.state.form.mail_setting
      }
    })
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
    form: {
      ...this.state.form,
      bankInfo: {
        ...this.state.form.bankInfo,
        bank_name: bankData.name,
        bank_code: bankData.code
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
    form: {
      ...this.state.form,
      bankInfo: {
        ...this.state.form.bankInfo,
        branch_name: branchData.name, 
        branch_code: branchData.code
      }
    }
  })
}

handleClear = e => {
  let formErrors = { ...this.state.formErrors }
  this.setState({
    formErrors:{
      bank_name: "",
      branch_name: "",
      deposit_type: "",
      account_number: "",
      account_holder: ""
    },
    form: {
      ...this.state.form,
      bankInfo: {
        ...this.state.form.bankInfo,
        branch_name: "",
        branch_code: "",
        bank_code: "",
        bank_name: "",
        account_number : "",
        account_holder: "",
        deposit_type: ""
      }
    },
    bankBranches: ""
  })
}

handleEmptyBank = (e) => {
  e.preventDefault() 
  
  this.setState({
    modal: {
      message: "",
      modal: false,
      modalType: '',
    }
  }, () => {
    this.setState({
      modal: {
        messageKey: 'selectBankFirst',
        message: LANG[localStorage.JobChoiceLanguage].selectBankFirst,
        modal: true,
        modalType: 'error',
      }
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
    <div>
      <JobChoiceLayout>
      <div className="container register-area">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12 col-xs-12">
            <RegisterBreadcrumbs step={2}/>
            {!this.state.isLoading &&
              <div className="register-card">
                <h1 className="register-card-title">{ LANG[localStorage.JobChoiceLanguage].basicInformationRegistration }</h1>
                <div className="register-card-body">
                  <form onSubmit={this.handleSubmit} noValidate>
                  <div className="input-row">
                    <div className="lname">
                      <Input
                        label={ LANG[localStorage.JobChoiceLanguage].lastName }
                        field='last_name'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].lastName }
                        value={this.state.form.last_name}
                        onChange={this.handleChange}
                        maxLength={50}
                      />
                    </div>
                    <div className="fname">
                      <Input
                        label={ LANG[localStorage.JobChoiceLanguage].firstName }
                        field='first_name'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].firstName }
                        value={this.state.form.first_name}
                        onChange={this.handleChange}
                        maxLength={50}
                      />
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="lkana">
                      <Input
                        label={ LANG[localStorage.JobChoiceLanguage].lastNameKana }
                        field='last_name_kana'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].lastNameKana }
                        value={this.state.form.last_name_kana}
                        onChange={this.handleChange}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.last_name_kana] }
                        maxLength={50}
                      />
                      <h6 className="register-additional-text">{ LANG[localStorage.JobChoiceLanguage].pleaseInputKatakana }</h6>
                    </div>
                    <div className="fkana">
                      <Input
                        label={ LANG[localStorage.JobChoiceLanguage].firstNameKana }
                        field='first_name_kana'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].firstNameKana }
                        value={this.state.form.first_name_kana}
                        onChange={this.handleChange}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.first_name_kana] }
                        maxLength={50}
                      />
                    </div>
                  </div>
                  <div className="input-row">
                    <Input
                      label={ LANG[localStorage.JobChoiceLanguage].nickName }
                      field='nickname'
                      placeholder={ LANG[localStorage.JobChoiceLanguage].nickName }
                      value={this.state.form.nickname}
                      onChange={this.handleChange}
                      maxLength={50}
                    />
                  </div>
                  <div className="input-row">
                    <DateInput
                      label={ LANG[localStorage.JobChoiceLanguage].birthday }
                      onChange={this.handleChange}
                      error={ LANG[localStorage.JobChoiceLanguage][formErrors.birthday] }
                      field="birthday"
                      value={this.state.form.birthday}
                    />
                  </div>
                  <div className="input-row align-items-flex-end">
                    <div className="gender">
                      <label htmlFor="gender">
                        { LANG[localStorage.JobChoiceLanguage].gender }
                        <span className="optional-badge">
                          <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                        </span>:
                      </label><br/>
                        <select
                          id="gender-selector" name="gender"
                          className={formErrors.value > 0 ? "error" : null} noValidate
                          onChange={this.infoChange} value={this.state.form.gender}>
                          <option>-{ LANG[localStorage.JobChoiceLanguage].select }-</option>
                          <option value="male">{ LANG[localStorage.JobChoiceLanguage].male }</option>
                          <option value="female">{ LANG[localStorage.JobChoiceLanguage].female }</option>
                        </select>
                      {formErrors.gender > 0 && (
                        <span className="errorMessage">{ LANG[localStorage.JobChoiceLanguage][formErrors.gender] }</span>
                      )}
                    </div>
                    <div className='mailsetting'>
                      <div className='border-setting'>
                      <label>{ LANG[localStorage.JobChoiceLanguage].emailNotification } </label>
                      <label>
                        <input type="checkbox" checked={this.state.form.mail_setting} onChange={this.onToggle} />
                      </label>
                      </div>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="zip_code">
                      <ZipCodeInput 
                        label={ LANG[localStorage.JobChoiceLanguage].zipCode }
                        field='zip_code'
                        isDisabled={false}
                        isEditing={this.state.isEditing}
                        handleInputChange={this.onZipCodeInput}
                        value={this.state.form.zip_code}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.zip_code] }
                      />
                    </div>
                    <div className="station">
                      <Input
                        label={ LANG[localStorage.JobChoiceLanguage].station }
                        field='station'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].station }
                        value={this.state.form.station}
                        maxLength={255}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-row">
                    <Input
                      label={ LANG[localStorage.JobChoiceLanguage].address }
                      field='complete_address'
                      placeholder={ LANG[localStorage.JobChoiceLanguage].address }
                      value={this.state.form.complete_address}
                      onChange={this.handleChange}
                      maxLength={60}
                    />
                  </div>
                  <div className="register-form2-banner">
                    <div className="line"></div>
                    <div>
                      <h4 className="registration-form2-title">{ LANG[localStorage.JobChoiceLanguage].enterAccountInformation }</h4>
                      <h4 className="registration-form2-title">{ LANG[localStorage.JobChoiceLanguage].enterAccountInformation2 }</h4>
                    </div>
                    <div className="line"></div>
                  </div>
                  <p className="no-mgb">
                      ({LANG[localStorage.JobChoiceLanguage].ifYouOpt})  
                      <a href="https://www.jp-bank.japanpost.jp/kojin/sokin/furikomi/kouza/kj_sk_fm_kz_1.html" target="_blank" className="external-link">
                        {LANG[localStorage.JobChoiceLanguage].yuchoBank}
                      </a>
                  </p>
                  <label className="clear-bank" onClick={this.handleClear}>{LANG[localStorage.JobChoiceLanguage].clearBankInfo}</label>
                  <div className="input-row">
                    <div className="bank_info">
                      <Input
                        label={LANG[localStorage.JobChoiceLanguage].bankName}
                        disabled
                        field='bank_name'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].bankName }
                        value={this.state.form.bankInfo.bank_name}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.bank_name] }
                      />
                      <label className="selectbank-branch" onClick={this.showBankModal}>{LANG[localStorage.JobChoiceLanguage].selectBank}</label>
                    </div>
                    <div className="bank_info">
                      <Input
                        label={LANG[localStorage.JobChoiceLanguage].branchName}
                        disabled
                        field='branch_name'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].branchName }
                        value={this.state.form.bankInfo.branch_name}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.branch_name] }
                      />
                      <label className="selectbank-branch" onClick={ (this.state.form.bankInfo.bank_name) !== '' ? this.showBankBranchModal : this.handleEmptyBank }>{LANG[localStorage.JobChoiceLanguage].selectBranch}</label>
                    </div>
                  </div>        
                  <div className="input-row">
                    <div className="bank_info">
                      <Input
                        label={LANG[localStorage.JobChoiceLanguage].accountNum}
                        field='account_number'
                        maxLength="7"
                        pattern="[0-9]*"
                        placeholder={ LANG[localStorage.JobChoiceLanguage].accountNum }
                        value={this.state.form.bankInfo.account_number}
                        onChange={this.handleChangeBankInfo}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.account_number] }
                      />
                    </div>
                    <div className="bank_info">
                      <Input
                        label={LANG[localStorage.JobChoiceLanguage].accountHolder}
                        field='account_holder'
                        placeholder={ LANG[localStorage.JobChoiceLanguage].accountHolder }
                        maxLength="255"
                        value={this.state.form.bankInfo.account_holder}
                        onChange={this.handleChangeBankInfo}
                        error={ LANG[localStorage.JobChoiceLanguage][formErrors.account_holder] }
                      />
                    </div>
                  </div>
                  <div className="deposit_type">
                    <label htmlFor="deposit_type">
                      { LANG[localStorage.JobChoiceLanguage].depositType }
                      <span className="optional-badge">
                        <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                      </span>:
                    </label><br/>
                    <select id="deposit_type-selector" name="deposit_type" className={formErrors.value > 0 ? "error" : null} noValidate onChange={this.infoChange} value={this.state.form.bankInfo.deposit_type}>
                      <option value="">-{ LANG[localStorage.JobChoiceLanguage].select }-</option>
                      <option value="savings_account">{ LANG[localStorage.JobChoiceLanguage].savingsAccount }</option>
                      <option value="current_account">{ LANG[localStorage.JobChoiceLanguage].checkingsAccount }</option>
                    </select>
                    {formErrors.deposit_type.length > 0 && (
                      <span className="errorMessage">{ LANG[localStorage.JobChoiceLanguage][formErrors.deposit_type] }</span>
                    )}
                  </div>
                  <div className="submit submit-flex-row-space-between">
                    <button
                      className="btn btn-outline-secondary btn-register-size"
                      onClick={this.backPage}
                      type="submit">
                      { LANG[localStorage.JobChoiceLanguage].modalEmailBackBtn }
                    </button>
                    <button
                      className={`btn-register-size ${formValid(this.state) === true ? "btn btn-success" : 'btn btn-light'}`}
                      disabled={!formValid(this.state)}
                      type="submit">
                      { LANG[localStorage.JobChoiceLanguage].continue }
                    </button>
                    {/* <button
                      className={`btn-register-size ${formValid(this.state) === true ? "btn btn-success" : 'btn btn-light'}`}
                      onClick={this.submitInfo}
                      disabled={!formValid(this.state)}
                    >
                      { LANG[localStorage.JobChoiceLanguage].save }
                    </button> */}
                  </div>
                </form>
                </div>
              </div>
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
        handleParentClose={this.handleClose}
      />

      <BankModal
        show={this.state.bankModal.bank_modal}
        title={this.state.bankModal.title}
        handleBankModal={this.handleBankModal}
        setBankData={this.handleChangeBankInfo}
      />

      <BankBranchModal
        show={this.state.branchModal.branch_modal}
        title={this.state.branchModal.title}
        handleBankBranchModal={this.handleBranchBankModal}
        bankBranches={this.state.bankBranches}
        setBankBranchData={this.handleChangeBankInfo}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm2)
