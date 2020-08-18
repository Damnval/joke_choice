import React, { Component } from 'react'
import './ClientHero5.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG } from '../../../../constants'
import UserGuideStep from '../../userGuide/components/UserGuideStep'
import ClientHeroButton from '../clientHeroButton/ClientHeroButton'

class ClientHero5 extends Component {

  render() {
    
    return (
      <div className="client-hero-five">
        <div className="client-hero-button-group">
          <ClientHeroButton handleInDevelopment={this.props.handleInDevelopment}/>
        </div>
        <div className="container">
          <div className="client-hero-five-sub-title">
            { LANG[localStorage.JobChoiceLanguage].clientTopPageHero5Title1 }
          </div>
          <div className="client-hero-five-step-container">
            <div className="client-hero-five-step">
              <div className="client-hero-five-step-title content-1">
                <div>STEP 1</div>
                <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep1 }</div>
              </div>
              <UserGuideStep arrowIcon="arrow-down" step="1">
                { LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep1Desc }
              </UserGuideStep>
            </div>
            <div className="client-hero-five-step">
              <div className="client-hero-five-step-title content-2">
                <div>STEP 2</div>
                <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep2 }</div>
              </div>
              <UserGuideStep arrowIcon="arrow-down" step="2">
                { LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep2Desc }
              </UserGuideStep>
            </div>
            <div className="client-hero-five-step">
              <div className="client-hero-five-step-title content-3">
                <div>STEP 3</div>
                <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep3 }</div>
              </div>
              <UserGuideStep arrowIcon="arrow-down" step="3">
                { LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep3Desc }
              </UserGuideStep>
            </div>
            <div className="client-hero-five-step">
              <div className="client-hero-five-step-title content-1">
                <div>STEP 4</div>
                <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep4 }</div>
              </div>
              <UserGuideStep arrowIcon="arrow-down" step="4">
                { LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep4Desc }
                <div className="important">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep4DescImportant }</div>
              </UserGuideStep>
            </div>
            <div className="client-hero-five-step">
              <div className="client-hero-five-step-title content-2">
                <div>STEP 5</div>
                <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep5 }</div>
              </div>
              <UserGuideStep arrowIcon="arrow-down" step="5">
                { LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep5Desc }
                <div className="important">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep5DescImportant }</div>
              </UserGuideStep>
            </div>
            <div className="client-hero-five-step">
              <div className="client-hero-five-step-title content-3">
                <div>STEP 6</div>
                <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep6 }</div>
              </div>
              <UserGuideStep arrowIcon=" " step="6">
                { LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep6Desc }
                <div className="important">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero5GridStep6DescImportant }</div>
              </UserGuideStep>
            </div>
            <div className="client-hero-five-sub-text">
              { LANG[localStorage.JobChoiceLanguage].clientTopPageHero5Desc }
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHero5)
