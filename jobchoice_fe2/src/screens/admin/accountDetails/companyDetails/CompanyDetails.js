import React, { Component } from 'react'
import { Redirect, withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import api from '../../../../utilities/api'
import {Breadcrumb} from 'react-bootstrap'
import BoxContainer from '../../../../components/boxContainer/BoxContainer'
import { LANG, EM } from '../../../../constants'
import AccountRowDetails from './../accountRowDetails/AccountRowDetails'
import AccountRowTwoDetails from './../accountRowTwoDetails/AccountRowTwoDetails'
import { ReturnFullName, DateFormat } from '../../../../helpers'
import './../AccountDetails.scss'

class JobSeekerDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
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
  this.props.handleLoadPage(true)
    api.get('api/manage/company/' + this.props.match.params.id).then(response => {
      const {company} = response.data.results
      this.setState({
        user: company
      }, () => this.props.handleLoadPage(false))
    }).catch(error => {
        console.log(error)
        this.setState({ 
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
  checkIfNull = (data) => {
    const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
    return data ? data: valueNotSet
  }

  checkGeolocation = (check, data) => {
    const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
    return check ? check[data]: valueNotSet
  }

  render() {
    const company = this.state.user
    const user = company && company.user
    const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>

    // Industry Value
    const industry = company && company.industry ? company.industry.name :
      <span className='profile-details-individual-value empty'>
        { LANG[localStorage.JobChoiceLanguage].valueNotSet }
      </span>

    // Number of Employees Value
    const no_employees = company && company.no_employees ? EM[localStorage.JobChoiceLanguage].NO_EMPLOYEES.filter(
      function(el) { return el.value === company.no_employees })[0].name :
      <span className='profile-details-individual-value empty'>
        { LANG[localStorage.JobChoiceLanguage].valueNotSet }
      </span>
    
    let full_name = user && ReturnFullName(user.first_name_kana, user.last_name_kana) ? ReturnFullName(user.first_name_kana, user.last_name_kana) : valueNotSet

    if (!('data' in this.props.user)) {
      return (<Redirect to="/login" />)
    }

    if (this.props.user.data.job_seeker || this.props.user.data.company) {
        return (<Redirect to="/home" />)
    }
    
    return (
      <div className="col-md-9 col-sm-12 col-xs-12 manage-accounts-area">
        <Breadcrumb className="admin-breadcrumbs-row">
          <Breadcrumb.Item>
            <Link to="/admin">{ LANG[localStorage.JobChoiceLanguage].dashboard }</Link>
          </Breadcrumb.Item>/
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].companyInformation }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container-fluid">
          {this.state.user &&
          <div className='row'>
            <div className='col-lg-12'>
              <form className="row client-detail-container" onSubmit={this.handleSubmit} noValidate>
                <BoxContainer className="client-secondary-container flex flex-column">
                  <div className="text-align-left account-details-title">{ LANG[localStorage.JobChoiceLanguage].companyInformation }</div>
                  <AccountRowTwoDetails
                    label={ LANG[localStorage.JobChoiceLanguage].userID }
                    data={company.id}
                    label_2={ LANG[localStorage.JobChoiceLanguage].industry }
                    data_2={industry} />
                  <AccountRowTwoDetails
                    label={ LANG[localStorage.JobChoiceLanguage].companyName }
                    data={company.company_name}
                    label_2={ LANG[localStorage.JobChoiceLanguage].noOfEmployees }
                    data_2={no_employees} />
                  <AccountRowTwoDetails
                    label={ LANG[localStorage.JobChoiceLanguage].companyKana }
                    data={company.company_kana}
                    label_2={ LANG[localStorage.JobChoiceLanguage].department }
                    data_2={company.department} />
                  <AccountRowTwoDetails
                    label={ LANG[localStorage.JobChoiceLanguage].zipCode }
                    data={this.checkGeolocation(company.geolocation, "zip_code")}
                    label_2={ LANG[localStorage.JobChoiceLanguage].recruiter }
                    data_2={full_name} />

                  <AccountRowTwoDetails
                    label={ LANG[localStorage.JobChoiceLanguage].prefecture }
                    data={this.checkGeolocation(company.geolocation, "prefectures")}
                    label_2={ LANG[localStorage.JobChoiceLanguage].contractPlan }
                    data_2="-" />
                  <AccountRowTwoDetails
                    label={ LANG[localStorage.JobChoiceLanguage].address }
                    data={this.checkGeolocation(company.geolocation, "complete_address")}
                    label_2={ LANG[localStorage.JobChoiceLanguage].paymentForm }
                    data_2="-" />
                  <AccountRowTwoDetails
                    label={ LANG[localStorage.JobChoiceLanguage].contact }
                    data={user.contact_no}
                    label_2={ LANG[localStorage.JobChoiceLanguage].startDate }
                    data_2={DateFormat(user.created_at)} />
                  <AccountRowTwoDetails
                    accountClass="bottomer"
                    dataClass="bottomer"
                    label={ LANG[localStorage.JobChoiceLanguage].emailAddress }
                    data={user.email}
                    label_2={ LANG[localStorage.JobChoiceLanguage].lastLogin }
                    data_2={user.last_login_at ? user.last_login_at : "-"} />
                </BoxContainer>
              </form>
            </div>
          </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(withRouter(JobSeekerDetails))