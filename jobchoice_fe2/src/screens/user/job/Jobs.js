import React, { Component } from 'react'
import "./Jobs.scss"
import api from '../../../utilities/api'
import Modal from '../../../components/modal/Modal'
import Input from '../../../components/input/Input'
import InputDropDown from '../../../components/inputDropDown/InputDropDown'
import LoadingIcon from '../../../components/loading/Loading'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { Redirect, Link } from 'react-router-dom'
import JobList from '../../../components/jobComponents/jobList/JobList'
import HatarakikataSearch from './hatarakikataSearch/HatarakikataSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import RegisterHatarakikataModal from '../../../components/registerHatarakikataModal/RegisterHatarakikataModal'
import { pageGenerator } from '../../../helpers'

class Jobs extends Component {

  constructor(props) {
    super(props)

    this.state = {
      job: [],
      isLoading: false,
      hatarakikataEdit: false,
      link: null,
      current_page: 0,
      jobsPerPage: 20,
      page: 0,
      pages: [],
      last_page: 0,
      hataraki_kata: [],
      total: 0,
      form: {
        prefecture: '',
        job_category: '',
      },
      job_categories: [],
      selectHatarakikata: [],
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
      hatarakikataModal: false,
    }

    this.Redirect = this.Redirect.bind(this)
    this.newLink = this.newLink.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleChance = this.handleChange.bind(this)
    this.handleParentClose = this.handleParentClose.bind(this)
  }

  getData = async (id) => {
    this.setState({
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
      isLoading: true
    })
    var url = ''
    if (this.props.user.data === undefined) {
      url = 'api/job'
    } else {
      if (this.props.user.data.job_seeker) {
        url = 'api/user-matching-jobs'
      } else {
        url = 'api/job'
      }
    }
    
    await api.get(url+'?page='+id).then(response => {
      if (response.data.status === 200) {
        const data = response.data.results

        this.setState({
          job: data.jobs.data,
          current_page: data.jobs.current_page,
          total: data.jobs.total,
          last_page: data.jobs.last_page,
          isLoading:false,
          pages: pageGenerator(data.jobs.last_page),
          hatarakikataModal: this.checkHatarakikata(),
        })}
    }).catch(error => {
      console.log(error)
      this.setState({
        isLoading:false,
        modal: {
          message: LANG[localStorage.JobChoiceLanguage].serverError,
          messageKey: "serverError",
          modal: true,
          modalType: 'error',
          redirect: '/',
        }
      })
    })
  }

