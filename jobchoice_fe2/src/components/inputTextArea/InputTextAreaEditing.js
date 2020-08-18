import React, { Component } from 'react'
import './InputTextArea.scss'
import { LANG } from '../../constants'

class InputTextAreaEditing extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      label: null,
      field: null,
      placeholder: '',
      value: '',
    }
  }

  componentDidMount() {

    this.setState({
      ...this.props
    })

  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.value})
  }

  handleChange = e => {
    e.preventDefault()
    this.props.onChange(this.state.field, e.target.value)
  }

  render() {

    const {field, placeholder, value, additionalStyle} = this.state
    const { label, error, resize, maxLength } = this.props
    const isIE = /*@cc_on!@*/false || !!document.documentMode

    return (
      <div className={`input-field ${additionalStyle ? additionalStyle: ''}`}>
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
        <textarea
          className={`${(error && error.length > 0) ? "error" : ""} ${resize === true ? 'resize-textarea': ''} ${isIE === true && resize === true ? 'isIE' : ''}`}
          placeholder={placeholder}
          name={field}
          value={value}
          maxLength={maxLength}
          noValidate
          onChange={this.handleChange}
        />
        {(error) ? (error.length > 0 ?
            <span className="errorMessage">{error}</span> :
            <div className="errorNone"></div>) :
          <div></div>
        }
      </div>
    )
  }
}

export default InputTextAreaEditing
