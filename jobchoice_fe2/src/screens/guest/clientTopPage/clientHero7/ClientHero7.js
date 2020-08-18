import React, { Component } from 'react'
import './ClientHero7.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG } from '../../../../constants'
import ClientHeroButton from '../clientHeroButton/ClientHeroButton'

class ClientHero5 extends Component {

  render() {
    
    return (
      <div className="client-hero-seven">
        <div className="client-hero-button-group">
          <ClientHeroButton/>
        </div>
        <div className="container">
          <div className="client-hero-seven-desc">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero7Text }</div>
          <div className="client-hero-seven-content">
            <div className="client-hero-seven-contact">
              <img className="client-hero-contact" src={require('../../../../assets/img/top_page/client-hero-contact.png')} alt="client-contact" />
            </div>
            <div className="client-hero-seven-inquiry">
              <div className="client-hero-seven-inquiry-text">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero7Form }</div>
              <div className="client-hero-seven-inquiry-button">
                <a className="btn btn-info btn-client-hero-seven" href="/contact">
                  { LANG[localStorage.JobChoiceLanguage].clientTopPageHero7Button }
                </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHero5)
