import React, { Component } from 'react'
import "./JobApplicationList.scss"
import api from '../../../utilities/api'
import { connect } from 'react-redux'
import InputDropDown from '../../../components/inputDropDown/InputDropDown'
import {Breadcrumb} from 'react-bootstrap'
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { Redirect } from 'react-router-dom'
import PendingJobApplication from './pendingJobApplications/PendingJobApplications'
import HistoryJobApplication from './historyJobApplications/HistoryJobApplications'
import { LANG } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import BoxContainer from '../../../components/boxContainer/BoxContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pageGenerator } from '../../../helpers';

class JobApplicationList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      jobApplicationList: [],
      isLoading: false,
      page: 1,
      pages: [],
      lastPage: 1,
      select: 0,
      total: '',
      showPaginationNumbers: true,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
      status: [
        {
          name: "jobUnderApplication",
          filter: ['pending', 'waiting']
        },
        {
          name: "jobApplicationHistory",
          filter: ['success', 'rejected']
        },
      ]
    }
    this.handleClick = this.handleClick.bind(this)
    this.historyLink = this.historyLink.bind(this)
    this.getData = this.getData.bind(this)
    this.handleLoadPage = this.handleLoadPage.bind(this)
    this.showPageNumber = this.showPageNumber.bind(this)
  }

  componentDidMount() {
    let job_seeker_id = {}
    const select = this.props.location.state ? this.props.location.state.category : 0 
    this.setState({
      select: select,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null
      },
    })
    
    if (this.props.user.data.job_seeker) {
      job_seeker_id = {
        job_seeker_id: this.props.user.data.job_seeker.id
      }
    } else {
      this.props.history.push({pathname:'/home'})
    }

    this.getData(this.state.page)
  }

  handleInputChange = (name, value) => {
    this.setState({
      [name]: value,
      isLoading: true
    }, () => this.getData(this.state.page))
  }

  handleClick(id) {
    this.setState({
      isLoading: true
    }, () => this.getData(id))
  }

  handleLoadPage = (state) => {
    this.setState({
      isLoading: state
    })
  }

  getData = (id, load=true) => {
    const status = {status: this.state.status[this.state.select].filter}
    this.setState({
      jobApplicationList: [],
      isLoading: load,
    }, () => {
      api.post('api/user-applied-jobs?page=' + id, status).then(response => {
        if (response.data.status === 200) {
          const data = response.data.results
          this.setState({
            jobApplicationList: data.applied_jobs.data,
            isLoading: false,
            page: data.applied_jobs.current_page,
            total: data.applied_jobs.total,
            lastPage: data.applied_jobs.last_page,
            pages: pageGenerator(data.applied_jobs.last_page)
          })
        } else {
          this.setState({
            modal: {
              messageKey: 'somethingWentWrong',
              message: LANG[localStorage.JobChoiceLanguage].somethingWentWrong,
              modal: true,
              modalType: 'error',
              redirect: '/',
            },
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
    })
  }

  historyLink(item){
    this.props.history.push(item)
  }

  showPageNumber(stater) {
    this.setState({
      showPaginationNumbers: stater,
    })
  }

  render() {

    const applicationList = this.state.jobApplicationList

    if (!(this.props.user.data.job_seeker)) {
      return (<Redirect to="/home" />)
    }
    
    return (
      <div>
        <JobChoiceLayout>
          <div className="container-fluid min-height back-color">
          <Breadcrumb className="breadcrumb-application">
                  <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
                  <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobApplicationAndHistory }</Breadcrumb.Item>
                </Breadcrumb>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 col-lg-12 col-xl-10 offset-xl-1 col-sm-12">
                <BoxContainer title={ LANG[localStorage.JobChoiceLanguage].jobApplicationAndHistory }>
                  <div className="job-application-list-container">
                    <InputDropDown
                      className="custom-select filter-select"
                      field='select'
                      options={this.state.status}
                      onChange={this.handleInputChange}
                      value={this.state.select}
                    >
                      {
                        (this.state.status.map((value, key) => {
                          return (<option key={key} value={key}>{LANG[localStorage.JobChoiceLanguage][value.name]}</option>)
                        }))
                      }
                    </InputDropDown>
                    { this.state.select == 0 &&
                      <PendingJobApplication applicationList={applicationList} getData={this.getData} handleLoadPage={this.handleLoadPage} showPageNumber={this.showPageNumber}/>
                    }
                    { this.state.select == 1 &&
                      <HistoryJobApplication applicationList={applicationList} historyLink={this.historyLink} />
                    }
                    {this.state.showPaginationNumbers &&
                      <div className="pagination-area">
                        { this.state.current_page > 1 &&
                          <button
                            className='btn pagination-number left'
                            onClick={() => this.getData(this.state.current_page-1)}
                          >
                            <FontAwesomeIcon icon='chevron-left'/>
                          </button>
                        }
                        { this.state.total > 0 && this.state.pages.map((val, key) => {
                          return (
                            <button key={key}
                              className={`btn pagination-number ${this.state.current_page === val ? 'active' : ''}`}
                              onClick={() => this.getData(val)}
                            >{val}</button>
                          )})
                        }
                        { this.state.last_page !== this.state.current_page &&
                          <button
                            className='btn pagination-number left'
                            onClick={() => this.getData(this.state.current_page+1)}
                          >
                            <FontAwesomeIcon icon='chevron-right'/>
                          </button>
                        }
                      </div> 
                    }    
                  </div>   
                </BoxContainer> 
              </div>
            </div>
          </div>
          </div>
          
          <Modal 
            messageKey={this.state.modal.messageKey}
            show={this.state.modal.modal} 
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect} />
          
          <LoadingIcon show={this.state.isLoading} />
        
        </JobChoiceLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(JobApplicationList)
