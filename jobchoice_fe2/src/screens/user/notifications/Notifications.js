import React, { Component } from 'react'
import './Notifications.scss'
import Modal from '../../../components/modal/Modal'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import api from '../../../utilities/api'
import LoadingIcon from '../../../components/loading/Loading'
import { connect } from 'react-redux'
import { LANG } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Notifications extends Component {
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
        api.post('api/published-notification').then(response => {
          const notifications = response.data.results.notifications.data
          this.setState({
            isLoading: false,
            notifications: notifications
          })
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
        <div>
            <JobChoiceLayout className="jobchoice-body">
                <Breadcrumb className="breadcrumb-jobs">
                    <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
                    <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].notice }</Breadcrumb.Item>
                </Breadcrumb>

                <div className="user-dashboard-notice">
                <div className="container">
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
                              {this.state.notifications.length > 0 && this.state.notifications.map((value, key)=>{
                                const type = this.state.type.filter(function(el) { return el.value === value.type ? el : null })[0]
                                const notification_log = value.notification_log ? value.notification_log.created_at : <font color="red">{ LANG[localStorage.JobChoiceLanguage].notRead }</font>
                                return (
                                  <tr key={key}>
                                    <td>
                                      {localStorage.JobChoiceLanguage === "JP" ? type.jp : type.en}
                                      </td>
                                    <td>
                                      <button className="btn btn-default btn-link" onClick={() => this.showNotification(value.id)}>
                                        <Link to={'/notification/details/'+ value.id} onClick={this.clickCollapse}>
                                          <span className="notice-text-link">{value.title}</span>
                                        </Link>
                                      </button>
                                    </td>
                                    <td>{value.created_at}</td>
                                    <td>{value.notification_log && <font color="blue">{ LANG[localStorage.JobChoiceLanguage].alreadyRead }</font>} {notification_log}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>

            <Modal
              messageKey={this.state.modal.messageKey}
              show={this.state.modal.modal}
              message={this.state.modal.message}
              type={this.state.modal.modalType}
              redirect={this.state.modal.redirect}
            />

            <LoadingIcon show={this.state.isLoading} />
            </JobChoiceLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
