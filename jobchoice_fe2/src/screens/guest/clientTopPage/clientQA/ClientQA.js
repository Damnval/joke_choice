import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { LANG } from '../../../../constants'

class ClientQA extends Component {
  
  render() {
    const {question, answer} = this.props

    return (
      <div className="client-q-a-container">
        <div className="client-q-a-container-question">
          <div className="label">Q</div>
          <div className="text">{LANG[localStorage.JobChoiceLanguage][question]}</div>
        </div>
        <div className="client-q-a-container-answer bottomer">
          <div className="label">A</div>
          <div className="text">{LANG[localStorage.JobChoiceLanguage][answer]}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientQA)
