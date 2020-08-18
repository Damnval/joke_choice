import React, { Component } from 'react'
import { connect } from 'react-redux'
import api from '../../../../utilities/api'
import { Link, withRouter, Redirect } from 'react-router-dom'
import BoxContainer from '../../../../components/boxContainer/BoxContainer'
import HatarakikataDisplay from '../../../../components/hatarakikata/hatarakikataDisplay/HatarakikataDisplay'
import { LANG, EM } from '../../../../constants'
import { DateFormat, MonthToday } from '../../../../helpers'
import AccountRowDetails from './../accountRowDetails/AccountRowDetails'
import './../AccountDetails.scss'
import AccountRowTwoDetails from '../accountRowTwoDetails/AccountRowTwoDetails'
import AccountRowThreeDetails from '../accountRowThreeDetails/AccountRowThreeDetails'
import {Breadcrumb} from 'react-bootstrap'
import Img from 'react-fix-image-orientation'

class JobSeekerDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      countDetails: null,
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
      api.get('api/manage/job-seeker/' + this.props.match.params.id).then(response => {
        const {job_seeker, ...rest} = response.data.results
        this.setState({
          user: job_seeker,
          countDetails: rest,
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
    const valueNotSet = LANG[localStorage.JobChoiceLanguage].valueNotSet
    return data ? data: valueNotSet
  }

  checkIfTwoNull = (data, data_2) => {
    const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
    const final = [data ? data: valueNotSet, <div className="divider-two-data"> / </div>, data_2 ? data_2: valueNotSet]
    return final
  }

  checkGeolocation = (check, data) => {
    const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
    return check && check[data] ? check[data]: valueNotSet
  }

  noteList = (data) => {
    const notes = data.map((el, key) => {
      return(
        <li key={key}>{el.notes}</li>
      )
    })

    return notes
  }

  render() {
    const job_seeker = this.state.user
    const user = job_seeker && {...job_seeker.user}
    const countDetails = this.state.countDetails
    
    const bankDetails = job_seeker && job_seeker.bank_account

    const valueNotSet = <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
    
    // Hataraki kata List
    const hatarakikata = user && (job_seeker.hataraki_kata_resource.length > 0 ? 
      job_seeker.hataraki_kata_resource.map((value,key)=> {
        return <HatarakikataDisplay resource={value} key={key} />
      }) : valueNotSet)

    // Notes
    const notes = countDetails && (countDetails.notes.length > 0 ? 
      <ul>{this.noteList(countDetails.notes)}</ul> : valueNotSet)

    // Month Today
    const monthToday = MonthToday()

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
          <Breadcrumb.Item active>{ LANG[localStorage.JobChoiceLanguage].accountInformation }</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container-fluid">
        {this.state.user &&
          <>
          <div className='row'>
            <div className='col-lg-5 col-sm-4 col-xs-6 flex flex-column justify-flex-start align-items-center'>
              <BoxContainer className="account-primary-container flex flex-column justify-content-center align-items-center">
                {
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].profilePicture }
                    className="profile"
                    data={job_seeker ?
                      (job_seeker.profile_picture && <div className="account-picture"><Img src={`${job_seeker.profile_picture}`} alt="logo"/></div>) : ''
                    } />
                }
              </BoxContainer>
              <BoxContainer className="account-primary-container flex flex-column">
                <div className="text-align-left account-details-title">{ LANG[localStorage.JobChoiceLanguage].performance }</div>
                <AccountRowTwoDetails
                  dataClass="bottomer"
                  accountClass="bottomer"
                  label={ LANG[localStorage.JobChoiceLanguage].appliedJobs }
                  data={countDetails.count_applied_jobs} 
                  label_2={ LANG[localStorage.JobChoiceLanguage].pastWork }
                  data_2={countDetails.count_work_experiences} />
              </BoxContainer>
              <BoxContainer className="account-primary-container flex flex-column">
                <AccountRowThreeDetails
                  label={ LANG[localStorage.JobChoiceLanguage].shareJobs }
                  generalLabel={ monthToday }
                  data={countDetails.this_month_shared_jobs}
                  label_2={ LANG[localStorage.JobChoiceLanguage].confirmedSharedJobs }
                  data_2={countDetails.count_this_month_disclosed_shared_jobs}
                  label_3={ LANG[localStorage.JobChoiceLanguage].shareCompensation }
                  data_3={countDetails.this_month_sum_disclosed_incentives} />
                <AccountRowThreeDetails
                  dataClass="bottomer"
                  accountClass="bottomer"
                  label={ LANG[localStorage.JobChoiceLanguage].shareJobs }
                  generalLabel={ LANG[localStorage.JobChoiceLanguage].cumulative }
                  data={countDetails.count_shared_jobs}
                  label_2={ LANG[localStorage.JobChoiceLanguage].confirmedSharedJobs }
                  data_2={countDetails.count_disclosed_shared_jobs}
                  label_3={ LANG[localStorage.JobChoiceLanguage].shareCompensation }
                  data_3={countDetails.sum_disclosed_incentives} />
              </BoxContainer>
            </div>
            <div className='col-lg-7 col-sm-8 col-xs-6'>
              <form className="row job-seeker-detail-container" onSubmit={this.handleSubmit} noValidate>
                <BoxContainer className="account-secondary-container flex flex-column">
                  <div className="text-align-left account-details-title">{ LANG[localStorage.JobChoiceLanguage].accountInformation }</div>
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].userID }
                    data={job_seeker.id} />
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].firstNameKana }
                    data={user.first_name_kana ? user.first_name_kana :
                      <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
                    }
                  />
                  <AccountRowDetails
                    label={ `${LANG[localStorage.JobChoiceLanguage].gender}/${LANG[localStorage.JobChoiceLanguage].age}`}
                    data={
                      job_seeker && job_seeker.gender ?
                        EM[localStorage.JobChoiceLanguage].GENDER.filter(el => el.value === job_seeker.gender ? el : null)[0].name :
                        <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
                    }
                  />
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].birthday }
                    data={job_seeker.birth_date ? 
                      DateFormat(job_seeker.birth_date) :
                      <span className='profile-details-individual-value empty'>{ LANG[localStorage.JobChoiceLanguage].valueNotSet }</span>
                    }
                  />
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].zipCode }
                    data={this.checkGeolocation(job_seeker.geolocation,"zip_code")} />
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].prefecture }
                    data={this.checkGeolocation(job_seeker.geolocation,"prefectures")} />
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].address }
                    data={this.checkGeolocation(job_seeker.geolocation,"complete_address")} />
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].contact }
                    data={user.contact_no} />
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].emailAddress }
                    data={user.email} />
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].startDate }
                    data={DateFormat(user.created_at)} />
                  <AccountRowDetails
                    label={ `${LANG[localStorage.JobChoiceLanguage].headerBankCode} / ${LANG[localStorage.JobChoiceLanguage].headerBankName}` }
                    data={this.checkIfTwoNull(bankDetails.bank_code, bankDetails.bank_name)} />
                  <AccountRowDetails
                    label={ `${LANG[localStorage.JobChoiceLanguage].headerBranchCode} / ${LANG[localStorage.JobChoiceLanguage].headerBranchName}` }
                    data={this.checkIfTwoNull(bankDetails.branch_code, bankDetails.branch_name)}
                    dataClass="bottomer"
                    accountClass="bottomer"/>
                </BoxContainer>
              </form>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 flex flex-column justify-flex-start align-items-center'>
              <div className="job-seeker-detail-container">
                <BoxContainer className="account-secondary-container flex flex-column">
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].hatarakikata }
                    data={hatarakikata}
                    dataClass="bottomer"
                    accountClass="bottomer" />
                </BoxContainer>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 flex flex-column justify-flex-start align-items-center'>
              <div className="job-seeker-detail-container">
                <BoxContainer className="account-secondary-container flex flex-column">
                  <AccountRowDetails
                    label={ LANG[localStorage.JobChoiceLanguage].note }
                    data={notes}
                    dataClass="bottomer notes"
                    accountClass="bottomer" />
                </BoxContainer>
              </div>
            </div>
          </div>
          </>
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
