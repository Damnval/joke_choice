import React, { Component } from 'react'
import './Notifications.scss'
import Modal from '../../../components/modal/Modal'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import api from '../../../utilities/api'
import LoadingIcon from '../../../components/loading/Loading'
import { connect } from 'react-redux'
import { LANG, EM } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import {Breadcrumb} from 'react-bootstrap'

class NotificationDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
          isLoading: true,
          notification: null,

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
        const id = this.props.match.params.id
        this.showNotification(id)
      }
    
    showNotification(id) {
      api.get('api/notification/' + id).then(response => {
        const notification = response.data.results.notification
        this.setState({
          isLoading: false,
          notification: notification
          }, 
        )
        console.log(notification.title)
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

        const title = this.state.notification === null ? null : this.state.notification.title
        const description = this.state.notification === null ? null : this.state.notification.description
        const category = this.state.notification === null ? null : this.state.notification.type
        const area = this.state.notification === null ? null : this.state.notification.area
        const prefecture = this.state.notification === null ? null : this.state.notification.prefecture
        const age_from = this.state.notification === null ? null : this.state.notification.age_from
        const age_to = this.state.notification === null ? null : this.state.notification.age_to
        const recipient = this.state.notification === null ? null : this.state.notification.recipient_type
        
      return (
        <div>
            <JobChoiceLayout className="jobchoice-body">
                <Breadcrumb className="breadcrumb-jobs">
                    <Breadcrumb.Item href="/home">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Breadcrumb.Item>/
                    <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].notificationDetails }</Breadcrumb.Item>
                </Breadcrumb>

                <div className="user-dashboard-notice">
                <div className="container">
                    <div className="row">
                    <div className="user-dashboard-notice-table table-responsive">
                        {this.state.notification !== null &&
                          <table className="table table-bordered table-hover">
                            <thead>
                                <tr className="notification-header">
                                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].notice }</th>
                                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].notificationContent }</th>
                                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].category }</th>
                                    {/* <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].area }</th>
                                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].prefecture }</th>
                                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].ageFrom }</th>
                                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].ageTo }</th>
                                    <th className="notification-title">{ LANG[localStorage.JobChoiceLanguage].recipient }</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                  <tr>
                                    <td>{title}</td>
                                    <td>{description}</td>
                                    <td>{EM[localStorage.JobChoiceLanguage].NOTIFICATION_TYPE.filter(function(item) { return item.value === category ? item : null })[0].name}</td>
                                    {/* <td>{EM[localStorage.JobChoiceLanguage].PUBLICATION_AREA.filter(function(item) { return item.value === area ? item : null })[0].name}</td>
                                    <td>{prefecture}</td>
                                    <td>{age_from}</td>
                                    <td>{age_to}</td>
                                    <td>{EM[localStorage.JobChoiceLanguage].ACCOUNT_TYPE.filter(function(item) { return item.value === recipient ? item : null })[0].name}</td> */}
                                  </tr>
                            </tbody>
                          </table>
                        }
                    </div>
                    </div>
                </div>
                </div>

            <Modal
                show={this.state.modal.modal}
                messageKey={this.state.modal.messageKey}
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDetails)
