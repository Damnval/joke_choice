import React from 'react'
import InputDropDown from '../../../components/inputDropDown/InputDropDown'
import { EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'
class EmploymentPeriodDropDown extends React.Component {

  render() {
    let employment_period = EM[localStorage.JobChoiceLanguage].EMPLOYMENT_PERIOD

    return (
      <InputDropDown
        field='employment_period'
        value={this.props.value}
        onChange={this.props.handleChange}
        placeholder=" "
        className={this.props.className?this.props.className:''}
      >
        {
          employment_period.map((value, key) => {
            return(<option key={key} value={value.value}>{value.name}</option>)
          })}
        }
      </InputDropDown>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmploymentPeriodDropDown)
 