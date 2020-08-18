import React, { Component } from 'react'
import { LANG } from '../../../constants'
import './../Hatarakikata.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class HatarakikataMessage extends Component {

  render() {

    return (
      <div className="hatarakikata-message-row flex-row align-items-flex-start mx-auto">
        <img src={require('../../../assets/img/smiley_icon.png')} width={80} alt="logo"/><br />
        <div className="flex-row hatarakikata-message-bubble">
          <FontAwesomeIcon className="tip-message-bubble-box" icon="caret-left" size="3x"/>
          <div className="hatarakikata-message-bubble-box">
            { LANG[localStorage.JobChoiceLanguage].clickYourDesiredHata }
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

export default connect(mapStateToProps, mapDispatchToProps)(HatarakikataMessage)
