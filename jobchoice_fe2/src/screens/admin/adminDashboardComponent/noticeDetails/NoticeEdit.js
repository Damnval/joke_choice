import React, { Component } from 'react'
import './NoticeDetails.scss'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Modal from '../../../../components/modal/Modal'
import api from '../../../../utilities/api'
import { LANG, EM } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { ErrorModal, DateSubmitFormat } from '../../../../helpers'
import Input from '../../../../components/input/Input'
import InputDropDown from '../../../../components/inputDropDown/InputDropDown'
import LoadingIcon from '../../../../components/loading/Loading'
import InputTextArea from '../../../../components/inputTextArea/InputTextArea'
import InputRadio from '../../../../components/inputRadio/InputRadio'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import {enUS, ja} from 'date-fns/esm/locale'

const errorModal = {...ErrorModal()}

const numRegex = RegExp(
  /^\d+$/
)

const formValid = ({ formErrors, form }) => {
  let valid = true

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    if (val instanceof Array) {
      Object.values(val).forEach(el => {
        el.length > 0 && (valid = false)
      })
    } else {
      val.length > 0 && (valid = false)
    }
  })

  Object.values(form).forEach(val => {
    if(typeof val === 'object'){
      Object.values(val).forEach(el => {
        (el === null || el.length === 0) && (valid = false)
      })
    } else {
      (val === null ||
       ((typeof val === 'string' && val.trim().length === 0) || val.length === 0)
      ) && (valid = false)
    }
  })

  return valid
}

const areaOption = [
  // PUBLICATION_AREA
  {
    en: "Nationwide",
    jp: "全国",
    value: "nationwide"
  },
  {
    en: "International",
    jp: "全世界",
    value: "international"
  },
  {
    en: "Local",
    jp: "一部地域",
    value: "local",
  },

]

const categoryOption = [
  // for NOTIFICATION_TYPE
  {
    en: "Campaign Information",
    jp: "キャンペーン案内",
    value: "campaign_information"
  },
  {
    en: "System Maintenance",
    jp: "システムメンテナンス",
    value: "system_maintenance"
  },
  {
    en: "System Update Notification",
    jp: "システム更新のお知らせ",
    value: "system_update_notification"
  }
]

const accounTypeOption = [
  // for ACCOUNT_TYPE
  {
    en: "Company",
    jp: "会社",
    value: "company"
  },
  {
    en: "Job Seeker",
    jp: "ユーザー",
    value: "job_seeker"
  },
  {
    en: "All",
    jp: "全ユーザー",
    value: "all"
  }
]

class NoticeEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isEditing: false,
          editDetails: false,
          loading: true,
          noticeDetails: this.props.noticeDetails,
          modal: {
            messageKey: null,
            message: '',
            modal: false,
            modalType: '',
            redirect: null,
          },
          form: {
            title: '',
            description: '',
            publication: {
              published_start_date: '',
              published_end_date: '',
              draft: '0',
              status: "published"
            },
          },
          optional: {
            area: '',
            age_to: '',
            age_from: '',
            recipient_type: 'all',
            type: 'system_update_notification',
          },
          formErrors: {
            title: '',
            description: '',
            published_start_date: '',
            published_end_date: '',
            area: '',
            type: '',
            age_to: '',
            age_from: '',
            recipient_type: ''
          }
        }
      this.handleChangeStart = this.handleChangeStart.bind(this)
      this.handleChangeEnd = this.handleChangeEnd.bind(this)
    }

    componentDidMount() {
      // initialize form with current data
      this.setState({
        form: {
          title: this.state.noticeDetails.title,
          description: this.state.noticeDetails.description,
          publication: {
            published_start_date: this.state.noticeDetails.publication.published_start_date,
            published_end_date: this.state.noticeDetails.publication.published_end_date,
            draft: '0',
            status: "published"
          },
        },
        optional: {
          area: this.state.noticeDetails.area,
          type: this.state.noticeDetails.type,
          age_to: this.state.noticeDetails.age_to,
          age_from: this.state.noticeDetails.age_from,
          recipient_type: this.state.noticeDetails.recipient_type,
        }
      })
    }

    editDetails = (e) => {
        if(this.state.editDetails){
          this.setState({editDetails: false})
        }
  
        if(!this.state.editDetails){
          const title = this.props.location.state.title
          this.setState({
            editDetails: true,
            details: {
              ...this.state.details,
              title: '',
            }
          })
        }
      }

    toggleEdit = e => {
      this.setState({
        isEditing: !this.state.isEditing,
      })
    }
  
    handleSubmit = e => {
      e.preventDefault()
      this.setState({
        modal: {
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
        },
        isLoading: true
      })
  
      const notifications = {
        ...this.state.form,
        ...this.state.optional,
        publication: {
          ...this.state.form.publication,
          published_start_date: DateSubmitFormat(this.state.form.publication.published_start_date),
          published_end_date: DateSubmitFormat(this.state.form.publication.published_end_date),
        }
      }

      api.patch('api/manage/notification/' + this.state.noticeDetails.id, notifications).then(response => {
        this.setState({
          isLoading: false,
          modal: {
            messageKey: 'successfullyUpdatedNotification',
            message: LANG[localStorage.JobChoiceLanguage].successfullyUpdatedNotification,
            modal: true,
            modalType: 'success',
            redirect: '/admin/manage/notice-management',
          }
        })
      }).catch(error => {
        let log = error.response.data.error
        try {
          log = Object.entries(JSON.parse(error.response.data.error))
          this.setState({
            isLoading: false,
            modal: {
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
              message: log,
              modal: true,
              modalType: 'error',
            }
          })
        }
      })
    }
   
    handleEdit = () => {
        this.props.handleEdit(false)
    }

    // Change specify to value
    // Values can be seen in data (SPECIFY)
    toggleSpecified = (name, value) => {
      this.setState({
        specify: value,
      })
    }

    handleInputChange = (name, value) => {
      let formErrors = { ...this.state.formErrors }

      switch (name) {
        case "title":
          if (value.length === 0) {
            formErrors.title = ""
          } else if (value.trim().length === 0) {
            formErrors.title = "invalidFormat"
          } else if ((value.length < 3)) {
            formErrors.title = "minimum3"
          } else {
            formErrors.title = ""
          }
          break
        case "description":
          if (value.length === 0) {
            formErrors.description = ""
          } else if (value.trim().length === 0) {
            formErrors.description = "invalidFormat"
          } else if ((value.length < 10)) {
            formErrors.description = "minimum10"
          } else {
            formErrors.description = ""
          }
          break
        case "age_from":
          var age_to = this.state.optional.age_to
          formErrors.age_from = (value === null || value === "") && age_to !== null && age_to !== "" ? "invalidInput" : value !== null && value !== "" && !numRegex.test(value) ? "invalidInput" : value !== null && value !== "" && age_to !== null && age_to !== "" && value >= parseInt(age_to) ? "invalidInput" : ""
          formErrors.age_to = value !== null && value !== "" && age_to === null && age_to === "" ? "invalidInput" : age_to !== null && age_to !== "" && !numRegex.test(age_to) ? "invalidInput" : value !== null && value !== "" && age_to !== null && age_to !== "" && value >= parseInt(age_to) ? "invalidInput" : ""
          break
        case "age_to":
          var age_from = this.state.optional.age_from
          formErrors.age_to = (value === null || value === "") && age_from !== null && age_from !== "" ? "invalidInput" : value !== null && value !== "" && !numRegex.test(value) ? "invalidInput" : value !== null && value !== "" && age_from !== null && age_from !== "" && value <= parseInt(age_from) ? "invalidInput" : ""
          formErrors.age_from = value !== null && value !== "" && age_from === null && age_from === "" ? "invalidInput" : age_from !== null && age_from !== "" && !numRegex.test(age_from) ? "invalidInput" : value !== null && value !== "" && age_from !== null && age_from !== "" && value <= parseInt(age_from) ? "invalidInput" : ""
          break
        default:
          formErrors[name] = value.length < 1 ? LANG[localStorage.JobChoiceLanguage].thisIsRequired : ""
          break
      }

      switch (name) {
        case "title":
        case "description":
          this.setState({
            formErrors,
            form : {
              ...this.state.form,
              [name]: value
            }
          })
          break
        case "area":
        case "age_to":
        case "age_from":
        case "recipient_type":
        case "type":
        default:
          this.setState({
            formErrors,
            optional : {
              ...this.state.optional,
              [name]: value
            }
          })
          break
      }
    }

    handleChangeStart(date) {
      const endDate = date > this.state.form.publication.published_end_date ? date : this.state.form.publication.published_end_date
      this.setState({
        form: {
          ...this.state.form,
          publication: {
            ...this.state.form.publication,
            published_start_date: date,
            published_end_date: endDate
          }
        }
      })
    }
  
    handleChangeEnd(date) {
      const startDate = date < this.state.form.publication.published_start_date ? date : this.state.form.publication.published_start_date
      this.setState({
        form: {
          ...this.state.form,
          publication: {
            ...this.state.form.publication,
            published_start_date: startDate,
            published_end_date: date
          }
        }
      })
    }

  render() {
    return (
        <div>
          <form className="edit-notice-form" onSubmit={this.handleSubmit} noValidate>
              <Input
                label={ LANG[localStorage.JobChoiceLanguage].noticeTitle }
                className='title-input'
                field='title'
                noValidate
                value={this.state.form.title}
                onChange={this.handleInputChange}
                errorKey={this.state.formErrors.title}
                maxLength={70}
                required
              />
              <InputTextArea
                label={ LANG[localStorage.JobChoiceLanguage].description }
                additionalStyle="description-input-notice-container"
                inputStyles='description-input-notice'
                field='description'
                noValidate
                value={this.state.form.description}
                initialValue={this.state.form.description}
                onChange={this.handleInputChange}
                errorKey={this.state.formErrors.description}
                maxLength={225}
                required
              />
              <div className='input-field publication-filter-container bottomer'>
                <label> { LANG[localStorage.JobChoiceLanguage].publicationPostDate }<span className="required-badge smaller"><small>{ LANG[localStorage.JobChoiceLanguage].required }</small></span> :</label>
                <div className="publication-filter">
                  <DatePicker
                    className="notice-date-picker"
                    dateFormat="yyyy/MM/dd"
                    selectsStart
                    startDate={this.state.form.publication.published_start_date}
                    endDate={this.state.form.publication.published_end_date}
                    selected={this.state.form.publication.published_start_date}
                    onChange={this.handleChangeStart}
                    error={this.state.formErrors.published_start_date}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                  <span className="squig"> ~ </span>
                  <DatePicker
                    className="notice-date-picker"
                    dateFormat="yyyy/MM/dd"
                    selectsEnd
                    startDate={this.state.form.publication.published_start_date}
                    endDate={this.state.form.publication.published_end_date}
                    selected={this.state.form.publication.published_end_date}
                    onChange={this.handleChangeEnd}
                    error={this.state.formErrors.published_end_date}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                </div>
              </div>
              <div className="admin-create-notice-title division-two">
                <strong>{ LANG[localStorage.JobChoiceLanguage].postNoticesWith }</strong> ({ LANG[localStorage.JobChoiceLanguage].optional })
              </div>
                <InputRadio 
                  id="employment_period"
                  field="employment_period"
                  value={this.state.specify}
                  options={EM[localStorage.JobChoiceLanguage].SPECIFY}
                  onChange={this.toggleSpecified}
                  additionalStyle="createJob-radio-solo"
                />
                {/* If form.specify === 'specify' then ... */}
                {this.state.specify === 'specify' &&
                  <div className="publication-area">
                    <div className="input-field-container">
                      <div className="publication-title">
                        <strong>{ LANG[localStorage.JobChoiceLanguage].publicationArea }</strong>
                      </div>
                      <InputDropDown 
                        className="publication-options"
                        id="area"
                        placeholder=" "
                        field="area"
                        options={areaOption}
                        value={this.state.optional.area}
                        onChange={this.handleInputChange}
                        error={this.state.formErrors.area}
                        >
                          {(areaOption.map((option) => {
                            return (
                              <option key={option.value} value={option.value}>
                                {localStorage.JobChoiceLanguage === "JP" ? option.jp : option.en}
                              </option>)
                          }))}
                      </InputDropDown>
                    </div>
                    <div className="input-field-container">
                      <div className="publication-title">
                        <strong>{ LANG[localStorage.JobChoiceLanguage].category }</strong>
                      </div>
                      <InputDropDown 
                        className="publication-options"
                        id="type"
                        placeholder=" "
                        field="type"
                        options={categoryOption}
                        value={this.state.optional.type}
                        onChange={this.handleInputChange}
                        error={this.state.formErrors.type}
                        >
                          {(categoryOption.map((option) => {
                            return (
                              <option key={option.value} value={option.value}>
                                {localStorage.JobChoiceLanguage === "JP" ? option.jp : option.en}
                              </option>)
                          }))}
                      </InputDropDown>
                    </div>
                  <div className="input-field-container">
                    <div className="publication-title">
                      <strong>{ LANG[localStorage.JobChoiceLanguage].ageRange }</strong>
                    </div>
                    <div className="publication-filter">
                      <Input
                        className="age-option"
                        field='age_from'
                        noValidate onChange={this.infoChange} 
                        value={this.state.optional.age_from}
                        onChange={this.handleInputChange}
                        errorKey={this.state.formErrors.age_from}
                      />
                      <span className="squig"> ~ </span>
                      <Input
                        className="age-option"
                        field='age_to'
                        noValidate onChange={this.infoChange} 
                        value={this.state.optional.age_to}
                        onChange={this.handleInputChange}
                        errorKey={this.state.formErrors.age_to}
                      />
                    </div>
                  </div>
                  <div className="input-field-container">
                    <div className="publication-title">
                      <strong>{ LANG[localStorage.JobChoiceLanguage].destination }</strong>
                    </div>
                    <InputDropDown
                      className="publication-options"
                      id="recipient_type"
                      field="recipient_type"
                      options={accounTypeOption}
                      onChange={this.handleInputChange}
                      value={this.state.optional.recipient_type}
                      error={this.state.formErrors.category}
                      >
                        {(accounTypeOption.map((option) => {
                          return (
                            <option key={option.value} value={option.value}>
                              {localStorage.JobChoiceLanguage === "JP" ? option.jp : option.en}
                            </option>)
                        }))}
                    </InputDropDown>
                  </div>
                </div>
                }
                <div className="edit-notice-btn">
                  <span className="publication-btn">
                      <Button 
                          onClick={this.handleEdit}
                          className="btn btn-primary" >
                          { LANG[localStorage.JobChoiceLanguage].cancel }
                      </Button>
                      <Button 
                          className={`profile-buttons ${(formValid(this.state)) ? 'btn-success' : 'btn-secondary'}`}
                          type="submit"
                          disabled={(!formValid(this.state))}
                          >{ LANG[localStorage.JobChoiceLanguage].submit }
                      </Button>
                  </span>
                </div>
            </form>
            <Modal
            show={this.state.modal.modal}
            message={this.state.modal.message}
            messageKey={this.state.modal.messageKey}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}/>

            <LoadingIcon show={this.state.isLoading} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NoticeEdit)
