import React, { Component } from 'react'
import { LANG } from '../../constants'

class InDevelopmentMessage extends Component {

  render() {
    return (
      <div>
        <span>{LANG[localStorage.JobChoiceLanguage].inDevCompanyRegMsg1}</span><br/>
        <span>{LANG[localStorage.JobChoiceLanguage].inDevCompanyRegMsg2}</span><br/>
        <span>{LANG[localStorage.JobChoiceLanguage].inDevCompanyRegMsg3}</span><br/><br/>
        <span><a href="/contact">https://job-choice.jp/contact</a></span>
      </div>
    )
  }
}

export default InDevelopmentMessage
