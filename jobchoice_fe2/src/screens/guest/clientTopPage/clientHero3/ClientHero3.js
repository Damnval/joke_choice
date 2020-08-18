import React, { Component } from 'react'
import './ClientHero3.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG } from './../../../../constants'
import ClientHeroButton from '../clientHeroButton/ClientHeroButton'

class ClientHero3 extends Component {

  render() {
    
    return (
      <div className="client-hero-three">
        <div className="client-hero-title">
          <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero3Title1 }</div>
        </div>
        <div className="client-hero-button-group">
          <ClientHeroButton handleInDevelopment={this.props.handleInDevelopment}/>
        </div>
        <div className="container">
          <div className="client-hero-three-sub-title">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero3Title2 }</div>
          <div className="client-hero-three-category-container">
            <div className="client-hero-three-category">
              <div className="client-hero-three-category-title">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero3Desc1 }</div>
              <div className="client-hero-three-category-img">
                <img src={require('../../../../assets/img/top_page/client-hero-three-1.png')} alt="client-hero-category-1"/>
              </div>
            </div>
            <div className="client-hero-three-category">
              <div className="client-hero-three-category-title">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero3Desc2 }</div>
              <div className="client-hero-three-category-img">
                <img src={require('../../../../assets/img/top_page/client-hero-three-2.png')} alt="client-hero-category-2"/>
              </div>
            </div>
            <div className="client-hero-three-category">
              <div className="client-hero-three-category-title">
                <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero3Desc3 }</div>
                <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero3Desc4 }</div>
              </div>
              <div className="client-hero-three-category-img">
                <img src={require('../../../../assets/img/top_page/client-hero-three-3.png')} alt="client-hero-category-3"/>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHero3)
