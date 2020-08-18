import React, { Component } from 'react'
import "../JobApplicationList.scss"
import { connect } from 'react-redux'
import { EM, LANG } from '../../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import Img from 'react-fix-image-orientation'

class HistoryJobApplications extends Component {
  constructor(props) {
    super(props)

    this.state = {
      jobApplicationHistory: [],
    }

    this.newLink = this.newLink.bind(this)
  }

  componentWillReceiveProps(newProps){
    if(newProps.applicationList.length !== 0) {
      this.setState({
        jobApplicationHistory: newProps.applicationList
      })
    }
  }

  newLink(id) {
    const link = '/job-detail/' + id
    this.props.historyLink({pathname: link})
  }

  render() {
    const jobApplicationHistory = this.state.jobApplicationHistory
    return (
      <>
     {jobApplicationHistory.length > 0 ? 
      <div className="jobHistory-container">
        {(jobApplicationHistory.map((value, key) => {
          const job_status = EM[localStorage.JobChoiceLanguage].JOB_STATUS.filter(function(em) { return em.value === value.status ? em : null })[0].name
          return (
            <div key={key} className={`jobHistory-row lefter toper righter ${key+1 === jobApplicationHistory.length ? 'bottomer' : ''}`}>
              <div className="jobHistory-status">
                <span className={`jobHistory-job_status ${value.status}`}>{job_status}</span>
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
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
      </div> :
      <div className="no-data-records">{LANG[localStorage.JobChoiceLanguage].noRecords}.</div>
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryJobApplications)
