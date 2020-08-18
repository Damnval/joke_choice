import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { LANG } from '../../constants'
class NumberDropdown extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      label: null,
      field: null,
    }
  }

  handleChange = e => {
    e.preventDefault()
    this.props.onChange(this.props.field, e.target.value)
  }

  render() {

    const {label, field} = this.props
    const {num, ...rest} = this.props
    let numArray = Array.from(Array(num), (x, index) => index + 1)
    return (
      <div>
        {label ? <label htmlFor={field}>{label}{this.props.required && (<span className="required"><small> ({LANG[localStorage.JobChoiceLanguage].required}) </small></span>)}:</label> : ""}
          <select
            {...this.props}
            label={label}
            name={rest.field}
            onChange={this.handleChange}
            value={rest.value}
          >
            <option value=''>{this.props.placeholder ? this.props.placeholder : ''}</option>
            {
              numArray.map((value, key) => {
                return (<option key={value} value={value}>{value}</option>)
              })
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(NumberDropdown)
