import React, { Component } from 'react'
import '../JobOfferDetail.scss'
import api from '../../../../utilities/api'
import { Button } from 'react-bootstrap'
import Input from '../../../../components/input/Input'
import InputRadio from '../../../../components/inputRadio/InputRadio'
import { LANG, EM } from '../../../../constants'
import { connect } from 'react-redux'
import Modal from '../../../../components/modal/Modal'
import InputNumberWithComma from '../../../../components/inputNumberWithComma/inputNumberWithComma'
import Pdf from '../../../../assets/documents/rates.pdf'
import { whiteSpaceValidation } from '../../../../helpers'
import ZipCodeInput from '../../../../components/zipcodeInput/ZipCodeInput'

const formValid = ({ formErrors, section1 }) => {
  let valid = true

  Object.values(formErrors).forEach(val => {
    (val === null || val.length > 0) && (valid = false)
    if(val && val !== undefined && val !== null && typeof val === 'object'){
      Object.values(val).forEach(geolocation => {
        (geolocation === null || geolocation.length > 0) && (valid = false)
      })
    }
  })


  Object.values(section1).forEach(val => {
    if(val && val !== undefined && val !== null && typeof val === 'object'){
      Object.values(val).forEach(geolocation => {
        (geolocation === null ||
          (typeof geolocation === 'string' && geolocation.trim().length === 0)) && (valid = false)
      })
    } else {
      (!val || val === null ||
       ((typeof val === 'string' && val.trim().length === 0) || val.length === 0)
      ) && (valid = false)
    }
  })

  return valid
}

