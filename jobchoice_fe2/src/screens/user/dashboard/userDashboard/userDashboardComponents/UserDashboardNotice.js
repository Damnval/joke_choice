import React, { Component } from 'react'
import '../UserDashboard.scss'
import { Link } from 'react-router-dom'
import { LANG } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'
import api from '../../../../../utilities/api'

class UserDashboardNotice extends Component {
  constructor(props) {
      super(props)
      this.state = {

        type: [
          {
            en: "Campaign Information",
            jp: "キャンペーン案内",
            value: "campaign_information"
          },
          {
            en: "System Maintenance",
            jp: "システムメンテナンス",
            value: "system_maintenance"
          },
          {
            en: "System Update Notification",
            jp: "システム更新のお知らせ",
            value: "system_update_notification"
          }
        ],

        isLoading: true,
        notifications: [],
        modal: {
          messageKey: null,
          message: '',
          modal: false,
          modalType: '',
          redirect: null,
        },
    }
  }
  
  componentDidMount() {
      this.setState({
          notifications: this.props.notifications
      })
  }

  showNotification(id) {
    api.get('api/notification/' + id).then(response => {
      const notification_log = response.data.results.notification.notification_log
      this.setState({
        isLoading: false,
        notification_log: notification_log
        },
      )
    }).catch(error => {
        console.log(error)
        this.setState({ 
          isLoading: false,
          modal: {
            messageKey: 'serverError',
            message: LANG[localStorage.JobChoiceLanguage].serverError,
            modal: true,
            modalType: 'error',
            redirect: '/home'
          },
        })
    })
  }
  
  render() {
    return (
      <div className="user-dashboard-notice">
        <div className="user-dashboard-notice-title">
          <span>{ LANG[localStorage.JobChoiceLanguage].notice }</span>
          <Link to='/notifications' className='btn user-dashboard-notice-button'>{ LANG[localStorage.JobChoiceLanguage].seeAllNotifications }</Link>
        </div>
        <div className="row">
            <div className="user-dashboard-notice-table table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr className="notification-header">
                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].category }</th>
                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].notice }</th>
                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].notificationDate }</th>
                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].read }</th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.notifications.map((value, key)=>{
                      const type = this.state.type.filter(function(el) {
                        if (el.value === value.type) {
                          return el
                        } else {
                          return null
                        }
                      })[0]
                      const notification_log = value.notification_log ? value.notification_log.created_at : <font color="red">{ LANG[localStorage.JobChoiceLanguage].notRead }</font>
                      return (
                        <tr key={key}>
                          <td>
                            { localStorage.JobChoiceLanguage === "JP" ? type.jp : type.en 
                            }
                          </td>
                          <td>
                              <Link to={'/notification/details/'+ value.id} onClick={() => this.showNotification(value.id)}>
                                <span className="notice-text-link">{value.title}</span>
                              </Link>
                          </td>
                          <td>{value.created_at}</td>
                          <td>{value.notification_log && <font color="blue">{ LANG[localStorage.JobChoiceLanguage].alreadyRead }</font>} {notification_log}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserDashboardNotice)
