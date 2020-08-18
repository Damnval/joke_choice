import React, { Component } from 'react'
import './Contact.scss'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import InputDropDown from '../../../components/inputDropDown/InputDropDown'
import InputTextArea from '../../../components/inputTextArea/InputTextArea'
import Input from '../../../components/input/Input'
import { Button } from 'react-bootstrap'
import LoadingIcon from '../../../components/loading/Loading'
import Modal from '../../../components/modal/Modal'
import api from '../../../utilities/api'
import ModalContactDetails from '../../../components/modalContactDetails/ModalContactDetails'
import ReactRecaptcha from 'react-recaptcha'
import { RECATPCHA } from '../../../constants'
import { LANG, EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import {contactRegex} from '../../../regex'
import ContactNumberInput from "../../../components/contactNumberInput/ContactNumberInput"

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
)

const formValid = ({ formErrors, required }) => {
    let valid = true

    Object.keys(formErrors).forEach(function(el) {
        if ( formErrors[el].length > 0 ) {
            valid = false
        }
    })

    Object.keys(required).forEach(function(el) {
        if ( required[el].length < 1 ) {
            valid = false
        }
    })

    return valid
}

class Contact extends Component {

    constructor(props) {
        super(props)

        this.state = {
          showDetails: false,
          validated: false,
          isLoading: true,
          modal: {
            messageKey: null,
            message: '',
            modal: false,
            modalType: '',
            redirect: null,
          },
          required: {
            inquirer: "",
            type: "",
            details: "",
            name: "",
            email: "",
          },
          contact_no: "",
          formErrors: {
            inquirer: "",
            type: "",
            category: "",
            details: "",
            name: "",
            email: "",
            contact_no: "",
          },
          contact_no_error: "",
        }

        this.callbackVerified = this.callbackVerified.bind(this)
        this.callbackExpired = this.callbackExpired.bind(this)
        this.callbackOnloaded = this.callbackOnloaded.bind(this)
        this.handleParentClose = this.handleParentClose.bind(this)
    }

    handleChange = (name, value) => {
        let formErrors = { ...this.state.formErrors }
        var dummy

        switch (name) {
            case "inquirer":
                formErrors.inquirer = value.length < 1 ? 'inquirerIsRequired': ""
            break
            case "type":
                formErrors.type = value.length < 1 ? 'typeOfInquiryIsRequired' : ""
            break
            case "details":
                formErrors.details = value.length < 3 ? 'minimum3' : ""
            break
            case "name":
                formErrors.name = value.length < 1 ? 'nameIsRequired' : ""
            break
            case "email":
                formErrors.email = emailRegex.test(value) ? "" : 'invalidEmail'
            break
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
            default:
            break
        }

        if (name === "contact_no") {
            this.setState({
                ...this.state,
                [name]: value
            })
        } else {
            this.setState({
                required: {
                    ...this.state.required,
                    [name]: value,
                },
            })
        }

        this.setState({
            formErrors,
            contact_no_error: dummy,
        })
    }

    handleModal = e => {
        e.preventDefault();

        this.setState({
            showDetails: !this.state.showDetails,
        })
    }

    closeModal = e => {
        this.setState({
            showDetails: !this.state.showDetails,
        })
    }

    handleSubmit = e => {
        const jobchoice_lang = localStorage.getItem('JobChoiceLanguage')
        this.setState({
            showDetails: false,
            isLoading: true,
            modal: {
                message: '',
                modal: false,
                modalType: '',
                redirect: null,
            },
        })

        let credentials = {
            inquirer: this.state.required.inquirer,
            type: this.state.required.type,
            category: this.state.required.category,
            details: this.state.required.details,
            name: this.state.required.name,
            email: this.state.required.email,
            contact_no: this.state.contact_no,
            jobchoice_lang: jobchoice_lang
        }

        switch (this.state.required.inquirer) {
            case "Job Seeker/Sharer":
                credentials.inquirer = "job_seeker/sharer"
            break
            case "Company":
                credentials.inquirer = "company"
            break
            case "Others":
                credentials.inquirer = "others"
            break
            default:
            break
        }

        api.post('api/inquiry', credentials).then(response => {
            this.setState({
              modal: {
                message: "inquirySent",
                modal: true,
                modalType: 'success',
                redirect: '/',
              },
              isLoading: false
            })
        }).catch(error => {
            console.log(error.response, 'what')
            const message = error.response.data === '{"email":["The email must be a valid email address."]}' ? "somethingWentWrong" : "invalidEmail"
            this.setState({
              modal: {
                message: message,
                modal: true,
                modalType: 'error'
              },
              isLoading: false
            })
        })
    }

    callbackOnloaded() {
        this.setState({isLoading: false})
    }

    callbackVerified() {
        this.setState({validated: true})
    }

