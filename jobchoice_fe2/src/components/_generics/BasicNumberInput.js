import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class BasicNumberInput extends Component {

  handleChange = e => {
    e.preventDefault()
    if (e.target.validity.valid) {
      this.props.onChange(this.props.field, e.target.value)
    }
  }

  render() {

    let { field, placeholder, inputType, initialValue, maxLength, value,
          inputStyles, ...rest} = this.props

    delete rest.required

    const className = `${inputStyles ? inputStyles : ''}`
    return (
      <input
        {...rest}
        className={className}
        value={value}
        placeholder={placeholder}
        type={inputType}
        name={field}
        pattern="[0-9]+"
        maxLength={maxLength}
        defaultValue={initialValue}
        noValidate
        onChange={this.handleChange}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(BasicNumberInput)
