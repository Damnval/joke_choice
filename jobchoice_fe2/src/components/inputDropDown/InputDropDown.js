import React, { Component } from 'react'
import './InputDropDown.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { LANG } from '../../constants'

class InputDropDown extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      label: null,
      field: null,
      placeholder: '',
      options: []
    }
  }

  componentDidMount() {

    this.setState({
      ...this.props
    })

  }

  handleChange = e => {
    e.preventDefault()
    this.props.onChange(this.state.field, e.target.value)
  }

  render() {

    const {field} = this.state
    const {label, placeholder, value, error, errorKey} = this.props
    const className = this.props.className ? this.props.className : ''
    
    return (
      <div className="input-field">
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
        <select
          {...this.props}
          name={field}
          onChange={this.handleChange}
          value={value}
          className={`${error ? "border-error" : ""} ${className}`}
        >
          {placeholder && <option value=''>{placeholder}</option>}
          {
            this.props.children
          }
        </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(InputDropDown)
