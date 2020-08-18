import React, { Component } from 'react'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class GenderDropDown extends Component {

  infoChange = e => {
    e.preventDefault()
    this.props.infoChange(e.target.name, e.target.value)
  }

  render() {
    const className = this.props.className ? this.props.className : ''
    const name = this.props.name ? this.props.name : 'gender'
    return (
      <select className={className} name={name} noValidate onChange={this.infoChange} value={this.props.value}>
        <option value="">-{ LANG[localStorage.JobChoiceLanguage].select }-</option>
        <option value="male">{ LANG[localStorage.JobChoiceLanguage].male }</option>
        <option value="female">{ LANG[localStorage.JobChoiceLanguage].female }</option>
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

export default connect(mapStateToProps, mapDispatchToProps)(GenderDropDown)
