import React, { Component } from 'react'
import './UserGuide.scss'
import JobChoiceLayout from '../../../layouts/jobChoiceLayout/JobChoiceLayout'
import { connect } from 'react-redux'
import { LANG } from '../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import UserGuideStep from './components/UserGuideStep'
import BoxContainer from '../../../components/boxContainer/BoxContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class UserGuide extends Component {
  
  render() {
    
    return (
      <div>
        <JobChoiceLayout className="jobchoice-body back-color">
          <div className="container">
            <div className="row user-guide-upwrapper">
              <BoxContainer>
                <div className="guide-container container">
                  <div className="row">
                    <div className="guide">
                      <strong><h4 className='top-header'>{ LANG[localStorage.JobChoiceLanguage].guideRegistration }</h4></strong>
                    </div>
                  </div>
                  {/* User Guide #1 */}
                  <div className="row flex-column">
                    <div className="col-lg-3 flex guide-title step-1">
                      <h4 className="step-1">1. { LANG[localStorage.JobChoiceLanguage].userGuideTitle1 }</h4>
                    </div>
                    <div className="col-lg-12 flex-column-center">
                      <UserGuideStep step="1">
                        { LANG[localStorage.JobChoiceLanguage].userGuideStep1of1 }
                      </UserGuideStep>
                      <UserGuideStep step="1">
                        <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep2of1 }</div>
                        <div>https://job-choice.jp/email-registration/job_seeker</div>
                        <div className="required">[※{ LANG[localStorage.JobChoiceLanguage].requiredForSharing }]</div>
                      </UserGuideStep>
                      <UserGuideStep step="1">
                        <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep3of1 }</div>
                      </UserGuideStep>
                      <UserGuideStep step="1">
                        <div className="paragraph-line">{ LANG[localStorage.JobChoiceLanguage].userGuideStep4of1 }</div>
                        <div className="optional"><a href="/hatarakikata">[※{ LANG[localStorage.JobChoiceLanguage].skipIsPossible }]</a></div>
                      </UserGuideStep>
                      <UserGuideStep step="1">
                        <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep5of1 }</div>
                        <div>
                          <span className="optional"><a href="/hatarakikata">[※{ LANG[localStorage.JobChoiceLanguage].skipIsPossible }]</a></span> 
                          <span className="required">[※{ LANG[localStorage.JobChoiceLanguage].requiredWhenApplying }]</span>
                        </div>
                      </UserGuideStep>
                      <UserGuideStep step="1">
                        <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep6of1 }</div>
                        <div className="required"><a href="/hatarakikata">[※{ LANG[localStorage.JobChoiceLanguage].skipIsPossible }]</a></div>
                      </UserGuideStep>
                    </div>
                  </div>
                  {/* User Guide #2 */}
                  <div className="row flex-column">
                    <div className="col-lg-3 flex guide-title step-2">
                      <h4>2. { LANG[localStorage.JobChoiceLanguage].userGuideTitle2 }</h4>
                    </div>
                    <div className="col-lg-12 flex-column-center">
                      <UserGuideStep step="2">
                        { LANG[localStorage.JobChoiceLanguage].userGuideStep1of2 }
                      </UserGuideStep>
                      <UserGuideStep step="2">
                        <div className="paragraph-line">{ LANG[localStorage.JobChoiceLanguage].userGuideStep2of2 }</div>
                        <div>{ LANG[localStorage.JobChoiceLanguage].iCanReadIt }</div>
                      </UserGuideStep>
                      <UserGuideStep step="2" arrowCount={2}>
                        <div className="paragraph-line">{ LANG[localStorage.JobChoiceLanguage].userGuideStep3of2 }</div>
                      </UserGuideStep>
                    </div>
                  </div>
                  {/* User Guide #3 & #4 */}
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-8 flex guide-title step-3">
                          <h4>3. { LANG[localStorage.JobChoiceLanguage].userGuideTitle3 }</h4>
                        </div>
                        <div className="col-lg-12 flex-column-center">
                          <UserGuideStep step="3">
                            <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep1of3 }</div>
                            <div className="required">[※{ LANG[localStorage.JobChoiceLanguage].secondaryRegistration }]</div>
                          </UserGuideStep>
                          <UserGuideStep step="3">
                            <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep2of3 }</div>
                          </UserGuideStep>
                          <UserGuideStep step="3" className="last-div">
                            <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep3of3 }</div>
                          </UserGuideStep>
                          <UserGuideStep step="3" arrow={false} className="last-div">
                            <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep4of3 }</div>
                          </UserGuideStep>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-6 flex guide-title step-4">
                          <h4>4. { LANG[localStorage.JobChoiceLanguage].userGuideTitle4 }</h4>
                        </div>
                        <div className="col-lg-12 flex-column-center">
                          <UserGuideStep step="4">
                            <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep1of4 }</div>
                            <div className="required">[※{ LANG[localStorage.JobChoiceLanguage].primaryRegistration }]</div>
                          </UserGuideStep>
                          <UserGuideStep step="4">
                            <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep2of4 }</div>
                          </UserGuideStep>
                          <UserGuideStep step="4" className="last-div">
                            <div className="paragraph-line">{ LANG[localStorage.JobChoiceLanguage].userGuideStep3of4 }</div>
                          </UserGuideStep>
                          <UserGuideStep step="4" arrow={false} className="last-div">
                            <div>{ LANG[localStorage.JobChoiceLanguage].userGuideStep4of4 }</div>
                            <div className="required">[※{ LANG[localStorage.JobChoiceLanguage].accountInformation }]</div>
                          </UserGuideStep>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BoxContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserGuide)
