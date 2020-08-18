import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG } from '../../../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ClientHeroButton extends Component {

  render() {
    
    return (
      <a className="btn btn-info btn-client-hero-button seven" href="/email-registration/company">
        <div className="circle-text">
            <span>{ LANG[localStorage.JobChoiceLanguage].clientTopPageCircle }</span>
        </div>
        <div>
          <span className="btn-text">{ LANG[localStorage.JobChoiceLanguage].clientTopPageApplyHere }</span>
          <FontAwesomeIcon className="arrow-right" icon="arrow-circle-right" size="2x"/>
        </div>
      </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHeroButton)
