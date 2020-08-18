import React, { Component } from 'react'
import '../ClientDashboard.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class ClientDashboardSidebar extends Component {
  render() {
    return (
      <div className="clientDashSide-background">
        <div className="clientDashSide-profile">
          <div className="clientDashSide-image-container">
            <div className="clientDashSide-image">
              <FontAwesomeIcon icon="briefcase" />
            </div>
          </div>
          <div className="clientDashSide-info">
            <div id="clientDashSide-name">
              {this.props.user.data.last_name} {this.props.user.data.first_name}
            </div>
            <div id="clientDashSide-email">
              {this.props.user.data.email}
            </div>
          </div>
        </div>
        <div className="clientDashSide-buttons">
          <ul className="list-group">
            <li className="list-group-item clientDashSide-item">
              <a href="/home">
                <span>{ LANG[localStorage.JobChoiceLanguage].jobMngmnt }</span>
                <span className="icon-space"><FontAwesomeIcon icon='building' /></span>
              </a>
            </li>
            <li className="list-group-item clientDashSide-item">
              <a href="/job/create">
                <span>{ LANG[localStorage.JobChoiceLanguage].createJob }</span>
                <span className="icon-space"><FontAwesomeIcon icon='plus-circle' /></span>
              </a>
            </li>
            <li className="list-group-item clientDashSide-item">
              <a href="/company/billing">
                <span>{ LANG[localStorage.JobChoiceLanguage].billing }</span>
                <span className="icon-space"><FontAwesomeIcon icon='file-invoice' /></span>
              </a>
            </li>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientDashboardSidebar)
