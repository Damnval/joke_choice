import React, { Component } from 'react'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import api from '../../../utilities/api'
import "./SharedJobs.scss"
import Modal from '../../../components/modal/Modal'
import LoadingIcon from '../../../components/loading/Loading'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import {enUS, ja} from 'date-fns/esm/locale'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Breadcrumb} from 'react-bootstrap'
import { LANG } from '../../../constants'
import { DateSubmitFormat } from '../../../helpers'
import * as authActions from '../../../store/auth/actions'
import BoxContainer from '../../../components/boxContainer/BoxContainer'
import { pageGenerator } from '../../../helpers'
import NumberFormat from 'react-number-format'

class SharedJobs extends Component {
    constructor(props) {
    super(props)

    this.state = {
      sharedJobs: [],
      isLoading: false,
      startDate: null,
      endDate: null,
      peopleCount: 0,
      page: 0,
      pages: [],
      lastPage: 0,
      select: 0,
      total_compensation: 0,
      checkedDisclosed: false,
      modal: {
        messageKey: null,
        message: '',
        modal: false,
        modalType: '',
        redirect: null,
      },
    }
    this.handleChangeStart = this.handleChangeStart.bind(this)
    this.handleChangeEnd = this.handleChangeEnd.bind(this)
    this.checkedDisclosed = this.checkedDisclosed.bind(this)
  }

