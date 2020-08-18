import React, { Component } from 'react'
import './ClientHero6.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG } from '../../../../constants'
import ClientQA from '../clientQA/ClientQA'

class ClientHero5 extends Component {

  render() {
    
    return (
      <div className="client-hero-six">
        <div className="container">
          <div className="client-hero-six-sub-title">{ LANG[localStorage.JobChoiceLanguage].clientTopPageHero6Title1 }</div>
          <div className="client-hero-six-container">
            <ClientQA
              question="clientTopPageHero6Question1"
              answer="clientTopPageHero6Answer1"
            />
            <ClientQA
              question="clientTopPageHero6Question2"
              answer="clientTopPageHero6Answer2"
            />
            <ClientQA
              question="clientTopPageHero6Question3"
              answer="clientTopPageHero6Answer3"
            />
            <ClientQA
              question="clientTopPageHero6Question4"
              answer="clientTopPageHero6Answer4"
            />
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
