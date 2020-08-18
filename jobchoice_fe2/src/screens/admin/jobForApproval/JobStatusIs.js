import React, { Component } from 'react'
import './JobForApproval.scss'
import { connect } from 'react-redux'
import { LANG  } from '../../../constants'
import { bindActionCreators } from "redux"
import * as authActions from "../../../store/auth/actions"

class JobStatusIs extends Component {

    render() {
      const { status } = this.props

    return (
      <>
        { LANG[localStorage.JobChoiceLanguage].jobStatusIs }
        { status === 'rejected' ? LANG[localStorage.JobChoiceLanguage].rejected : LANG[localStorage.JobChoiceLanguage].approved }
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

export default connect(mapStateToProps, mapDispatchToProps)(JobStatusIs)
