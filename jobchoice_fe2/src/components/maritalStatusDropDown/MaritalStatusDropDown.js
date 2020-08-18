import React, { Component } from 'react'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class MaritalStatusDropDown extends Component {

  infoChange = e => {
    e.preventDefault()
    this.props.infoChange(e.target.name, e.target.value)
  }

  render() {
    const className = this.props.className ? this.props.className : ''

    return (
      <select className={className} value={this.props.value}
        name={this.props.name} noValidate onChange={this.infoChange} >
        <option value="">-{ LANG[localStorage.JobChoiceLanguage].select }-</option>
        <option value="single">{ LANG[localStorage.JobChoiceLanguage].single }</option>
        <option value="married">{ LANG[localStorage.JobChoiceLanguage].married }</option>
        <option value="divorced">{ LANG[localStorage.JobChoiceLanguage].divorced }</option>
        <option value="widowed">{ LANG[localStorage.JobChoiceLanguage].widowed }</option>
      </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(MaritalStatusDropDown)
