import React, { Component } from 'react'
import './InputRadio.scss'
import { Radio } from 'react-bootstrap'
import { LANG } from '../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'

class InputRadio extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      label: null,
      field: null,
    }
  }

  handleChange = e => {
    this.setState({
      value: e.target.value
    }, () => {
      this.props.onChange(this.props.field, this.state.value)
    })
  }

  render() {

    const { field, options, label, error, value, additionalStyle, additionalStyleUpperDiv, noBadge=false } = this.props
    const { inputStyles } = this.state
    const className = `input-radio-click ${additionalStyle ? additionalStyle : ''} ${inputStyles ? inputStyles : ''} ${(error && error.length > 0) ? "error" : ''}`

    return (
      <div className={`input-field ${additionalStyleUpperDiv ? additionalStyleUpperDiv : ''}`}>
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
        <div className="input-radio-area">
          {options.map((option) => {
            return (
              <div className="input-radio-individual" key={option.value}>
                <Radio 
                  className={className} 
                  name={field}
                  value={option.value} 
                  onChange={this.handleChange}
                  checked={option.value === value}>
                  { option.name }
                  </Radio>
              </div>
            )
          })}
        </div>
        {(error) ? (error.length > 0 ?
            <span className="errorMessage">{error}</span> :
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

export default connect(mapStateToProps, mapDispatchToProps)(InputRadio)
