import React, { Component } from 'react'
import './AdminDashboard.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import { Link } from "react-router-dom"

class AdminDashboardLeft extends Component {
    render() {
        const user = this.props.user.data
        const account_type = ( user.job_seeker || user.company ) ? (user.job_seeker ? 'job_seeker' : 'company') : null
        const client_active = this.props.location.pathname === '/admin/manage/clients' ? 'active' : ''
        const job_offer_active = this.props.location.pathname === '/admin/manage/job-offers' ? 'active' : ''
        const job_category_active = this.props.location.pathname === '/admin/manage/job-categories' ? 'active' : ''
        const user_active = this.props.location.pathname === '/admin/' ? 'active' : ''
        const incentive_active = this.props.location.pathname === '/admin/manage/incentives' ? 'active' : ''
        
        return (
            <div className="user-dashboard-left">
                <div className="admin-dashboard-left-title">
                    <span>{ LANG[localStorage.JobChoiceLanguage].dashboard }</span>
                </div>
                <div className="admin-dashboard-profile-buttons">
                    <ul className="list-group">
                        {!account_type ?
                         <>
                        <li className={`list-group-item user-dashboard-profile-list-item ${user_active}`}>
                            <Link to ={{
                            pathname: "/admin/"}}
                            >
                            <span>{LANG[localStorage.JobChoiceLanguage].userList}</span>
                            <span className="icon-space"><FontAwesomeIcon icon='user' /></span>
                            </Link>
                        </li>
                        <li className={`list-group-item user-dashboard-profile-list-item ${client_active}`}>
                            <Link to ={{
                            pathname: "/admin/manage/clients"}}
                            >
                            <span>{LANG[localStorage.JobChoiceLanguage].clientList}</span>
                            <span className="icon-space"><FontAwesomeIcon icon='briefcase' /></span>
                            </Link>
                        </li>
                        <li className={`list-group-item user-dashboard-profile-list-item ${job_category_active}`}>
                          <Link to ={{
                            pathname: "/admin/manage/job-categories"}}
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
                            <span className="icon-space"><FontAwesomeIcon icon='pen-square' /></span>
                          </Link>
                        </li>
                        <li className={`list-group-item user-dashboard-profile-list-item ${job_offer_active}`}>
                          <Link to ={{
                            pathname: "/admin/manage/job-offers"}}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</span>
                            <span className="icon-space"><FontAwesomeIcon icon='tasks' /></span>
                          </Link>
                        </li>
                        <li className={`list-group-item user-dashboard-profile-list-item ${incentive_active}`}>
                          <Link to ={{
                            pathname: "/admin/manage/incentives"}}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].incentiveMngmnt }</span>
                            <span className="icon-space"><FontAwesomeIcon icon='money-bill' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/admin/manage/notice-management"}}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].noticeManagement }</span>
                            <span className="icon-space"><FontAwesomeIcon icon='flag-checkered' /></span>
                          </Link>
                        </li>
                        </> :
                        (<><li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/account-profile",
                              state: {
                                whatTab: 0
                              }
                            }}
                          >
                          <span>{ LANG[localStorage.JobChoiceLanguage].loginInformation }</span>
                          <span className="icon-space"><FontAwesomeIcon icon='tachometer-alt' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/account-profile",
                              state: {
                                whatTab: 1
                              }
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].basicInformation } </span>
                            <span className="icon-space"><FontAwesomeIcon icon='bell' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/account-profile",
                              state: {
                                whatTab: 2
                              }
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].profile } </span>
                            <span className="icon-space"><FontAwesomeIcon icon='user' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/account-profile",
                              state: {
                                whatTab: 3
                              }
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].accountInformation } </span>
                            <span className="icon-space"><FontAwesomeIcon icon='building' /></span>
                          </Link>
                        </li>
                        <li className="list-group-item user-dashboard-profile-list-item">
                          <Link to ={{
                            pathname: "/account-profile",
                              state: {
                                whatTab: 4
                              }
                            }}
                          >
                            <span>{ LANG[localStorage.JobChoiceLanguage].sns }</span>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboardLeft)
