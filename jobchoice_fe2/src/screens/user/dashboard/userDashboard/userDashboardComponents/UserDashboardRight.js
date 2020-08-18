import React, { Component } from 'react'
import '../UserDashboard.scss'
import { LANG } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'
import UserDashboardRightRow from './UserDashboardRightRow';

class UserDashboardRight extends Component {
    render() {
        return (
            <div className="user-dashboard-right">
              <div className="user-dashboard-right-panel">
              <div className="user-dashboard-right-button-area"> 
                    <div className="user-dashboard-right-individual"> 
                        <div className="user-dashboard-right-individual-title">{ LANG[localStorage.JobChoiceLanguage].registrationStatus }</div> 
                    </div>
                    <UserDashboardRightRow
                      whatTab={0}
                      statusStyle={this.props.user.loginInfo ? `register` : 'unregister'}
                      status={ this.props.user.loginInfo ? LANG[localStorage.JobChoiceLanguage].unRegister : LANG[localStorage.JobChoiceLanguage].registered }
                      info={ LANG[localStorage.JobChoiceLanguage].loginInformation }
                    />
                    <UserDashboardRightRow
                      whatTab={1}
                      statusStyle={this.props.user.basicInfo ? `register` : 'unregister'}
                      status={ this.props.user.basicInfo ? LANG[localStorage.JobChoiceLanguage].unRegister : LANG[localStorage.JobChoiceLanguage].registered }
                      info={ LANG[localStorage.JobChoiceLanguage].basicInformation }
                    />
                    <UserDashboardRightRow
                      whatTab={2}
                      statusStyle={this.props.user.profileInfo ? `register` : 'unregister'}
                      status={ this.props.user.profileInfo ? LANG[localStorage.JobChoiceLanguage].unRegister : LANG[localStorage.JobChoiceLanguage].registered }
                      info={ LANG[localStorage.JobChoiceLanguage].profile }
                    />
                    <UserDashboardRightRow
                      whatTab={3}
                      statusStyle={this.props.user.bankInfo ? `register` : 'unregister'}
                      status={ this.props.user.bankInfo ? LANG[localStorage.JobChoiceLanguage].unRegister : LANG[localStorage.JobChoiceLanguage].registered }
                      info={ LANG[localStorage.JobChoiceLanguage].accountInformation }
                    />
                </div>
                <div className="user-dashboard-right-desc">
                    <p>{ LANG[localStorage.JobChoiceLanguage].itIsNecessary }</p>
                </div>
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

  export default connect(mapStateToProps, mapDispatchToProps)(UserDashboardRight)