  checkHatarakikata = () => {
    let ret = false
    // If there is a User Logged in and it is a Job Seeker
    // If No hataraki kata data exist, return true
    // If not Job Seeker Account, return false
    if (this.props.user.data !== undefined) {
      if (this.props.user.data.job_seeker && this.props.user.data.job_seeker.hataraki_kata_resource.length === 0) {
        ret = true
      } else {
        ret = false
      }
    }
    return ret
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    let history = this.props.location.state
    let default_hataraki_kata = []
    this.setState({
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
      isLoading: true
    })

    if ((history && history !== undefined) && history.hataraki_kata) {
      default_hataraki_kata = history.hataraki_kata.map((value, key) => {
        return value.id
      })
      this.setState({
        selectHatarakikata: history.hataraki_kata
      })
    }
    
    var url = ''
    if (this.props.user.data === undefined) {
      url = 'api/job'
    } else {
      if (this.props.user.data.job_seeker) {
        url = 'api/user-matching-jobs'
      } else if (this.props.user.data.company) {
        url = 'api/company-jobs/'
      } else {
        url = 'api/job'
      }
    }

    this.getData(1)
    this.setState({
      isLoading: true
    }, () => {
      api.get('api/hataraki-kata').then(response => {
        let hataraki_kata = response.data.results.hataraki_kata.map((val) => {
          return({
            id: val.id,
            item_jp: val.item_jp,
            item_en: val.item_en,
            value: default_hataraki_kata.includes(val.id),
            image: val.image
          })
        })
        this.setState({
          hataraki_kata: hataraki_kata
        }, () => {
          api.get('api/job-category').then(response => {
            this.setState({
              job_categories: response.data.results.jobs,
              isLoading: false
            })
          }).catch(error => {
            console.log(error)
            this.setState({ 
              modal: {
                message: LANG[localStorage.JobChoiceLanguage].serverError,
                messageKey: 'serverError',
                modal: true,
                modalType: 'error',
                redirect: '/'
              },
              isLoading: false
            })
          })
        })
      }).catch(error => {
        console.log(error)
        this.setState({
          isLoading:false,
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            messageKey: 'serverError',
            modal: true,
            modalType: 'error',
            redirect: '/',
          }
        })
      })
    })
  }

  handleState = (newInput) => {this.setState(newInput)}

  handleChange = (name, value) => {

    this.setState({ 
      form: {
        ...this.state.form,
        [name]: value,
      } 
    })
  }

  handleClose = (value) => {
    this.setState({
      [value]: false,
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const state = this.state
    const form = state.form
    this.setState({
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null
      },
      isLoading: true
    }, () => {
      const hataraki_kata = state.hataraki_kata.filter(el => el.value)
      .map(value => {
        return value.id
      })
  
      if (hataraki_kata.length !== 4 && hataraki_kata.length !== 0) {
        this.setState({
          modal: {
            message: "Please select exactly 4 hataraki kata or none.",
            messageKey: null,
            modal: true,
            modalType: 'error',
          },
          isLoading: false,
        })
        return
      }
      const credentials = {
        hataraki_kata_id: hataraki_kata,
        job_category_id: form.job_category,
        prefectures: form.prefecture,
        job_seeker_id: (this.props.user.data && this.props.user.data.job_seeker) ? this.props.user.data.job_seeker.id : null
      }
      // Submit to Backend the credentials
      api.post('api/job/search', credentials).then(response => {
        const jobs = response.data.results.jobs
        jobs.data.length > 0 ?
        this.setState({
          isLoading: false,
          job: jobs.data,
          total: jobs.total
        }) :
        this.setState({
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].noJobsFound,
            messageKey: 'noJobsFound',
            modal: true,
            modalType: 'error',
          },
          isLoading: false,
          results: jobs.data
        })
      }).catch(error => {
        console.log(error)
        this.setState({
          modal: {
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            messageKey: 'serverError',
            modal: true,
            modalType: 'error',
            redirect: '/',
          },
          isLoading: false
        })
      })
    })
  }

  newLink(id) {
    const user = this.props.user
    if (user.data && user.data.job_seeker === null) {
      if (user.data.company) {
        this.props.history.push({pathname:'job-detail/' + id})
      } else {
        this.props.history.push({pathname:'/admin/manage/job-offer/for-approval/' + id})
      }
    } else {
      this.setState({
        modal: {
          message: '',
          messageKey: null,
          modal: false,
          modalType: 'error',
        }
      }, () => {
        this.props.history.push({pathname:'job-detail/' + id})
      })
    } 
  }

  handleClick(id) {
    this.getData(id)
  }

  Redirect(mode) {
    this.props.history.push({pathname:'/hatarakikata',
      state:{
        mode: mode,
        prevLocation:'/jobs',
        hataraki_kata: this.state.selectHatarakikata
      }})
  }

  handleParentClose() {
    this.setState({
      modal: {
        messageKey: null,
        message: "",
        modal: false,
        modalType: '',
      }
    })
  }

  render() {

    if (this.state.link !== null) {
      return <Redirect to={this.state.link} />
    }
 
    return (
      <div>
        <JobChoiceLayout>
          <Breadcrumb className="breadcrumb-jobs">
            {this.props.user && !this.props.user.data ?
              <Breadcrumb.Item href="/">{ LANG[localStorage.JobChoiceLanguage].home}</Breadcrumb.Item> :
              <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>
            }/
            <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].jobs }</Breadcrumb.Item>
          </Breadcrumb>
          <div className="container-fluid job-offer-list-background ">
            <div className="job-list row job-list-first-margin-top">
              <div className="col-lg-12 col-xl-8 offset-xl-2">
                <h1 className="page-title-job">{this.props.user && this.props.user.company ? 'Job Offers' : LANG[localStorage.JobChoiceLanguage].jobsList}</h1>
                <form className='search-row row' noValidate onSubmit={this.handleSubmit}>
                  <div className="col-xl-5 col-lg-6 col-md-9 col-sm-12">
                    <HatarakikataSearch
                      data={this.state.hataraki_kata && this.state.hataraki_kata.filter(el => el.value === true)}
                      Redirect={this.Redirect}
                    />
                  </div>
                  <div className="job-list-input-2 col-md-9 col-xl-7 col-lg-6 col-md-3 col-sm-12">
                    <div className="job-list-input-group row">
                      <Input
                        label={LANG[localStorage.JobChoiceLanguage].prefecture}
                        className="col-md-6"
                        field='prefecture'
                        value={this.state.form.prefecture}
                        onChange={this.handleChange}
                      />
                      <div className="col-md-6">
                        <InputDropDown
                          label={LANG[localStorage.JobChoiceLanguage].jobCategory}
                          className="joblist-category-dropdown"
                          field='job_category'
                          onChange={this.handleChange}
                          placeholder=" "
                          value={this.state.form.job_category_id}
                        >
                          {
                            (this.state.job_categories.map((value, key) => {
                              return (<option key={key} value={value.id}>{value.category}</option>)
                            }))
                          }
                        </InputDropDown>
                      </div>
                    </div>
                    <div className="row">
                      <div className="search-row-button col-md-5 offset-md-2">
                        <Link className="btn btn-secondary" to="/search">{LANG[localStorage.JobChoiceLanguage].furtherSearch} <FontAwesomeIcon className="search-icon" icon='chevron-right' /></Link>
                      </div>
                      <div className="search-row-button col-md-5">
                        <button className="btn btn-search">{LANG[localStorage.JobChoiceLanguage].search} <FontAwesomeIcon className="search-icon" icon='search' /></button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row justify-content-center">
                  {(this.state.job.length > 0) ?
                    <JobList
                      jobs={this.state.job}
                      onClick={this.newLink}
                    /> :
                    <div className="no-data-records job-list-no-data-found">{ LANG[localStorage.JobChoiceLanguage].noJobsFound }</div>
                  }
                </div>
                <div className="row flex-row-space-between jobs-list-bottom-results">
                  <div className="pagination-area justify-content-center">
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
                    { this.state.total > 0 && <div className="job-list-search-results-component">{ LANG[localStorage.JobChoiceLanguage].jobsFound } {this.state.total} { LANG[localStorage.JobChoiceLanguage].found } </div>}
                </div> 
              </div>
            </div>  
          </div>
          
          <Modal show={this.state.modal.modal} 
            message={this.state.modal.message}
            type={this.state.modal.modalType}
            redirect={this.state.modal.redirect}
            messageKey={this.state.modal.messageKey} 
            handleParentClose={this.handleParentClose} 
          />

          <RegisterHatarakikataModal
            show={this.state.hatarakikataModal}
            Redirect={this.Redirect}
            mode={'save'}
          />

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

export default connect(mapStateToProps, mapDispatchToProps)(Jobs)
