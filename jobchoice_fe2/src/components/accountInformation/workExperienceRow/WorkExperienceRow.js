import React, { Component } from "react"
import Input from '../../input/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LANG } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
import moment from 'moment'

class WorkExperienceRow extends Component {

  render() {
    const {num, value, id, max, company, position,
      start_date, end_date, errorKey, error, isEditing, ifError} = this.props
    const displayText = isEditing ? '' : 'disabled-work-experience-input'
    return (
      <div className={`field-row work-exp ${displayText}`}>
        {isEditing ? 
          <>
          <Input
            label={ LANG[localStorage.JobChoiceLanguage].companyNameStoreName }
            inputStyles={displayText}
            field={company}
            placeholder={ LANG[localStorage.JobChoiceLanguage].companyPlaceHolder }
            value={value.company}
            onChange={this.props.handleChange}
            error={error.company}
            errorKey={errorKey.company}
            disabled={!isEditing}
            noBadge={true}
          />
          <Input
            label={ LANG[localStorage.JobChoiceLanguage].position }
            inputStyles={displayText}
            field={position}
            placeholder={ LANG[localStorage.JobChoiceLanguage].position }
            value={value.position}
            onChange={this.props.handleChange}
            error={error.position}
            errorKey={errorKey.position}
            disabled={!isEditing}
            noBadge={true}
          />
        </> :
      <>
        <div className="work-exp-disabled">
            <div className="work-exp-disabled-label">{ LANG[localStorage.JobChoiceLanguage].companyNameStoreName }:</div>
            <div className="work-exp-disabled-value">{value.company}</div>
        </div>
        <div className="work-exp-disabled">
            <div className="work-exp-disabled-label">{ LANG[localStorage.JobChoiceLanguage].position }:</div>
            <div className="work-exp-disabled-value">{value.position}</div>
        </div>
       </>
        }

          {isEditing ?
          <>
          <Input
            label={ LANG[localStorage.JobChoiceLanguage].entryDate }
            field={start_date}
            value={value.start_date}
            inputType="date"
            onChange={this.props.handleChange}
            inputStyles="work-experience-date"
            error={error.start_date}
            errorKey={errorKey.start_date}
            disabled={!isEditing}
            max={moment().format("YYYY-MM-DD")}
            noBadge={true}
          />
          <Input
            label={ LANG[localStorage.JobChoiceLanguage].retirementDate }
            field={end_date}
            value={value.end_date}
            inputType="date"
            onChange={this.props.handleChange}
            inputStyles="work-experience-date"
            error={error.end_date}
            errorKey={errorKey.end_date}
            disabled={!isEditing}
            max={moment().format("YYYY-MM-DD")}
            noBadge={true}
          />
          </> :
          <div className={displayText}>
          <Input
            label={ LANG[localStorage.JobChoiceLanguage].entryDate }
            field={start_date}
            value={value.start_date}
            inputType="date"
            onChange={this.props.handleChange}
            error={error.start_date}
            errorKey={errorKey.start_date}
            disabled={!isEditing}
            max={moment().format("YYYY-MM-DD")}
            noBadge={true}
          />
          <Input
            label={ LANG[localStorage.JobChoiceLanguage].retirementDate }
            field={end_date}
            value={value.end_date}
            inputType="date"
            onChange={this.props.handleChange}
            error={error.end_date}
            errorKey={errorKey.end_date}
            disabled={!isEditing}
            max={moment().format("YYYY-MM-DD")}
            noBadge={true}
            />
         </div>
        }
      {isEditing && ((num+1 === max) ? 
        ((max === 3) ?
        ""
        :
        <button
          className={`btn light-icon ${ifError ? "self-center": "self-bottom"}`}
          onClick={e => this.props.addRow(e, id, "work_exp")}
        >
          <FontAwesomeIcon icon='plus-circle' size='lg' />
        </button>
        ) :
        <button
          className={`btn light-icon ${ifError ? "self-center": "self-bottom"}`}
          onClick={e => this.props.removeRow(e, id, "work_exp")}
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkExperienceRow)
