import React, { Component } from 'react'
import './TopPage1.scss'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TopPageCard from '../../../../components/topPageCard/TopPageCard'
import CoverImageComponent from '../coverImageComponent/CoverImageComponent'
import { connect } from 'react-redux'
import { LANG } from '../../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class TopPage1 extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      width: 0,
      imageSize: 0
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth}, () => this.changeImageSize())
  }

  changeImageSize = e => {
    this.setState({ imageSize: 360})

    if(this.state.width < 1200 && this.state.width > 767) {
      this.setState({ imageSize: 210})
    }

    if(this.state.width < 768) {
      this.setState({ imageSize: 250})
    }

    if(this.state.width < 381) {
      this.setState({ imageSize: 200})
    }
  }
  render() {
    
    return (
      <>
        <CoverImageComponent>
          <div className="container">
            <div className="row">
              <div className="flex justify-content-center col-xl-6 offset-xl-3 col-lg-10 offset-lg-1 col-sm-12 col-xs-12">
                <div id="cover-hero-div-label">
                  <h4>{ LANG[localStorage.JobChoiceLanguage].sharingTypeRecruitment }</h4>
                  <img src={require('../../../../assets/img/Logo-Header.png')} width={this.state.imageSize} alt="logo"/>
                  <Button className='cover-hero-button' href="/email-registration/job_seeker">{LANG[localStorage.JobChoiceLanguage].memberRegistration }</Button>
                </div>
              </div>
            </div>
          </div>
        </CoverImageComponent>

        <div id="three-points" className="page-section">
          <div className="three-points-title">
            <span>{ LANG[localStorage.JobChoiceLanguage].threeThings }</span>
          </div>
          <div className="container">
            <div className="row">
              <div className="three-points-container">
                <div className="three-points-image">
                  <img src={require('../../../../assets/img/JOBチョイス_TOP画像_1.png')} width={80} alt="logo"/>
                </div>
                <div className="three-points-description">
                  <span>① { LANG[localStorage.JobChoiceLanguage].ifThePersonGotHired }</span>
                </div>
              </div>
              <div className="three-points-container">
                <div className="three-points-image">
                  <img src={require('../../../../assets/img/JOBチョイス_TOP画像_2.png')} width={80} alt="logo"/>
                </div>
                <div className="three-points-description">
                  <span>② { LANG[localStorage.JobChoiceLanguage].youCanShareInManyWays }</span>
                </div>
              </div>
              <div className="three-points-container">
                <div className="three-points-image">
                  <img src={require('../../../../assets/img/JOBチョイス_TOP画像_3.png')} width={80} alt="logo"/>
                </div>
                <div className="three-points-description">
                  <span>③ { LANG[localStorage.JobChoiceLanguage].findJobinSNS }</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
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

export default connect(mapStateToProps)(TopPage1)
