import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import JobSeekerProfileComponent from './jobSeekerProfileComponent/JobSeekerProfileComponent'
import CompanyProfileComponent from './companyProfileComponent/CompanyProfileComponent'
import AdminProfileComponent from './adminProfileComponent/AdminProfileComponent'
import { Redirect, Link } from 'react-router-dom'

class AccountProfile extends Component {
    render() {
      if (
        this.props.isAuthenticated &&
        (this.props.user.data && !this.props.user.data.sms_verified_at)
      ) {
        return <Redirect to={{pathname:`/verify/${localStorage.accessToken}` }}/>
      }
      return (
        <div>
            { this.props.user &&
              <>
              {this.props.user.data.job_seeker !== null && <JobSeekerProfileComponent location={this.props.location}/>}
              {this.props.user.data.type === "company" && <CompanyProfileComponent/>}
              {this.props.user.data.type === "admin" && <AdminProfileComponent/>}
              </>
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountProfile)
