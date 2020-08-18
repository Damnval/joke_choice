import React, { Component } from 'react'
import './ClientHero1.scss'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class ClientHero1 extends Component {

  render() {
    
    return (
      <div className="client-hero-one">
        <img className="client-hero-img" src={require('../../../../assets/img/top_page/client-hero-one.png')} alt="client-hero" />
        <div className="client-hero-title">
          <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero1Title1 }</div>
          <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero1Title2 }</div>
          <div className="client-hero-description">
            <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero1Desc1 }</div>
            <div className="client-hero-important">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero1Desc2 }</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHero1)
