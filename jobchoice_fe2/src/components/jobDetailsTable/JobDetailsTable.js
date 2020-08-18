import React from 'react'
import './JobDetailTable.scss'
import api from '../../utilities/api'
import { LANG, EM } from '../../constants'
import { handleSearchTranslation } from '../../helpers'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import InputTextArea from '../inputTextArea/InputTextArea'
import NumberFormat from 'react-number-format'

class JobDetailTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      detail: this.props.details,
      note: null,
      note_id: null,
      link:null,
      currentTab: 0,
      showEmail: false,
      savedNotes: false,
      share_job_details: '',
      isLoading: true,
      isSaving: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }
    this.infoChange = this.infoChange.bind(this)
  }

  handleState = (newInput) => {this.setState(newInput)}

  infoChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  componentDidMount() {
    const notes = this.props.details.notes ? this.props.details.notes.notes : ''
    const note_id = this.props.details.notes ? this.props.details.notes.note_id : null
    this.setState({
      note: notes,
      note_id: note_id
    })
  }

  noteInput = (name, value) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

    this.setState({
      note: value,
      isSearching: true,
      isSaving: true,
      savedNotes: false
    }, () => this.setState({
      typingTimeout:setTimeout(() => this.onSearchFunction(value), 2000)
    }))
  }

  onSearchFunction = (note) => {
    // IF there is an EXISTING NOTE
    if (this.state.note_id) {
      const note = {
        notes: this.state.note,
      }
      api.patch('api/note/'+this.state.note_id, note).then(response => {
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
    // ELSE Create a Note
    } else {
      const note = {
        notes: this.state.note,
        taggable_id: this.props.details.id,
        taggable_type: 'Job'
      }
      api.post('api/note', note).then(response => {
        if (response.data) {
          this.setState({
            savedNotes: true,
            note_id: response.data.note.id,
            isSaving: false
          })
        }
      }).catch(error => {
        console.log(error.response.error)
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

  render() {
    const employment_type = this.state.detail.employment_type
    const employment_status = EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE.filter(function(el) { return el.value === employment_type ? el : null })[0].name

    let moment = require('moment')

    const created_at = moment(this.props.details.publication.published_start_date, "YYYY-MM-DD").format("YYYY年MM月DD日")
    const end_at = moment(this.props.details.publication.published_end_date, "YYYY-MM-DD").format("YYYY年MM月DD日")

    const final_application_date = this.props.details.applied_job.length > 0 ?
      moment(this.props.details.applied_job[0].created_at, "YYYY-MM-DD").format("YYYY年MM月DD日") :
      '-'

    return (
      <>
        <Breadcrumb className="breadcrumb-shared-jobs">
          <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
        <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].applicationList }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="row justify-content-center">
          <div className="job-grid-a">
            <div className="job-grid-item">
              <div>{LANG[localStorage.JobChoiceLanguage].jobTitle}</div>
              <div>{this.props.details.title}</div>
            </div>
            <div className="job-grid-item">
              <div>{LANG[localStorage.JobChoiceLanguage].employmentStatus}</div>
              <div>{employment_status !== undefined ? employment_status.name : ''}</div>
            </div>
            <div className="job-grid-item">
              <div className="item-2">{LANG[localStorage.JobChoiceLanguage].publicationDate}</div>
              <div className="item-data">
                <div>{created_at}</div>
                <div>{end_at}</div>
              </div>
            </div>
            <div className="job-grid-item">
              <div>{LANG[localStorage.JobChoiceLanguage].status}</div>
              <div>{handleSearchTranslation('PUBLICATION_STATUS', this.props.details.publication.status)}</div>
            </div>
            <div className="job-grid-item">
              <div><span>{ LANG[localStorage.JobChoiceLanguage].incentives }</span></div>
              <div>
                <NumberFormat
                  value={this.props.details.price}
                  displayType={'text'}
                  thousandSeparator={true}
                />
                {this.props.details.price !== null ? ' 円' : ' - '}
              </div>
            </div>
            <div className="job-grid-item">
                <div>{LANG[localStorage.JobChoiceLanguage].numberOfShares}</div>
                <div>{this.props.details.num_shares}</div>
            </div>
          </div>
          <div className="job-grid-b">
            <div className="job-grid-item">
              <div className="job-grid-header">{LANG[localStorage.JobChoiceLanguage].applicationMgmt}</div>
              <div className="item-data-b sub-header">
                <div className="sub-item-1"><span>{LANG[localStorage.JobChoiceLanguage].noOfApplications}</span></div>
                <div className="sub-item-2"><span>{LANG[localStorage.JobChoiceLanguage].noOfUnopened}</span></div>
                <div className="sub-item-3"><span>{LANG[localStorage.JobChoiceLanguage].noOfDisclosure}</span></div>
                <div className="sub-item-4"><span>{LANG[localStorage.JobChoiceLanguage].noOfAccepted}</span></div>
                <div className="sub-item-5"><span>{LANG[localStorage.JobChoiceLanguage].dateFinalApplication}</span></div>
              </div>
              <div className="item-data-b">
                <div className="sub-item-1">{this.props.details.num_applied}</div>
                <div className="sub-item-2">{this.props.details.num_waiting}</div>
                <div className="sub-item-3">{this.props.details.num_disclosed}</div>
                <div className="sub-item-4">{this.props.details.num_hired}</div>
                <div className="sub-item-5">{final_application_date}</div>
              </div>
            </div>
            <div className="job-grid-item">
              <div className="job-grid-header note-header">
                <div>{LANG[localStorage.JobChoiceLanguage].note}</div>
                {this.state.savedNotes ? 
                  <small className="success">{LANG[localStorage.JobChoiceLanguage].saved}</small> :
                  ''
                }
                {this.state.isSaving ?
                  <small className="loading">{LANG[localStorage.JobChoiceLanguage].saving}</small> :
                  ''
                }
              </div>
              <div className="note">
                {this.state.note !== null &&
                  <InputTextArea
                    field="note"
                    inputStyles={this.state.savedNotes ? 'success' : ''}
                    onChange={this.noteInput}
                    value={this.state.note}
                    initialValue={this.state.note}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailTable)
