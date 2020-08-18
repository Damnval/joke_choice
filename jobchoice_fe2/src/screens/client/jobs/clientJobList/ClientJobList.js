import React, { Component } from 'react'
import './../../../admin/manageJobCategories/ManageJobCategories.scss'
import './ClientJobList.scss'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { LANG } from '../../../../constants'
import { handleSearchTranslation } from '../../../../helpers'
import "react-table/react-table.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../../../../utilities/api'
import {EM} from '../../../../constants'
import InputTextArea from '../../../../components/inputTextArea/InputTextArea'
import {pageGenerator, ErrorModal} from '../../../../helpers'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import {enUS, ja} from 'date-fns/esm/locale'
import Input from '../../../../components/input/Input'
import ConfirmationModal from '../../../../components/confirmationModal/ConfirmationModal'
import InputDropDown from '../../../../components/inputDropDown/InputDropDown'
import ModalViewJobPC from '../../../../components/modalViewJobPc/ModalViewJobPC'
import { Button } from 'react-bootstrap'
import ConfirmDuplicateMessage from '../confirmDuplicateMessage/ConfirmDuplicateMessage'
import NumberFormat from 'react-number-format'

const errorModal = {...ErrorModal()}
class ClientJobList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchFields: {
        published_start_date: null,
        published_end_date: null,
        keyword: '',
        status: ''
      },
      jobs: [],
      chosenJob: -1,
      last_page: 0,
      current_page: 0,
      per_page: 4,
      pages: [],
      total: 0,
      isLoading: true,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      confirmModal: {
        messageKey: null,
        show: false,
        message: ''
      },
      confirmDelete: {
        messageKey: null,
        message: '',
        show: false,
        id: 0
      },
      viewJobPc: false,
      jobId: null,
      viewMode: null,
    }
    this.handleChangeStart = this.handleChangeStart.bind(this)
    this.handleChangeEnd = this.handleChangeEnd.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.setModalView = this.setModalView.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  // Initial load of page will get the job list
  // Default page is 1
  componentDidMount() {
    this.props.getClientJobList(this.state.searchFields)
  }

  getClientJobList = (page, update=false, mode='search') => {
    this.props.searchClientJobList(this.state.searchFields, page, update)
  }

  // This function accepts a page number
  // Gets paginated job list from backend and configures for note saving
  getData = (page, update=false, mode='search') => {
    this.props.updateLoading(true)
    this.props.setParent({
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      }
    })
    let moment = require('moment')
    const credentials = {
      ...this.state.searchFields,
      published_start_date: this.state.searchFields.published_start_date ?
        moment(this.state.searchFields.published_start_date, "YYYY-MM-DD").format("YYYY-MM-DD"): '',
      published_end_date: this.state.searchFields.published_end_date ?
      moment(this.state.searchFields.published_end_date, "YYYY-MM-DD").format("YYYY-MM-DD"): '',
    }
    api.post('api/company-jobs?page='+page, credentials).then(response => {
      const data = response.data.results.jobs
      const jobs = data.data.map((el, key) => {
        el['isSearching'] = false
        el['isSaving'] = false
        el['savedNotes'] = false
        return el
      })

      this.setState({
          jobs: jobs,
          current_page: data.current_page,
          per_page: data.per_page,
          total: data.total,
          last_page: data.last_page,
          chosenJob: -1,
          pages: pageGenerator(data.last_page),
      }, () => {
        if (update) {
          if (mode === 'search') {
            if (this.state.total === 0) {
              this.setState({ 
                modal: {
                  messageKey: 'noJobsFound',
                  message: LANG[localStorage.JobChoiceLanguage].noJobsFound,
                  modal: true,
                  modalType: 'error',
                },
              }, () => {
                this.props.setParent({modal: this.state.modal})
              })
            }
          } else if (mode === 'delete') {
            this.setState({ 
              modal: {
                messageKey: 'successfullyDeletedJob',
                message: LANG[localStorage.JobChoiceLanguage].successfullyDeletedJob,
                modal: true,
                modalType: 'success',
              },
            }, () => {
              this.props.setParent({modal: this.state.modal})
            })
          } else if (mode === 'duplicate') {
            this.setState({ 
              modal: {
                messageKey: 'successfullyDuplicatedJob',
                message: LANG[localStorage.JobChoiceLanguage].successfullyDuplicatedJob,
                modal: true,
                modalType: 'success',
              },
            }, () => {
              this.props.setParent({modal: this.state.modal})
            })
          }
        }
        this.props.updateLoading(false)
      })
      
    }).catch(error => {
      console.log(error)
      this.setState({  modal: {...errorModal} })
    })
  }

  // This function is the initial code for note saving with timeout
  // After timeout it runs the handleSaveJobNote function
  noteInput = (index, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    const jobs = [...this.props.jobs]
    jobs[index] = {
      ...jobs[index],
      isSearching: true,
      isSaving: true,
      savedNotes: false,
    }

    this.setState({
      jobs: [...jobs]
    }, () => this.setState({
      typingTimeout:setTimeout(() => this.handleSaveJobNote(index, value, jobs), 2000)
    }))
  }

  // This function accepts index of a job, new note, and the job list
  // This function handles creating or updating a note of a job
  handleSaveJobNote = (index, value, jobs) => {
    const notes = jobs[index].notes
    // IF there is an EXISTING NOTE
    if (notes && notes.id) {
      const note = {
        notes: value,
      }
      api.patch('api/note/'+notes.id, note).then(response => {
        if (response.data.results) {
          jobs[index] = {
            ...jobs[index],
            savedNotes: true,
            isSaving: false
          }
          this.setState({ jobs: [...jobs] })
        }
      }).catch(error => {
        console.log(error)
        this.setState({
          ...errorModal,
          isLoading: false
        })
      })
    // ELSE Create a Note
    } else {
      const note = {
        notes: value,
        taggable_id: jobs[index].id,
        taggable_type: 'Job'
      }
      api.post('api/note', note).then(response => {
        if (response.data) {
          jobs[index] = {
            ...jobs[index],
            savedNotes: true,
            isSaving: false
          }
          this.setState({ jobs: [...jobs] })
        }
      }).catch(error => {
        console.log(error.response.error)
        if( error.response.data.error === LANG[localStorage.JobChoiceLanguage].noteAlreadyExist ) {
          this.onSearchFunction(note)
        } else {
          this.setState({
            ...errorModal,
            isLoading: false
          })
        }
      })
    }
  }

  handleChange = (name, value) => {
    this.setState({
      searchFields: {
        ...this.state.searchFields,
        [name]: value
      }
    })
  }

  handleChangeStart(date) {
    const endDate = date > this.state.searchFields.published_end_date ? date : this.state.searchFields.published_end_date
    this.setState({
      searchFields: {
        ...this.state.searchFields,
        published_start_date: date,
        published_end_date: endDate
      }
    })
  }

  handleChangeEnd(date) {
    const startDate = date < this.state.searchFields.published_start_date ? date : this.state.searchFields.published_start_date
    this.setState({
      searchFields: {
        ...this.state.searchFields,
        published_start_date: startDate,
        published_end_date: date
      }
    })
  }

  chooseJob = (id) => {
    const newId = id === this.state.chosenJob ? -1 : id
    this.setState({
      chosenJob: newId
    })
  }

  onDuplicate = () => {
    const chosenJob = this.state.chosenJob
    const credentials = {
      job_id: this.props.jobs[chosenJob].id
    }
    this.props.updateLoading(true)
    this.setState({
      confirmModal: {
        messageKey: null,
        show: false,
        message: ``,
        chosenJob: -1
      }
    }, () => {
      api.post('api/company-job/duplicate', credentials).then(response => {
        this.props.searchClientJobList({}, 1, true, 'duplicate')
      }).catch(error => {
        this.setState({
          ...errorModal,
          isLoading: false
        })
      })
    })
  }

  openDuplicateModal = () => {
    const chosenJob = this.state.chosenJob
    this.setState({
      confirmModal: {
        messageKey: null,
        show: false,
        message: ``,
        chosenJob: -1
      }
    }, () => {
      this.setState({
        confirmModal: {
          messageKey: null,
          show: true,
          message: <ConfirmDuplicateMessage item={this.props.jobs[chosenJob].title}/>
        }
      })
    })
    
  }

  checkDelete (id, num_applied) {
    if(num_applied > 0) {
      this.setState({
        modal: {
          messageKey: 'cannotDeleteThisJob',
          message: '',
          modal: true,
          modalType: 'error',
          redirect: null,
        },
      }, () => {
        this.props.setParent({modal: this.state.modal})
      })
    } else {
      this.handleDelete(id)
    }
  }

  handleDelete (id) {
    this.setState({
      confirmDelete: {
        messageKey: null,
        message: '',
        show: false,
        id: 0
      },
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }, () => {
      this.props.setParent({modal: this.state.modal})
      this.setState({
        confirmDelete: {
          messageKey: 'confirmationMsg',
          message: LANG[localStorage.JobChoiceLanguage].confirmationMsg,
          show: true,
          id: id
        }
      })
    })
  }

  onDelete () {
    this.setState({
      confirmDelete: {
        messageKey: null,
        message: '',
        show: false,
        id: 0
      },
    })
    this.props.updateLoading(true)
    
    api.delete('api/job/' + this.state.confirmDelete.id).then(response => {
      this.props.searchClientJobList({}, 1, true, 'delete')
    }).catch(error => {
      console.log(error)
      this.props.updateLoading(false)
      this.setState({ 
        ...errorModal,
        isLoading: false,
      })
    })
  }

  viewJobModal(jobId, viewMode) {
    this.setState({
      viewJobPc: true,
      jobId: jobId,
      viewMode: viewMode,
    })
  }

  setLoading(stater) {
    this.props.updateLoading(stater)
  }

  setModalView(stater) {
    this.setState({
      viewJobPc : stater,
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

  render() {

    if (!(this.props.user.data.company)) {
      return (<Redirect to="/home" />)
    }

    let moment = require('moment')
    const chosenJob = this.state.chosenJob

    return (
      <div className="container-fluid">
        <ConfirmationModal
          show={this.state.confirmModal.show} 
          message={this.state.confirmModal.message}
          handleParentClose={this.handleConfirmClose}
          confirmKey='duplicate'
          handleSuccess={this.onDuplicate}/>
        <ConfirmationModal 
          show={this.state.confirmDelete.show} 
          message={this.state.confirmDelete.message}
          messageKey={this.state.confirmDelete.messageKey}
          handleParentClose={this.handleConfirmClose}
          confirmKey='delete'
          handleSuccess={this.onDelete}/>
        <div className="client-job-list-search-container">
          <div className="shared-job-date-search-area">
            <div className="shared-job-date-search-row">
              <div>
                <label className="client-job-list-search-label">
                  {LANG[localStorage.JobChoiceLanguage].postPeriod}
                  <small className="input-instructions">{LANG[localStorage.JobChoiceLanguage].inputDateRange}</small>
                </label>
                <div className="shared-job-date-search-data">
                  <DatePicker
                    className="client-job-list-search-date-picker"
                    dateFormat="yyyy/MM/dd"
                    selectsStart
                    startDate={this.state.searchFields.published_start_date}
                    endDate={this.state.searchFields.published_end_date}
                    selected={this.state.searchFields.published_start_date}
                    onChange={this.handleChangeStart}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                  <span className="mid-date-picker">~</span>
                  <DatePicker
                    className="client-job-list-search-date-picker"
                    dateFormat="yyyy/MM/dd"
                    selectsEnd
                    startDate={this.state.searchFields.published_start_date}
                    endDate={this.state.searchFields.published_end_date}
                    selected={this.state.searchFields.published_end_date}
                    onChange={this.handleChangeEnd}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                </div>
              </div>
              <div className="shared-job-date-search-data">
                <Input
                  label={ LANG[localStorage.JobChoiceLanguage].keyword }
                  inputStyles="client-job-list-search-keyword"
                  onChange={this.handleChange}
                  field="keyword"
                />
              </div>
              <div className="shared-job-date-search-data">
                <label className="client-job-list-search-label">{LANG[localStorage.JobChoiceLanguage].publicationStatus}</label>
                <InputDropDown
                  field="status"
                  onChange={this.handleChange}
                  className="client-job-list-search-status"
                >
                  <option value=""></option>
                  {EM[localStorage.JobChoiceLanguage].PUBLICATION_STATUS.map((el, key) => {
                      return (<option key={key} value={el.value}>{el.name}</option>)
                    })
                  }
                </InputDropDown>
              </div>
              <button
                className="client-job-list-search-btn search-btn"
                onClick={() => this.getClientJobList(1, true)}>
                {LANG[localStorage.JobChoiceLanguage].search}
              </button>
            </div>
          </div>
        </div>
        <div className="company-job-list-search-results-component">{ LANG[localStorage.JobChoiceLanguage].jobsFound } {this.state.total} { LANG[localStorage.JobChoiceLanguage].found } </div>
        <div className="client-job-list">
          {this.props.jobs && this.props.jobs.map((el, key) => {
            const publication_status = el.publication.status
            const approval_status = el.approval_status
            const employment = el.employment_type
            const publication = handleSearchTranslation('PUBLICATION_STATUS', publication_status)
            const employment_type = handleSearchTranslation('EMPLOYMENT_TYPE', employment, '-')
            const final_application_date = el.applied_job.length > 0 ?
              moment(el.applied_job[0].created_at, "YYYY-MM-DD").format("YYYY年MM月DD日") :
              '-'
            
            return (
              <div className={`client-job-item ${chosenJob === key ? 'active': ''}`} key={key} onClick={ () => this.chooseJob(key)}>
                <div className="client-job-title">
                  <div>
                    <div className="client-job-status-area">
                      <span className={`client-job-publication-status ${el.publication.status}`}>
                        {publication}
                      </span>
                      <span className={`client-job-draft-status draft-status-${el.publication.draft} ${el.publication.draft === 0 ? 'approval-status-'+approval_status : ''}`}>
                        { el.publication.draft === 1 ? LANG[localStorage.JobChoiceLanguage].clientDraft : approval_status === 'waiting' ? LANG[localStorage.JobChoiceLanguage].clientApplying : LANG[localStorage.JobChoiceLanguage][approval_status]  }
                      </span>
                    </div>
                    <Link 
                    to={`../../job-offer/${el.id}`} 
                    className={`${el.publication.draft === 1 && 'client-job-title-draft'} ${el.title === null && 'client-job-title-draft-no-title'}`}>
                      {el.title !== null ? el.title : LANG[localStorage.JobChoiceLanguage].draftTitle }
                    </Link>
                  </div>
                  <Button onClick={() => this.checkDelete(el.id, el.num_applied)} bsClass='btn manage-account-table-button btn-view client-job-delete'>
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </div>
                <div className="client-job-review">
                  <button disabled={el.publication.draft === 1} onClick={() => this.viewJobModal(el.id, 'PC')} className="btn btn-info">PC</button>
                  <button disabled={el.publication.draft === 1} onClick={() => this.viewJobModal(el.id, 'SMART')} className="btn btn-warning">{LANG[localStorage.JobChoiceLanguage].SMART}</button>
                </div>
                <div className="client-job-information-container">
                  <div className="client-job-information-details">
                    <div className="client-job-employee-status">
                      <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].employmentForm}</div>
                      <div className="client-job-detail-data">{employment_type}</div>
                    </div>
                    <div className="client-job-disclosed-amount">
                      <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].disclosedAmount}</div>
                      <div className="client-job-detail-data">
                        <NumberFormat
                          value={el.price}
                          displayType={'text'}
                          thousandSeparator={true}
                        />{el.price !== null ? ' 円' : ' - '}
                      </div>
                    </div>
                    <div className="client-job-post-period">
                      <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].postPeriod}</div>
                      <div className="client-job-detail-data">
                        {el.publication.published_start_date} {el.publication.published_start_date !== null && el.publication.published_end_date !== null && '~'} {el.publication.published_end_date}
                        {el.publication.published_start_date === null && el.publication.published_end_date === null && ' - '}
                      </div>
                    </div>
                    <div className="client-job-num_shares">
                        <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].numberOfShares}</div>
                        <div className="client-job-detail-data num">
                          <NumberFormat
                            value={el.num_shares}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="client-job-applicant-management">
                    <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].applicantManagement}</div>
                    <div className="client-job-applicant-management-detail">
                      <div className="client-job-detail-item">
                        <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].numApplied}</div>
                        <div className="client-job-detail-data num">
                          <Link to={`../company/jobs/${el.id}`}>
                            <NumberFormat
                              value={el.num_applied}
                              displayType={'text'}
                              thousandSeparator={true}
                            />
                          </Link>
                        </div>
                      </div>
                      <div className="client-job-detail-item">
                        <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].numUnopened}</div>
                        <div className="client-job-detail-data num">
                          <NumberFormat
                            value={el.num_waiting}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </div>
                      </div>
                      <div className="client-job-detail-item">
                        <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].numDisclosed}</div>
                        <div className="client-job-detail-data num">
                          <NumberFormat
                            value={el.num_disclosed}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </div>
                      </div>
                      <div className="client-job-detail-item">
                        <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].numSuccess}</div>
                        <div className="client-job-detail-data num">
                          <NumberFormat
                            value={el.num_hired}
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </div>
                      </div>
                      <div className="client-job-detail-item">
                        <div className="client-job-detail-title">{LANG[localStorage.JobChoiceLanguage].finalApplication}</div>
                        <div className="client-job-detail-data num">{final_application_date}</div>
                      </div>
                    </div>
                  </div>
                <div className="client-job-note">
                  <div className="client-job-detail-title">
                    {LANG[localStorage.JobChoiceLanguage].note}
                    {el.savedNotes && <span className="saved-notif">{LANG[localStorage.JobChoiceLanguage].saved}</span>}
                    {el.isSaving && <span className="loading-notif">{LANG[localStorage.JobChoiceLanguage].saving}</span>}
                  </div>
                      <div className="client-job-note-detail">
                        <InputTextArea
                          field={key}
                          inputStyles={this.state.savedNotes ? 'success' : ''}
                          onChange={this.noteInput}
                          value={el.notes ? el.notes.notes : this.state.notes}
                          initialValue={el.notes ? el.notes.notes : ''}
                        />
                      </div>
                </div>
              </div>
            )
          })}
          { this.props.clientPage.total === 0 &&
            <div className="no-data-records job-list-no-data-found">{ LANG[localStorage.JobChoiceLanguage].noJobsFound }</div>
          }
        </div>
        <div className="client-job-list-footer">
          <div className="pagination-area">
            { this.props.clientPage.current_page > 1 &&
              <button
                className='btn pagination-number left'
                onClick={() => this.props.searchClientJobList({}, this.props.clientPage.current_page-1)}
              >
                <FontAwesomeIcon icon='chevron-left'/>
              </button>
            }
            { this.props.clientPage.total > 0 && this.props.clientPage.pages.map((val, key) => {
              return (
                <button key={key}
                  className={`btn pagination-number ${this.props.clientPage.current_page === val ? 'active' : ''}`}
                  onClick={() => this.props.searchClientJobList({}, val)}
                >{val}</button>
              )})
            }
            { this.props.clientPage.last_page !== this.props.clientPage.current_page &&
              <button
                className='btn pagination-number left'
                onClick={() => this.props.searchClientJobList({}, this.props.clientPage.current_page+1)}
              >
                <FontAwesomeIcon icon='chevron-right'/>
              </button>
            }
          </div>
          { this.props.clientPage.total > 0 &&
            <button
              className="btn btn-secondary duplicate-btn"
              disabled={this.state.chosenJob === -1}
              onClick={this.openDuplicateModal}>
              {LANG[localStorage.JobChoiceLanguage].duplicate}
            </button>
          }
        </div>

        <ModalViewJobPC 
          jobId={this.state.jobId}
          show={this.state.viewJobPc} 
          handleLoading={this.setLoading}
          handleModalView={this.setModalView}
          viewMode={this.state.viewMode}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(ClientJobList)
