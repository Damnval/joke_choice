import React, { Component } from 'react'
import { LANG, EM } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class EmployeeNumberDropDown extends Component {

  infoChange = e => {
    e.preventDefault()
    this.props.infoChange(e.target.name, e.target.value)
  }

  render() {
    const className = this.props.className ? this.props.className : ''
    const name = this.props.name ? this.props.name : 'no_employees'
    const {label, field} = this.props
    return (
      <div>
        {label ? 
          <label htmlFor={field}>
            { label }
            { this.props.required ?
              ( <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span> ) :
              ( !this.props.noBadge &&
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span> )
            } :
          </label> : ""}
        <select className={className} name={name} noValidate onChange={this.infoChange} value={this.props.value}>
          <option value="" disabled selected>{ LANG[localStorage.JobChoiceLanguage].defaultNoEmployees }</option>
          { EM[localStorage.JobChoiceLanguage].NO_EMPLOYEES.map(el => {
            return <option value={el.value}>{ el.name }</option>
          }) }
        </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeNumberDropDown)
