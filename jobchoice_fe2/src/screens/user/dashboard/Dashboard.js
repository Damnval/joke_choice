import React, { Component } from 'react'
import './Dashboard.scss'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { Redirect } from 'react-router-dom'
import api from '../../../utilities/api'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import LoadingIcon from '../../../components/loading/Loading'
import UserDashboard from './userDashboard/UserDashboard'
import CompanyDashboard from '../../client/clientDashboard/ClientDashboard'
import RegisterHatarakikataModal from '../../../components/registerHatarakikataModal/RegisterHatarakikataModal'
import {ClearModal, ErrorModal, DateSubmitFormat, pageGenerator} from '../../../helpers'

const clearModal = {...ClearModal()}
const errorModal = {...ErrorModal()}
class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      jobs: null,
      jobCounts: 0,
      clientPage: {
        current_page: 0,
        per_page: 5,
        total: 0,
        last_page: 0,
        chosenJob: -1,
        pages: 0,
      },
      hatarakikataModal: false,
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
    }

    this.redirectShareHistory = this.redirectShareHistory.bind(this)
    this.redirectJobApplications = this.redirectJobApplications.bind(this)
    this.redirectCreateJob = this.redirectCreateJob.bind(this)
    this.Redirect = this.Redirect.bind(this)
    this.getClientJobList = this.getClientJobList.bind(this)
  }

  redirectShareHistory = (date, disclosed=null) => {
    this.props.history.push({pathname:'/shared-jobs/', state:{date:date, disclosed: disclosed}})
  }

  redirectJobApplications = (id) => {
    this.props.history.push({pathname:'/applications/', state:{category:id}})
  }

  redirectCreateJob = () => {
    this.props.history.push({pathname:'/job/create'})
  }

  getClientJobList = async (search={}, page=0, update=false, mode='search') => {
    this.setState({
      modal: { ...clearModal }
    })
    
    const credentials = {
      ...search,
      published_start_date: search.published_start_date ? DateSubmitFormat(search.published_start_date) : '',
      published_end_date: search.published_end_date ? DateSubmitFormat(search.published_end_date): '',
    }

    await api.post('api/company-jobs?page='+page, credentials).then(response => {
      const data = response.data.results.jobs
      const jobs = data.data.map((el, key) => {
        el['isSearching'] = false
        el['isSaving'] = false
        el['savedNotes'] = false
        return el
      })

      this.setState({
          jobs: jobs,
          clientPage: {
            current_page: data.current_page,
            per_page: data.per_page,
            total: data.total,
            last_page: data.last_page,
            chosenJob: -1,
            pages: pageGenerator(data.last_page),
          }
      }, () => {
        this.setState({
          isLoading: false,
        })
      })
      
    }).catch(error => {
      console.log(error)
      this.setState({  modal: {...errorModal} })
    })
  }

  componentDidMount() {
    if (this.props.user.data && this.props.user.data.company) {
      this.setState({
        isLoading: true
      }, () => {
        this.getClientJobList()
      })
    } else {
      api.get('api/user-matching-jobs').then(response => {
        this.setState({
            jobs: response.data.results.jobs.data
        }, () => {
          api.get('api/user-dashboard').then(response => {
            this.setState({
                jobCounts: response.data.results,
            }, () => {
              api.post('api/published-notification', {paginate: 3}).then(response => {
                const notifications = response.data.results.notifications.data
                let hataraki_kata = []
                if (this.props.user.data && this.props.user.data.job_seeker) {
                  hataraki_kata = this.props.user.data.job_seeker.hataraki_kata_resource
                }
                this.setState({
                  isLoading: false,
                  notifications: notifications,
                  hatarakikataModal: hataraki_kata.length > 0 ? false : true,
                })
                }).catch(error => {
                console.log(error)
                this.setState({
                    isLoading: false,
                    modal: {
                        message: LANG[localStorage.JobChoiceLanguage].serverError,
                        messageKey: "serverError",
                        modal: true,
                        modalType: 'error',
                        redirect: '/home'
                    },
                })
                })
            })
          }).catch(error => {
              console.log(error)
              this.setState({
                  isLoading: false,
                  modal: {
                      message: LANG[localStorage.JobChoiceLanguage].serverError,
                      messageKey: "serverError",
                      modal: true,
                      modalType: 'error',
                      redirect: '/home'
                  },
              })
              })
          })
        }).catch(error => {
          this.setState({
              isLoading: false,
              modal: {
                  message: LANG[localStorage.JobChoiceLanguage].serverError,
                  messageKey: "serverError",
                  modal: true,
                  modalType: 'error',
                  redirect: '/logout',
              }
          })
        })
     }
  }

  Redirect(mode) {
    this.props.history.push({pathname:'/hatarakikata',
      state:{
        mode: mode,
        prevLocation:'/home'
      }})
  }

  render() {
    if(this.state.isLoading) {
      return(<LoadingIcon show={this.state.isLoading} />)
    }

    // Check if SNS Apply is set to true, if it is
    // set to true we will redirect the user to the share job detail page
    if(localStorage.snsApply) {
      let job_data = JSON.parse(localStorage.getItem('share_job_data'))
      return <Redirect to={{pathname:`/job-detail/${job_data.job_id}`,
                            state: {job_seeker_id:job_data.job_seeker_id, shared_job_id:job_data.shared_job_id}
                          }}
              />
    }

    return (
      <div>
        {this.props.user.data &&
          <JobChoiceLayout>

            {(this.props.user.data.job_seeker) &&
              <>
                <UserDashboard
                  redirectShareHistory={this.redirectShareHistory}
                  jobs={this.state.jobs}
                  jobCounts={this.state.jobCounts}
                  redirectJobApplications={this.redirectJobApplications}
                  notifications={this.state.notifications}
                />

                <RegisterHatarakikataModal
                  show={this.state.hatarakikataModal}
                  Redirect={this.Redirect}
                  mode={'save'}
                />
              </>
            }

            {(this.props.user.data.company) &&
              <CompanyDashboard
                redirectCreateJob={this.redirectCreateJob}
                getClientJobList={this.getClientJobList}
                jobs={this.state.jobs}
                clientPage={this.state.clientPage}
                isLoading={this.state.isLoading}
              />
            }

            {(!this.props.user.data.job_seeker && !this.props.user.data.company) &&
              <Redirect to="/admin"/>
            }
          </JobChoiceLayout>
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
