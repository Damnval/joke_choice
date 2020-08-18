import React, { Component } from 'react'
import './InputTextArea.scss'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class InputTextArea extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      label: null,
      field: null,
      placeholder: '',
      initialValue: '',
    }
  }

  componentDidMount() {

    this.setState({
      ...this.props
    })

  }

  handleChange = e => {
    e.preventDefault()
    this.setState({
      value: e.target.value
    }, () => {
      this.props.onChange(this.props.field, this.state.value)
    })
  }

  render() {

    const { placeholder, placeholderKey, inputStyles,
            additionalStyle, isRegistering } = this.state
    const { label, field, errorKey, error, resize, initialValue, value, maxLength } = this.props

    const className = `${inputStyles ? inputStyles : ''} ${(error && error.length > 0) ? "error" : ''}`
    const displayText = isRegistering ? '' : 'disabled-work-experience-input'
    const isIE = /*@cc_on!@*/false || !!document.documentMode
    return (
      <div className={`input-field ${additionalStyle ? additionalStyle: ''} ${displayText}`}>
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
          { isRegistering === true ?
          <div className="register-additional-text">
                <div>{ LANG[localStorage.JobChoiceLanguage].pleaseEnterYourEligibility }</div>
            </div> : ''
          }
        <textarea
          className={`${className} ${(error && error.length > 0) ? "error" : ""} ${resize === true ? 'resize-textarea': ''} ${isIE === true && resize === true ? 'isIE' : ''}`}
          placeholder={placeholderKey !== undefined ? LANG[localStorage.JobChoiceLanguage][placeholderKey] : placeholder}
          name={field}
          defaultValue={initialValue}
          value={value}
          maxLength={maxLength}
          noValidate
          onChange={this.handleChange}
        />
        {(errorKey || error) ? ((errorKey || error.length > 0) ?
            <span className={`${this.props.displaycreatejob === 'true' ? 'errorMessage-createJob' : 'errorMessage'}`}>
              {errorKey ? LANG[localStorage.JobChoiceLanguage][errorKey] : error}
            </span> :
            <div className="errorNone"></div>) :
          <div></div>
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(InputTextArea)
