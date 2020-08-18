import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import { connect } from 'react-redux'
import { LANG } from '../../constants'
import "react-datepicker/dist/react-datepicker.css"
import {enUS, ja} from 'date-fns/esm/locale'

class InputTime extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (value) => {
    this.props.onChange(this.props.field, value)
  }

  render() {

    let { errorKey, error, field, label, placeholder, inputType,
      pattern, initialValue, maxLength, value, inputStyles,
      onClick, withYen, noBadge=false, calendarClassName,  ...rest} = this.props

    const className = `${inputStyles ? inputStyles : ''} ${(error && error.length > 0) ? "error" : ''}`
    return (
      <div className={`${rest.className ? rest.className : ''}`}>
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
          <DatePicker
            selected={value}
            onChange={this.handleChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            dateFormat="h:mm aa"
            locale={localStorage.JobChoiceLanguage === 'JP' ? ja : enUS}
            calendarClassName={calendarClassName}
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

export default InputTime
