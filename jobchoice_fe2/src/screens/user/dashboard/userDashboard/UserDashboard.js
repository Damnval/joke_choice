import React, { Component } from 'react'
import './UserDashboard.scss'
import { connect } from 'react-redux'
import UserDashboardLeft from './userDashboardComponents/UserDashboardLeft'
import UserDashboardNotice from './userDashboardComponents/UserDashboardNotice'
import UserDashboardHatarakikata from './userDashboardComponents/UserDashboardHatarakikata'
import UserDashboardJob from './userDashboardComponents/UserDashboardJob'
import UserDashboardMatching from './userDashboardComponents/UserDashboardMatching'
import UserDashboardRight from './userDashboardComponents/UserDashboardRight'
import { Redirect, Link } from 'react-router-dom'

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: this.props.jobs,
      jobCounts: this.props.jobCounts,
      notifications: this.props.notifications,
      modal: {
        message: "",
        messageKey: null,
        modal: false,
        modalType: "",
        redirect: null
      }
    };
  }

  render() {
    if (
      this.props.isAuthenticated &&
      (this.props.user.data && !this.props.user.data.sms_verified_at)
    ) {
      return <Redirect to={{pathname:`/verify/${localStorage.accessToken}` }}/>
    }
    return (
      <div className="user-dashboard-background">
        {this.state.notifications && (
          <div className="row">
            <div className="col-md-3 col-sm-12 col-12">
              <UserDashboardLeft />
            </div>
            <div className="col-md-6 col-sm-12 col-12">
              <div className="row">
                <div className="user-dashboard-center col-12">
                  <UserDashboardNotice
                    notifications={this.state.notifications}
                  />
                  <UserDashboardHatarakikata
                    hataraki_kata_resource={
                      this.props.user.data.job_seeker.hataraki_kata_resource
                    }
                  />
                  <UserDashboardJob
                    jobCounts={this.state.jobCounts}
                    redirectShareHistory={this.props.redirectShareHistory}
                    redirectJobApplications={this.props.redirectJobApplications}
                  />
                  <UserDashboardMatching jobs={this.state.jobs} />
                </div>
              </div>
            </div>
            <div className="col-md-3 col-12">
              <UserDashboardRight />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(Dashboard);
