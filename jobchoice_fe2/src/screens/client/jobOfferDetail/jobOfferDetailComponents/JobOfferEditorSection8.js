import React, { Component } from 'react'
import '../JobOfferDetail.scss'
import { connect } from 'react-redux'
import InputTextAreaEditing from '../../../../components/inputTextArea/InputTextAreaEditing'
import InputRadio from '../../../../components/inputRadio/InputRadio'
import { LANG, EM } from '../../../../constants'
import DateInput from '../../../../components/dateInput/DateInput'

const formValid = ({ formErrors, section8 }) => {
  let valid = true

  section8.status.length === 0 && (valid = false)

  Object.values(formErrors).forEach(val => {
    val !== null && val.length > 0 && (valid = false)
  })

  return valid
}

class JobOfferEditorSection8 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      section8: {
        status: '',
        published_start_date: '',
        published_end_date: '',
        draft: 0,
        published_comment: '',
      },
      formErrors: {
        published_start_date: '',
        published_end_date: '',
        published_comment: '',
      },
    }

    this.handleFormError = this.handleFormError.bind(this)
  }

  componentDidMount() {
    this.setState({
      section8: {
        status: this.props.initialData.publication.status,
        published_start_date: this.props.initialData.publication.published_start_date,
        published_end_date: this.props.initialData.publication.published_end_date,
        draft: this.props.initialData.publication.draft,
        published_comment: this.props.initialData.published_comment,
      },
    }, () => {
      this.props.retrievedData("section8", this.state.section8, true)
    })
  }

  handleInputChange = (name, value) => {
    let formErrors = { ...this.state.formErrors }

    switch (name) {
      case "published_start_date":
        const start_date = new Date(value)
        const y_start = start_date.getFullYear()
        const end_temp = this.state.section8.published_end_date !== null && this.state.section8.published_end_date.length > 0 ? new Date(this.state.section8.published_end_date) : null
        const y_end_temp = end_temp !== null ? end_temp.getFullYear() : 0
        formErrors.published_start_date = (this.state.section8.published_end_date !== null && this.state.section8.published_end_date.length > 0 && value >= this.state.section8.published_end_date) || y_start > 3000 ? LANG[localStorage.JobChoiceLanguage].invalidDateRange : this.state.section8.published_end_date !== null && this.state.section8.published_end_date.length > 0 && value.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        formErrors.published_end_date = (this.state.section8.published_end_date !== null && this.state.section8.published_end_date.length > 0 && value >= this.state.section8.published_end_date) || y_end_temp > 3000 ? LANG[localStorage.JobChoiceLanguage].invalidDateRange : this.state.section8.published_end_date !== null && this.state.section8.published_end_date.length === 0 && value.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        break
        case "published_end_date":
          const end_date = new Date(value)
          const y_end = end_date.getFullYear()
          const start_temp = this.state.section8.published_start_date !== null && this.state.section8.published_start_date.length > 0 ? new Date(this.state.section8.published_start_date) : null
          const y_start_temp = start_temp !== null ? start_temp.getFullYear() : 0
          formErrors.published_start_date = (this.state.section8.published_start_date !== null && this.state.section8.published_start_date.length > 0 && value <= this.state.section8.published_start_date) || y_start_temp > 3000 ? LANG[localStorage.JobChoiceLanguage].invalidDateRange : this.state.section8.published_start_date.length === 0 && value.length > 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
          formErrors.published_end_date = (this.state.section8.published_start_date !== null && this.state.section8.published_start_date.length > 0 && value <= this.state.section8.published_start_date) || y_end > 3000  ? LANG[localStorage.JobChoiceLanguage].invalidDateRange : this.state.section8.published_start_date.length > 0 && value.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
          break
      case "published_comment":
          formErrors[name] = value.length > 100 ? LANG[localStorage.JobChoiceLanguage].postPeriod + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '100' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
        break
      default:
        break
    }

    this.setState({
      formErrors,
      section8: {
        ...this.state.section8,
        [name]: value
      }
    }, () => {
      this.props.retrievedData("section8", this.state.section8, formValid(this.state))
    })
  }

  handleFormError(name, value) {
    let formError = ""
    
    switch (name) {
      case "published_start_date":
        const start_date = new Date(value)
        const y_start = start_date.getFullYear()
        formError = (this.state.section8.published_end_date !== null && value !== null && this.state.section8.published_end_date.length > 0 && value >= this.state.section8.published_end_date) || y_start > 3000 ? LANG[localStorage.JobChoiceLanguage].invalidDateRange : this.state.section8.published_end_date !== null && value !== null && this.state.section8.published_end_date.length > 0 && value.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        break
      case "published_end_date":
        const end_date = new Date(value)
        const y_end = end_date.getFullYear()
        formError = (this.state.section8.published_start_date !== null && value !== null && this.state.section8.published_start_date.length > 0 && value <= this.state.section8.published_start_date) || y_end > 3000  ? LANG[localStorage.JobChoiceLanguage].invalidDateRange : this.state.section8.published_start_date !== null && value !== null && this.state.section8.published_start_date.length > 0 && value.length === 0 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
        break
      case "published_comment":
        formError = value !== null && value.length > 100 ? LANG[localStorage.JobChoiceLanguage].postPeriod + LANG[localStorage.JobChoiceLanguage].maxCharacters1 + '100' + LANG[localStorage.JobChoiceLanguage].maxCharacters2 : ""
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
          <span>{LANG[localStorage.JobChoiceLanguage].placementManagement}</span>
        </div>

        <div className="createJob-inputArea">
          <InputRadio 
            field="status"
            label={LANG[localStorage.JobChoiceLanguage].publicationStatus}
            options={EM[localStorage.JobChoiceLanguage].PUBLICATION_STATUS}
            value={this.state.section8.status}
            onChange={this.handleInputChange}
            additionalStyle="createJob-radio-solo"
            additionalStyleUpperDiv="createJob-input-solo"
            required
          />
        </div>

        <div className="createJob-inputArea createJob-sameline">
          <label htmlFor="post_period">
            {LANG[localStorage.JobChoiceLanguage].postPeriod}
            <span className="optional-badge">
              <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
            </span>:
          </label>
          <div name="post_period" id="job-post-period" className="createJob-range-horizontal">
            <DateInput
              onChange={ this.handleInputChange }
              error={ this.handleFormError('published_start_date', this.state.section8.published_start_date) }
              field="published_start_date"
              value={ this.state.section8.published_start_date }
              dataExists={true}
              yearsToFuture={2}
            />
            <div className="createJob-center-object">
              <span>～</span>
            </div>
            <DateInput
              onChange={ this.handleInputChange }
              error={ this.handleFormError('published_end_date', this.state.section8.published_end_date) }
              field="published_end_date"
              value={ this.state.section8.published_end_date }
              dataExists={true}
              yearsToFuture={2}
            />
          </div>
        </div>

        <div className="createJob-inputArea">
          <InputTextAreaEditing
            field="published_comment"
            label={LANG[localStorage.JobChoiceLanguage].memo}
            onChange={this.handleInputChange}
            value={this.state.section8.published_comment}
            error={this.handleFormError('published_comment', this.state.section8.published_comment)}
            additionalStyle="createJob-input-solo"
            resize={true}
          />
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(JobOfferEditorSection8)
