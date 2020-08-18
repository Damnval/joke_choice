import React from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import './SharerInfo.scss'
import { LANG } from '../../../constants'
import {Breadcrumb} from 'react-bootstrap'
import InputTextArea from '../../../components/inputTextArea/InputTextArea'
import InfoRow from '../../../components/infoComponents/infoRow/InfoRow'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import Img from 'react-fix-image-orientation'

class SharerInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sharerDetails: null,
      note: null,
      note_id: null,
      savingNote: false,
      isLoading: true,
      isSaving: false,

      modal: {
        messageKey:null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const shared_job_id = this.props.match.params.shared_job_id
    api.post('api/sharer-information', {shared_job_id: shared_job_id}).then(response => {
      if (response.data.status === 200) {
        const notes = response.data.results.shared_job.notes ? response.data.results.shared_job.notes: null
        const data = response.data.results.shared_job
        
        const first_name = data.slug.user.first_name ? data.slug.user.first_name : ''
        const last_name = data.slug.user.last_name ? data.slug.user.last_name : ''

        const first_name_kana = data.slug.user.first_name_kana ? data.slug.user.first_name_name : ''
        const last_name_kana = data.slug.user.last_name_kana ? data.slug.user.last_name_name : ''

        this.setState({
          note: notes ? notes.notes: '',
          note_id: notes ? notes.id: null,
          sharerDetails: {
            id: data.slug.user.id,
            full_name: first_name || last_name ? last_name+ ' ' +first_name : '',
            full_kana_name: first_name_kana || last_name_kana ? last_name_kana+ ' ' +first_name_kana : '',
            nickname: data.slug.user.job_seeker.nickname,
            registration_date: data.slug.user.created_at,
            total_application: data.num_applicants_on_shared_jobs,
            under_application: data.num_applicants_pending_on_shared_jobs,
            num_contract: data.num_applicants_success_on_shared_jobs,
            rejected_application: data.num_applicants_rejected_on_shared_jobs,
            profile_picture: data.slug.user.job_seeker.profile_picture
          },
          job_id: data.job_id,
          isLoading: false
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

  noteInput = (name, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    this.setState({
      note: value,
      isSaving: true
    }, () => this.setState({
      typingTimeout:setTimeout(() => this.onSearchFunction(value), 3000)
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
        taggable_id: this.props.match.params.shared_job_id,
        taggable_type: 'SharedJob'
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
        console.log(error)
        if( error.response.data.error === LANG[localStorage.JobChoiceLanguage].noteAlreadyExist ) {
          this.onSearchFunction(note)
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
    }
  } 

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    const data = this.state
    const shared_job = data.sharerDetails

    return (
      <div>
        <JobChoiceLayout>
        <div className='container-fluid offer-detail-background'>
        {shared_job &&
        <>
        <Breadcrumb className="breadcrumb-shared-jobs">
          <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
          <Breadcrumb.Item href={"/company/jobs/"+data.job_id}>{ LANG[localStorage.JobChoiceLanguage].applicantList }</Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].sharerInfo }</Breadcrumb.Item>
        </Breadcrumb>
          <div className="row">
            <div className="col-md-8 offset-md-2 col-xl-8 offset-xl-2">
              <div className="row applicant-info-1">
                <div className="col-lg-4 col-xl-3 offset-xl-1 flex justify-content-center">
                  <div className='applicant-picture'>
                    {shared_job ? 
                      (shared_job.profile_picture && <Img src={shared_job.profile_picture} alt="logo"/>) :
                      ''
                    }
                  </div>
                </div>
                <div className="col-lg-8 col-xl-7">
                  <span className='applicant-title'>
                    { LANG[localStorage.JobChoiceLanguage].sharerInfo }
                  </span>
                  <div className="applicant-note">
                    <span>{LANG[localStorage.JobChoiceLanguage].note}</span>
                    {data.savingNote && <span className="saved-notif">{ LANG[localStorage.JobChoiceLanguage].saved }</span>}
                    {data.isSaving && <span className="loading-notif">{ LANG[localStorage.JobChoiceLanguage].saving }</span>}
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
                  <InfoRow label={'ID'} data={shared_job.id}/>
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].name}
                    data={shared_job.full_name ? shared_job.full_name : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].completeKanaName}
                    data={shared_job.full_kana_name ? shared_job.full_kana_name : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                  />
                  <InfoRow
                    label={LANG[localStorage.JobChoiceLanguage].nickName}
                    data={shared_job.nickname ? shared_job.nickname : LANG[localStorage.JobChoiceLanguage].valueNotSet}
                  />

                  <InfoRow label={LANG[localStorage.JobChoiceLanguage].jobChoiceRegistrationDate} data={shared_job.registration_date}/>           
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
                        <div className="sub-header-1">{LANG[localStorage.JobChoiceLanguage].totalNumberOfApplications}</div>
                        <div className="sub-header-2">{LANG[localStorage.JobChoiceLanguage].underApplication}</div>
                        <div className="sub-header-3">{LANG[localStorage.JobChoiceLanguage].numberOfContracts}</div>
                        <div className="sub-header-4">{LANG[localStorage.JobChoiceLanguage].numberOfRejectedApplications}</div>
                      </div>
                      <div className="application-history-data">
                        <div className="sub-data-1">{shared_job.total_application}</div>
                        <div className="sub-data-2">{shared_job.under_application}</div>
                        <div className="sub-data-3">{shared_job.num_contract}</div>
                        <div className="sub-data-4">{shared_job.rejected_application}</div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        }
        </div>

        <Modal show={data.modal.modal} 
          message={this.state.modal.message}
          messageKey={this.state.modal.messageKey}
          type={data.modal.modalType}
          redirect={data.modal.redirect} />

        <LoadingIcon show={this.state.isLoading} />

        </JobChoiceLayout>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SharerInfo)
