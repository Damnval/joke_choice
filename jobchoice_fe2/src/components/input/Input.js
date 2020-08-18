import React, { Component } from 'react'
import './Input.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { LANG } from '../../constants'

class Input extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      label: null,
      field: null,
      placeholder: '',
      inputType: "text",
      errorKey: null,
      error: null,
      pattern: null,
      initialValue: ''
    }
  }

  componentDidMount() {

    this.setState({
      ...this.props
    })

  }

  handleChange = e => {
    e.preventDefault()
    if (e.target.validity.valid) {
      this.props.onChange(this.state.field, e.target.value)
    }
  }

  render() {

    let { errorKey, error, field, label, placeholder, inputType,
          pattern, initialValue, maxLength, value, inputStyles,
          onClick, withYen, noBadge=false,  ...rest} = this.props

    delete rest.required
    
    if ( value === null ) {
      value = ''
    }

    const className = `${inputStyles ? inputStyles : ''} ${(error && error.length > 0) ? "error" : ''}`
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
        <input
          {...rest}
          className={className}
          value={value}
          placeholder={placeholder}
          type={inputType}
          name={field}
          pattern={pattern}
          maxLength={maxLength}
          defaultValue={initialValue}
          noValidate
          onChange={this.handleChange}
          onClick={onClick}
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

export default connect(mapStateToProps, mapDispatchToProps)(Input)
