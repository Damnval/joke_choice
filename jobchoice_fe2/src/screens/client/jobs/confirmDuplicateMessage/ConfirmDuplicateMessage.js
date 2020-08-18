import React, { Component } from 'react'
import { LANG } from '../../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class ConfirmDuplicateMessage extends Component {

  render() {

    const item = this.props.item

    return (
      `${LANG[localStorage.JobChoiceLanguage].doYouWantToDuplicateEN} ${item} ${LANG[localStorage.JobChoiceLanguage].doYouWantToDuplicateJP}?`
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDuplicateMessage)
