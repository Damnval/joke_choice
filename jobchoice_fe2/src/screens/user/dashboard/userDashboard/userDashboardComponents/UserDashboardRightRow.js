import React, { Component } from 'react'
import '../UserDashboard.scss'
import { Link } from 'react-router-dom'

class UserDashboardRightRow extends Component {
    render() {
      const {whatTab, statusStyle, status, info} = this.props
      const style = statusStyle === 'register' ? 'user-registered' : 'user-unregistered'
        return (
          <div className="user-dashboard-right-individual">
            <Link 
              to={{ pathname: "/account-profile",
              state: {
                whatTab: whatTab
              }
            }}>
              <div className={`user-dashboard-right-individual-circle ${style}`}></div>
            </Link>
            <div className="user-dashboard-right-individual-button">{ status }</div>
            <div className="user-dashboard-right-individual-desc">
              <span>{ info }</span>
            </div>
          </div>
        )
    }
}

export default UserDashboardRightRow
