import React, { Component } from 'react'
import MonthDropDown from '../monthDropDown/MonthDropDown'
import YearRangeDropDown from '../yearRangeDropDown/YearRangeDropDown'
import NumberDropdown from '../numberDropdown/numberDropdown'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../store/auth/actions'
import { LANG } from '../../constants'

class DateInput extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      month: '',
      day: '',
      year: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSettingData = this.handleSettingData.bind(this)
  }

  componentDidMount() {
    if (this.props.value) {
      this.handleSettingData(this.props.value)
    }
  }

  componentWillReceiveProps(new_props) {
    if (new_props.value && new_props.dataExists === true) {
      this.handleSettingData(new_props.value)
    }
  }

  handleSettingData(value) {
    const moment = require('moment')
    const date = value.split("-")
    this.setState({
      day: date[2] ? moment(value, "YYYY-MM-D").format('D') : '',
      year: date[0] ? moment(value, "YYYY-MM-D").format('YYYY') : '',
      month: date[1] ? moment(value, "YYYY-MM-D").format('M') : ''
    })
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    }, () => {
      const month = this.state.month ? ("0" + this.state.month).slice(-2) : ""
      const day = this.state.day ? ("0" + this.state.day).slice(-2) : ""
      const date = ( month || day || this.state.year ) ? `${this.state.year}-${month}-${day}` : ""
      this.props.onChange(this.props.field, date)
    })
  }

  render() {

    let {error, label, inputStyles,  ...rest} = this.props

    const className = `${inputStyles ? inputStyles : ''} ${(error && error.length > 0) ? "error" : ''}`
    return (
      <div className={`${rest.className ? rest.className : ''} input-field`}>
        {label ? 
          <label>
            { label }
            { this.props.required ?
              ( <span className="required-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].required} </small>
                </span> ) :
              ( <span className="optional-badge">
                  <small> {LANG[localStorage.JobChoiceLanguage].optional} </small>
                </span> )
            } :
          </label> : ""}
        <div className={`date-input-row`}>
        <div className="date-input-field">
        <div className="date-input-field">
          <label>{LANG[localStorage.JobChoiceLanguage].year}</label>
            <YearRangeDropDown
              year={1950}
              onChange={this.handleChange}
              value={this.state.year}
              field='year'
              className="date-input-year-dropdown"
              yearsToFuture={this.props.yearsToFuture}
            />
          </div>
          <label>{LANG[localStorage.JobChoiceLanguage].month}</label>
          <MonthDropDown 
            infoChange={this.handleChange}
            value={this.state.month}
            className="date-input-month-dropdown"
            name='month'
          />
        </div>
        <div className="date-input-field">
          <label>{LANG[localStorage.JobChoiceLanguage].day}</label>
          <NumberDropdown
            num={31}
            onChange={this.handleChange}
            value={this.state.day}
            className="date-input-day-dropdown"
            field='day'
          />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DateInput)
