import React, { Component } from 'react'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class ContactNumberInput extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      label: null,
      field: null,
      placeholder: '',
      inputType: "text",
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
      this.props.onChange(this.props.field, e.target.value)
    }
  }

  render() {

    let { error, field, label, placeholder, inputType, pattern,
          initialValue, maxLength, value, inputStyles, onClick, noBadge=false,
          ...rest} = this.props

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
        <div className="contact-number-input-field">
          <label>+81</label>
          <input
            {...rest}
            className={className}
            value={value}
            placeholder={placeholder}
            type={inputType}
            name={field}
            pattern="[0-9]+"
            maxLength={ maxLength ? maxLength : "10" }
            defaultValue={initialValue}
            noValidate
            onChange={this.handleChange}
            onClick={onClick}
          />
        </div>
        {(error) ? (error.length > 0 ?
            <span className={`${this.props.displaycreatejob === 'true' ? 'errorMessage-createJob' : 'errorMessage'}`}>{error}</span> :
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactNumberInput) 
