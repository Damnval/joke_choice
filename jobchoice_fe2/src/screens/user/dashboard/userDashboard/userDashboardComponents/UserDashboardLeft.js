import React, { Component } from 'react'
import '../UserDashboard.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'
import { Link } from "react-router-dom"
import Img from 'react-fix-image-orientation'

class UserDashboardLeft extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latestImage: Date.now()
    } 
  }
  
    render() {
        const user = this.props.user.data
        const account_type = ( user.job_seeker || user.company ) ? (user.job_seeker ? 'job_seeker' : 'company') : null
        return (
            <div className="user-dashboard-left">
                <div className="user-dashboard-left-title">
                    <span>{ LANG[localStorage.JobChoiceLanguage].myPage }</span>
                </div>
                <div className="user-dashboard-image">
                    <div className="profile-image">
                    { !account_type ?
                        ''
                     :
                     (user[account_type].profile_picture ?
                        <Img src={`${user.job_seeker.profile_picture}?${this.state.latestImage}`} alt="logo"/>:
                        '')
                    }
                    </div>
                </div>
                <div className="user-dashboard-profile-info">
                    <span id="user-name">{this.props.user.data.last_name} {user.first_name}</span>
                </div>
                <div className="user-dashboard-profile-buttons">
                    <ul className="list-group">
                        {!account_type ?
                         <>
                         <li className="list-group-item user-dashboard-profile-list-item">
                            <Link to ={{
                            pathname: "/manage/accounts"}}
                            >
                            <span>{LANG[localStorage.JobChoiceLanguage].mngAccounts}</span>
                            <span className="icon-space"><FontAwesomeIcon icon='user' /></span>
                            </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/manage/job-categories"}}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].jobCategory } </span>
                            <span className="icon-space"><FontAwesomeIcon icon='list-alt' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/jobs"}}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].jobs } </span>
                            <span className="icon-space"><FontAwesomeIcon icon='briefcase' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/jobs-management"}}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</span>
                            <span className="icon-space"><FontAwesomeIcon icon='tasks' /></span>
                          </Link>
                        </li>
                        </> :
                        (<><li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "../"
                            }}
                          >
                          <span>{ LANG[localStorage.JobChoiceLanguage].dashboardTop }</span>
                          <span className="icon-space"><FontAwesomeIcon icon='tachometer-alt' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/notifications"
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].dashboardNotice }</span>
                            <span className="icon-space"><FontAwesomeIcon icon='bell' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/account-profile"
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].dashboardRegistrationInfo } </span>
                            <span className="icon-space"><FontAwesomeIcon icon='user' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/hatarakikata",
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].hatarakikataChoice }</span>
                            <span className="icon-space"><FontAwesomeIcon icon='list-alt' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/applications",
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].dashboardMyWork }</span>
                            <span className="icon-space"><FontAwesomeIcon icon='briefcase' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/shared-jobs",
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].sharedJobs } </span>
                            <span className="icon-space"><FontAwesomeIcon icon='file' /></span>
                          </Link>
                        </li></>)}
                    </ul>
                </div>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(UserDashboardLeft)
