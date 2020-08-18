import React, { Component } from 'react'
import { connect } from 'react-redux'
import AccountInformationComponent from '../accountInformationComponent/AccountInformationComponent'
import Input from '../../../../components/input/Input'
import { LANG } from '../../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'

class GenericProfileDetailIndividual extends Component {

  render() {

    const {label, value, field, editValue, error,
      isDisabled=false, isEditing, pattern, inputType='text', required=false,
      maxLength, onClick, handleInputChange, bankClick, bankLabel} = this.props

    const display = value !== "" ? value : LANG[localStorage.JobChoiceLanguage].valueNotSet
    return (
      <AccountInformationComponent label={label} required={required} isEditing={isEditing}>
            {!isEditing ?
            <span className={`profile-details-individual-value ${value ? '' : 'empty'}`}>
              {display}
            </span> :
            <div>
              <Input 
                value={editValue}
                inputType={inputType}
                field={field}
                inputStyles="profile-details-individual-edit"
                onChange={handleInputChange}
                error={error}
                disabled={isDisabled}
                pattern={pattern}
                maxLength={maxLength}
                onClick={onClick}
              />
              {bankLabel && <label className="selectbank-branch" onClick={bankClick}>{bankLabel}</label> }
            </div>}
      </AccountInformationComponent>
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

export default connect(mapStateToProps, mapDispatchToProps)(GenericProfileDetailIndividual)
