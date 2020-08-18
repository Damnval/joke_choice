import React, { Component } from 'react'
import { LANG, EM } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class MonthDropDown extends Component {

  infoChange = e => {
    e.preventDefault()
    this.props.infoChange(e.target.name, e.target.value)
  }

  render() {
    const className = this.props.className ? this.props.className : ''
    const name = this.props.name ? this.props.name : ''
    return (
      <select className={className} name={name} noValidate onChange={this.infoChange} value={this.props.value}>
        <option value=""></option>
        {EM[localStorage.JobChoiceLanguage].MONTH.map((value, key) => {
          return <option key={key} value={value.value}>{ value.name }</option>
        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(MonthDropDown)
