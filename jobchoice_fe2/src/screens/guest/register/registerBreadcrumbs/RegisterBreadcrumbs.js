import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LANG } from '../../../../constants'
import { bindActionCreators } from 'redux'
import * as authActions from '../../../../store/auth/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class RegisterBreadcrumbs extends Component {

  renderClass(current_step) {
    let ret = ''
    if (this.props.step > current_step) {
      ret = 'success'
    } else if (this.props.step === current_step) {
      ret = 'active'
    } else {
      ret = ''
    }
    return ret
  }

  renderIcon(current_step) {
    let ret = ''
    if (this.props.step > current_step) {
      ret = 'check'
    } else if (this.props.step === current_step) {
      ret = 'pen'
    } else {
      ret = ''
    }
    return ret
  }

  render() {
    return (
      <div className="register-breadcrumbs-icon-row">
        <div className="register-breadcrumbs-container">
          <div className={`register-breadcrumbs-icon-circle ${this.renderClass(1)}`}>
            <FontAwesomeIcon icon={this.renderIcon(1)} />
          </div>
          <div className="registration-breadcrumbs-info-text">
            { LANG[localStorage.JobChoiceLanguage].initialRegistration }
          </div>
        </div>
        <div className="register-breadcrumbs-line"></div>
        <div className="register-breadcrumbs-container">
          <div className={`register-breadcrumbs-icon-circle ${this.renderClass(2)}`}>
            {this.props.step > 1 && <FontAwesomeIcon icon={this.renderIcon(2)} />}
          </div>
          <div className="registration-breadcrumbs-info-text">
            { LANG[localStorage.JobChoiceLanguage].basicRegistration }
          </div>
        </div>
        <div className="register-breadcrumbs-line"></div>
        <div className="register-breadcrumbs-container">
          <div className={`register-breadcrumbs-icon-circle ${this.renderClass(3)}`}>
            {this.props.step > 2 && <FontAwesomeIcon icon={this.renderIcon(3)} />}
          </div>
          <div className="registration-breadcrumbs-info-text">
            { LANG[localStorage.JobChoiceLanguage].profileRegistration }
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterBreadcrumbs)
