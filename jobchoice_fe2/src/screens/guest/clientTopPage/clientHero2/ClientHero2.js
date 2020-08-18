import React, { Component } from 'react'
import './ClientHero2.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG } from './../../../../constants'

class ClientHero2 extends Component {

  render() {
    
    return (
      <div className="client-hero-two">
        <div className="client-hero-title">
          <div>{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero2Title1 }</div>
        </div>
        { localStorage.JobChoiceLanguage === "JP" &&
          <img className="client-hero-img" src={require('../../../../assets/img/top_page/client-hero-two.png')} alt="client-hero" />
        }
        { localStorage.JobChoiceLanguage === "US" &&
          <img className="client-hero-img" src={require('../../../../assets/img/top_page/client-hero-two-en.png')} alt="client-hero" />
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHero2)