class JobOfferEditorSection1 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      section1: {
        employment_period: '',
        employment_type: '',
        service_company: '',
        geolocation: {
          zip_code: '',
          complete_address: '',
          lat: 10.000,
          lng: 10.000,
          prefectures: "N/A",
        },
        incentive_per_share: '',
        price: '',
      },
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      formErrors: {
        employment_period: '',
        employment_type: '',
        service_company: '',
        geolocation: {
          zip_code: '',
          complete_address: '',
          location_details: '',
        },
        price: '',
      },
      optional: {
        location_details: '',
      },
      typingTimeout: 0,
      lowestValue: null, 
    }
    
    this.handleFormError = this.handleFormError.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  componentDidMount() {
    const employment_period = this.props.initialData.employment_period
    this.setState({
      section1: {
        employment_period: this.props.initialData.employment_period,
        employment_type: this.props.initialData.employment_type,
        service_company: this.props.initialData.service_company,
        geolocation: {
          zip_code: this.props.initialData.geolocation ? this.props.initialData.geolocation.zip_code : null,
          complete_address: this.props.initialData.geolocation ? this.props.initialData.geolocation.complete_address : null,
          lat: this.props.initialData.geolocation ? this.props.initialData.geolocation.lat : 10.000,
          lng: this.props.initialData.geolocation ? this.props.initialData.geolocation.lng : 10.000,
          prefectures: this.props.initialData.geolocation ? this.props.initialData.geolocation.prefectures : "N/A",
        },
        incentive_per_share: this.props.initialData.incentive_per_share,
        price: this.props.initialData.price,
      },
      optional: {
        location_details: this.props.initialData.location_details,
      },
      lowestValue: this.props.initialData.employment_period !== null ? EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD.filter(item => item.value === employment_period)[0].price : 0,
    }, () => {
      this.props.retrievedData("section1", {...this.state.section1, ...this.state.optional}, formValid(this.state))
      this.props.loadNow('section1')
    })
  }

  handleInputChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "service_company":
        formErrors[name] = value.length > 70 ? LANG[localStorage.JobChoiceLanguage].companyNameCreate + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '70' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "complete_address":
      case "location_details":
        formErrors.geolocation[name] = value.length > 100 ? (name === 'complete_address' ? LANG[localStorage.JobChoiceLanguage].address : LANG[localStorage.JobChoiceLanguage].locationDetails) + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '100' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      case "price": 
        if(this.state.lowestValue !== null) {
          formErrors.price = parseFloat(String(value).replace(/,/g, '')) < this.state.lowestValue ? LANG[localStorage.JobChoiceLanguage].valueMustNotLower1 + this.state.lowestValue + LANG[localStorage.JobChoiceLanguage].valueMustNotLower2  : value.length > 6 ? LANG[localStorage.JobChoiceLanguage].incentivePerShare + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '5' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        } else {
          formErrors.price = value.length > 6 ? LANG[localStorage.JobChoiceLanguage].incentivePerShare + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '5' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        }
        break
      case "employment_period":
        if(this.state.lowestValue !== null) {
          formErrors.price = value < this.state.lowestValue ? LANG[localStorage.JobChoiceLanguage].valueMustNotLower1 + this.state.lowestValue + LANG[localStorage.JobChoiceLanguage].valueMustNotLower2 : ""
        } else {
          formErrors.price = ""
        }
      break
      default:
        break
    }

    if(name === "employment_period") {
      const employment_period = EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD.filter(function (item) {return item.value === value})[0]
      if(value.length > 0) {
        this.setState({
          formErrors,
          section1: {
            ...this.state.section1,
            incentive_per_share: employment_period.incentive,
            price: employment_period.price,
            [name]: value
          },
          lowestValue: employment_period.price
        }, () => {
          this.props.retrievedData("section1", {...this.state.section1, ...this.state.optional}, formValid(this.state))
        })
      } else {
        this.setState({
          formErrors,
          section1: {
            ...this.state.section1,
            incentive_per_share: "",
            price: "",
            [name]: value
          },
          lowestValue: null,
        }, () => {
          this.props.retrievedData("section1", {...this.state.section1, ...this.state.optional}, formValid(this.state))
        })
      }
    } else if(name==="complete_address") {
      this.setState({
        formErrors,
        section1: {
          ...this.state.section1,
          geolocation: {
            ...this.state.section1.geolocation,
            complete_address: value,
          },
        }
      }, () => {
        this.props.retrievedData("section1", {...this.state.section1, ...this.state.optional}, formValid(this.state))
      })
    } else if(name === "location_details") {
      this.setState({
        formErrors,
        optional: {
          ...this.state.optional,
          [name]: value
        }
      }, () => {
        this.props.retrievedData("section1", {...this.state.section1, ...this.state.optional}, formValid(this.state))
      })
    } else {
      this.setState({
        formErrors,
        section1: {
          ...this.state.section1,
          [name]: value
        }
      }, () => {
        this.props.retrievedData("section1", {...this.state.section1, ...this.state.optional}, formValid(this.state))
      })
    }
  }

  onZipCodeInput = (name, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    let formErrors = { ...this.state.formErrors }
    formErrors.geolocation.zip_code = value.length > 7 ? LANG[localStorage.JobChoiceLanguage].zipCode + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '7' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
    formErrors.geolocation.complete_address = value.length > 100 ? LANG[localStorage.JobChoiceLanguage].address + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '100' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""

    if(value.length > 0) {
      this.setState({
        formErrors,
        section1: {
          ...this.state.section1,
          geolocation: {
            ...this.state.section1.geolocation,
            zip_code: value,
            lat: 10.000,
            lng: 10.000,
          }
        },
        isSearching: true,
      }, () => setTimeout(this.onSearchFunction(value), 1000))
    } else {
      this.setState({
        formErrors,
        section1: {
          ...this.state.section1,
          geolocation: {
            ...this.state.section1.geolocation,
            zip_code: '',
            complete_address: '',
            lat: '',
            lng: '',
            prefectures: '',
          }
        },
        isSearching: true,
      })
    }
  }

  onSearchFunction = (zipcode) => {
    api.post('api/zipcode', {zipcode:zipcode}).then(response => {
      if (response.data.results) {
        const address = `${response.data.results[0].address2}${response.data.results[0].address3}`
        this.setState({
          section1: {
            ...this.state.section1,
            geolocation: {
              ...this.state.section1.geolocation,
              complete_address: address,
              prefectures: response.data.results[0].address1 ? response.data.results[0].address1 : "N/A",
            }
          },
        })
        this.props.retrievedData("section1", {...this.state.section1, ...this.state.optional}, formValid(this.state))
      }
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

  copyCompany = e => {
    e.preventDefault()
    this.setState({
      section1: {
        ...this.state.section1,
        service_company: this.props.company.company_name && this.props.company.company_name !== null ? this.props.company.company_name : this.props.initialData.company_name,
        geolocation: {
          zip_code: this.props.company.geolocation && this.props.company.geolocation.zip_code !== null ? this.props.company.geolocation.zip_code : this.props.initialData.geolocation.zip_code,
          complete_address: this.props.company.geolocation && this.props.company.geolocation.complete_address !== null ? this.props.company.geolocation.complete_address : this.props.initialData.geolocation.complete_address,
          lat: this.props.company.geolocation && this.props.company.geolocation.lat !== null ? this.props.company.geolocation.lat : this.props.initialData.geolocation.lat,
          lng: this.props.company.geolocation && this.props.company.geolocation.lng !== null ? this.props.company.geolocation.lng : this.props.initialData.geolocation.lng,
          prefectures: this.props.company.geolocation && this.props.company.geolocation.prefectures !== null ? this.props.company.geolocation.prefectures : this.props.initialData.geolocation.prefectures,
        },
      },
      formErrors: {
        ...this.state.formErrors,
        service_company: "",
        geolocation: {
          ...this.state.formErrors.geolocation,
          zip_code: "",
          complete_address: "",
        },
      }
    }, () => {
      this.props.retrievedData("section1", {...this.state.section1, ...this.state.optional}, formValid(this.state))
      this.showMissingInfo()
    })
  }

  showMissingInfo() {
    const companyGeolocation = this.props.company.geolocation ? this.props.company.geolocation : null
    if(companyGeolocation === null || companyGeolocation.zip_code === null || companyGeolocation.complete_address === null || companyGeolocation.lat === null || companyGeolocation.lng === null || companyGeolocation.prefectures === null) {
      this.setState({
        modal: {
          ...this.state.modal,
          messageKey: 'incompleteCompanyInformation',
          modal: true,
          modalType: 'error',
        },
      })
    }
  }

  handleInDevelopment = () => {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    }, () => {
      this.setState({
        modal: {
          messageKey: 'thisIsStillInDevelopment',
          message: LANG[localStorage.JobChoiceLanguage].thisIsStillInDevelopment,
          modal: true,
          modalType: 'error',
        }
      })
    })
  }

  handleFormError(name, value) {
    let formError = ""
    
    switch (name) {
      case "service_company":
      case "complete_address":
      case "zip_code":
        const whiteSpaceValidator = value && value !== null ? whiteSpaceValidation(value) : null
        formError = whiteSpaceValidator !== null ? LANG[localStorage.JobChoiceLanguage][whiteSpaceValidator] : ''
        break
      case "price":
        if(this.state.lowestValue !== null) {
          formError = value !== null && parseFloat(String(value).replace(/,/g, '')) < this.state.lowestValue ? LANG[localStorage.JobChoiceLanguage].valueMustNotLower1 + this.state.lowestValue + LANG[localStorage.JobChoiceLanguage].valueMustNotLower2  : value !== null && value.length > 6 ? LANG[localStorage.JobChoiceLanguage].incentivePerShare + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '5' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        } else {
          formError = value !== null && value.length > 6 ? LANG[localStorage.JobChoiceLanguage].incentivePerShare + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '5' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        }
      break
      case "employment_period":
        if(this.state.lowestValue !== null) {
          formError = value !== null && value < this.state.lowestValue ? LANG[localStorage.JobChoiceLanguage].valueMustNotLower1 + this.state.lowestValue + LANG[localStorage.JobChoiceLanguage].valueMustNotLower2  : ""
        } else {
          formError = ""
        }
      break
      default:
        break
    }

    return formError
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
    return (
      <div className="createJob-section-bg">
        <div className="createJob-section-header">
          <span>{LANG[localStorage.JobChoiceLanguage].pricePlanEstimate}</span>
        </div>
        <div className="createJob-links">
          {/* <Button onClick={()=>this.handleInDevelopment()} className="createJob-links-actual">{LANG[localStorage.JobChoiceLanguage].aboutCharges}</Button> */}
          <a href={Pdf} target="_blank" className="createJob-links-actual">{LANG[localStorage.JobChoiceLanguage].clickHereForRates}</a>
        </div>
        <div className="createJob-inputArea">
          <InputRadio 
            id="employment_period"
            field="employment_period"
            label={LANG[localStorage.JobChoiceLanguage].jobType}
            options={EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD}
            onChange={this.handleInputChange}
            error={this.handleFormError('employment_period', this.state.section1.employment_period)}
            value={this.state.section1.employment_period}
            additionalStyle="createJob-radio-solo"
            additionalStyleUpperDiv="createJob-input-solo"
            required
          />
        </div>
        <div className="createJob-inputArea">
          <InputRadio 
            id="employment_type"
            field="employment_type"
            label={LANG[localStorage.JobChoiceLanguage].employmentForm}
            options={EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE}
            onChange={this.handleInputChange}
            error={this.handleFormError('employment_type', this.state.section1.employment_type)}
            value={this.state.section1.employment_type}
            additionalStyle="createJob-radio-solo"
            additionalStyleUpperDiv="createJob-input-solo"
            required
          />
        </div>
        <div className="createJob-inputArea section-break">
          <Input
            id="service_company"
            field="service_company"
            label={LANG[localStorage.JobChoiceLanguage].companyNameCreate}
            onChange={this.handleInputChange}
            error={this.handleFormError('service_company', this.state.section1.service_company)}
            value={this.state.section1.service_company}
            maxLength={70}
            className="createJob-input-solo"
            required
          />
        </div>
        <div className="createJob-inputArea">
          <ZipCodeInput
            field="zip_code"
            label={LANG[localStorage.JobChoiceLanguage].zipCode}
            handleInputChange={this.onZipCodeInput}
            error={this.handleFormError('zip_code', this.state.section1.geolocation.zip_code)}
            value={this.state.section1.geolocation.zip_code}
            className="createJob-input-solo"
            required
          />
        </div>
        <div className="createJob-inputArea">
          <Input
            id="complete_address"
            field="complete_address"
            label={LANG[localStorage.JobChoiceLanguage].address}
            onChange={this.handleInputChange}
            error={this.handleFormError('complete_address', this.state.section1.geolocation.complete_address)}
            value={this.state.section1.geolocation.complete_address}
            className="createJob-input-solo"
            maxLength={100}
            required
          />
        </div>
        <div className="createJob-inputArea">
          <Input
            id="location_details"
            field="location_details"
            label={LANG[localStorage.JobChoiceLanguage].locationDetails}
            onChange={this.handleInputChange}
            value={this.state.optional.location_details}
            error={this.handleFormError('location_details', this.state.optional.location_details)}
            className="createJob-input-solo"
            maxLength={100}
          />
        </div>
        <div className="createJob-copyArea">
          <Button onClick={this.copyCompany}>{LANG[localStorage.JobChoiceLanguage].copyCompanyInfo}</Button>
        </div>
        <div className="createJob-inputArea section-break">
          <InputNumberWithComma 
            id="price"
            field="price"
            pattern="[0-9\.,]+"
            label={LANG[localStorage.JobChoiceLanguage].incentivePerShare}
            onChange={this.handleInputChange}
            error={this.handleFormError('price', this.state.section1.price)}
            value={this.state.section1.price}
            className="createJob-yen-ender"
            required
            withYen={true}
          />
        </div>
        <div className="createJob-input-links">
          <div></div>
          <div>
            <a href="#" onClick={()=>this.handleInDevelopment()}>※{LANG[localStorage.JobChoiceLanguage].pleaseReferHereShareReward}</a>
            <a href="#" onClick={()=>this.handleInDevelopment()}>※{LANG[localStorage.JobChoiceLanguage].pleaseReferMoneyPerShare}</a>
          </div>
        </div>

        <Modal show={this.state.modal.modal} 
          messageKey={this.state.modal.messageKey}
          message={this.state.modal.message}
          type={this.state.modal.modalType}
          redirect={this.state.modal.redirect} 
          handleParentClose={this.handleParentClose} />

      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferEditorSection1)
