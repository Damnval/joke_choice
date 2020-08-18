import React from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import './ApplicantInfo.scss'
import InputTextArea from '../../../components/inputTextArea/InputTextArea'
import CareerHistoryModal from './careerHistoryModal/CareerHistoryModal'
import EducationalBackgroundModal from './educationalBackgroundModal/EducationalBackgroundModal'
import HatarakikataDisplay from '../../../components/hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import InfoRow from '../../../components/infoComponents/infoRow/InfoRow'
import { LANG, EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import ApplicantInfoConfirmationModal from './applicantInfoConfirmationModal/ApplicantInfoConfirmationModal'
import { DateFormat } from '../../../helpers'
import Img from 'react-fix-image-orientation'

class ApplicantInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      applicantDetails: null,
      disclosed: 0,
      note: null,
      note_id: null,
      savingNote: false,
      isLoading: true,
      isSaving: false,

      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },

      confirm: {
        messageKey: null,
        message: '',
        modal: false,
        disclosureFee: 0,
        id: 0
      },

      educational_background_modal: false,
      career_history_modal: false,
    }

    this.handleDisclosed = this.handleDisclosed.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
  }

  componentDidMount() {
    const job_seeker_id = this.props.match.params.job_seeker_id
    const job_id = this.props.match.params.job_id
    api.post('api/account-information', {job_seeker_id: job_seeker_id, job_id: job_id}).then(response => {
      if (response.data.status === 200) {
        const notes = response.data.results.applicant_info.notes ? response.data.results.applicant_info.notes: null
        this.setState({
          note: notes ? notes.notes: '',
          note_id: notes ? notes.id: null,
          applicantDetails: response.data.results.applicant_info,
          isLoading: false,
          disclosed: response.data.results.applicant_info.disclosed
        })
      }
    }).catch(error => {
      console.log(error)
    })
  }

  onDisclosed (id) {
    this.setState({
      confirm: {
        messageKey: null,
        message: '',
        modal: false,
        id: 0
      }
    }, () => {
      const message = id === 0 ? 
        'areYouSureReject' :
        'areYouSureDisclose'
      this.setState({
        confirm: {
          messageKey: null,
          message: message,
          modal: true,
          id: id,
          disclosureFee: this.state.applicantDetails.job.incentive_per_share
        }
      })
    })
  }

  handleDisclosed (disclosed) {
    this.setState({
      isLoading: true,
      confirm: {
        messageKey: null,
        message: '',
        modal: false,
        id: 0
      }
    })
    const credentials = {
      job_seeker_id: this.props.match.params.job_seeker_id,
      job_id: this.props.match.params.job_id,
      disclosed: disclosed
    }
    api.patch('api/disclose-apply-job',credentials).then(response => {
      const job_seeker_id = this.props.match.params.job_seeker_id
      const job_id = this.props.match.params.job_id
      api.post('api/account-information', {job_seeker_id: job_seeker_id, job_id: job_id}).then(response => {
        if (response.data.status === 200) {
          if (disclosed === 1) {
            const notes = response.data.results.applicant_info.notes ? response.data.results.applicant_info.notes: null
            this.setState({
              note: notes ? notes.notes: '',
              note_id: notes ? notes.id: null,
              applicantDetails: response.data.results.applicant_info,
              isLoading: false,
              disclosed: response.data.results.applicant_info.disclosed,
              modal: {
                messageKey: 'youHaveAcceptedToDisclose',
                message: null,
                modal: true,
                modalType: 'success'
              }
            })
          } else {
            this.props.history.push('/company/jobs/'+this.props.match.params.job_id)
          }
        }
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
      this.setState({ 
          modal: {
              messageKey: 'serverError',
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/home'
          },
          isLoading: false,
      })
    })
  }

  noteInput = (name, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    this.setState({
      note: value,
      isSaving: true
    }, () => this.setState({
      typingTimeout:setTimeout(() => this.onSearchFunction(value), 1000)
    }))
  }

  onSearchFunction = (note) => {
    if (this.state.note_id) {
      const note = {
        notes: this.state.note,
      }
      api.patch('api/note/'+this.state.note_id, note).then(response => {
        if (response.data.results) {
          this.setState({
            savingNote: true,
            isSaving:false
          })
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
    } else {
      const note = {
        notes: this.state.note,
        taggable_id: this.state.applicantDetails.id,
        taggable_type: 'AppliedJob'
      }
      api.post('api/note', note).then(response => {
        if (response.data.results) {
          // Add note_id upon successful response
          this.setState({
            savedNote: true,
            isSaving: false,
            note_id: response.data.note.id
          })
        } else {
          
        }
      }).catch(error => {
        if( error.response.data.error === LANG[localStorage.JobChoiceLanguage].noteAlreadyExist ) {
          this.onSearchFunction(note)
        } else {
          this.setState({
            modal: {
              messageKey: null,
              message: LANG[localStorage.JobChoiceLanguage].serverError,
              modal: true,
              modalType: 'error',
              redirect: '/',
            },
            isLoading: false
          })
        }
      })
    }
  } 

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  renderMultipleAnswer = (item) => {
    return (
      <div className="answer-container">
        <div className="answer-marker">
          <div>A</div>
        </div>
        <div className="answer-list">
          {item.length > 0 ? item.map((el, key) => {
            return (
              <ul key={key} className="answer-item">{el.job_question_answer.answer}</ul>
            )
          }) : 
            <ul className="no-answer-item">{LANG[localStorage.JobChoiceLanguage].noAnswer}</ul>
          }
        </div>
      </div>
    )
  }

  renderFreeTextAnswer = (answer) => {
    return (
      <div className="answer-container">
        <div className="answer-marker">
          <div>A</div>
        </div>
        <div className="answer-list">
        <ul className={`${answer ? 'answer-item' : 'no-answer-item'}`}>{answer ? answer : LANG[localStorage.JobChoiceLanguage].noAnswer}</ul>
        </div>
      </div>
    )
  }

  handleModalClose() {
    this.setState({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    })
  }

  render() {
    const data = this.state
    const applicant = data.applicantDetails
    const matching_job_ratio = applicant && applicant.job_matching_ratio ? `${applicant.job_matching_ratio}%` : '0%'

    const job_id = this.props.match.params.job_id
    
    let first_name = ''
    let last_name = ''
    let first_name_kana = ''
    let last_name_kana = ''
    const moment = require('moment')
    let created_at = applicant ? moment(applicant.job_seeker.created_at, "YYYY-MM-DD").format("YYYY-MM-DD") : ""

    if (applicant && this.state.disclosed === 1) {
      first_name = applicant.job_seeker.user.first_name ? applicant.job_seeker.user.first_name : ''
      last_name = applicant.job_seeker.user.last_name ? applicant.job_seeker.user.last_name : ''
      first_name_kana = applicant.job_seeker.user.first_name_kana ? applicant.job_seeker.user.first_name_kana : ''
      last_name_kana = applicant.job_seeker.user.last_name_kana ? applicant.job_seeker.user.last_name_kana : ''
    }

    return (
      <JobChoiceLayout className="jobchoice-body">
        <Breadcrumb>
          <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
          <Breadcrumb.Item href={`/company/jobs/${job_id}`}>{LANG[localStorage.JobChoiceLanguage].applicantList}</Breadcrumb.Item>/
          <Breadcrumb.Item active>{LANG[localStorage.JobChoiceLanguage].applicantInformation}</Breadcrumb.Item>
        </Breadcrumb>
      <div className='container-fluid offer-detail-background'>
        <div className="row">
          <div className="col-md-8 offset-md-2 col-xl-8 offset-xl-2">
            {applicant &&
            <>
            <div className="row applicant-info-1">
              <div className="col-lg-4 col-xl-3 offset-xl-1 flex justify-content-center">
                <div className='applicant-picture'>
                  {applicant ? 
                    (applicant.job_seeker.profile_picture && <Img src={applicant.job_seeker.profile_picture} alt="logo"/>) :
                    ''
                  }
                </div>
              </div>
              <div className="col-lg-8 col-xl-7">
                <span className='applicant-title'>
                  {LANG[localStorage.JobChoiceLanguage].applicantInformation}
                </span>
                <div className="options">
                  {applicant.status !== 'rejected' && (data.disclosed ?
                  <span className="disclosed-label">{LANG[localStorage.JobChoiceLanguage].applicantDisclosed}</span> :
                  <button onClick={() => this.onDisclosed(1)} className="btn btn-success">{LANG[localStorage.JobChoiceLanguage].disclosureBtnUpper}</button>)
                  }
                  {applicant.status === 'rejected' ?
                    <span className="rejected-label">{LANG[localStorage.JobChoiceLanguage].rejectedCaps}</span> :
                    <button onClick={() => this.onDisclosed(0)} className="btn btn-danger">{LANG[localStorage.JobChoiceLanguage].rejectButtonApplicantInfoUpper}</button>
                  }
                </div>
                <div className="applicant-note">
                  <span>{LANG[localStorage.JobChoiceLanguage].note}</span>
                  {data.savingNote && <span className="saved-notif">{LANG[localStorage.JobChoiceLanguage].saved}</span>}
                  {data.isSaving && <span className="loading-notif">{LANG[localStorage.JobChoiceLanguage].saving}</span>}
                </div>
                {this.state.note !== null &&
                  <InputTextArea
                    field="note"
                    inputStyles={data.savedNotes ? 'success' : ''}
                    onChange={this.noteInput}
                    value={data.note}
                    initialValue={data.note}
                  />
                }
              </div>
            </div>
            
            <div className="row info-container">
                <div className="col-xl-10 offset-xl-1">
                  <InfoRow label={LANG[localStorage.JobChoiceLanguage].matchingRatio} data={matching_job_ratio}/>
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].name}
                    data={
                      applicant.disclosed === 0 ? LANG[localStorage.JobChoiceLanguage].notDisclosed : 
                      ( first_name || last_name ? `${last_name} ${first_name}` : LANG[localStorage.JobChoiceLanguage].valueNotSet )
                    }
                    disclosed={applicant.disclosed === 1}
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].completeKanaName}
                    data={
                      applicant.disclosed === 0 ? LANG[localStorage.JobChoiceLanguage].notDisclosed :
                      ( first_name_kana || last_name_kana ? `${last_name_kana} ${first_name_kana}` : LANG[localStorage.JobChoiceLanguage].valueNotSet )
                    }
                    disclosed={applicant.disclosed === 1}
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].nickName}
                    data={applicant.job_seeker.nickname ? applicant.job_seeker.nickname : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                  />
                  <InfoRow label={LANG[localStorage.JobChoiceLanguage].age} data={applicant.job_seeker.age}/>
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].gender}
                    data={EM[localStorage.JobChoiceLanguage].GENDER.filter(function(el) { return el.value === applicant.job_seeker.gender ? el : null })[0].name}
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].address}
                    data={applicant.disclosed === 0 ? LANG[localStorage.JobChoiceLanguage].notDisclosed : 
                      applicant.job_seeker.geolocation.complete_address}
                    disclosed={applicant.disclosed === 1}
                  />
                  <InfoRow label={LANG[localStorage.JobChoiceLanguage].nearestStation} data={applicant.job_seeker.geolocation.station}/>
                  <InfoRow label={LANG[localStorage.JobChoiceLanguage].jobChoiceRegistrationDate} data={DateFormat(created_at)}/>
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].emailAddress}
                    data={
                      applicant.disclosed === 0 ? LANG[localStorage.JobChoiceLanguage].notDisclosed :
                      applicant.job_seeker.user.email
                    }
                    disclosed={applicant.disclosed === 1}
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].contactNo}
                    data={
                      applicant.disclosed === 0 ? LANG[localStorage.JobChoiceLanguage].notDisclosed :
                      applicant.job_seeker.user.contact_no
                    }
                    disclosed={applicant.disclosed === 1}
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].employmentStatus}
                    data={EM[localStorage.JobChoiceLanguage].EMPLOYMENT_STATUS.filter(
                      function(el) { return el.value === applicant.job_seeker.employment_status ? el : null })[0].name}
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].educationalBackground}
                    info={
                      <button className="btn btn-outline-secondary" onClick={() => this.setState({educational_background_modal: true})}>
                      {LANG[localStorage.JobChoiceLanguage].seeDetails}
                      </button>
                    }
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].workExperience}
                    info={
                      <button className="btn btn-outline-secondary" onClick={() => this.setState({career_history_modal: true})}>
                      {LANG[localStorage.JobChoiceLanguage].seeDetails}
                      </button>
                    }/>
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].skillQualificationLicense}
                    info={
                      <div className="data-multiple">
                        <ul>
                          {applicant.job_seeker.job_seeker_skills.map((value, key) => {
                            return(
                              <li key={key}>{value.skill.name}</li>
                            )
                          })}
                        </ul>
                      </div>
                  }/>  
                  <InfoRow label={LANG[localStorage.JobChoiceLanguage].selfPr} data={applicant.job_seeker.description}/>
                </div>
            </div>
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="applicant-note">{LANG[localStorage.JobChoiceLanguage].answersToQuestions}</div>
              </div>
            </div>
            {this.state.applicantDetails && 
              this.state.applicantDetails.job_questions.map((item, key) => {
                const free_text_answer = item.answer_type === 'free_text' &&  item.job_question_job_seeker_answers.length > 0 ? 
                  item.job_question_job_seeker_answers[0].free_text_answer : ''
                return (
                  <div key={key} className="row question-answer-data">
                    <div className="col-xl-10 offset-xl-1">
                      <div className="question-answer data">
                        <div key={key} className="question-container">
                        <div className="question-marker">
                          <div>Q</div>
                        </div>
                        <div className="question-item">{item.question}</div>
                      </div>
                        { (item.answer_type === 'multiple' ||
                          item.answer_type === 'single') &&
                          this.renderMultipleAnswer(item.job_question_job_seeker_answers)}
                        {item.answer_type === 'free_text' &&
                          this.renderFreeTextAnswer(free_text_answer)}
                      </div>
                    </div>
                  </div>
                )
              })
            }
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="applicant-note">{LANG[localStorage.JobChoiceLanguage].hatarakikataChoice}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="data row">
                  {this.state.applicantDetails && this.state.applicantDetails.job_seeker.hataraki_kata_resource.map((hatarakikata, key) => {
                    return(
                      <HatarakikataDisplay key={key} resource={hatarakikata} />
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="applicant-note">{LANG[localStorage.JobChoiceLanguage].applicationHistory}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                  <div className="application-history-grid">
                    <div className="application-history-headers">
                      <div className="sub-header-1">{LANG[localStorage.JobChoiceLanguage].noOfApplications}</div>
                      <div className="sub-header-2">{LANG[localStorage.JobChoiceLanguage].underApplication}</div>
                      <div className="sub-header-3">{LANG[localStorage.JobChoiceLanguage].numberOfContracts}</div>
                      <div className="sub-header-4">{LANG[localStorage.JobChoiceLanguage].numberOfRejectedApplications}</div>
                    </div>
                    <div className="application-history-data">
                      <div className="sub-data-1">{applicant.num_applied}</div>
                      <div className="sub-data-2">{applicant.num_under_application}</div>
                      <div className="sub-data-3">{applicant.num_hired}</div>
                      <div className="sub-data-4">{applicant.num_rejected}</div>
                    </div>
                </div>
              </div>
            </div>
            </>
            }
            {/* 
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="data">Answer to questions when applying</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <Modal show={data.modal.modal} 
        messageKey={data.modal.messageKey}
        message={this.state.modal.message}
        type={data.modal.modalType}
        redirect={data.modal.redirect}
        handleParentClose={this.handleModalClose} />

      {data.educational_background_modal &&
        <EducationalBackgroundModal
          show={data.educational_background_modal}
          details={applicant.job_seeker.educational_background}
          onClose={this.handleChange}
        />
      }

      {data.career_history_modal &&
        <CareerHistoryModal
          show={data.career_history_modal}
          details={applicant.job_seeker.work_experience}
          onClose={this.handleChange}
        />
      }

      <ApplicantInfoConfirmationModal show={data.confirm.modal} 
        message={data.confirm.message}
        handleSuccess={() => this.handleDisclosed(this.state.confirm.id)}
        disclosureFee={data.confirm.disclosureFee}
      />

      <LoadingIcon show={this.state.isLoading} />

      </JobChoiceLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(ApplicantInfo)
