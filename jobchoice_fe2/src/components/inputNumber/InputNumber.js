import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { LANG } from '../../constants'
import BasicNumberInput from '../_generics/BasicNumberInput'

class InputNumber extends Component {

  render() {

    let { errorKey, error, field, label, placeholder, inputType,
          pattern, initialValue, maxLength, value, inputStyles,
          onClick, withYen, noBadge=false,  ...rest} = this.props

    delete rest.required

    const className = inputStyles
    return (
      <div className={`${rest.className ? rest.className : ''} input-field`}>
        {label ? 
          <label htmlFor={field}>
            { label }
            { this.props.required ?
              ( <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span> ) :
              ( !noBadge &&
                <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span> )
            } :
          </label> : ""}
        <BasicNumberInput
          inputStyles={this.props.inputStyles}
          value={this.props.value}
          placeholder={this.props.placeholder}
          inputType={this.props.inputType}
          field={this.props.field}
          maxLength={this.props.maxLength}
          initialValue={this.props.initialValue}
          noValidate
          onChange={this.props.onChange}
        />
        {withYen && <span id="yen-area">円</span>}
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

export default connect(mapStateToProps, mapDispatchToProps)(InputNumber)
