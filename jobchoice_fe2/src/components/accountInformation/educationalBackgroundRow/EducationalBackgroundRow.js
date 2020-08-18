import React, { Component } from "react"
import Input from '../../input/Input'
import InputDropDown from '../..//inputDropDown/InputDropDown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG, EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class EducationalBackgroundRow extends Component {

  render() {
    const {num, value, id, max,  school, year_educ, schoolClassName,
      month_educ, errorKey, error, isEditing, ifError, className} = this.props
    let moment = require('moment')
    const yearMax =(new Date().getFullYear())
    const yearList = [...Array(50)].map((_, i) => yearMax - i)
    const displayText = isEditing ? '' : 'disabled-educ-input'
    return (
      <div className={`field-row ${className ? className : ''} ${displayText}`}>
          {!isEditing ? 
          <div className="educ-disabled">
            <div className="educ-disabled-label">
              { LANG[localStorage.JobChoiceLanguage].college }
            </div>
            <div className="educ-disabled-value">{value.school}</div>
          </div>:
          <>
          <Input
            placeholder={ LANG[localStorage.JobChoiceLanguage].college }
            field={school}
            value={value.school}
            onChange={this.props.handleChange}
            error={error.school}
            errorKey={errorKey.school}
            disabled={!isEditing}
            inputStyles={schoolClassName ? schoolClassName : ''}
          />
          </>
          }
          <div className="field-row-item">
            <InputDropDown 
              field={year_educ}
              placeholder={ LANG[localStorage.JobChoiceLanguage].year }
              value={value.year}
              options={yearList}
              onChange={this.props.handleChange}
              className="educational-background-year"
              error={error.year}
              errorKey={errorKey.year}
              disabled={!isEditing}
            >
              {
                (yearList.map((value, _) => {
                  return (<option key={value} value={value}>{value}</option>)
                }))
              }
            </InputDropDown>
            <InputDropDown 
              field={month_educ}
              placeholder={ LANG[localStorage.JobChoiceLanguage].month }
              value={value.month}
              options={moment.months()}
              onChange={this.props.handleChange}
              className="educational-background-month"
              error={error.month}
              errorKey={errorKey.month}
              disabled={!isEditing}
            >
              {
                (EM[localStorage.JobChoiceLanguage].MONTH.map((el, key) => {
                  return (<option key={el.value} value={el.dropdown_value}>{el.name}</option>)
                }))
              }
            </InputDropDown>
          </div>
      {isEditing && ((num+1 === max) ? 
        ((max === 3) ?
        ""
        :
        <button
          className={`btn light-icon ${ifError ? "self-center": "self-bottom"}`}
          onClick={e => this.props.addRow(e, id, "educational_bg")}
        >
          <FontAwesomeIcon icon='plus-circle' size='lg' />
        </button>
        ) :
        <button
          className={`btn light-icon ${ifError ? "self-center": "self-bottom"}`}
          onClick={e => this.props.removeRow(e, id, "educational_bg")}
        >
          <FontAwesomeIcon icon='times' size='1x' />
        </button>)
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

export default connect(mapStateToProps, mapDispatchToProps)(EducationalBackgroundRow)
