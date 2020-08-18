import React, { Component } from 'react'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class CompanySuccessMessage extends Component {

  render() {

    const {email, credentials} = this.props
    let userEmail = ""
    if(localStorage.getItem('JobChoiceLanguage') == 'US') {
        userEmail = <span>{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessagesSentTo}<strong> {email}</strong></span>
    } else {
        userEmail = <span><strong>{email}</strong> {LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessagesSentTo}</span>
    }

    return (
      <div className="company-success-message">
        <h4><strong>{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessage1}</strong></h4><br />
        <span>{userEmail}</span><br />
        <span>{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessage2}</span>
        <br />
        <span>{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessage25}</span>
        <br />
        <br />
        <span>{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessage3}</span><br />
        <span>{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessage4}</span><br />
        <span>
        {LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessage5}
        &nbsp;<a href={"/email-registration/" + credentials.type }>{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessageLinkHere}</a>
        &nbsp;{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessageContactHere1}<br />
        &nbsp;<a href="/contact">{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMessageContactHereLink}</a>
        &nbsp;{LANG[localStorage.JobChoiceLanguage].companyModalSuccessMesssageContactHereHere2}
        </span>  
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

export default connect(mapStateToProps, mapDispatchToProps)(CompanySuccessMessage)
