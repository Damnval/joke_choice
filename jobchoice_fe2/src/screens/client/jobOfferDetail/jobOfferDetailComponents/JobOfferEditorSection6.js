import React, { Component } from 'react'
import '../JobOfferDetail.scss'
import { connect } from 'react-redux'
import Input from '../../../../components/input/Input'
import InputTextAreaEditing from '../../../../components/inputTextArea/InputTextAreaEditing'
import { LANG } from '../../../../constants'
import { emailRegex } from '../../../../regex'
import { whiteSpaceValidation } from '../../../../helpers'

const formValid = ({ formErrors, section6 }) => {
  let valid = true

  Object.values(section6).forEach(val => {
    (val === null ||
      ((typeof val === 'string' && val.trim().length === 0) || val.length === 0)
     ) && (valid = false)
  })

  Object.values(formErrors).forEach(val => {
    val !== null && val.length > 0 && (valid = false)
  })

  return valid
}

class JobOfferEditorSection6 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      section6: {
        mail_reply_template: '',
        mail_reply_email_address: '',
      },
      formErrors: {
        mail_reply_template: '',
        mail_reply_email_address: '',
      },
    }

    this.handleFormError = this.handleFormError.bind(this)
  }

  componentDidMount() {
    this.setState({
      section6: {
        mail_reply_template: this.props.initialData.mail_reply_template,
        mail_reply_email_address: this.props.initialData.mail_reply_email_address,
      }
    }, () => {
      this.props.retrievedData("section6", this.state.section6, formValid(this.state))
      this.props.loadNow('section6')
    })
  }

  handleInputChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "mail_reply_email_address":
        formErrors.mail_reply_email_address = value !== null && value.length > 100 ? LANG[localStorage.JobChoiceLanguage].applicationAddress + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '100' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : value !== null && value.length > 0 && !emailRegex.test(value) ? LANG[localStorage.JobChoiceLanguage].invalidEmail : ""
        break
      default:
        formErrors[name] = value !== null && value.length > 2000 ? LANG[localStorage.JobChoiceLanguage].applicationReply + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '2000' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
    }

    this.setState({
      formErrors,
      section6: {
        ...this.state.section6,
        [name]: value
      }
    }, () => {
      this.props.retrievedData("section6", this.state.section6, formValid(this.state))
    })
  }

  handleFormError(name, value) {
    
    const whiteSpaceValidator = whiteSpaceValidation(value)
    let formError = whiteSpaceValidator ? LANG[localStorage.JobChoiceLanguage][whiteSpaceValidator] : ''
    switch (name) {
      case "mail_reply_email_address":
        if ( value !== null && value.length > 0 && !emailRegex.test(value) ) {
          formError = LANG[localStorage.JobChoiceLanguage].invalidEmail 
        }
        break
      default:
        break
    }
    return formError
  }

  render() {
    return (
      <div className="createJob-section-bg">

        <div className="createJob-section-header">
          <span>{LANG[localStorage.JobChoiceLanguage].applicationInformation}</span>
        </div>

        <div className="createJob-inputArea">
          <InputTextAreaEditing
            field="mail_reply_template"
            label={LANG[localStorage.JobChoiceLanguage].applicationReply}
            onChange={this.handleInputChange}
            value={this.state.section6.mail_reply_template}
            error={this.handleFormError('mail_reply_template', this.state.section6.mail_reply_template)}
            additionalStyle="createJob-input-solo"
            resize={true}
            maxLength={100}
            required
          />
        </div>

        <div className="createJob-inputArea">
          <Input
            field="mail_reply_email_address"
            label={LANG[localStorage.JobChoiceLanguage].applicationAddress}
            onChange={this.handleInputChange}
            value={this.state.section6.mail_reply_email_address}
            error={this.handleFormError('mail_reply_email_address', this.state.section6.mail_reply_email_address)}
            className="createJob-input-solo"
            resize={true}
            maxLength={2000}
            required
          />
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferEditorSection6)