  componentDidMount() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth()
    if (this.props.location.state) {
      var displayDate = this.props.location.state.date
      const disclosed = this.props.location.state.disclosed

      this.setState({
          startDate: displayDate !== "" ? new Date(y, m, 1) : null,
          endDate: displayDate !== "" ? new Date() : null,
          checkedDisclosed: disclosed ? disclosed : false
        }, () => {
          if (disclosed) {
            this.getDisclosedData(1)
          } else {
            this.handleClick(1)
          }
        }
      )
    } else {
      this.handleClick(1)
    }
  }

  handleClick(id) {
    this.setState({
      isLoading: true
    }, () => this.getData(id))
  }

  getData = (id) => {
    this.setState({
      isLoading: true
    })
    const credentials = {
      start_date: this.state.startDate ? DateSubmitFormat(this.state.startDate) : "",
      end_date: this.state.endDate ? DateSubmitFormat(this.state.endDate) : ""
    }
    api.post('api/user-shared-jobs?page=' + id, credentials).then(response => {
      if (response.data.status === 200) {
        const data = response.data.results
        let peopleCount = 0
        const shared_jobs = data.shared_jobs.data.map((val, key) => {
          val['isVisible'] = false
          peopleCount = peopleCount + val.applied_job.length
          return val
        })
        this.setState({
          sharedJobs: shared_jobs,
          isLoading: false,
          page: data.shared_jobs.current_page,
          total: data.shared_jobs.total,
          lastPage: data.shared_jobs.last_page,
          total_compensation: data.total_compensation ? data.total_compensation : 0,
          peopleCount: peopleCount,
          pages: pageGenerator(data.shared_jobs.last_page)
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
  }

  getDisclosedData = (id) => {
    this.setState({
      isLoading: true
    })
    const credentials = {
      start_date: this.state.startDate ? DateSubmitFormat(this.state.startDate) : "",
      end_date: this.state.endDate ? DateSubmitFormat(this.state.endDate) : "",
      disclosed: 1,
    }
    api.post('api/user-shared-jobs?page=' + id, credentials).then(response => {
      if (response.data.status === 200) {
        const data = response.data.results
        let peopleCount = 0
        const shared_jobs = data.shared_jobs.data.map((val, key) => {
          val['isVisible'] = false
          peopleCount = peopleCount + val.applied_job.length
          return val
        })
        this.setState({
          sharedJobs: shared_jobs,
          isLoading: false,
          page: data.shared_jobs.current_page,
          total: data.shared_jobs.total,
          lastPage: data.shared_jobs.last_page,
          total_compensation: data.total_compensation ? data.total_compensation : 0,
          peopleCount: peopleCount,
          pages: pageGenerator(data.shared_jobs.last_page)
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
  }

  checkedDisclosed = (id=null) => {
    this.setState({
      isLoading: true,
      checkedDisclosed: !this.state.checkedDisclosed,
    }, () => {
      let data_id = id === null ? 1 : id
      if(this.state.checkedDisclosed) {
        this.getDisclosedData(data_id)
      } else {
        this.getData(id)
      }
    })
  }

  toggleDetails = (key) => {
    const sharedJob = [...this.state.sharedJobs]
    sharedJob[key]['isVisible'] = !sharedJob[key]['isVisible']
    this.setState({
      sharedJobs: sharedJob
    })
  }

  handleChangeStart(date) {
    const endDate = date > this.state.endDate ? date : this.state.endDate
    this.setState({
        ...this.state,
       startDate: date,
        endDate: endDate
    })
  }

  handleChangeEnd(date) {
    const startDate = date < this.state.startDate ? date : this.state.startDate
    this.setState({
        ...this.state,
        startDate: startDate,
        endDate: date
    })
  }

  getChecker = (id) => {
    this.setState({
      isLoading: true,
    })
    if(this.state.checkedDisclosed) {
      this.getDisclosedData(id)
    } else {
      this.getData(id)
    }
  }

  render() {
    const sharedJobs = this.state.sharedJobs

    const icons = [
      {name: 'qr',
       icon: 'qrcode',
       fa: 'fa',
       size: '2x'
      },
      {name: 'sms',
       icon: 'sms',
       fa: 'fa',
       size: '1x'
      },
      {name: 'facebook',
       icon: 'facebook',
       fa: 'fab',
       size: '2x'
      },
      {name: 'line',
       icon: 'line',
       fa: 'fab',
       size: '2x'
      },
      {name: 'email',
       icon: 'envelope',
       fa: 'fa',
       size: '1x'
      },
      {name: 'clipboard',
       icon: 'clipboard',
       fa: 'fa',
       size: '1x'
      },
      {name: 'twitter',
       icon: 'twitter',
       fa: 'fab',
       size: '1x'
      },
    ]

    if (!(this.props.user.data.job_seeker)) {
      return (<Redirect to="/home" />)
    }

    return (

      <div>
        <JobChoiceLayout>
          <div className="container-fluid min-height back-color">
          <Breadcrumb className="breadcrumb-shared-jobs">
            <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
            <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].shareHistory }</Breadcrumb.Item>
          </Breadcrumb>
          <div className="row">
            <div className="col-md-10 offset-md-1 col-sm-12 justify-content-center">
              <BoxContainer className="shared-job" title={ LANG[localStorage.JobChoiceLanguage].shareHistory }>
                <div className="shared-job-date-search-row">
                  <div className="shared-job-date-label">{ LANG[localStorage.JobChoiceLanguage].startDate }</div>
                  <DatePicker
                    className="shared-job-date"
                    dateFormat="yyyy/MM/dd"
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    selected={this.state.startDate}
                    onChange={this.handleChangeStart}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                <div className="shared-job-date-label">{ LANG[localStorage.JobChoiceLanguage].endDate }</div>
                  <DatePicker
                    className="shared-job-date"
                    dateFormat="yyyy/MM/dd"
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    selected={this.state.endDate}
                    onChange={this.handleChangeEnd}
                    placeholderText={ LANG[localStorage.JobChoiceLanguage].datePlaceholder }
                    locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
                  />
                  <input
                      type="checkbox"
                      className='disclosed-checkbox'
                      checked={this.state.checkedDisclosed}
                      onChange={() => this.checkedDisclosed()}
                      />
                  { LANG[localStorage.JobChoiceLanguage].disclosed }
                  <button
                    className="search-btn"
                    onClick={() => this.handleClick(this.state.page)}>
                    {LANG[localStorage.JobChoiceLanguage].search}
                  </button>
                </div>
                { this.props.user.data.job_seeker.bank_account.account_number === null &&
                  <Link
                  to={{ pathname: "/account-profile",
                        state: { whatTab: 3 } }}
                  className='shared-job-date-search-row notice'>
                    <span>{ LANG[localStorage.JobChoiceLanguage].accountHistoryInfoMsg }</span>
                  </Link>
                }
                <div className="shared-job-date-search-row data">
                  <div className="shared-job-date-search-row data-container" >
                    <div className="shared-job-date-label">{ LANG[localStorage.JobChoiceLanguage].totalCompensation }</div>
                    <div className="shared-job-date-data">
                      <NumberFormat
                        value={this.state.total_compensation}
                        displayType={'text'}
                        thousandSeparator={true}
                      />円
                    </div>
                  </div>
                  <div className="shared-job-date-search-row data-container" >
                    <div className="shared-job-date-label">{ LANG[localStorage.JobChoiceLanguage].numberOfShares }</div>
                    <div className="shared-job-date-data">
                      <NumberFormat
                        value={this.state.total ? this.state.total : '0'}
                        displayType={'text'}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                  <div className="shared-job-date-search-row data-container" >
                    <div className="shared-job-date-label">{ LANG[localStorage.JobChoiceLanguage].totalApplicants }</div>
                    <div className="shared-job-date-data">
                      <NumberFormat
                          value={this.state.peopleCount ? this.state.peopleCount : '0'}
                          displayType={'text'}
                          thousandSeparator={true}
                        />
                    </div>
                  </div>
                </div>
                <div className='search-row'>
                  {(!this.state.sharedJobs) && <div></div>
                  }
                  <div className="shared-jobs-grid-container">
                    <div className="header item shared-jobs">{ LANG[localStorage.JobChoiceLanguage].sharedJobs }</div>
                    <div className="header item shared-jobs">{ LANG[localStorage.JobChoiceLanguage].sharedDate }</div>
                    <div className="header item shared-jobs">{ LANG[localStorage.JobChoiceLanguage].numberOfPeople }</div>
                    <div className="header item shared-jobs">{ LANG[localStorage.JobChoiceLanguage].sns }</div>
                    <div className="header item shared-jobs">{ LANG[localStorage.JobChoiceLanguage].totalShareReward }</div>
                    {sharedJobs.map((value,key)=>{
                      const share = icons.filter(function(el) { return el.name === value.provider.name ? el : null })[0]

                      return(
                        <div key={key} className="container-grid-item bottomer">
                          <div className="item shared-jobs toggle">
                            <button className="btn btn-default" onClick={() => this.toggleDetails(key)}>
                              {value.isVisible ?
                                <FontAwesomeIcon icon={['fa', 'chevron-down']}  size="1x" />:
                                <FontAwesomeIcon icon={['fa', 'chevron-right']}  size="1x" />
                              }
                            </button>
                          </div>
                          <div className="item shared-jobs item-job-a">
                            <div><Link to={`/job-detail/${value.job_id}`}>{value.job.title}</Link></div>
                          </div>
                          <div className="item shared-jobs">
                            <div>{value.created_at}</div>
                          </div>
                          <div className="item shared-jobs">
                            <div>{value.applied_job.length}</div>
                          </div>
                          <div className="item shared-jobs">
                            <div className={share.icon}>
                              <FontAwesomeIcon icon={[share.fa, share.icon]}  size={share.size} />
                            </div>
                          </div>
                          <div className="item shared-jobs">
                            <div>
                              <NumberFormat
                                value={ value.applied_job.length === 0 ? '0' :
                                      value.job.incentive_per_share*value.applied_job.length
                                    }
                                displayType={'text'}
                                thousandSeparator={true}
                              />円
                            </div>
                          </div>
                          {value.isVisible &&
                           ( value.applied_job.length > 0 ?
                              value.applied_job.map((applicant, key) => {
                              return(

                                <div key={key} className="shared-jobs-grid-details">
                                  <div className="item shared-jobs item-detail-a">
                                    <div><strong>{ LANG[localStorage.JobChoiceLanguage].nickName }</strong></div>
                                  </div>
                                  <div className="item shared-jobs">
                                    <div>{applicant.job_seeker.nickname ? applicant.job_seeker.nickname : LANG[localStorage.JobChoiceLanguage].valueNotSet}</div>
                                  </div>
                                  <div className="item shared-jobs">
                                    <div><strong>{applicant.disclosed === 1 ? LANG[localStorage.JobChoiceLanguage].disclosedDate : ''}</strong></div>
                                  </div>
                                  <div className="item shared-jobs">
                                    <div>{applicant.updated_at}</div>
                                  </div>
                                  <div className="item shared-jobs item-detail-b">
                                    <div><strong>{ LANG[localStorage.JobChoiceLanguage].shareRenumeration }</strong></div>
                                  </div>
                                  <div className="item shared-jobs">
                                    <div>
                                      <NumberFormat
                                        value={value.job.incentive_per_share}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                      />円
                                    </div>
                                  </div>
                                </div>
                              )
                            }) :
                            <div className="no-applied-job item">
                              <li>{LANG[localStorage.JobChoiceLanguage].noApplicantsMsg}</li>
                            </div>
                            )
                          }
                        </div>
                      )
                    })}
                  </div>
                </div>
                { sharedJobs.length === 0 &&
                  <div className="no-jobs-found-share-job">{ LANG[localStorage.JobChoiceLanguage].noJobsFound }</div>
                }
                <div className="pagination-area">
                  { this.state.current_page > 1 &&
                    <button
                      className='btn pagination-number left'
                      onClick={() => this.getChecker(this.state.current_page-1)}
                    >
                      <FontAwesomeIcon icon='chevron-left'/>
                    </button>
                  }
                  { this.state.pages.map((val, key) => {
                    return (
                      <button key={key}
                        className={`btn pagination-number ${this.state.current_page === val ? 'active' : ''}`}
                        onClick={() => this.getChecker(val)}
                      >{val}</button>
                    )})
                  }
                  { this.state.last_page !== this.state.current_page &&
                    <button
                      className='btn pagination-number left'
                      onClick={() => this.getChecker(this.state.current_page+1)}
                    >
                      <FontAwesomeIcon icon='chevron-right'/>
                    </button>
                  }
                </div>
              </BoxContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(SharedJobs)
