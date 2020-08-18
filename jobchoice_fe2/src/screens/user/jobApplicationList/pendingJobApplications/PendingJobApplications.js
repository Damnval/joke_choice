import React, { Component } from 'react'
import "../JobApplicationList.scss"
import api from '../../../../utilities/api'
import { connect } from 'react-redux'
import { LANG, EM } from '../../../../constants'
import ConfirmationModal from '../../../../components/confirmationModal/ConfirmationModal'
import Modal from '../../../../components/modal/Modal'
import LoadingIcon from '../../../../components/loading/Loading'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { ErrorModal } from '../../../../helpers'
import SharerInfoJobSeeker from './SharerInfoJobSeeker'
import Img from 'react-fix-image-orientation'

const errorModal = {...ErrorModal()}
class PendingJobApplication extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      sharer: null,
      showSharer: false,
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },
      confirmDelete: {
        messageKey: null,
        message: '',
        show: false,
        id: 0
      }
    }
    this.onCancel = this.onCancel.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.redirectJobSharer = this.redirectJobSharer.bind(this)
    this.returnToList = this.returnToList.bind(this)
  }

  componentDidMount() {
  }

  onCancel() {
    this.setState({
      confirmDelete: {
        messageKey: null,
        message: '',
        show: false,
        id: 0
      }
    }, () => this.props.handleLoadPage(true))

    api.delete('api/apply-job/' + this.state.confirmDelete.id).then(response => {
      this.props.getData(1)
      this.setState({
        modal: {
          message: LANG[localStorage.JobChoiceLanguage].successfullyCancelledApplication,
          messageKey: 'successfullyCancelledApplication',
          modal: true,
          modalType: 'success',
          redirect: ''
        }
      }, () => this.props.handleLoadPage(false))
    }).catch(error => {
      console.log(error)
      this.setState({
        ...errorModal,
        isLoading: false
      })
    })
  }

  handleCancel (id) {
    this.setState({
      confirmDelete: {
        messageKey: null,
        message: '',
        show: false,
        id: 0
      },
      modal: {
        message: '',
        messageKey: null,
        modal: false,
        modalType: '',
        redirect: null,
      },

    }, () => {
      this.setState({
        confirmDelete: {
          message: LANG[localStorage.JobChoiceLanguage].areYouSureCancelApplication,
          messageKey: 'areYouSureCancelApplication',
          show: true,
          id: id
        },
      })
    })
  }

  redirectJobSharer = (user) => {
    this.setState({
      sharer: user,
      showSharer: true,
    }, () => {
      this.props.showPageNumber(false)
    })
  }

  returnToList(stater) {
    this.setState({
      sharer: null,
      showSharer: stater,
    }, () => {
      this.props.showPageNumber(true)
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
    const applicationList = this.props.applicationList

    if(this.state.showSharer) {
      return(<SharerInfoJobSeeker sharerDetails={this.state.sharer} returnToList={this.returnToList} />)
    }

    return (
      <>
      {applicationList.length > 0 ?
        <div className="jobHistory-container">
        {
          applicationList.map((value, key) => {
            const job_status = EM[localStorage.JobChoiceLanguage].JOB_STATUS.filter(function(em) { return em.value === value.status ? em : null })[0].name
            const nick_name = (value.shared_job) ?
                              value.shared_job.slug.user.job_seeker.nickname || LANG[localStorage.JobChoiceLanguage].valueNotSet :
                              LANG[localStorage.JobChoiceLanguage].valueNotSet;

            return (
              <div key={key}
                   className={`jobHistory-row lefter toper righter ${key+1 === applicationList.length ? 'bottomer' : ''}`}>
                <div className="jobHistory-status">
                  <div>
                    <span className={`jobHistory-job_status ${value.status}`}>{job_status}</span>
                    {value.shared_job !== null &&
                      <div>
                        <br/>
                        <span>{LANG[localStorage.JobChoiceLanguage].sharedBy}: <br/>
                          <button className="btn btn-link" onClick={() => this.redirectJobSharer(value.shared_job.slug.user)}>
                            {nick_name}
                          </button>
                        </span>
                      </div>
                    }
                  </div>
                </div>
                <div className="jobHistory-content">
                  <div className="jobPending-item grid-item-b">
                    <div className="job-under-application-image-container">
                      <Img src={value.job.job_image} alt="logo"/>
                    </div>
                  </div>
                  <div className="jobHistory-main">
                    <div className="jobHistory-title">
                      <div className="jobHistory-title-title">{LANG[localStorage.JobChoiceLanguage].jobTitle}</div>
                      <a href={"/job-detail/"+value.job.id}>{value.job.title}</a>
                    </div>
                    <div className="jobHistory-description">
                      <div className="jobHistory-title-title">{LANG[localStorage.JobChoiceLanguage].jobDescription}</div>
                      <div>{value.job.description}</div>
                    </div>
                    <div className="jobHistory-lower">
                      <div className="jobHistory-icon">
                        <div>「{ LANG[localStorage.JobChoiceLanguage].applicationDate }」</div>
                        <span>{value.created_at}</span>
                      </div>
                      <div className="jobHistory-icon">
                        <div>「{ LANG[localStorage.JobChoiceLanguage].totalNumberOfShares }」</div>
                        <span>{value.job_share_count}</span>
                      </div>
                      <div className="jobHistory-icon">
                        <div>「{ LANG[localStorage.JobChoiceLanguage].numberofViews }」</div>
                        <span>{value.job.analytic ? value.job.analytic.views : '0'}</span>
                      </div>
                      <div>
                        <div className="jobPending-item grid-item">
                          <button
                            onClick={() => this.handleCancel(value.id)}
                            className="btn btn-secondary btn-cancel">
                              { LANG[localStorage.JobChoiceLanguage].cancel }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )
          })
        }
      </div> :
      <div className="no-data-records">{ LANG[localStorage.JobChoiceLanguage].noRecords }.</div>
      }
      <Modal
        show={this.state.modal.modal}
        message={this.state.modal.message}
        messageKey={this.state.modal.messageKey}
        type={this.state.modal.modalType}
        redirect={this.state.modal.redirect} />
        <LoadingIcon show={this.state.isLoading} />
      <ConfirmationModal
        show={this.state.confirmDelete.show}
        message={this.state.confirmDelete.message}
        messageKey={this.state.confirmDelete.messageKey}
        handleParentClose={this.handleConfirmClose}
        handleSuccess={this.onCancel}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PendingJobApplication)
