import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ButtonGroup } from 'react-bootstrap'
import './PrivacyPolicy.css'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class PrivacyPolicy extends Component {
  
  render() {
    
    return (
      <div>
        <JobChoiceLayout className="jobchoice-body">
        <div className='privacy-container container'>
          <div className='text-center'>
            {/* <h1>{LANG[localStorage.JobChoiceLanguage].termsAndCondition}</h1> */}
            <div className="terms-wrapper">
              <div className="condition-wrapper">
                  <p>
                    <strong>
                      {LANG[localStorage.JobChoiceLanguage].aboutHandling}
                    </strong>
                  </p>
                  <p>
                    {LANG[localStorage.JobChoiceLanguage].thishandling}
                  </p>
                  <p> 
                    {LANG[localStorage.JobChoiceLanguage].businessName}
                  </p>
                  <p>
                    {LANG[localStorage.JobChoiceLanguage].personalInformationProtection}
                  </p>
                  <p>
                    <strong>
                    {LANG[localStorage.JobChoiceLanguage].purposeOfUse}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].thePersonalInformation}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].responseToUser}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].contactAndNotification}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].personalAuthentication}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].providingToCompanies}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].shareMoney}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].confirmationOfUser}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].contactForQuestionnaires}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].investigationOfUse}
                  </p><p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].createStatistical}
                  </p>
                  <p className="policy-numbered">
                    {LANG[localStorage.JobChoiceLanguage].inAddition}
                  </p>
                  <p>
                    <strong>
                    {LANG[localStorage.JobChoiceLanguage].aboutTheThirdParty}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].weWillNotProvide}
                  </p>
                  <p>
                    <strong>
                    {LANG[localStorage.JobChoiceLanguage].aboutConsignment}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].weDoNotEntrust}
                  </p>
                  <p>
                    <strong>
                     {LANG[localStorage.JobChoiceLanguage].aboutTheDisclosure}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].atTheRequest}
                  </p>
                  <p className="policy-sub-title">
                    <strong>
                      {LANG[localStorage.JobChoiceLanguage].byHorai}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].applicationFrom}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].requestDate}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].weWillConfirm}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].inCaseOfAnAgent}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].ifNecessary}
                  </p>
                  <p>
                    <strong>
                      {LANG[localStorage.JobChoiceLanguage].notesOnEntering}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].ifYouDoNotFill}
                  </p>
                  <p>
                    <strong>
                      {LANG[localStorage.JobChoiceLanguage].acquisitionsOfPersonal}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].weDoNotAcquire}
                  </p>
                  <p>
                    <strong>
                      {LANG[localStorage.JobChoiceLanguage].aboutPersonalInformationSecurity}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].withRegard}
                  </p>
                  <p>
                    <strong>
                     {LANG[localStorage.JobChoiceLanguage].contactUs}
                    </strong>
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].contactUs1}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].mediaFlagInc}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].personalInformationReception}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].contactUs2}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].contactUs3}
                  </p>
                  <p className="policy-sub-title">
                    {LANG[localStorage.JobChoiceLanguage].contactUs4}
                  </p>

                  {/* <ButtonGroup className="btn-group">
                    <Link to='' className='btn-agree btn btn-primary'>{LANG[localStorage.JobChoiceLanguage].iAgree}</Link>
                  </ButtonGroup>
                  <ButtonGroup className="btn-group">
                    <Link to='' className='btn btn-danger'>{LANG[localStorage.JobChoiceLanguage].iDisagree}</Link>
                  </ButtonGroup> */}

              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy)
