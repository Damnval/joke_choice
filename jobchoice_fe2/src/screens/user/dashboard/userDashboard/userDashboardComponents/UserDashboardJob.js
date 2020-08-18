import React, { Component } from 'react'
import '../UserDashboard.scss'
import { LANG, EM } from '../../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../../store/auth/actions'
import NumberFormat from 'react-number-format'

class UserDashboardJob extends Component {
    constructor(props) {
        super(props)

        this.state = {
          dateToday: new Date().getMonth() + 1,
        }
    }

    render() {
        const dateToday = this.state.dateToday
        return (
            <div className="user-dashboard-job row">
                <div className="user-dashboard-job-title col-12">
                    <span>{ LANG[localStorage.JobChoiceLanguage].myJob }</span>
                </div>
                <div className="user-dashboard-job-table table-responsive col-12">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>{ LANG[localStorage.JobChoiceLanguage].appliedJobs }</th>
                                <th>{ LANG[localStorage.JobChoiceLanguage].pastWork }</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td onClick={() => this.props.redirectJobApplications(0)}>
                                    <button className="btn btn-link" onClick={() => this.props.redirectJobApplications(0)}>
                                    <NumberFormat
                                        value={this.props.jobCounts !== null ? this.props.jobCounts.count_applied_jobs : ''}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                    />
                                    </button></td>
                                <td className="disable-td">
                                    <button className="btn btn-default job-seeker-dashboard-btn-disabled" onClick={() => this.props.redirectJobApplications(1)} disabled>
                                    <NumberFormat
                                        value={this.props.jobCounts !== null ? this.props.jobCounts.count_work_experiences : ''}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                    />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="user-dashboard-job-title col-12">
                    <span>{ LANG[localStorage.JobChoiceLanguage].shareWork }</span>
                </div>
                <div className="user-dashboard-job-table col-12 table-responsive">
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th className="header-with-body" rowSpan="2">
                                    {localStorage.JobChoiceLanguage === 'JP' ? this.state.dateToday + '月' :
                                    EM[localStorage.JobChoiceLanguage].MONTH.filter(function(el) {
                                        return (el.value === dateToday) ? el : null
                                      })[0].name}
                                </th>
                                <td className="header-within-body">{ LANG[localStorage.JobChoiceLanguage].sharedJobs }</td>
                                <td className="header-within-body">{ LANG[localStorage.JobChoiceLanguage].confirmedSharedJobs }</td>
                                <td className="header-within-body">{ LANG[localStorage.JobChoiceLanguage].shareCompensation }</td>
                            </tr>
                            <tr>
                                <td onClick={() => this.props.redirectShareHistory(this.state.dateToday+1)}>
                                    <a href="#" onClick={() => this.props.redirectShareHistory(this.state.dateToday+1)}>
                                        <NumberFormat
                                            value={this.props.jobCounts !== null ? this.props.jobCounts.this_month_shared_jobs : ''}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                        />
                                    </a>
                                </td>
                                <td onClick={() => this.props.redirectShareHistory(this.state.dateToday+1, true)}>
                                    <a href="#" onClick={() => this.props.redirectShareHistory(this.state.dateToday+1, true)}>
                                        <NumberFormat
                                            value={this.props.jobCounts !== null ? this.props.jobCounts.count_this_month_disclosed_shared_jobs : ''}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                        />
                                    </a>
                                </td>
                                <td onClick={() => this.props.redirectShareHistory(this.state.dateToday+1)}>
                                    <a href="#" onClick={() => this.props.redirectShareHistory(this.state.dateToday+1)}>
                                    ￥  <NumberFormat
                                            value={this.props.jobCounts !== null ? this.props.jobCounts.this_month_sum_disclosed_incentives : ''}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                        />
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th className="header-with-body" rowSpan="2">{ LANG[localStorage.JobChoiceLanguage].cumulative }</th>
                                <td className="header-within-body">{ LANG[localStorage.JobChoiceLanguage].sharedJobs }</td>
                                <td className="header-within-body">{ LANG[localStorage.JobChoiceLanguage].confirmedSharedJobs }</td>
                                <td className="header-within-body">{ LANG[localStorage.JobChoiceLanguage].shareCompensation }</td>
                            </tr>
                            <tr>
                                <td onClick={() => this.props.redirectShareHistory('')}>
                                    <a href="#" onClick={() => this.props.redirectShareHistory('')}>
                                        <NumberFormat
                                            value={this.props.jobCounts !== null ? this.props.jobCounts.count_shared_jobs : ''}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                        />
                                    </a>
                                </td>
                                <td onClick={() => this.props.redirectShareHistory('', true)}>
                                    <a href="#" onClick={() => this.props.redirectShareHistory('', true)}>
                                        <NumberFormat
                                            value={this.props.jobCounts !== null ? this.props.jobCounts.count_disclosed_shared_jobs : ''}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                        />
                                    </a>
                                </td>
                                <td onClick={() => this.props.redirectShareHistory('')}>
                                    <a href="#" onClick={() => this.props.redirectShareHistory('')}>
                                        ￥<NumberFormat
                                            value={this.props.jobCounts !== null ? this.props.jobCounts.sum_disclosed_incentives : ''}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                        />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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

  export default connect(mapStateToProps, mapDispatchToProps)(UserDashboardJob)
