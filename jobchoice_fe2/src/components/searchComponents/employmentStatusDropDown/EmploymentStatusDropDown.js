import React from 'react'
import InputDropDown from '../../../components/inputDropDown/InputDropDown'
import { EM } from '../../../constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../store/auth/actions'

class EmploymentStatusDropDown extends React.Component {
  render() {
    let employment_status = EM[localStorage.JobChoiceLanguage].EMPLOYMENT_TYPE

    return (
      <InputDropDown
        field='employment_status'
        value={this.props.value}
        onChange={this.props.handleChange}
        placeholder=" "
        className={this.props.className?this.props.className:''}
      >
        {
          employment_status.map((value, key) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(EmploymentStatusDropDown)
 