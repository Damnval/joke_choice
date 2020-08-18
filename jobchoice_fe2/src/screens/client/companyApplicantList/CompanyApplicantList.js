import React from 'react'
import './CompanyApplicantList.scss'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import api from '../../../utilities/api'
import { LANG, EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import JobDetailsTable from '../../../components/jobDetailsTable/JobDetailsTable'
import GenderDropDown from '../../../components/genderDropDown/GenderDropDown'
import Input from '../../../components/input/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import InputTextArea from '../../../components/inputTextArea/InputTextArea'
import ApplicantCommentModal from './applicantCommentModal/ApplicantCommentModal'
import ConfirmationModal from '../../../components/confirmationModal/ConfirmationModal'
import ApplicantEmploymentStatusDropDown from '../../../components/searchComponents/applicantEmploymentStatusDropDown/ApplicantEmploymentStatusDropDown'

class CompanyApplicantList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobDetails: null,
      applicantList: [],
      isLoading: true,
      savedNotes: false,
      isSaving: false,
      answers: [],
      page: 1,
      total: 0,
      search : {
        age: '',
        gender: '',
        keyword: '',
        employment_status: ''
      },
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
        id: 0
      },
      applicant_modal: false,
      applicant_modal_id: 0
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.noteInput = this.applicantNoteInput.bind(this)
    this.noteInput = this.sharerNoteInput.bind(this)
  }

  componentDidMount() {
    const id = this.props.match.params.id
    api.get('api/company/job/' + id).then(response => {
      if (response.data.status === 200) {
        this.setState({
          jobDetails: response.data.results.job
        }, () => {
          this.getApplicantInfo(id)
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
  }

  handleConfirmClose = () => {
    this.setState({ 
      confirmDelete: {
        messageKey: null,
        message: '',
        show: false,
        id: 0
      }
    })
  }

  // Pass job_id for getting list of applicants
  // Check search for filters to be applied
  getApplicantInfo = (job_id, search=false) => {
    const credentials = {...this.state.search}
    credentials['job_id'] = job_id
    this.setState({
      modal: {
        messageKey: '',
        message: "",
        modal: false,
        modalType: 'error',
      }
    }, () => {
      api.post('api/company-job-applicants', credentials).then(response => {
        const response_details = response.data.results.job_applicants
        let answerList = []
        const applicants = response_details.applied_jobs.map((value, key) => {
          answerList.push({job_seeker_id: value.applicant_job_seeker_id})
          value['visibleSharer'] = false
          value['new_notes'] = value.notes
          value['savedNotes'] = false
          return value
        })
  
        answerList = answerList.map((job_seeker, key) => {
          // Get Questions that are answered by the Job Seeker
          // details is a copy of the list of job_questions
          const details = [...response_details.job_questions]
          let job_seeker_answers_list = details.filter((question, key) => {
            return question.job_question_job_seeker_answers.find(
              el => el.job_seeker_id === job_seeker.job_seeker_id) !== undefined
          })
          const job_seeker_answers = job_seeker_answers_list.map((item, key) => {
            const answer = {...item}
            answer.job_question_job_seeker_answers = item.job_question_job_seeker_answers.filter(el => 
              el.job_seeker_id === job_seeker.job_seeker_id
            )
            return answer
          })
          job_seeker.job_seeker_answers = job_seeker_answers
          return job_seeker
        })
        
        if (response.data.status === 200) {
          this.setState({
            applicantList: applicants,
            answers: answerList,
            isLoading: false,
            total: response.data.results.total
          }, () => {
            if (search) {
              if (this.state.applicantList.length === 0) {
                this.setState({
                  modal: {
                    messageKey: 'noApplicantsFound',
                    message: LANG[localStorage.JobChoiceLanguage].noApplicantsFound,
                    modal: true,
                    modalType: 'error'
                  }
                })
              }
            }
          })
        }
      }).catch(error => {
        console.log(error)
        this.setState({
          isLoading: false
        })
      })
    })
  }

  // Update SEARCH Object using name and value
  // Check search for filters to be applied
  infoChange = (name, value) => {
    const search = {...this.state.search}
    search[name] = value
    this.setState({
      search: search
    })
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  toggleSharer = (key) => {
    const applicantList = [...this.state.applicantList]
    applicantList[key]['visibleSharer'] = !applicantList[key]['visibleSharer']
    this.setState({
      applicantList: applicantList
    })
  }

  handleSearch() {
    this.setState({
      isLoading: true
    }, () => {
      this.getApplicantInfo(this.props.match.params.id, true)
    })
  }

  applicantNoteInput = (name, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    this.setState({
      isSearching: true,
      isSaving: true,
      savedNotes: false,
    }, () => this.setState({
      typingTimeout:setTimeout(() => this.applicantNoteSave(name, value), 3000)
    }))
  }

  applicantNoteSave(name, value) {
    const res = name.split(".")
    // if length 3 taggable_id.taggable_type.applicant_key
    // If no sharer note exists
    if (res.length === 3) {
      const note = {
        taggable_type: res[1],
        taggable_id: res[0],
        notes: value
      }
      api.post('api/note', note).then(response => {
        const applicantList = [...this.state.applicantList]
        applicantList[res[2]].applicant_note_id = response.data.note.id
        if (response.data) {
          this.setState({
            savedNotes: true,
            applicantList: applicantList,
            isSaving: false
          })
        }
      }).catch(error => {
        console.log(error.response.data.error)
        if( error.response.data.error === LANG[localStorage.JobChoiceLanguage].noteAlreadyExist ) {
          const note_id = this.state.applicantList[res[2]].applicant_note_id
          this.applicantNoteSave(`${note_id}`, value)
        } else {
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
        }
      })
    // if length 1 note_id
    // If sharer note exists
    } else if (res.length === 1) {
      const note = {
        notes: value,
      }
      api.patch('api/note/'+res[0], note).then(response => {
        if (response.data.results) {
          this.setState({
            savedNotes: true,
            isSaving: false
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
    }
  }
  
  sharerNoteInput = (name, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    this.setState({
      isSearching: true,
    }, () => this.setState({
      typingTimeout:setTimeout(() => this.sharerNoteSave(name, value), 3000)
    }))
  }

  sharerNoteSave(name, value) {
    const res = name.split(".")
    // if length 3 taggable_id.taggable_type.applicant_key
    // If no sharer note exists
    if (res.length === 3) {
      const note = {
        taggable_type: res[1],
        taggable_id: res[0],
        notes: value
      }
      api.post('api/note', note).then(response => {
        const applicantList = [...this.state.applicantList]
        applicantList[res[2]]['sharer_note_id'] = response.data.note.id
        applicantList[res[2]]['savedNotes'] = true
        if (response.data) {
          this.setState({
            applicantList: applicantList,
          })
        }
      }).catch(error => {
        console.log(error.response.data.error)
        if( error.response.data.error === LANG[localStorage.JobChoiceLanguage].noteAlreadyExist ) {
          const note_id = this.state.applicantList[res[2]]['sharer_note_id']
          this.sharerNoteSave(`${note_id}.${res[2]}`, value)
        } else {
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
        }
      })
    // if length 2 note_id.applicant_key
    } else if (res.length === 2) {
      const note = {
        notes: value,
      }
      api.patch('api/note/'+res[0], note).then(response => {
        const applicantList = [...this.state.applicantList]
        applicantList[res[1]]['savedNotes'] = true
        if (response.data.results) {
          this.setState({
            applicantList: applicantList,
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
    }
  }

  showExperience = (id) => {
    this.setState({
      applicant_modal: false,
      applicant_modal_id: 0
    }, () => {
      this.setState({
        applicant_modal: true,
        applicant_modal_id: id
      })
    })
  }

  onDisclosed (key, applicant_job_seeker_id, id) {
    this.setState({
      confirm: {
        messageKey: null,
        message: '',
        modal: false,
        key: null,
        applicant_job_seeker_id: null,
        id: 0
      }
    }, () => {
      const message = id === 0 ? "areYouSureReject" :
        "areYouSureDisclose"
      this.setState({
        confirm: {
          messageKey: message,
          modal: true,
          key: key,
          applicant_job_seeker_id: applicant_job_seeker_id,
          id: id
        }
      })
    })
  }

  handleDisclosed (key, job_seeker_id, disclosed) {
    this.setState({
      isLoading: true,
      confirm: {
        message: '',
        messageKey: null,
        modal: false,
        key: null,
        applicant_job_seeker_id: null,
        id: 0
      }
    })
    const credentials = {
      job_seeker_id: job_seeker_id,
      job_id: this.props.match.params.id,
      disclosed: disclosed
    }
    api.patch('api/disclose-apply-job',credentials).then(response => {
      this.getApplicantInfo(this.props.match.params.id)
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

  render() {
    return (
      <JobChoiceLayout>
      <div className='jobchoice-body'>
        { (!this.state.jobDetails) ?
          <div></div> :
          <div className="col-md-12">
            <JobDetailsTable details={this.state.jobDetails}/>
            <div className="row justify-content-center applicant-search-filter">
              <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12">
                <div className="row">
                  <div className="search-item">
                    <label>{LANG[localStorage.JobChoiceLanguage].gender}</label>
                    <GenderDropDown className="applicant-search-filter gender" infoChange={this.infoChange}/>
                  </div>
                  <div className="search-item">
                    <label>{LANG[localStorage.JobChoiceLanguage].employmentStatus}</label>
                    <ApplicantEmploymentStatusDropDown className="applicant-search-filter status" handleChange={this.infoChange}/>
                  </div>
                </div>
                <div className="row">
                  <div className="search-item">
                    <label>{LANG[localStorage.JobChoiceLanguage].age}</label>
                    <Input
                      inputStyles="applicant-search-filter age"
                      value={this.state.age}
                      inputType='number'
                      field="age"
                      defaultValue={this.state.age}
                      noValidate
                      onChange={this.infoChange}
                    />
                  </div>
                  <div className="search-item">
                    <label>{LANG[localStorage.JobChoiceLanguage].keyword}</label>
                    <Input
                      inputStyles="applicant-search-filter keyword"
                      value={this.state.keyword}
                      field="keyword"
                      defaultValue={this.state.keyword}
                      noValidate
                      onChange={this.infoChange}
                    />
                  </div>
                  <div className="search-item">
                    <button className="btn btn-info search-button" onClick={this.handleSearch}>{LANG[localStorage.JobChoiceLanguage].search}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        { this.state.applicantList.length > 0 &&
          <div className="row justify-content-center company-applicant-list-container">
            <div className="col-xl-12 col-md-12 col-sm-12">
              <div className="row justify-content-center">
                <div className="grid-container">
                  <div className="applicant-grid">
                    <div className="applicant-grid-header">
                      <div className="job-grid-item">
                        <span>{LANG[localStorage.JobChoiceLanguage].preview}</span>
                      </div>
                      <div className="job-grid-item-2">
                        <div className="main-header">
                          <span>{LANG[localStorage.JobChoiceLanguage].applicantListManagement}</span>
                        </div>
                        <div className="sub-header-1"><span>{LANG[localStorage.JobChoiceLanguage].employmentStatus}</span></div>
                        <div className="sub-header-2"><span>{LANG[localStorage.JobChoiceLanguage].justName}</span></div>
                        <div className="sub-header-3"><span>{LANG[localStorage.JobChoiceLanguage].mjr}</span></div>
                        <div className="sub-header-4"><span>{LANG[localStorage.JobChoiceLanguage].age}</span></div>
                        <div className="sub-header-5"><span>{LANG[localStorage.JobChoiceLanguage].gender}</span></div>
                        <div className="sub-header-6"><span>{LANG[localStorage.JobChoiceLanguage].address}</span></div>
                        <div className="sub-header-7"><span>{LANG[localStorage.JobChoiceLanguage].evaluation}</span></div>
                        <div className="sub-header-8">
                          <span>{LANG[localStorage.JobChoiceLanguage].note}</span>
                          {this.state.savedNotes && <span className="saved-notif">{LANG[localStorage.JobChoiceLanguage].saved}</span>}
                          {this.state.isSaving && <span className="loading-notif">{LANG[localStorage.JobChoiceLanguage].saving}</span>}
                        </div>
                        <div className="sub-header-9"><span>{LANG[localStorage.JobChoiceLanguage].answer}</span></div>
                        <div className="sub-header-10"><span><FontAwesomeIcon icon='info-circle' /></span></div>
                      </div>
                    </div>
                    {this.state.applicantList.map((value, key) => {
                        const gender = value.applicant_gender ? EM[localStorage.JobChoiceLanguage].GENDER.find(el => el.value === value.applicant_gender).name : '-'
                        const applicant_employment_status = value.applicant_gender ? EM[localStorage.JobChoiceLanguage].EMPLOYMENT_STATUS.find(el => el.value === value.applicant_employment_status).name : '-'
                        const matching_job_ratio = value.applicant_job_match_ratio ? `${value.applicant_job_match_ratio}%` : '0%'
                        return (
                          <div className={`application-grid-row grid-row-${key} ${value.visibleSharer ? 'active' : ''}`} key={key}>
                            <div className="sub-data-1">
                              <span className="preview">
                                {value.applicant_status !== 'rejected' && (value.applicant_applied_job_disclosed === 1 ?
                                  <div className="preview-label disclosed">{LANG[localStorage.JobChoiceLanguage].disclosed}</div> :
                                  <button
                                    className="btn btn-success"
                                    onClick={() => this.onDisclosed(key, value.applicant_job_seeker_id, 1)}
                                  >{LANG[localStorage.JobChoiceLanguage].disclose}</button>)
                                }
                                {value.applicant_status === 'rejected' ?
                                  <div className="preview-label rejected">{LANG[localStorage.JobChoiceLanguage].rejected}</div> :
                                  <button className="btn btn-danger" onClick={() => this.onDisclosed(key, value.applicant_job_seeker_id, 0)}>
                                    {LANG[localStorage.JobChoiceLanguage].reject}
                                  </button>
                                }
                              </span>
                            </div>
                            <div className="sub-data-2 applicant-list-applicant-employment-status-container">
                              <div>{applicant_employment_status}</div>
                            </div>
                            <div className="sub-data-3 grid-clickable">
                              <Link className="grid-clickable-link" to={'/applicant/' + value.job_id + '/' + value.applicant_job_seeker_id}>{value.applicant_first_name}</Link>
                            </div>
                            <div className="sub-data-4"><span>{matching_job_ratio}</span></div>
                            <div className="sub-data-5"><span>{value.applicant_age}</span></div>
                            <div className="sub-data-6"><span>{gender}</span></div>
                            <div className="sub-data-7"><span>{value.applicant_complete_address}</span></div>
                            <div className="sub-data-8"><span></span></div>
                            <div className="sub-data-9 note"><span>
                              <InputTextArea
                                field={`${value.applicant_note_id ? value.applicant_note_id : value.applied_job_id+'.AppliedJob.'+key}`}
                                value={value.applicant_notes ? value.applicant_notes : ''}
                                onChange={this.applicantNoteInput}
                              />  
                            </span></div>
                            <div className="sub-data-10"><span><button className="btn btn-outline-secondary" onClick={() => this.showExperience(key)}>{LANG[localStorage.JobChoiceLanguage].read}</button></span></div>
                            <div className="sub-data-11"><button className="btn" onClick={() => this.toggleSharer(key)}>
                              <FontAwesomeIcon icon={value.visibleSharer ? 'chevron-left' : 'chevron-down'} /></button>
                            </div>
                          { value.visibleSharer ?
                            <>
                              <div className="grid-item-sharer-info"><span>{LANG[localStorage.JobChoiceLanguage].sharerInfo}</span></div>
                                {value.sharer_first_name ?
                                  <>
                                    <div className="sharer-info-headers">
                                      <div className="sub-header-1"><span>{LANG[localStorage.JobChoiceLanguage].justName}</span></div>
                                      <div className="sub-header-2"><span>{LANG[localStorage.JobChoiceLanguage].totalShared}</span></div>
                                      <div className="sub-header-3"><span>{LANG[localStorage.JobChoiceLanguage].totalDisclosed}</span></div>
                                      <div className="sub-header-4"><span>{LANG[localStorage.JobChoiceLanguage].totalRejected}</span></div>
                                      <div className="sub-header-5">
                                        <span>{LANG[localStorage.JobChoiceLanguage].note}</span>
                                        {value.savedNotes && <span className="saved-notif">{LANG[localStorage.JobChoiceLanguage].saved}</span>}
                                      </div>
                                    </div>
                                    <div className="sharer-info-details">
                                      <div className="sub-data-1"><span>
                                      <Link className="grid-clickable-link" to={'/sharer/' + value.shared_job_id}>{value.sharer_first_name}</Link>
                                      </span></div>
                                      <div className="sub-data-2"><span>{value.sharer_total_shared_job}</span></div>
                                      <div className="sub-data-3"><span>{value.sharer_disclosed_job}</span></div>
                                      <div className="sub-data-4"><span>{value.sharer_not_disclosed_job}</span></div>
                                      <div className="sub-data-5 note"><span>
                                        <InputTextArea
                                          field={`${value.sharer_note_id ? value.sharer_note_id+'.'+key : value.shared_job_id+'.SharedJob.'+key}`}
                                          value={value.sharer_note ? value.sharer_note : ''}
                                          onChange={this.sharerNoteInput}
                                        />
                                      </span></div>
                                    </div>
                                  </> :
                                  <div className="sharer-info-null">
                                    <span>{LANG[localStorage.JobChoiceLanguage].noSharer}</span>
                                  </div>
                                }
                            </> : ''
                          }
                        </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
            { this.state.total > 0 &&
              <div className="applicant-list-search-results-component">{ LANG[localStorage.JobChoiceLanguage].jobsFound } { this.state.total } { LANG[localStorage.JobChoiceLanguage].found } </div>
            }
          </div>
        }
        { (this.state.applicantList.length === 0 && !this.state.isLoading) &&
          <div className="no-data-records job-list-no-data-found">{LANG[localStorage.JobChoiceLanguage].noApplicantsFound}</div>
        }
        </div>

      <Modal show={this.state.modal.modal} 
        messageKey={this.state.modal.messageKey}
        message={this.state.modal.message}
        type={this.state.modal.modalType}
        redirect={this.state.modal.redirect} />
      
      {this.state.applicant_modal &&
        <ApplicantCommentModal
          show={this.state.applicant_modal}
          details={this.state.answers[this.state.applicant_modal_id]}
          onClose={this.handleChange}
        />
      }

      <ConfirmationModal show={this.state.confirm.modal} 
        messageKey={this.state.confirm.messageKey}
        message={this.state.confirm.message}
        handleParentClose={this.handleConfirmClose}
        handleSuccess={() =>
          this.handleDisclosed(this.state.key, this.state.confirm.applicant_job_seeker_id, this.state.confirm.id)}
      />

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

export default connect(mapStateToProps, mapDispatchToProps)(CompanyApplicantList)