    callbackExpired() {
        this.setState({validated: false})
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
            <JobChoiceLayout>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">{ LANG[localStorage.JobChoiceLanguage].home }</Breadcrumb.Item>/
                    <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].contact }</Breadcrumb.Item>
                </Breadcrumb>
                <div className="contact-background">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-7 col-xs-12">
                            <div className="contact-area">
                                <div className="contact-title">
                                    <span id="main-title">{ LANG[localStorage.JobChoiceLanguage].contact }</span>
                                </div>
                                <div className="contact-body">
                                    <form onSubmit={this.handleModal} noValidate>

                                        <div className="contact-individual">
                                            <InputDropDown
                                                label={ LANG[localStorage.JobChoiceLanguage].inquirer }
                                                field='inquirer'
                                                placeholder=" "
                                                value={this.state.required.inquirer}
                                                options={this.state.inquirer_options}
                                                onChange={this.handleChange}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.inquirer] }
                                                required={true}
                                            >
                                            {EM[localStorage.JobChoiceLanguage].INQUIRER_OPTION.map((value, key) => {
                                                return <option key={key} value={value.value}>{ value.name }</option>
                                            })}
                                            </InputDropDown>
                                        </div>

                                        <div className="contact-individual">
                                            <Input
                                                label={ LANG[localStorage.JobChoiceLanguage].inquirerName }
                                                field='name'
                                                value={this.state.name}
                                                onChange={this.handleChange}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.name] }
                                                required={true}
                                                maxLength={255}
                                            />
                                        </div>

                                        <div className="contact-individual">
                                            <InputDropDown
                                                label={ LANG[localStorage.JobChoiceLanguage].typeOfInquiry }
                                                field='type'
                                                placeholder=" "
                                                value={this.state.required.type}
                                                options={this.state.type_of_inquiry_options}
                                                onChange={this.handleChange}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.type] }
                                                required={true}
                                                disabled={this.state.required.inquirer === ""}
                                            >
                                                {(this.state.required.inquirer === "job_seeker/sharer") ?
                                                    (EM[localStorage.JobChoiceLanguage].CATEGORY_OPTION_1.map((value, key) => {
                                                        return <option key={key} value={value.value}>{ value.name }</option>
                                                    })) :
                                                    (EM[localStorage.JobChoiceLanguage].CATEGORY_OPTION_2.map((value, key) => {
                                                        return <option key={key} value={value.value}>{ value.name }</option>
                                                    }))
                                                }
                                            </InputDropDown>
                                        </div>

                                        <div className="contact-individual">
                                            <Input
                                                label={ LANG[localStorage.JobChoiceLanguage].enterEmail }
                                                field='email'
                                                value={this.state.email}
                                                onChange={this.handleChange}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.email] }
                                                required={true}
                                            />
                                        </div>

                                        <div className="contact-individual">
                                            <ContactNumberInput
                                                label={ LANG[localStorage.JobChoiceLanguage].contactInquiry }
                                                field='contact_no'
                                                placeholder="xxxxxxxxxx"
                                                value={this.state.contact_no}
                                                onChange={this.handleChange}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.contact_no] }
                                            />
                                        </div>

                                        <div className="contact-individual">
                                            <InputTextArea
                                                label={ LANG[localStorage.JobChoiceLanguage].inquiryDetail }
                                                field='details'
                                                value={this.state.details}
                                                onChange={this.handleChange}
                                                error={ LANG[localStorage.JobChoiceLanguage][formErrors.details] }
                                                maxLength={255}
                                                required={true}
                                                resize={true}
                                            />
                                        </div>

                                        <div className="contact-individual">
                                            <ReactRecaptcha
                                                sitekey= {RECATPCHA}
                                                verifyCallback={this.callbackVerified}
                                                expiredCallback={this.callbackExpired}
                                                onloadCallback={this.callbackOnloaded}
                                                render="explicit"
                                            />
                                        </div>

                                        <div className="contact-submit">
                                            <Button
                                            type="submit"
                                            className={`btn contact-submit-button ${(formValid(this.state) && (this.state.validated) && (this.state.contact_no_error === "" || this.state.contact_no_error === undefined)) ? 'contact-button-enabled' : 'contact-button-disabled'}`}
                                            disabled={(!formValid(this.state)) || (!this.state.validated) || (this.state.contact_no_error !== "" && this.state.contact_no_error !== undefined)}
                                            >
                                                <span>{ LANG[localStorage.JobChoiceLanguage].submit }</span>
                                            </Button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ModalContactDetails
                show={this.state.showDetails}
                data={[this.state.required, this.state.contact_no]}
                handleSubmit={this.handleSubmit}
                closeModal={this.closeModal} />

                <Modal
                show={this.state.modal.modal}
                message={LANG[localStorage.JobChoiceLanguage][this.state.modal.message]}
                type={this.state.modal.modalType}
                redirect={this.state.modal.redirect}
                handleParentClose={this.handleParentClose} />

                <LoadingIcon show={this.state.isLoading} />
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

  export default connect(mapStateToProps, mapDispatchToProps)(Contact)
